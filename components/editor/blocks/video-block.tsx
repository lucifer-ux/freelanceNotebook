"use client"

import type React from "react"
import { useState } from "react"
import { Check, Upload } from "lucide-react"
import { motion } from "framer-motion"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

type VideoBlockProps = {
  onInsert: (url: string, caption: string, fileName?: string) => void
}

export const VideoBlock: React.FC<VideoBlockProps> = ({ onInsert }) => {
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
    }, 2000)
  }

  const getEmbedUrl = (url: string) => {
    // Convert YouTube URLs to embed format
    const youtubeRegex = /(?:youtube\.com\/(?:[^/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?/\s]{11})/
    const youtubeMatch = url.match(youtubeRegex)

    if (youtubeMatch && youtubeMatch[1]) {
      return `https://www.youtube.com/embed/${youtubeMatch[1]}`
    }

    // Convert Vimeo URLs to embed format
    const vimeoRegex = /vimeo\.com\/(?:channels\/(?:\w+\/)?|groups\/(?:[^/]*)\/videos\/|)(\d+)(?:|\/\?)/
    const vimeoMatch = url.match(vimeoRegex)

    if (vimeoMatch && vimeoMatch[1]) {
      return `https://player.vimeo.com/video/${vimeoMatch[1]}`
    }

    return url
  }

  const handleUrlInsert = () => {
    const embedUrl = getEmbedUrl(url)
    onInsert(embedUrl, caption, url.split("/").pop() || "video.mp4")
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Add Video</h3>
      <Tabs defaultValue="url" className="w-full">
        <TabsList className="grid w-full grid-cols-2 bg-gray-800">
          <TabsTrigger value="url">URL</TabsTrigger>
          <TabsTrigger value="upload">Upload</TabsTrigger>
        </TabsList>
        <TabsContent value="url" className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label htmlFor="video-url">Video URL</Label>
            <Input
              id="video-url"
              placeholder="https://youtube.com/watch?v=..."
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="bg-gray-800 border-gray-700"
            />
            <p className="text-xs text-gray-500">Supports YouTube, Vimeo, and direct video links</p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="video-caption">Caption (optional)</Label>
            <Input
              id="video-caption"
              placeholder="Video caption"
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              className="bg-gray-800 border-gray-700"
            />
          </div>
          <div className="flex justify-end">
            <Button onClick={handleUrlInsert} disabled={!url}>
              <Check className="mr-2 h-4 w-4" />
              Insert
            </Button>
          </div>
        </TabsContent>
        <TabsContent value="upload" className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label htmlFor="video-file">Upload Video</Label>
            <div className="border-2 border-dashed border-gray-700 rounded-lg p-6 text-center">
              <input id="video-file" type="file" accept="video/*" className="hidden" onChange={handleFileChange} />
              <label htmlFor="video-file" className="flex flex-col items-center justify-center cursor-pointer">
                <Upload className="h-8 w-8 text-gray-400 mb-2" />
                <span className="text-sm font-medium text-gray-300">
                  {file ? file.name : "Click to upload or drag and drop"}
                </span>
                <span className="text-xs text-gray-500 mt-1">MP4, WebM, or OGG (max. 100MB)</span>
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
            <Label htmlFor="upload-video-caption">Caption (optional)</Label>
            <Input
              id="upload-video-caption"
              placeholder="Video caption"
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
