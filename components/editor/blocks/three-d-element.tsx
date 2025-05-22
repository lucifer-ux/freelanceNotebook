"use client"

import type React from "react"
import { Suspense, useState, useCallback, useEffect } from "react"
import { Canvas } from "@react-three/fiber"
import { OrbitControls, PerspectiveCamera, useGLTF } from "@react-three/drei"
import { Pencil, AlertCircle } from "lucide-react"
import * as THREE from 'three'

import { Input } from "@/components/ui/input"

const Model = ({ url }: { url: string }) => {
  try {
    const { scene } = useGLTF(url)
    return (
      <primitive 
        object={scene} 
        scale={1} 
        position={[0, 0, 0]}
        onUpdate={(self: THREE.Object3D) => {
          // Auto-rotate the model for better visibility
          self.rotation.y += 0.005
        }}
      />
    )
  } catch (error) {
    console.error("Error loading 3D model:", error)
    return null
  }
}

export const ThreeDElement = ({ attributes, children, element, selected, focused }: any) => {
  const [isEditingCaption, setIsEditingCaption] = useState(false)
  const [caption, setCaption] = useState(element.caption || "")

  const handleCaptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCaption(e.target.value)
    // In a real implementation, you would update the element in the editor
  }

  const [error, setError] = useState<string | null>(null)

  const handleError = useCallback((err: Error) => {
    console.error("3D Model Error:", err)
    setError("Failed to load 3D model. Please check the URL or file format.")
  }, [])

  return (
    <div {...attributes} className={`my-4 ${selected && focused ? "ring-2 ring-blue-500 rounded-lg" : ""}`}>
      <div contentEditable={false} className="relative">
        <div className="h-[300px] max-w-2xl mx-auto rounded-lg overflow-hidden bg-gray-800">
          {error ? (
            <div className="h-full flex flex-col items-center justify-center p-4 text-center">
              <AlertCircle className="h-12 w-12 text-red-500 mb-2" />
              <p className="text-red-400 font-medium">Error loading 3D model</p>
              <p className="text-sm text-gray-400 mt-1">{error}</p>
              <button 
                onClick={() => setError(null)} 
                className="mt-4 px-3 py-1 text-sm bg-gray-700 hover:bg-gray-600 rounded"
              >
                Try Again
              </button>
            </div>
          ) : (
            <Suspense fallback={
              <div className="h-full flex flex-col items-center justify-center">
                <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-2"></div>
                <p className="text-gray-400 text-sm">Loading 3D model...</p>
              </div>
            }>
              <Canvas
                gl={{ antialias: true }}
                camera={{ position: [0, 0, 5], fov: 50 }}
                style={{ background: '#1e1e2d' }}
              >
                <color attach="background" args={['#1e1e2d']} />
                <ambientLight intensity={1} />
                <directionalLight
                  position={[10, 10, 5]}
                  intensity={1}
                  castShadow
                />
                <directionalLight
                  position={[-10, -10, -5]}
                  intensity={0.5}
                />
                <Model url={element.url} />
                <OrbitControls 
                  enablePan={true}
                  enableZoom={true}
                  enableRotate={true}
                />
              </Canvas>
            </Suspense>
          )}
        </div>
        <div className="mt-2 text-center">
          {isEditingCaption ? (
            <div className="flex items-center justify-center gap-2">
              <Input
                value={caption}
                onChange={handleCaptionChange}
                placeholder="Add a caption..."
                className="max-w-md text-sm"
                autoFocus
                onBlur={() => setIsEditingCaption(false)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    setIsEditingCaption(false)
                  }
                }}
              />
            </div>
          ) : (
            <div
              className="text-sm text-gray-400 flex items-center justify-center gap-1 cursor-text"
              onClick={() => setIsEditingCaption(true)}
            >
              {caption ? (
                caption
              ) : (
                <>
                  <Pencil className="h-3 w-3" />
                  <span>Add a caption</span>
                </>
              )}
            </div>
          )}
        </div>
      </div>
      {children}
    </div>
  )
}
