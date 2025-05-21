"use client"

import type React from "react"
import { Suspense, useState } from "react"
import { Canvas } from "@react-three/fiber"
import { OrbitControls, PerspectiveCamera, useGLTF } from "@react-three/drei"
import { Pencil } from "lucide-react"

import { Input } from "@/components/ui/input"

const Model = ({ url }: { url: string }) => {
  const { scene } = useGLTF(url)
  return <primitive object={scene} scale={1.5} position={[0, 0, 0]} />
}

export const ThreeDElement = ({ attributes, children, element, selected, focused }: any) => {
  const [isEditingCaption, setIsEditingCaption] = useState(false)
  const [caption, setCaption] = useState(element.caption || "")

  const handleCaptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCaption(e.target.value)
    // In a real implementation, you would update the element in the editor
  }

  return (
    <div {...attributes} className={`my-4 ${selected && focused ? "ring-2 ring-blue-500 rounded-lg" : ""}`}>
      <div contentEditable={false} className="relative">
        <div className="h-[400px] rounded-lg overflow-hidden bg-gray-800">
          <Suspense fallback={<div className="h-full flex items-center justify-center">Loading 3D model...</div>}>
            <Canvas>
              <ambientLight intensity={0.5} />
              <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
              <pointLight position={[-10, -10, -10]} />
              <Model url={element.url} />
              <OrbitControls />
              <PerspectiveCamera makeDefault position={[0, 0, 5]} />
            </Canvas>
          </Suspense>
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
