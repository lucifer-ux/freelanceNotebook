"use client"

import type React from "react"
import { useState } from "react"
import { Pencil } from "lucide-react"
import { Input } from "@/components/ui/input"

export const ImageElement = ({ attributes, children, element, selected, focused }: any) => {
  const [isEditingCaption, setIsEditingCaption] = useState(false)
  const [caption, setCaption] = useState(element.caption || "")

  const handleCaptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCaption(e.target.value)
    // In a real implementation, you would update the element in the editor
  }

  return (
    <div {...attributes} className={`my-4 ${selected && focused ? "ring-2 ring-blue-500 rounded-lg" : ""}`}>
      <div contentEditable={false} className="relative">
        <img
          src={element.url || "/placeholder.svg"}
          alt={element.caption || ""}
          className="max-w-full rounded-lg mx-auto"
        />
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
