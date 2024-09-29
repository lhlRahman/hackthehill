"use client"

import React, { useState, useEffect, useCallback, Suspense } from 'react'
import { PlaceholdersAndVanishInput } from "./ui/placeholders-and-vanish-input"
import { ErrorBoundary } from 'react-error-boundary'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, useGLTF } from '@react-three/drei'
import { useAppStatesContext } from "../../contexts/user-context"
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

export default function PetViewer( visible, petUrl ) {
  const [prompt, setPrompt] = useState('')
  const [modelUrl, setModelUrl] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [error, setError] = useState(null)
  const [taskId, setTaskId] = useState(null)
  const { id } = useAppStatesContext();
  
  console.log("id dkwa;skd;l" + id)


  const accept = async () => {
    const response = await fetch(`http://localhost:3001/user/updateuser`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            id: id,
            url: modelUrl
    })
}
    )

    const data = await response.json();
    console.log(data);
    if (data.success) {
        console.log('User updated successfully');
    } else {
        console.error('Failed to update user');
    }

  }



  const placeholders = [
    "A Dragon",
    "LEBRON JAMES",
    "A ninja",
    "A unicorn",
    "A cat",
    "A dog",
  ]

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
      setTaskId(generateData.model_link.id)
      setModelUrl(generateData.model_link.model_urls.glb)
      console.log(`PetViewer: Task ID set to: ${generateData.id}`)
    } catch (err) {
      console.error('PetViewer: Error during model generation:', err)
      setError(err.message)
      setIsGenerating(false)
    }
  }

  const pollTaskStatus = useCallback(async () => {
    if (!taskId) return

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
      } else if (data.status === 'FAILED') {
        console.error('PetViewer: Model generation failed')
        throw new Error('Model generation failed')
      } else {
        console.log(`PetViewer: Model generation status: ${data.status}. Continuing to poll...`)
      }
    } catch (err) {
      console.error('PetViewer: Error while polling task status:', err)
      setError(err.message)
      setIsGenerating(false)
    }
  }, [taskId])

  useEffect(() => {
    let pollingInterval

    if (taskId && isGenerating) {
      console.log(`PetViewer: Starting to poll task status for Task ID: ${taskId}`)
      pollingInterval = setInterval(pollTaskStatus, 5000) // Poll every 5 seconds
    }

    return () => {
      if (pollingInterval) {
        console.log('PetViewer: Clearing polling interval')
        clearInterval(pollingInterval)
      }
    }
  }, [taskId, isGenerating, pollTaskStatus])

  return (
    <div className="container mx-auto p-4">
      {error && (
        <p className="text-red-500 mt-2">Error: {error}</p>
      )}
      {!isGenerating && !modelUrl ? (
        <div className="h-[40rem] flex flex-col justify-center items-center px-4">
          <h2 className="mb-10 sm:mb-20 text-xl text-center sm:text-5xl dark:text-white text-black">
            Choose Your Character!
          </h2>
          <PlaceholdersAndVanishInput 
            placeholders={placeholders} 
            onChange={(e) => setPrompt(e.target.value)} 
            onSubmit={generateModel} 
          />
        </div>
      ) : (
        !modelUrl && 
        <div className="h-[40rem] flex flex-col justify-center items-center px-4">
          <h2 className="mb-10 sm:mb-20 text-xl text-center sm:text-5xl dark:text-white text-black">
            Generating Your 3D Pet!
          </h2>
          <p className="mt-2">This may take a few minutes...</p>
        </div>
      )}
      {modelUrl && (
        <div className="mt-4">
          <h2 className="text-xl font-bold mb-2">Your 3D Pet</h2>
          <ModelViewer modelUrl={modelUrl} />
          <button onClick={accept}>
            Continue
          </button>
        </div>
        
      )}
    </div>
  )
}
