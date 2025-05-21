"use client"

import type React from "react"

import { createContext, useContext, useState, useEffect } from "react"
import type { Descendant } from "slate"

export type Note = {
  id: string
  title: string
  content: Descendant[]
  lastEdited: Date
}

type NotesContextType = {
  notes: Note[]
  activeNoteId: string | null
  openTabs: string[]
  addNote: () => string
  updateNote: (id: string, updates: Partial<Note>) => void
  setActiveNote: (id: string) => void
  openTab: (id: string) => void
  closeTab: (id: string) => void
  searchNotes: (query: string) => Note[]
}

const initialValue: Descendant[] = [
  {
    type: "heading-1",
    children: [{ text: "New page" }],
  },
  {
    type: "paragraph",
    children: [{ text: "" }],
  },
]

const NotesContext = createContext<NotesContextType | undefined>(undefined)

export function NotesProvider({ children }: { children: React.ReactNode }) {
  const [notes, setNotes] = useState<Note[]>([
    { id: "1", title: "New page", content: initialValue, lastEdited: new Date() },
    { id: "2", title: "Meeting notes", content: initialValue, lastEdited: new Date() },
    { id: "3", title: "Project ideas", content: initialValue, lastEdited: new Date() },
  ])
  const [activeNoteId, setActiveNoteId] = useState<string | null>("1")
  const [openTabs, setOpenTabs] = useState<string[]>(["1"])

  // Open the active note in tabs if not already open
  useEffect(() => {
    if (activeNoteId && !openTabs.includes(activeNoteId)) {
      setOpenTabs((prev) => [...prev, activeNoteId])
    }
  }, [activeNoteId, openTabs])

  const addNote = () => {
    const newId = `note-${Date.now()}`
    const newNote: Note = {
      id: newId,
      title: "Untitled",
      content: [
        {
          type: "heading-1",
          children: [{ text: "Untitled" }],
        },
        {
          type: "paragraph",
          children: [{ text: "" }],
        },
      ],
      lastEdited: new Date(),
    }
    setNotes((prev) => [...prev, newNote])
    setActiveNoteId(newId)
    setOpenTabs((prev) => [...prev, newId])
    return newId
  }

  const updateNote = (id: string, updates: Partial<Note>) => {
    setNotes((prev) => prev.map((note) => (note.id === id ? { ...note, ...updates, lastEdited: new Date() } : note)))
  }

  const setActiveNote = (id: string) => {
    setActiveNoteId(id)
    if (!openTabs.includes(id)) {
      setOpenTabs((prev) => [...prev, id])
    }
  }

  const openTab = (id: string) => {
    if (!openTabs.includes(id)) {
      setOpenTabs((prev) => [...prev, id])
    }
    setActiveNoteId(id)
  }

  const closeTab = (id: string) => {
    setOpenTabs((prev) => prev.filter((tabId) => tabId !== id))
    if (activeNoteId === id) {
      // Set active to the previous tab or the first available
      const index = openTabs.indexOf(id)
      if (index > 0) {
        setActiveNoteId(openTabs[index - 1])
      } else if (openTabs.length > 1) {
        setActiveNoteId(openTabs[1])
      } else {
        setActiveNoteId(null)
      }
    }
  }

  const searchNotes = (query: string) => {
    if (!query) return notes
    const lowerQuery = query.toLowerCase()
    return notes.filter(
      (note) =>
        note.title.toLowerCase().includes(lowerQuery) ||
        JSON.stringify(note.content).toLowerCase().includes(lowerQuery),
    )
  }

  return (
    <NotesContext.Provider
      value={{
        notes,
        activeNoteId,
        openTabs,
        addNote,
        updateNote,
        setActiveNote,
        openTab,
        closeTab,
        searchNotes,
      }}
    >
      {children}
    </NotesContext.Provider>
  )
}

export function useNotes() {
  const context = useContext(NotesContext)
  if (context === undefined) {
    throw new Error("useNotes must be used within a NotesProvider")
  }
  return context
}
