"use client"

import { useCallback, useEffect, useRef, useState } from 'react'
import { useSlate, useFocused, useSelected } from 'slate-react'
import { createPortal } from 'react-dom'
import { MessageSquare, MessageSquarePlus } from 'lucide-react'

const FloatingToolbar = () => {
  const ref = useRef<HTMLDivElement | null>(null)
  const [showToolbar, setShowToolbar] = useState(false)
  const [position, setPosition] = useState({ top: 0, left: 0 })
  const editor = useSlate()
  const isEditorFocused = useFocused()

  // Check if there's a text selection
  const hasSelection = useCallback(() => {
    const selection = window.getSelection()
    if (!selection || selection.rangeCount === 0 || selection.toString().trim() === '') {
      return false
    }
    return true
  }, [])

  // Function to position the toolbar
  const positionToolbar = useCallback(() => {
    if (!hasSelection()) {
      setShowToolbar(false)
      return
    }

    const selection = window.getSelection()
    if (!selection || selection.rangeCount === 0) {
      setShowToolbar(false)
      return
    }

    const range = selection.getRangeAt(0)
    const rect = range.getBoundingClientRect()
    
    setPosition({
      top: rect.top + window.scrollY - 40, // Position above the selection
      left: rect.left + window.scrollX + rect.width / 2 - 50, // Center above selection
    })
    setShowToolbar(true)
  }, [hasSelection])

  // Handle text selection
  const handleMouseUp = useCallback(() => {
    if (hasSelection()) {
      positionToolbar()
    } else {
      setShowToolbar(false)
    }
  }, [positionToolbar, hasSelection])

  // Add event listeners
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setShowToolbar(false)
      }
    }

    document.addEventListener('mouseup', handleMouseUp)
    document.addEventListener('mousedown', handleClickOutside)
    
    return () => {
      document.removeEventListener('mouseup', handleMouseUp)
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [handleMouseUp])

  // Don't render if there's no selection or editor isn't focused
  if (!showToolbar || !isEditorFocused) {
    return null
  }

  const handleAddComment = () => {
    // TODO: Implement add comment functionality
    console.log('Add comment')
    setShowToolbar(false)
  }

  const handleAddSuggestion = () => {
    // TODO: Implement add suggestion functionality
    console.log('Add suggestion')
    setShowToolbar(false)
  }


  return createPortal(
    <div
      ref={ref}
      style={{
        position: 'absolute',
        top: `${position.top}px`,
        left: `${position.left}px`,
        zIndex: 1000,
      }}
      className="bg-gray-800 rounded-md shadow-lg border border-gray-700 p-1 flex items-center gap-1"
      onMouseDown={(e) => e.preventDefault()} // Prevent losing selection
    >
      <button
        onClick={handleAddComment}
        className="p-2 hover:bg-gray-700 rounded text-gray-300 hover:text-white"
        title="Add comment"
      >
        <MessageSquare className="w-4 h-4" />
      </button>
      <button
        onClick={handleAddSuggestion}
        className="p-2 hover:bg-gray-700 rounded text-gray-300 hover:text-white"
        title="Add suggestion"
      >
        <MessageSquarePlus className="w-4 h-4" />
      </button>
    </div>,
    document.body
  )
}

export default FloatingToolbar
