"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { ChevronDown, ChevronRight, File, FileText, ImageIcon, Plus, Search } from "lucide-react"
import { cn } from "@/lib/utils"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useNotes } from "@/components/context/notes-context"
import { useAssets } from "@/components/context/assets-context"

interface SidebarProps {
  open: boolean
  setOpen: (open: boolean) => void
}

export function Sidebar({ open, setOpen }: SidebarProps) {
  const { notes, addNote, setActiveNote, searchNotes } = useNotes()
  const { assets } = useAssets()
  const [searchQuery, setSearchQuery] = useState("")
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    notepad: true,
    projects: false,
    gettingStarted: false,
  })
  const [filteredNotes, setFilteredNotes] = useState(notes)

  useEffect(() => {
    setFilteredNotes(searchNotes(searchQuery))
  }, [searchQuery, notes, searchNotes])

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }))
  }

  const handleAddPage = () => {
    addNote()
  }

  return (
    <div
      className={cn(
        "h-screen bg-[#191919] border-r border-gray-800 transition-all duration-300 flex flex-col",
        open ? "w-64" : "w-0",
      )}
    >
      {open && (
        <>
          <div className="p-3 border-b border-gray-800">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                placeholder="Search notes..."
                className="pl-8 bg-gray-800 border-gray-700 text-sm"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            <div className="p-1">
              <div className="mb-1">
                <button
                  className="flex items-center w-full px-2 py-1 text-sm text-gray-300 hover:bg-gray-800 rounded"
                  onClick={() => toggleSection("notepad")}
                >
                  {expandedSections.notepad ? (
                    <ChevronDown className="h-4 w-4 mr-1 text-gray-500" />
                  ) : (
                    <ChevronRight className="h-4 w-4 mr-1 text-gray-500" />
                  )}
                  <span>NotePad</span>
                </button>

                {expandedSections.notepad && (
                  <div className="ml-6 mt-1 space-y-1">
                    {filteredNotes.map((note) => (
                      <button
                        key={note.id}
                        className="flex items-center w-full px-2 py-1 text-sm text-gray-400 hover:bg-gray-800 rounded"
                        onClick={() => setActiveNote(note.id)}
                      >
                        <FileText className="h-4 w-4 mr-2 text-gray-500" />
                        <span className="truncate">{note.title}</span>
                      </button>
                    ))}
                    <button
                      className="flex items-center w-full px-2 py-1 text-sm text-gray-400 hover:bg-gray-800 rounded"
                      onClick={handleAddPage}
                    >
                      <Plus className="h-4 w-4 mr-2 text-gray-500" />
                      <span>Add a page</span>
                    </button>
                  </div>
                )}
              </div>

              <div className="mb-1">
                <button
                  className="flex items-center w-full px-2 py-1 text-sm text-gray-300 hover:bg-gray-800 rounded"
                  onClick={() => toggleSection("projects")}
                >
                  {expandedSections.projects ? (
                    <ChevronDown className="h-4 w-4 mr-1 text-gray-500" />
                  ) : (
                    <ChevronRight className="h-4 w-4 mr-1 text-gray-500" />
                  )}
                  <span>Projects</span>
                </button>
              </div>

              <div className="mb-1">
                <button
                  className="flex items-center w-full px-2 py-1 text-sm text-gray-300 hover:bg-gray-800 rounded"
                  onClick={() => toggleSection("gettingStarted")}
                >
                  {expandedSections.gettingStarted ? (
                    <ChevronDown className="h-4 w-4 mr-1 text-gray-500" />
                  ) : (
                    <ChevronRight className="h-4 w-4 mr-1 text-gray-500" />
                  )}
                  <span>Getting Started</span>
                </button>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-800 p-3">
            <Tabs defaultValue="files" className="w-full">
              <TabsList className="grid w-full grid-cols-2 bg-gray-800">
                <TabsTrigger value="files" className="text-xs">
                  Files
                </TabsTrigger>
                <TabsTrigger value="assets" className="text-xs">
                  Assets
                </TabsTrigger>
              </TabsList>
              <TabsContent value="files" className="mt-2 space-y-2">
                <h3 className="text-xs font-medium text-gray-500 uppercase px-1">Links</h3>
                <div className="space-y-1">
                  <div className="flex items-center px-1 py-1 text-sm text-gray-400 hover:bg-gray-800 rounded">
                    <File className="h-4 w-4 mr-2 text-gray-500" />
                    <span className="truncate">Google</span>
                  </div>
                  <div className="flex items-center px-1 py-1 text-sm text-gray-400 hover:bg-gray-800 rounded">
                    <File className="h-4 w-4 mr-2 text-gray-500" />
                    <span className="truncate">GitHub</span>
                  </div>
                  <div className="flex items-center px-1 py-1 text-sm text-gray-400 hover:bg-gray-800 rounded">
                    <File className="h-4 w-4 mr-2 text-gray-500" />
                    <span className="truncate">Vercel</span>
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="assets" className="mt-2 space-y-2">
                <h3 className="text-xs font-medium text-gray-500 uppercase px-1">Uploaded Files</h3>
                <div className="space-y-1">
                  {assets.map((asset) => (
                    <div
                      key={asset.id}
                      className="flex items-center px-1 py-1 text-sm text-gray-400 hover:bg-gray-800 rounded"
                    >
                      <ImageIcon className="h-4 w-4 mr-2 text-gray-500" />
                      <span className="truncate">{asset.name}</span>
                    </div>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </>
      )}

      <button
        className="absolute top-4 left-64 bg-gray-800 rounded-full p-1 transform translate-x-1/2 hover:bg-gray-700 transition-all"
        onClick={() => setOpen(!open)}
      >
        {open ? <ChevronLeft className="h-4 w-4 text-gray-400" /> : <ChevronRight className="h-4 w-4 text-gray-400" />}
      </button>
    </div>
  )
}

function ChevronLeft(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m15 18-6-6 6-6" />
    </svg>
  )
}
