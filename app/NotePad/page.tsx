"use client"

import { useState } from "react"
import { Editor } from "@/components/editor/editor"
import { ThemeProvider } from "@/components/theme-provider"
import { Sidebar } from "@/components/sidebar/sidebar"
import { CollaborationBar } from "@/components/collaboration-bar"
import { TabsBar } from "@/components/tabs-bar"
import { NotesProvider } from "@/components/context/notes-context"
import { AssetsProvider } from "@/components/context/assets-context"

export default function Home() {
  const [sidebarOpen, setSidebarOpen] = useState(true)

  return (
    <ThemeProvider defaultTheme="dark" storageKey="notion-theme">
      <NotesProvider>
        <AssetsProvider>
          <div className="flex h-screen bg-[#191919] text-white overflow-hidden">
            <Sidebar open={sidebarOpen} setOpen={setSidebarOpen} />

            <main className="flex-1 flex flex-col h-screen overflow-hidden">
              <CollaborationBar />
              <TabsBar />

              <div className="flex-1 overflow-auto">
                <div className="container mx-auto py-4 px-4 max-w-5xl">
                  <div className="rounded-lg overflow-hidden">
                    <Editor />
                  </div>
                </div>
              </div>
            </main>
          </div>
        </AssetsProvider>
      </NotesProvider>
    </ThemeProvider>
  )
}
