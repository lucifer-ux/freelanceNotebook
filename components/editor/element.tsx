"use client"
import { useSelected, useFocused } from "slate-react"
import { BlockWrapper } from "./block-wrapper"
import { CodeBlockElement } from "./blocks/code-block-element"
import { ImageElement } from "./blocks/image-element"
import { ThreeDElement } from "./blocks/three-d-element"
import { VideoElement } from "./blocks/video-element"

interface BlockElementProps {
  element: any
  attributes: any
  children: React.ReactNode
  className?: string
}

const BlockElement = ({ element, attributes, children, className = "" }: BlockElementProps) => (
  <div {...attributes} className={className}>
    {children}
  </div>
)

// Define the Element component props
type ElementProps = {
  attributes: any
  children: React.ReactNode
  element: any
}

// List of block types that should be wrapped with BlockWrapper
const WRAPPED_BLOCKS = [
  'code-block',
  'image',
  'video',
  '3d',
  'audio'
]

const ElementContent = ({ element, children, attributes }: ElementProps) => {
  const selected = useSelected()
  const focused = useFocused()

  const blockProps = {
    selected,
    focused,
    attributes,
    children,
    element,
  }

  // Render the appropriate block type
  const renderContent = () => {
    switch (element.type) {
      case "paragraph":
        return (
          <div className="mb-3 leading-relaxed text-gray-300">
            {children}
          </div>
        )
      case "heading-1":
        return (
          <h1 className="text-4xl font-bold mb-4 text-gray-200">
            {children}
          </h1>
        )
      case "heading-2":
        return (
          <h2 className="text-3xl font-bold mb-3 text-gray-200">
            {children}
          </h2>
        )
      case "heading-3":
        return (
          <h3 className="text-2xl font-bold mb-2 text-gray-200">
            {children}
          </h3>
        )
      case "bulleted-list":
        return (
          <ul className="list-disc pl-10 mb-4">
            {children}
          </ul>
        )
      case "numbered-list":
        return (
          <ol className="list-decimal pl-10 mb-4">
            {children}
          </ol>
        )
      case "list-item":
        return <li>{children}</li>
      case "code-block":
        return <CodeBlockElement {...blockProps} />
      case "image":
        return <ImageElement {...blockProps} />
      case "video":
        return <VideoElement {...blockProps} />
      case "3d":
        return <ThreeDElement {...blockProps} />
      case "divider":
        return (
          <div contentEditable={false} className="my-4 relative">
            <hr className="border-gray-700" />
            {children}
          </div>
        )
      case "table":
        return (
          <div className="my-4 overflow-x-auto">
            <table className="min-w-full border-collapse border border-gray-700">
              <tbody>{children}</tbody>
            </table>
          </div>
        )
      case "table-row":
        return <tr>{children}</tr>
      case "table-cell":
        return (
          <td className="border border-gray-700 px-4 py-2 text-gray-300">
            {children}
          </td>
        )
      default:
        return <div {...attributes}>{children}</div>
    }
  }

  // Don't wrap list items or table cells/rows with BlockWrapper
  if (element.type === 'list-item' || element.type === 'table-cell' || element.type === 'table-row') {
    return (
      <div {...attributes}>
        {renderContent()}
      </div>
    )
  }

  // For blocks that should be wrapped with BlockWrapper
  if (WRAPPED_BLOCKS.includes(element.type)) {
    return (
      <BlockWrapper element={element} attributes={attributes}>
        {renderContent()}
      </BlockWrapper>
    )
  }

  // Default rendering for other elements
  return (
    <div {...attributes}>
      {renderContent()}
    </div>
  )
}

export const Element = (props: ElementProps) => {
  return <ElementContent {...props} />
}
