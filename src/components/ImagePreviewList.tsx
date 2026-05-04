import * as React from "react"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"

export type ItemType = "file" | "url"

type ImagePreviewListProps = {
  files?: File[] | FileList
  urls?: string[]
  onRemove: (index: number, type: ItemType) => void
  className?: string
}

export type PreviewItem = {
  src: string
  type: ItemType
}

const ImagePreviewList: React.FC<ImagePreviewListProps> = ({
  files,
  urls = [],
  onRemove,
  className,
}) => {
  const fileArray = React.useMemo(
    () => (files ? Array.from(files) : []),
    [files]
  )

  const [items, setItems] = React.useState<PreviewItem[]>([])

  React.useEffect(() => {
    const filePreviews: PreviewItem[] = fileArray.map((file) => ({
      src: URL.createObjectURL(file),
      type: "file",
    }))

    const urlPreviews: PreviewItem[] = urls.map((url) => ({
      src: url,
      type: "url",
    }))

    const allItems = [...urlPreviews, ...filePreviews]
    setItems(allItems)

    // cleanup only for file previews
    return () => {
      filePreviews.forEach((item) => URL.revokeObjectURL(item.src))
    }
  }, [fileArray, urls])

  if (!items.length) return null

  return (
    <div className={`grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 ${className}`}>
      {items.map((item, index) => (
        <div
          key={index}
          className="relative group rounded-xl overflow-hidden border"
        >
          <img
            src={item.src}
            alt={`preview-${index}`}
            className="w-full h-32 object-cover"
          />

          <Button
            size="icon"
            variant="destructive"
            className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition"
            onClick={() => onRemove(index, item.type)}
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      ))}
    </div>
  )
}

export default ImagePreviewList