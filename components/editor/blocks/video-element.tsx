"use client"

import type React from "react"
import { useState } from "react"
import { Pencil } from "lucide-react"

import { Input } from "@/components/ui/input"

export const VideoElement = ({ attributes, children, element, selected, focused }: any) => {
  const [isEditingCaption, setIsEditingCaption] = useState(false)
  const [caption, setCaption] = useState(element.caption || "")

  const handleCaptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCaption(e.target.value)
    // In a real implementation, you would update the element in the editor
  }

  const isEmbedUrl =
    element.url.includes("youtube.com/embed") ||
    element.url.includes("player.vimeo.com") ||
    element.url.includes("embed")

  return (
    <div {...attributes} className={`my-4 ${selected && focused ? "ring-2 ring-blue-500 rounded-lg" : ""}`}>
      <div contentEditable={false} className="relative max-w-2xl mx-auto">
        <div className="relative aspect-video bg-gray-800 rounded-lg overflow-hidden">
          {isEmbedUrl ? (
            <iframe
              src={element.url}
              className="w-full h-full"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          ) : (
            <video 
              src={element.url} 
              controls 
              className="w-full h-full object-contain bg-black"
            />
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
