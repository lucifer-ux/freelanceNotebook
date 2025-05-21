"use client"

import { Share } from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

type Collaborator = {
  id: string
  name: string
  initials: string
  color: string
}

const SAMPLE_COLLABORATORS: Collaborator[] = [
  { id: "1", name: "Alex Johnson", initials: "AJ", color: "#7c3aed" },
  { id: "2", name: "Sam Taylor", initials: "ST", color: "#ef4444" },
  { id: "3", name: "Jamie Smith", initials: "JS", color: "#10b981" },
]

export function CollaborationBar() {
  return (
    <div className="flex items-center justify-between px-4 py-2 border-b border-gray-800">
      <div className="flex items-center space-x-2">
        <div className="flex -space-x-2">
          <TooltipProvider>
            {SAMPLE_COLLABORATORS.map((collaborator) => (
              <Tooltip key={collaborator.id}>
                <TooltipTrigger asChild>
                  <Avatar className="h-8 w-8 border-2 border-[#191919]" style={{ backgroundColor: collaborator.color }}>
                    <AvatarFallback className="text-xs font-medium text-white">{collaborator.initials}</AvatarFallback>
                  </Avatar>
                </TooltipTrigger>
                <TooltipContent side="bottom">
                  <p>{collaborator.name}</p>
                </TooltipContent>
              </Tooltip>
            ))}
          </TooltipProvider>
        </div>
        <span className="text-sm text-gray-400">{SAMPLE_COLLABORATORS.length} collaborators</span>
      </div>

      <Button variant="outline" size="sm" className="text-gray-300 border-gray-700 hover:bg-gray-800">
        <Share className="h-4 w-4 mr-2" />
        Share
      </Button>
    </div>
  )
}
