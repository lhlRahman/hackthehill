// src/app/components/PetViewer.js
"use client"

import React, { useState, useEffect } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, useGLTF } from '@react-three/drei'
import { ErrorBoundary } from 'react-error-boundary'

function Model({ url }) {
  const { scene } = useGLTF(url)
  return <primitive object={scene} />
}

function FallbackComponent({ error }) {
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
      try {
        setIsLoading(true)
        const response = await fetch('/api/downloadModal', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ url: modelUrl }),
        })
        
        if (!response.ok) {
          const errorText = await response.text()
          throw new Error(`API error: ${response.status} ${response.statusText}\n${errorText}`)
        }

        let data
        try {
          data = await response.json()
        } catch (e) {
          throw new Error(`Invalid JSON response: ${await response.text()}`)
        }

        if (data.success) {
          setLocalModelUrl(`/${data.fileName}`)
        } else {
          throw new Error(data.error || 'Failed to download model')
        }
      } catch (err) {
        console.error('Error:', err)
        setError(err.message)
      } finally {
        setIsLoading(false)
      }
    }

    downloadModel()
  }, [modelUrl])

  if (error) {
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
            <Model url={localModelUrl} />
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
  const [modelUrl, setModelUrl] = useState("https://assets.meshy.ai/b2e42015-d3d8-42b0-89d7-d8dbc433ff6e/tasks/01923a5f-96b4-7a73-a34e-79bf74d5198c/output/model.glb?Expires=4881081600&Signature=qBFuEPH2WLrsku9n0veRRWlRBY-z6n0YuuakZHpOzl~UzRpBaFUGbyAZrTd1BHfYG8LCs3H7JbcSgReDnTjMetYmEKF5X6LlJFce7emlZv2MNpDmRXY2-KRbYtANAMnrKR8NYBal6tkFBS5kxBMZDY5WdZ6YrRjYsemU7AZqC1YrbP~0mKJtQpgqkI-iucy4m0yHT0cixVaMUn0mPmF3-LVOCeZaJjvvaAeziHEIjs5Np3u83KpQtAc2b0DsZKvDr4zSfGtfE4XcjkmdHo76a6texjI7LtKrkwIWuZhCp06V8ownsUab2OjmPNJWBsX-h8e62ccHPnV3ZgayG3eVtg__&Key-Pair-Id=KL5I0C8H7HX83")

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">3D Model Viewer</h1>
      {modelUrl ? (
        <ModelViewer modelUrl={modelUrl} />
      ) : (
        <p className="text-red-500">No model URL provided.</p>
      )}
    </div>
  )
}