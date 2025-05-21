"use client"

import { useNotes } from "@/components/context/notes-context"
import { X } from "lucide-react"
import { cn } from "@/lib/utils"

export function TabsBar() {
  const { notes, activeNoteId, openTabs, setActiveNote, closeTab } = useNotes()

  if (openTabs.length === 0) {
    return null
  }

  return (
    <div className="flex items-center overflow-x-auto bg-[#1e1e1e] border-b border-gray-800 px-1 h-9">
      <div className="flex space-x-1">
        {openTabs.map((tabId) => {
          const note = notes.find((n) => n.id === tabId)
          if (!note) return null

          return (
            <div
              key={tabId}
              className={cn(
                "group flex items-center h-8 px-3 py-1 rounded-t-md border-t border-l border-r border-transparent relative",
                activeNoteId === tabId
                  ? "bg-[#191919] border-gray-700 text-white"
                  : "bg-[#252525] text-gray-400 hover:bg-[#2a2a2a]",
              )}
            >
              <button className="text-xs font-medium truncate max-w-[120px]" onClick={() => setActiveNote(tabId)}>
                {note.title}
              </button>
              <button
                className="ml-2 p-0.5 rounded-full hover:bg-gray-700 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={(e) => {
                  e.stopPropagation()
                  closeTab(tabId)
                }}
              >
                <X className="h-3 w-3" />
              </button>
              {activeNoteId === tabId && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500" />}
            </div>
          )
        })}
      </div>
    </div>
  )
}
