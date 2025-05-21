"use client"
import { useSelected, useFocused } from "slate-react"

import { CodeBlockElement } from "./blocks/code-block-element"
import { ImageElement } from "./blocks/image-element"
import { ThreeDElement } from "./blocks/three-d-element"
import { VideoElement } from "./blocks/video-element"

export const Element = ({ attributes, children, element }: any) => {
  const selected = useSelected()
  const focused = useFocused()

  const blockProps = {
    selected,
    focused,
    attributes,
    children,
    element,
  }

  switch (element.type) {
    case "paragraph":
      return (
        <p {...attributes} className="mb-3 leading-relaxed text-gray-300">
          {children}
        </p>
      )
    case "heading-1":
      return (
        <h1 {...attributes} className="text-4xl font-bold mb-4 text-gray-200">
          {children}
        </h1>
      )
    case "heading-2":
      return (
        <h2 {...attributes} className="text-3xl font-bold mb-3 text-gray-200">
          {children}
        </h2>
      )
    case "heading-3":
      return (
        <h3 {...attributes} className="text-2xl font-bold mb-2 text-gray-200">
          {children}
        </h3>
      )
    case "bulleted-list":
      return (
        <ul {...attributes} className="list-disc pl-10 mb-4">
          {children}
        </ul>
      )
    case "numbered-list":
      return (
        <ol {...attributes} className="list-decimal pl-10 mb-4">
          {children}
        </ol>
      )
    case "list-item":
      return <li {...attributes}>{children}</li>
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
        <div {...attributes} contentEditable={false} className="my-4 relative">
          <hr className="border-gray-700" />
          {children}
        </div>
      )
    case "table":
      return (
        <div {...attributes} className="my-4 overflow-x-auto">
          <table className="min-w-full border-collapse border border-gray-700">
            <tbody>{children}</tbody>
          </table>
        </div>
      )
    case "table-row":
      return <tr {...attributes}>{children}</tr>
    case "table-cell":
      return (
        <td {...attributes} className="border border-gray-700 px-4 py-2 text-gray-300">
          {children}
        </td>
      )
    default:
      return <p {...attributes}>{children}</p>
  }
}
