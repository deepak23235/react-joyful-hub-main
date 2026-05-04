import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { supabase } from "./supabase";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}


type UploadOptions = {
  bucket?: string
  folder?: string
  upsert?: boolean
}

export async function uploadFilesAndGetUrls(
  files: FileList|[],
  options: UploadOptions = {}
): Promise<string[]> {
  const {
    bucket = 'publick-bucket',
    folder = 'uploads',
    upsert = false,
  } = options

  const uploadPromises: Promise<string | null>[] = Array.from(files).map(async (file) => {
    try {
      const uniqueId = `${Date.now()}-${Math.random()
        .toString(36)
        .slice(2)}`

      const filePath = `${folder}/${uniqueId}-${file.name}`

      const { error } = await supabase.storage
        .from(bucket)
        .upload(filePath, file, { upsert })

      if (error) {
        console.error(`Upload failed for ${file.name}:`, error.message)
        return null
      }

      const { data } = supabase.storage
        .from(bucket)
        .getPublicUrl(filePath)

      return data.publicUrl
    } catch (err) {
      console.error(`Unexpected error for ${file.name}:`, err)
      return null
    }
  })

  const results = await Promise.all(uploadPromises)

  return results.filter((url): url is string => Boolean(url))
}