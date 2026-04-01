type Props = {
  src: string | null
  alt: string
}

export function HomeworkPreview({ src, alt }: Props) {
  if (!src) return null
  return (
    <div className="homework-preview card p-2 mt-4">
      <img src={src} alt={alt} className="w-full max-h-64 object-contain rounded-xl" />
    </div>
  )
}
