"use client"

import type React from "react"
import { useCallback, useState, useEffect, useMemo } from "react"
import { createEditor, type Descendant, Range, Transforms, type BaseEditor, type BaseElement, type BaseText } from "slate"
import { withHistory, type HistoryEditor } from "slate-history"
import { Editable, Slate, withReact, type ReactEditor } from "slate-react"

type CustomElement = {
  type: 'paragraph' | 'heading-1' | 'heading-2' | 'heading-3' | 'bulleted-list' | 'numbered-list' | 'list-item' | 'code-block' | 'image' | 'video' | '3d' | 'divider' | 'table' | 'table-row' | 'table-cell';
  children: Descendant[];
  url?: string;
  caption?: string;
  language?: string;
  [key: string]: unknown;
}

declare module 'slate' {
  interface CustomTypes {
    Editor: BaseEditor & ReactEditor & HistoryEditor;
    Element: CustomElement;
    Text: BaseText;
  }
}
import { AnimatePresence, motion } from "framer-motion"
import { ImageBlock } from "./blocks/image-block"
import { ThreeDBlock } from "./blocks/three-d-block"
import { VideoBlock } from "./blocks/video-block"
import { SlashCommandMenu } from "./slash-command-menu"
import { Element } from "./element"
import { Leaf } from "./leaf"
import { EditorHeader } from "./editor-header"
import { useNotes } from "@/components/context/notes-context"
import { useAssets } from "@/components/context/assets-context"

const SLASH_COMMAND_CHAR = "/"

const defaultInitialValue: CustomElement[] = [
  {
    type: "heading-1",
    children: [{ text: "New page" }],
  } as CustomElement,
  {
    type: "paragraph",
    children: [{ text: "" }],
  } as CustomElement,
]

export const Editor = () => {
  const [isMounted, setIsMounted] = useState(false)
  const { notes, activeNoteId, updateNote } = useNotes()
  const { addAsset } = useAssets()
  const editor = useMemo(() => withHistory(withReact(createEditor())), [])
  const [showSlashMenu, setShowSlashMenu] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])
  const [slashMenuPosition, setSlashMenuPosition] = useState({ top: 0, left: 0 })
  const [uploadModalOpen, setUploadModalOpen] = useState<{ type: "image" | "video" | "3d" } | null>(null)

  const activeNote = useMemo(() => {
    return notes.find((note) => note.id === activeNoteId) || null
  }, [notes, activeNoteId])

  // Initialize with default value to ensure it's never undefined
  const [editorValue, setEditorValue] = useState<CustomElement[]>(() => {
    if (activeNote?.content) {
      // Ensure content matches CustomElement type
      return (activeNote.content as any[]).map(item => ({
        ...item,
        children: item.children || [{ text: '' }]
      })) as CustomElement[];
    }
    return defaultInitialValue;
  })

  // Update editor value when active note changes
  useEffect(() => {
    if (activeNote?.content) {
      // Ensure content matches CustomElement type
      const content = (activeNote.content as any[]).map(item => ({
        ...item,
        children: item.children || [{ text: '' }]
      })) as CustomElement[];
      setEditorValue(content);
    } else {
      setEditorValue(defaultInitialValue);
    }
  }, [activeNote])

  // Save content changes to the active note
  const handleEditorChange = (value: CustomElement[]) => {
    setEditorValue(value)
    if (activeNoteId) {
      // Check if the title (first heading) has changed
      let title = "Untitled"
      if (value.length > 0 && value[0].type === "heading-1") {
        // @ts-ignore - we know this is a text node
        const headingText = value[0].children[0]?.text || "Untitled"
        title = headingText
      }

      updateNote(activeNoteId, {
        content: value,
        title,
      })
    }
  }

  const renderElement = useCallback((props: any) => {
    // Add contentEditable={false} to void elements
    if (
      props.element.type === "image" ||
      props.element.type === "video" ||
      props.element.type === "3d" ||
      props.element.type === "divider"
    ) {
      return <Element {...props} contentEditable={false} />
    }
    return <Element {...props} />
  }, [])
  const renderLeaf = useCallback((props: any) => <Leaf {...props} />, [])

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      if (event.key === SLASH_COMMAND_CHAR) {
        const { selection } = editor
        if (selection && Range.isCollapsed(selection)) {
          const domSelection = window.getSelection()
          if (domSelection && domSelection.rangeCount > 0) {
            const domRange = domSelection.getRangeAt(0)
            const rect = domRange.getBoundingClientRect()
            setSlashMenuPosition({
              top: rect.bottom + window.scrollY,
              left: rect.left + window.scrollX,
            })
            setShowSlashMenu(true)
          }
        }
      } else if (showSlashMenu) {
        if (event.key === "Escape") {
          setShowSlashMenu(false)
        }
      }
    },
    [editor, showSlashMenu],
  )

  const handleSlashCommand = useCallback(
    (command: string) => {
      setShowSlashMenu(false)

      // Delete the slash character
      if (editor.selection) {
        Transforms.delete(editor, {
          at: {
            anchor: editor.selection.anchor,
            focus: {
              ...editor.selection.focus,
              offset: editor.selection.focus.offset - 1,
            },
          },
        })
      }

      switch (command) {
        case "text":
          Transforms.insertNodes(editor, {
            type: "paragraph",
            children: [{ text: "" }],
          })
          break
        case "heading-1":
          Transforms.insertNodes(editor, {
            type: "heading-1",
            children: [{ text: "" }],
          })
          break
        case "heading-2":
          Transforms.insertNodes(editor, {
            type: "heading-2",
            children: [{ text: "" }],
          })
          break
        case "heading-3":
          Transforms.insertNodes(editor, {
            type: "heading-3",
            children: [{ text: "" }],
          })
          break
        case "bulleted-list":
          Transforms.insertNodes(editor, {
            type: "bulleted-list",
            children: [
              {
                type: "list-item",
                children: [{ text: "" }],
              },
            ],
          })
          break
        case "numbered-list":
          Transforms.insertNodes(editor, {
            type: "numbered-list",
            children: [
              {
                type: "list-item",
                children: [{ text: "" }],
              },
            ],
          })
          break
        case "code":
          Transforms.insertNodes(editor, {
            type: "code-block",
            language: "javascript",
            children: [{ text: "" }],
          })
          // Add a paragraph after the code block
          Transforms.insertNodes(editor, {
            type: "paragraph",
            children: [{ text: "" }],
          })
          break
        case "image":
          setUploadModalOpen({ type: "image" })
          break
        case "video":
          setUploadModalOpen({ type: "video" })
          break
        case "3d":
          setUploadModalOpen({ type: "3d" })
          break
        case "divider":
          Transforms.insertNodes(editor, {
            type: "divider",
            children: [{ text: "" }],
          })
          break
        case "table":
          Transforms.insertNodes(editor, {
            type: "table",
            children: Array(3)
              .fill(0)
              .map(() => ({
                type: "table-row",
                children: Array(3)
                  .fill(0)
                  .map(() => ({
                    type: "table-cell",
                    children: [{ text: "" }],
                  })),
              })),
          })
          break
        default:
          break
      }
    },
    [editor],
  )

  const handleInsertMedia = useCallback(
    (type: "image" | "video" | "3d", url: string, caption = "", fileName = "") => {
      setUploadModalOpen(null)

      // Add to assets
      addAsset({
        name: fileName || `${type}-${Date.now()}.${type === "3d" ? "glb" : type === "image" ? "png" : "mp4"}`,
        type,
        url,
      })

      switch (type) {
        case "image":
          Transforms.insertNodes(editor, {
            type: "image",
            url,
            caption,
            children: [{ text: "" }],
          })
          break
        case "video":
          Transforms.insertNodes(editor, {
            type: "video",
            url,
            caption,
            children: [{ text: "" }],
          })
          break
        case "3d":
          Transforms.insertNodes(editor, {
            type: "3d",
            url,
            caption,
            children: [{ text: "" }],
          })
          break
        default:
          break
      }

      // Add a paragraph after the media block
      Transforms.insertNodes(editor, {
        type: "paragraph",
        children: [{ text: "" }],
      })
    },
    [editor, addAsset],
  )

  // Don't render the Slate editor until we have a valid value
  if (!isMounted) {
    // Return a simple loading state during SSR and hydration
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-gray-500">Loading editor...</p>
      </div>
    )
  }

  if (!activeNoteId) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-gray-500">Select a note or create a new one</p>
      </div>
    )
  }
  


  return (
    <div className="relative">
      <EditorHeader title={activeNote?.title || "Untitled"} />

      <Slate 
        editor={editor} 
        initialValue={editorValue}
        onChange={value => {
          // Convert to CustomElement array
          const customElements = value as unknown as CustomElement[];
          handleEditorChange(customElements);
        }}
      >
        <Editable
          renderElement={renderElement}
          renderLeaf={renderLeaf}
          placeholder="Start typing..."
          spellCheck={false}
          className="min-h-[300px] p-6 focus:outline-none"
          onKeyDown={handleKeyDown}
        />

        <AnimatePresence>
          {showSlashMenu && (
            <SlashCommandMenu
              position={slashMenuPosition}
              onSelect={handleSlashCommand}
              onClose={() => setShowSlashMenu(false)}
            />
          )}
        </AnimatePresence>
      </Slate>

      <AnimatePresence>
        {uploadModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
            onClick={() => setUploadModalOpen(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-gray-900 text-gray-100 rounded-lg p-6 max-w-md w-full"
              onClick={(e) => e.stopPropagation()}
            >
              {uploadModalOpen.type === "image" && (
                <ImageBlock onInsert={(url, caption, fileName) => handleInsertMedia("image", url, caption, fileName)} />
              )}
              {uploadModalOpen.type === "video" && (
                <VideoBlock onInsert={(url, caption, fileName) => handleInsertMedia("video", url, caption, fileName)} />
              )}
              {uploadModalOpen.type === "3d" && (
                <ThreeDBlock onInsert={(url, caption, fileName) => handleInsertMedia("3d", url, caption, fileName)} />
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
