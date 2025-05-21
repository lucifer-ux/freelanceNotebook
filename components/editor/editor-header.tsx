"use client"

import { Lock, ChevronDown, MessageSquare, Star, MoreHorizontal } from "lucide-react"

interface EditorHeaderProps {
  title?: string
}

export function EditorHeader({ title = "New page" }: EditorHeaderProps) {
  return (
    <header className="flex items-center justify-between mb-6 px-2">
      <div className="flex items-center space-x-2">
        <h1 className="text-sm font-medium text-gray-300">{title}</h1>
        <div className="flex items-center space-x-1 text-gray-500">
          <span className="p-1 rounded hover:bg-gray-800">
            <Lock className="h-4 w-4" />
          </span>
          <span className="text-xs">Private</span>
          <span className="p-1 rounded hover:bg-gray-800">
            <ChevronDown className="h-4 w-4" />
          </span>
        </div>
      </div>
      <div className="flex items-center space-x-2">
        <button className="px-3 py-1 text-sm rounded hover:bg-gray-800 text-gray-300">Share</button>
        <button className="p-1 rounded hover:bg-gray-800 text-gray-300">
          <MessageSquare className="h-5 w-5" />
        </button>
        <button className="p-1 rounded hover:bg-gray-800 text-gray-300">
          <Star className="h-5 w-5" />
        </button>
        <button className="p-1 rounded hover:bg-gray-800 text-gray-300">
          <MoreHorizontal className="h-5 w-5" />
        </button>
      </div>
    </header>
  )
}
