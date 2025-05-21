"use client"

import type React from "react"

import { createContext, useContext, useState } from "react"

export type Asset = {
  id: string
  name: string
  type: "image" | "video" | "3d" | "audio" | "file"
  url: string
  uploadedAt: Date
}

type AssetsContextType = {
  assets: Asset[]
  addAsset: (asset: Omit<Asset, "id" | "uploadedAt">) => void
  removeAsset: (id: string) => void
}

const AssetsContext = createContext<AssetsContextType | undefined>(undefined)

export function AssetsProvider({ children }: { children: React.ReactNode }) {
  const [assets, setAssets] = useState<Asset[]>([
    { id: "1", name: "Logo.png", type: "image", url: "/placeholder.svg", uploadedAt: new Date() },
    { id: "2", name: "Presentation.mp4", type: "video", url: "/placeholder.svg", uploadedAt: new Date() },
    { id: "3", name: "Product.glb", type: "3d", url: "/placeholder.svg", uploadedAt: new Date() },
  ])

  const addAsset = (asset: Omit<Asset, "id" | "uploadedAt">) => {
    const newAsset: Asset = {
      ...asset,
      id: `asset-${Date.now()}`,
      uploadedAt: new Date(),
    }
    setAssets((prev) => [...prev, newAsset])
  }

  const removeAsset = (id: string) => {
    setAssets((prev) => prev.filter((asset) => asset.id !== id))
  }

  return (
    <AssetsContext.Provider
      value={{
        assets,
        addAsset,
        removeAsset,
      }}
    >
      {children}
    </AssetsContext.Provider>
  )
}

export function useAssets() {
  const context = useContext(AssetsContext)
  if (context === undefined) {
    throw new Error("useAssets must be used within an AssetsProvider")
  }
  return context
}
