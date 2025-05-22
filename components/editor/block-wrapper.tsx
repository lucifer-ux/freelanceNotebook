"use client"

import { useRef, useState, useEffect, useCallback } from 'react'
import { createPortal } from 'react-dom'
import { useSelected, useFocused } from 'slate-react'
import { MessageSquare, MessageSquarePlus, X, Send } from 'lucide-react'

// Mock user data - replace with your actual user data
const currentUser = {
  id: 'user1',
  name: 'John Doe',
  email: 'john@example.com'
}

// Helper function to get user initials from name
const getUserInitials = (name: string) => {
  return name
    .split(' ')
    .map(part => part[0] || '')
    .join('')
    .toUpperCase()
    .substring(0, 2)
}

interface Comment {
  id: string
  userId: string
  userName: string
  content: string
  timestamp: Date
}

type BlockWrapperProps = {
  children: React.ReactNode
  attributes: any
  element: any
}

// Block types that should show the toolbar on hover
const BLOCKS_WITH_HOVER_TOOLBAR = [
  'image',
  'video',
  '3d',
  'audio',
  'code-block'
]

// A separate component for the comment input that will be rendered in a portal
const CommentInput = ({
  onClose,
  onSubmit,
  initialValue = ''
}: {
  onClose: () => void
  onSubmit: (text: string) => void
  initialValue?: string
}) => {
  const [commentText, setCommentText] = useState(initialValue)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (commentText.trim()) {
      onSubmit(commentText)
    }
  }

  return (
    <div className="mt-2 w-full">
      <div className="flex gap-3 items-start">
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-medium">
          {getUserInitials(currentUser.name)}
        </div>
        <div className="flex-1 bg-gray-800 rounded-lg p-3">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-200">{currentUser.name}</span>
            <button 
              onClick={onClose}
              className="text-gray-400 hover:text-gray-200"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <form onSubmit={handleSubmit} className="space-y-2">
            <textarea
              ref={inputRef}
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              className="w-full bg-gray-900 text-gray-200 rounded p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Write a comment..."
              rows={3}
            />
            <div className="flex justify-end">
              <button
                type="submit"
                className="inline-flex items-center px-3 py-1.5 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-md"
                disabled={!commentText.trim()}
              >
                <Send className="w-4 h-4 mr-1" />
                Comment
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

// Component for displaying a single comment
const CommentItem = ({ comment }: { comment: Comment }) => (
  <div className="flex gap-3">
    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-medium">
      {getUserInitials(comment.userName)}
    </div>
    <div className="flex-1">
      <div className="bg-gray-800 rounded-lg p-3">
        <div className="flex justify-between items-start">
          <div>
            <span className="text-sm font-medium text-gray-200">{comment.userName}</span>
            <span className="text-xs text-gray-400 ml-2">
              {new Date(comment.timestamp).toLocaleString()}
            </span>
          </div>
        </div>
        <p className="mt-1 text-sm text-gray-300">{comment.content}</p>
      </div>
    </div>
  </div>
)

export const BlockWrapper = ({ children, attributes, element }: BlockWrapperProps) => {
  const [showToolbar, setShowToolbar] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const [showCommentInput, setShowCommentInput] = useState(false)
  const [comments, setComments] = useState<Comment[]>([])
  const wrapperRef = useRef<HTMLDivElement>(null)
  const isSelected = useSelected()
  const isFocused = useFocused()
  const [portalContainer, setPortalContainer] = useState<HTMLDivElement | null>(null)

  // Create a container for the portal when the component mounts
  useEffect(() => {
    const container = document.createElement('div')
    container.className = 'comment-portal-container'
    document.body.appendChild(container)
    setPortalContainer(container)
    
    return () => {
      if (container && container.parentNode) {
        container.parentNode.removeChild(container)
      }
    }
  }, [])

  // Check if text is selected
  const hasTextSelected = useCallback(() => {
    const selection = window.getSelection()
    return selection && selection.toString().trim().length > 0
  }, [])

  // Check if this block should show toolbar on hover
  const shouldShowHoverToolbar = BLOCKS_WITH_HOVER_TOOLBAR.includes(element.type)
  
  const handleAddComment = useCallback(() => {
    setShowCommentInput(true)
    setShowToolbar(false)
  }, [])

  const handleAddSuggestion = useCallback(() => {
    console.log('Add suggestion to block:', element)
    setShowToolbar(false)
  }, [element])

  const handleCommentSubmit = useCallback((text: string) => {
    if (!text.trim()) return
    
    const newComment: Comment = {
      id: Date.now().toString(),
      userId: currentUser.id,
      userName: currentUser.name,
      content: text,
      timestamp: new Date()
    }
    
    setComments(prev => [...prev, newComment])
    setShowCommentInput(false)
  }, [])

  // getUserInitials is now defined at the module level

  // Show/hide toolbar based on conditions
  useEffect(() => {
    const shouldShow = (isHovered && shouldShowHoverToolbar) || hasTextSelected()
    
    if (shouldShow) {
      setShowToolbar(true)
    } else {
      // Small delay to allow moving to the toolbar
      const timer = setTimeout(() => {
        setShowToolbar(false)
      }, 200)
      return () => clearTimeout(timer)
    }
  }, [isHovered, isSelected, isFocused, shouldShowHoverToolbar, hasTextSelected])

  // Only add hover handlers for blocks that should show the toolbar on hover
  const hoverHandlers = shouldShowHoverToolbar ? {
    onMouseEnter: (e: React.MouseEvent) => {
      e.stopPropagation()
      setIsHovered(true)
    },
    onMouseLeave: (e: React.MouseEvent) => {
      e.stopPropagation()
      setIsHovered(false)
    }
  } : {}

  return (
    <div 
      ref={wrapperRef}
      {...attributes}
      className="relative group block-wrapper"
      style={{
        backgroundColor: isHovered && shouldShowHoverToolbar ? 'rgba(31, 41, 55, 0.2)' : 'transparent',
        transition: 'background-color 0.2s ease',
        padding: '2px 0',
        margin: '-2px 0',
      }}
      {...hoverHandlers}
    >
      {children}
      
      {/* Floating Toolbar */}
      {showToolbar && (
        <div
          className="absolute -left-12 top-0 z-50"
          style={{ pointerEvents: 'auto' }}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <div className="flex flex-col bg-gray-800 rounded-md shadow-lg border border-gray-700 p-1 gap-1">
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
          </div>
        </div>
      )}

      {/* Comment Input in Portal */}
      {showCommentInput && portalContainer && createPortal(
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-start justify-center p-4 z-50"
          onClick={(e) => {
            e.stopPropagation()
            e.preventDefault()
            setShowCommentInput(false)
          }}
        >
          <div 
            className="bg-gray-800 rounded-lg p-4 w-full max-w-2xl mt-20"
            onClick={e => e.stopPropagation()}
          >
            <CommentInput
              onClose={() => setShowCommentInput(false)}
              onSubmit={handleCommentSubmit}
            />
          </div>
        </div>,
        portalContainer
      )}

      {/* Comments List */}
      {comments.length > 0 && (
        <div className="mt-3 space-y-3">
          {comments.map((comment) => (
            <CommentItem key={comment.id} comment={comment} />
          ))}
        </div>
      )}
    </div>
  )
}
