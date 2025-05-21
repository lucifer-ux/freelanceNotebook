"use client"

import { useEffect, useRef, useState } from "react"
import { useSlate } from "slate-react"
import Prism from "prismjs"
import "prismjs/components/prism-javascript"
import "prismjs/components/prism-typescript"
import "prismjs/components/prism-jsx"
import "prismjs/components/prism-tsx"
import "prismjs/components/prism-css"
import "prismjs/components/prism-python"
import "prismjs/components/prism-java"
import "prismjs/components/prism-c"
import "prismjs/components/prism-cpp"
import "prismjs/components/prism-csharp"
import "prismjs/components/prism-go"
import "prismjs/components/prism-rust"
import "prismjs/components/prism-ruby"
import "prismjs/components/prism-php"
import "prismjs/components/prism-swift"
import "prismjs/components/prism-kotlin"
import "prismjs/components/prism-sql"
import "prismjs/components/prism-bash"
import "prismjs/components/prism-json"
import "prismjs/components/prism-yaml"
import "prismjs/components/prism-markdown"
import { Copy } from "lucide-react"
import { motion } from "framer-motion"

import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const LANGUAGES = [
  { value: "javascript", label: "JavaScript" },
  { value: "typescript", label: "TypeScript" },
  { value: "html", label: "HTML" },
  { value: "css", label: "CSS" },
  { value: "python", label: "Python" },
  { value: "java", label: "Java" },
  { value: "c", label: "C" },
  { value: "cpp", label: "C++" },
  { value: "csharp", label: "C#" },
  { value: "go", label: "Go" },
  { value: "rust", label: "Rust" },
  { value: "ruby", label: "Ruby" },
  { value: "php", label: "PHP" },
  { value: "swift", label: "Swift" },
  { value: "kotlin", label: "Kotlin" },
  { value: "sql", label: "SQL" },
  { value: "bash", label: "Bash" },
  { value: "json", label: "JSON" },
  { value: "yaml", label: "YAML" },
  { value: "markdown", label: "Markdown" },
]

export const CodeBlockElement = ({ attributes, children, element, selected, focused }: any) => {
  const editor = useSlate()
  const codeRef = useRef<HTMLPreElement>(null)
  const [language, setLanguage] = useState(element.language || "javascript")
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (codeRef.current) {
      Prism.highlightElement(codeRef.current)
    }
  }, [element.children[0].text, language])

  const handleCopy = () => {
    const code = element.children[0].text
    navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleLanguageChange = (value: string) => {
    setLanguage(value)
    // Update the element's language property
    const path = editor.selection ? editor.selection.anchor.path.slice(0, -1) : []
    editor.setNodes({ language: value }, { at: path })
  }

  return (
    <div
      {...attributes}
      className={`my-4 rounded-lg overflow-hidden ${
        selected && focused ? "ring-2 ring-blue-500" : "ring-1 ring-gray-700"
      }`}
    >
      <div className="bg-gray-800 px-4 py-2 flex items-center justify-between" contentEditable={false}>
        <Select value={language} onValueChange={handleLanguageChange}>
          <SelectTrigger className="w-40 h-8 text-xs bg-white">
            <SelectValue placeholder="Select language" />
          </SelectTrigger>
          <SelectContent>
            {LANGUAGES.map((lang) => (
              <SelectItem key={lang.value} value={lang.value} className="text-xs">
                {lang.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button variant="ghost" size="sm" onClick={handleCopy} className="h-8 px-2">
          {copied ? (
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-xs text-green-600 font-medium"
            >
              Copied!
            </motion.span>
          ) : (
            <Copy className="h-4 w-4" />
          )}
        </Button>
      </div>
      <pre
        ref={codeRef}
        className={`p-4 bg-gray-900 text-gray-100 overflow-x-auto text-sm font-mono language-${language}`}
      >
        <code className={`language-${language}`}>{element.children[0]?.text || ""}</code>
      </pre>
      {children}
    </div>
  )
}
