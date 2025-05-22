"use client"

import { motion, AnimatePresence } from 'framer-motion';
import { FileText, Code, Headphones, Video, Image as ImageIcon, Box as Box3d } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

type SlashCommandMenuProps = {
  position: { top: number; left: number }
  onSelect: (command: string) => void
  onClose: () => void
  searchTerm?: string
}

type SlashCommandOption = {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
};

// Category sections
const CATEGORIES = {
  SUGGESTED: 'Suggested',
  BASIC: 'Basic blocks',
  MEDIA: 'Media',
}

const COMMAND_OPTIONS = [
  {
    category: 'Suggested',
    items: [
      {
        id: 'ai_meeting',
        name: 'AI Meeting Notes',
        icon: () => (
          <div className="flex items-center">
            <FileText className="w-4 h-4 mr-2" />
            <span>AI Meeting Notes</span>
            <span className="ml-2 text-xs text-blue-400">Beta</span>
          </div>
        ),
      },
      {
        id: 'code',
        name: 'Code',
        icon: () => (
          <div className="flex items-center">
            <Code className="w-4 h-4 mr-2" />
            <span>Code</span>
          </div>
        ),
      },
      {
        id: 'audio',
        name: 'Audio',
        icon: () => (
          <div className="flex items-center">
            <Headphones className="w-4 h-4 mr-2" />
            <span>Audio</span>
          </div>
        ),
      },
      {
        id: 'video',
        name: 'Video',
        icon: () => (
          <div className="flex items-center">
            <Video className="w-4 h-4 mr-2" />
            <span>Video</span>
          </div>
        ),
      },
      {
        id: 'image',
        name: 'Image',
        icon: () => (
          <div className="flex items-center">
            <ImageIcon className="w-4 h-4 mr-2" />
            <span>Image</span>
          </div>
        ),
      },
      {
        id: '3d',
        name: '3D Model',
        icon: () => (
          <div className="flex items-center">
            <Box3d className="w-4 h-4 mr-2" />
            <span>3D Model</span>
          </div>
        ),
      },
    ],
  },
  {
    category: 'Basic blocks',
    items: [
      {
        id: 'text',
        name: 'Type',
        icon: () => (
          <div className="flex items-center">
            <span className="text-gray-400 mr-2">T</span>
            <span>Type</span>
            <span className="ml-auto text-gray-500">on the page</span>
          </div>
        ),
      },
    ],
  },
];

type CommandItem = {
  id: string;
  name: string;
  icon: () => React.ReactNode;
};

type CommandGroup = {
  category: string;
  items: CommandItem[];
};

export const SlashCommandMenu = ({
  position,
  onSelect,
  onClose,
  searchTerm,
}: SlashCommandMenuProps) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [selectedGroupIndex, setSelectedGroupIndex] = useState(0);
  const [selectedItemIndex, setSelectedItemIndex] = useState(0);
  const menuRef = useRef<HTMLDivElement>(null);
  
  // Filter command options based on search term
  const filteredGroups = COMMAND_OPTIONS.map(group => ({
    ...group,
    items: group.items.filter(item => 
      (item.name.toLowerCase().includes((searchTerm || '').toLowerCase()))
    )
  })).filter(group => group.items.length > 0);
  
  // Flatten all items for easier selection
  const allItems = filteredGroups.flatMap(group => group.items);

  // Handle keyboard navigation with proper event capture
  useEffect(() => {
    const menuElement = menuRef.current;
    
    const handleKeyDown = (e: KeyboardEvent) => {
      // Only handle if the menu is open
      if (!menuElement) return;
      
      // Always handle Escape key
      if (e.key === 'Escape') {
        e.preventDefault();
        e.stopPropagation();
        onClose();
        return;
      }

      // Handle arrow keys and Enter
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp' || e.key === 'Enter') {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();

        if (e.key === 'Enter' && allItems[selectedIndex]) {
          onSelect(allItems[selectedIndex].id);
          return;
        }

        // Calculate new index based on arrow key
        let newIndex = selectedIndex;
        if (e.key === 'ArrowDown') {
          newIndex = (selectedIndex + 1) % allItems.length;
        } else if (e.key === 'ArrowUp') {
          newIndex = (selectedIndex - 1 + allItems.length) % allItems.length;
        }

        // Update selected index
        setSelectedIndex(newIndex);
        
        // Scroll to the selected item
        const selectedElement = menuElement.querySelector(`[data-index="${newIndex}"]`);
        if (selectedElement) {
          selectedElement.scrollIntoView({
            behavior: 'smooth',
            block: 'nearest'
          });
        }
      }
    };

    // Use capture phase to ensure we get the event first
    document.addEventListener('keydown', handleKeyDown, { capture: true });
    
    // Focus the menu when it opens
    if (menuElement) {
      menuElement.focus();
    }
    
    return () => {
      document.removeEventListener('keydown', handleKeyDown, { capture: true });
    };
  }, [selectedIndex, allItems.length, onSelect, onClose]);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);

  return (
    <motion.div
      ref={menuRef}
      initial={{ opacity: 0, y: 0, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 0, scale: 0.98 }}
      transition={{
        duration: 0.08,
        ease: 'easeOut',
        opacity: { duration: 0.08 },
        scale: { duration: 0.08 }
      }}
      style={{
        top: position.top + 8, // Position directly under the cursor
        left: position.left - 8,
        width: '320px',
        transformOrigin: 'top left',
        willChange: 'transform, opacity',
        maxHeight: '400px',
        zIndex: 50,
        borderRadius: '6px',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.35)',
        border: '1px solid rgba(55, 65, 81, 0.3)',
        backgroundColor: '#121212',
        overflow: 'hidden'
      }}
      className="absolute overflow-hidden"
      tabIndex={-1}
    >
      {/* Menu header with category name */}
      <div className="py-1 px-2 flex items-center justify-between" style={{ backgroundColor: '#1a1a1a' }}>
        <div className="text-sm font-medium text-gray-300">{filteredGroups[0]?.category || 'Suggested'}</div>
        <div className="text-xs text-gray-500">esc</div>
      </div>
      
      {/* Menu items */}
      <div
        className="overflow-y-auto outline-none custom-scrollbar"
        style={{
          maxHeight: 'calc(100% - 32px)', // Account for header
          scrollBehavior: 'smooth',
          backgroundColor: '#1a1a1a'
        }}
      >
        {filteredGroups.map((group, groupIndex) => (
          <div key={group.category} className="mb-1">
            {/* Show category header for non-first groups */}
            {groupIndex > 0 && (
              <div className="px-2 pt-2 pb-1 text-xs font-medium text-gray-500 border-t border-gray-800">
                {group.category}
              </div>
            )}
            
            {/* Group items */}
            {group.items.map((item, itemIndex) => {
              // Calculate the global index for this item
              const globalIndex = filteredGroups
                .slice(0, groupIndex)
                .reduce((sum, g) => sum + g.items.length, 0) + itemIndex;
                
              const isSelected = globalIndex === selectedIndex;
              
              return (
                <motion.div
                  key={item.id}
                  data-index={globalIndex}
                  initial={{ backgroundColor: 'transparent' }}
                  animate={{
                    backgroundColor: isSelected ? 'rgba(55, 65, 81, 0.4)' : 'transparent'
                  }}
                  transition={{ duration: 0.08 }}
                  className={`px-2 py-2 cursor-pointer transition-colors`}
                  onClick={() => onSelect(item.id)}
                  onMouseEnter={() => setSelectedIndex(globalIndex)}
                  style={{ 
                    backgroundColor: isSelected ? 'rgba(55, 65, 81, 0.4)' : 'transparent',
                    marginBottom: '1px',
                  }}
                >
                  {item.icon()}
                </motion.div>
              );
            })}
          </div>
        ))}
        
        {allItems.length === 0 && (
          <div className="px-4 py-3 text-sm text-gray-500 bg-transparent">
            No results for "{searchTerm}"
          </div>
        )}
      </div>
      
      {/* Search input at the bottom for filtering */}
      <div 
        className="py-2 px-2.5 border-t border-gray-800 text-xs text-gray-400"
        style={{ backgroundColor: '#1a1a1a' }}
      >
        <div className="flex items-center">
          <span className="text-xs">Type <span className="text-gray-200 font-mono">/</span> to filter...</span>
        </div>
      </div>
    </motion.div>
  )
}
