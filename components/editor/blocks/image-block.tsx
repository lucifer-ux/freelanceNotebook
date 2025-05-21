"use client"

import type React from "react"
import { useState } from "react"
import { Check, Upload } from "lucide-react"
import { motion } from "framer-motion"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

type ImageBlockProps = {
  onInsert: (url: string, caption: string, fileName?: string) => void
}

export const ImageBlock: React.FC<ImageBlockProps> = ({ onInsert }) => {
  const [url, setUrl] = useState("")
  const [caption, setCaption] = useState("")
  const [file, setFile] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0])
    }
  }

  const handleUpload = async () => {
    if (!file) return

    setIsUploading(true)
    setUploadProgress(0)

    // Simulate upload progress
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 95) {
          clearInterval(interval)
          return 95
        }
        return prev + 5
      })
    }, 100)

    // Simulate file upload
    setTimeout(() => {
      clearInterval(interval)
      setUploadProgress(100)
      setIsUploading(false)

      // Create a local object URL for the file
      const objectUrl = URL.createObjectURL(file)
      onInsert(objectUrl, caption, file.name)
    }, 1500)
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Add Image</h3>
      <Tabs defaultValue="url" className="w-full">
        <TabsList className="grid w-full grid-cols-2 bg-gray-800">
          <TabsTrigger value="url">URL</TabsTrigger>
          <TabsTrigger value="upload">Upload</TabsTrigger>
        </TabsList>
        <TabsContent value="url" className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label htmlFor="image-url">Image URL</Label>
            <Input
              id="image-url"
              placeholder="https://example.com/image.jpg"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="bg-gray-800 border-gray-700"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="image-caption">Caption (optional)</Label>
            <Input
              id="image-caption"
              placeholder="Image caption"
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              className="bg-gray-800 border-gray-700"
            />
          </div>
          <div className="flex justify-end">
            <Button onClick={() => onInsert(url, caption, url.split("/").pop() || "image.jpg")}>
              <Check className="mr-2 h-4 w-4" />
              Insert
            </Button>
          </div>
        </TabsContent>
        <TabsContent value="upload" className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label htmlFor="image-file">Upload Image</Label>
            <div className="border-2 border-dashed border-gray-700 rounded-lg p-6 text-center">
              <input id="image-file" type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
              <label htmlFor="image-file" className="flex flex-col items-center justify-center cursor-pointer">
                <Upload className="h-8 w-8 text-gray-400 mb-2" />
                <span className="text-sm font-medium text-gray-300">
                  {file ? file.name : "Click to upload or drag and drop"}
                </span>
                <span className="text-xs text-gray-500 mt-1">SVG, PNG, JPG or GIF (max. 10MB)</span>
              </label>
            </div>
            {file && isUploading && (
              <div className="w-full bg-gray-700 rounded-full h-2.5 mt-2">
                <motion.div
                  className="bg-blue-600 h-2.5 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${uploadProgress}%` }}
                  transition={{ duration: 0.1 }}
                />
              </div>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="upload-caption">Caption (optional)</Label>
            <Input
              id="upload-caption"
              placeholder="Image caption"
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              className="bg-gray-800 border-gray-700"
            />
          </div>
          <div className="flex justify-end">
            <Button onClick={handleUpload} disabled={!file || isUploading}>
              {isUploading ? (
                <>
                  <span className="mr-2">Uploading...</span>
                  {uploadProgress}%
                </>
              ) : (
                <>
                  <Upload className="mr-2 h-4 w-4" />
                  Upload & Insert
                </>
              )}
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
