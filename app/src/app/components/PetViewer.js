"use client"

import React, { useState, useEffect, Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, useGLTF } from '@react-three/drei'
import { ErrorBoundary } from 'react-error-boundary'

function Model({ url }) {
  console.log(`Model component: Loading model from URL: ${url}`)
  const { scene } = useGLTF(url)
  console.log('Model component: Model loaded successfully')
  return <primitive object={scene} />
}

function FallbackComponent({ error }) {
  console.log('FallbackComponent: An error occurred:', error)
  return (
    <div role="alert" className="p-4 bg-red-100 border border-red-400 text-red-700 rounded">
      <p className="font-bold">An error occurred:</p>
      <pre className="mt-2 text-sm overflow-auto">{error.message}</pre>
    </div>
  )
}

function ModelViewer({ modelUrl }) {
  const [localModelUrl, setLocalModelUrl] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function downloadModel() {
      console.log(`ModelViewer: Starting to download model from URL: ${modelUrl}`)
      try {
        setIsLoading(true)
        console.log('ModelViewer: Sending POST request to /api/downloadModal')
        const response = await fetch('/api/downloadModal', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ url: modelUrl }),
        })
        console.log(`ModelViewer: Received response with status: ${response.status}`)

        if (!response.ok) {
          const errorText = await response.text()
          console.error(`ModelViewer: API error: ${response.status} ${response.statusText}\n${errorText}`)
          throw new Error(`API error: ${response.status} ${response.statusText}\n${errorText}`)
        }

        let data
        try {
          data = await response.json()
          console.log('ModelViewer: Parsed JSON response:', data)
        } catch (e) {
          const responseText = await response.text()
          console.error('ModelViewer: Failed to parse JSON:', responseText)
          throw new Error(`Invalid JSON response: ${responseText}`)
        }

        if (data.success) {
          console.log(`ModelViewer: Model downloaded successfully. File name: ${data.fileName}`)
          setLocalModelUrl(`/${data.fileName}`)
        } else {
          console.error(`ModelViewer: Failed to download model: ${data.error}`)
          throw new Error(data.error || 'Failed to download model')
        }
      } catch (err) {
        console.error('ModelViewer: Error during model download:', err)
        setError(err.message)
      } finally {
        setIsLoading(false)
        console.log('ModelViewer: Finished downloading model. isLoading set to false.')
      }
    }

    if (modelUrl) {
      downloadModel()
    }
  }, [modelUrl])

  if (error) {
    console.log('ModelViewer: Rendering FallbackComponent due to error')
    return <FallbackComponent error={{ message: error }} />
  }

  return (
    <div className="w-full h-[400px] relative bg-gray-100 rounded-lg overflow-hidden">
      {isLoading ? (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-200">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : localModelUrl ? (
        <ErrorBoundary FallbackComponent={FallbackComponent}>
          <Canvas camera={{ position: [0, 0, 5] }}>
            <Suspense fallback={null}>
              <Model url={localModelUrl} />
            </Suspense>
            <OrbitControls enablePan={true} enableZoom={true} enableRotate={true} />
            <ambientLight intensity={0.5} />
            <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
          </Canvas>
        </ErrorBoundary>
      ) : null}
    </div>
  )
}

export default function PetViewer() {
  const [prompt, setPrompt] = useState('')
  const [modelUrl, setModelUrl] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [error, setError] = useState(null)
  const [taskId, setTaskId] = useState(null)

  const generateModel = async () => {
    console.log('PetViewer: Starting model generation')
    setIsGenerating(true)
    setError(null)
    setModelUrl('')
    try {
      console.log('PetViewer: Sending POST request to /api/generate-3d-model with prompt:', prompt)
      const generateResponse = await fetch('http://localhost:3001/api/generate-3d-model', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt }),
      })

      console.log(`PetViewer: Received response from generate-3d-model with status: ${generateResponse.status}`)

      if (!generateResponse.ok) {
        const errorText = await generateResponse.text()
        console.error(`PetViewer: Failed to generate model: ${generateResponse.statusText}\n${errorText}`)
        throw new Error(`Failed to generate model: ${generateResponse.statusText}`)
      }

      const generateData = await generateResponse.json()
      console.log('PetViewer: Model generation response data:', generateData)
      setModelUrl(generateData.model_link.glb)
      setTaskId(generateData.id)
      console.log(`PetViewer: Task ID set to: ${generateData.id}`)
    } catch (err) {
      console.error('PetViewer: Error during model generation:', err)
      setError(err.message)
      setIsGenerating(false)
    }
  }

  useEffect(() => {
    let pollingInterval
    if (taskId) {
      console.log(`PetViewer: Starting to poll task status for Task ID: ${taskId}`)
      pollingInterval = setInterval(async () => {
        console.log(`PetViewer: Polling status for Task ID: ${taskId}`)
        try {
          const response = await fetch(`http://localhost:3001/api/v2/text-to-3d/${taskId}`)
          console.log(`PetViewer: Received polling response with status: ${response.status}`)

          if (!response.ok) {
            const errorText = await response.text()
            console.error(`PetViewer: Failed to poll task: ${response.statusText}\n${errorText}`)
            throw new Error(`Failed to poll task: ${response.statusText}`)
          }

          const data = await response.json()
          console.log('PetViewer: Polling response data:', data)

          if (data.status === 'SUCCEEDED' && data.model_urls && data.model_urls.glb) {
            console.log('PetViewer: Model generation succeeded. Model URL:', data.model_urls.glb)
            setModelUrl(data.model_urls.glb)
            setIsGenerating(false)
            clearInterval(pollingInterval)
          } else if (data.status === 'FAILED') {
            console.error('PetViewer: Model generation failed')
            throw new Error('Model generation failed')
          } else {
            console.log(`PetViewer: Model generation status: ${data.status}. Continuing to poll...`)
          }
          // If status is still PENDING or IN_PROGRESS, continue polling
        } catch (err) {
          console.error('PetViewer: Error while polling task status:', err)
          setError(err.message)
          setIsGenerating(false)
          clearInterval(pollingInterval)
        }
      }, 5000) // Poll every 5 seconds
    }

    return () => {
      if (pollingInterval) {
        console.log('PetViewer: Clearing polling interval')
        clearInterval(pollingInterval)
      }
    }
  }, [taskId])

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">3D Pet Generator</h1>
      <div className="mb-4">
        <input
          type="text"
          value={prompt}
          onChange={(e) => {
            console.log(`PetViewer: Prompt changed to: ${e.target.value}`)
            setPrompt(e.target.value)
          }}
          placeholder="Describe your pet (e.g., 'A cute blue cat')"
          className="w-full p-2 border rounded"
        />
      </div>
      <button
        onClick={generateModel}
        disabled={isGenerating || !prompt}
        className="bg-blue-500 text-white p-2 rounded disabled:bg-gray-300"
      >
        {isGenerating ? 'Generating...' : 'Generate 3D Pet'}
      </button>
      {error && (
        <p className="text-red-500 mt-2">Error: {error}</p>
      )}
      {isGenerating && (
        <p className="mt-2">Generating your 3D pet. This may take a few minutes...</p>
      )}
      {modelUrl && (
        <div className="mt-4">
          <h2 className="text-xl font-bold mb-2">Your 3D Pet</h2>
          <ModelViewer modelUrl={modelUrl} />
        </div>
      )}
    </div>
  )
}
