import React from 'react'

type Props = {
  label: string
  accept?: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  ariaLabel: string
}

export function UploadCard({ label, accept = 'image/*', onChange, ariaLabel }: Props) {
  return (
    <label className="file-input-label homework-upload-card block rounded-2xl border-2 border-dashed border-blue-200 bg-white/80 p-6">
      <span className="block font-semibold text-blue-900 mb-2">{label}</span>
      <input type="file" accept={accept} onChange={onChange} aria-label={ariaLabel} className="mt-2" />
    </label>
  )
}
