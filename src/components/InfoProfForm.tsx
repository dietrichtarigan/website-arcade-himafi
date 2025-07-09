'use client'

import { useState } from 'react'

interface InfoProfFormData {
  judul: string
  kategori: string
  deskripsi: string
  konten: string
  link_utama: string
  kontak_email: string
  sumber: string
  tags: string[]
  deadline?: string
  poster_url: string
  poster_file?: File
  arsip: boolean
}

interface InfoProfFormProps {
  onSubmit: (data: InfoProfFormData) => void
  onCancel: () => void
  initialData?: Partial<InfoProfFormData>
  isEditing?: boolean
}

export default function InfoProfForm({ onSubmit, onCancel, initialData, isEditing = false }: InfoProfFormProps) {
  const [formData, setFormData] = useState<InfoProfFormData>({
    judul: initialData?.judul || '',
    kategori: initialData?.kategori || 'Magang',
    deskripsi: initialData?.deskripsi || '',
    konten: initialData?.konten || '',
    link_utama: initialData?.link_utama || '',
    kontak_email: initialData?.kontak_email || '',
    sumber: initialData?.sumber || '',
    tags: initialData?.tags || [],
    deadline: initialData?.deadline || '',
    poster_url: initialData?.poster_url || '',
    arsip: initialData?.arsip || false
  })

  const [tagInput, setTagInput] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [posterPreview, setPosterPreview] = useState<string | null>(initialData?.poster_url || null)

  const kategoriOptions = ['Magang', 'Beasiswa', 'Lowongan', 'Sertifikasi', 'Kompetisi']

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }))
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Hanya file gambar yang diperbolehkan!')
        return
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('Ukuran file maksimal 5MB!')
        return
      }

      // Create preview
      const reader = new FileReader()
      reader.onload = (event) => {
        setPosterPreview(event.target?.result as string)
      }
      reader.readAsDataURL(file)

      // Store file for upload
      setFormData(prev => ({
        ...prev,
        poster_file: file,
        poster_url: '' // Clear URL if file is selected
      }))
    }
  }

  const removePoster = () => {
    setPosterPreview(null)
    setFormData(prev => ({
      ...prev,
      poster_file: undefined,
      poster_url: ''
    }))
    // Reset file input
    const fileInput = document.getElementById('poster-upload') as HTMLInputElement
    if (fileInput) fileInput.value = ''
  }

  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()]
      }))
      setTagInput('')
    }
  }

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    try {
      let finalPosterUrl = formData.poster_url

      // Upload file if selected
      if (formData.poster_file) {
        try {
          const uploadFormData = new FormData()
          uploadFormData.append('file', formData.poster_file)
          
          const uploadResponse = await fetch('/api/upload', {
            method: 'POST',
            body: uploadFormData
          })

          if (uploadResponse.ok) {
            const uploadResult = await uploadResponse.json()
            finalPosterUrl = uploadResult.url || uploadResult.path
          } else {
            console.warn('File upload failed, continuing without poster')
          }
        } catch (uploadError) {
          console.warn('File upload error:', uploadError)
          // Continue without poster rather than failing entirely
        }
      }

      // Prepare submission data
      const submissionData = {
        ...formData,
        poster_url: finalPosterUrl,
        // Remove file object from submission
        poster_file: undefined
      }

      console.log('Submitting data:', submissionData)
      await onSubmit(submissionData)
    } catch (error) {
      console.error('Error submitting form:', error)
      alert('Terjadi kesalahan saat menyimpan data: ' + (error instanceof Error ? error.message : 'Unknown error'))
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-60 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-6 border w-11/12 max-w-4xl shadow-xl rounded-lg bg-white">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-gray-900">
            {isEditing ? '✏️ Edit Info Karier' : '➕ Tambah Info Karier Baru'}
          </h3>
          <button
            onClick={onCancel}
            className="text-gray-500 hover:text-gray-700 text-2xl font-bold w-8 h-8 flex items-center justify-center"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Judul */}
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-800 mb-2">
                Judul <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="judul"
                value={formData.judul}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-500"
                placeholder="Masukkan judul info karier..."
              />
            </div>

            {/* Kategori */}
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-2">
                Kategori <span className="text-red-500">*</span>
              </label>
              <select
                name="kategori"
                value={formData.kategori}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white"
              >
                {kategoriOptions.map(option => (
                  <option key={option} value={option} className="text-gray-900">{option}</option>
                ))}
              </select>
            </div>

            {/* Sumber */}
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-2">
                Sumber
              </label>
              <input
                type="text"
                name="sumber"
                value={formData.sumber}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-500"
                placeholder="Contoh: BRIN, Telkom Indonesia..."
              />
            </div>

            {/* Link Utama */}
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-2">
                Link Utama
              </label>
              <input
                type="url"
                name="link_utama"
                value={formData.link_utama}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-500"
                placeholder="https://..."
              />
            </div>

            {/* Email Kontak */}
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-2">
                Email Kontak
              </label>
              <input
                type="email"
                name="kontak_email"
                value={formData.kontak_email}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-500"
                placeholder="email@example.com"
              />
            </div>

            {/* Deadline */}
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-2">
                Deadline
              </label>
              <input
                type="datetime-local"
                name="deadline"
                value={formData.deadline}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
              />
            </div>
          </div>

          {/* Poster Upload Section */}
          <div className="bg-gray-50 p-6 rounded-lg">
            <label className="block text-sm font-semibold text-gray-800 mb-3">
              🖼️ Poster/Gambar
            </label>
            
            {/* URL Input */}
            <div className="mb-4">
              <input
                type="url"
                name="poster_url"
                value={formData.poster_url}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-500"
                placeholder="https://... atau upload file di bawah"
              />
            </div>
            
            {/* File Upload */}
            <div className="mb-4">
              <div className="flex items-center justify-center w-full">
                <label htmlFor="poster-upload" className="flex flex-col items-center justify-center w-full h-36 border-2 border-gray-400 border-dashed rounded-lg cursor-pointer bg-white hover:bg-gray-100 transition-colors">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <svg className="w-10 h-10 mb-3 text-gray-600" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                      <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/>
                    </svg>
                    <p className="mb-2 text-sm font-medium text-gray-700"><span className="font-semibold">Klik untuk upload</span> atau drag & drop</p>
                    <p className="text-xs text-gray-600">PNG, JPG, GIF (MAX. 5MB)</p>
                  </div>
                  <input
                    id="poster-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </label>
              </div>
            </div>
            
            {/* Preview */}
            {posterPreview && (
              <div className="relative">
                <img
                  src={posterPreview}
                  alt="Poster preview"
                  className="w-full max-w-md mx-auto rounded-lg shadow-md"
                />
                <button
                  type="button"
                  onClick={removePoster}
                  className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-red-600 transition font-bold"
                >
                  ×
                </button>
              </div>
            )}
          </div>

          {/* Deskripsi */}
          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-2">
              Deskripsi Singkat <span className="text-red-500">*</span>
            </label>
            <textarea
              name="deskripsi"
              value={formData.deskripsi}
              onChange={handleInputChange}
              required
              rows={3}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-500"
              placeholder="Deskripsi singkat untuk preview..."
            />
          </div>

          {/* Konten Detail */}
          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-2">
              Konten Detail
            </label>
            <textarea
              name="konten"
              value={formData.konten}
              onChange={handleInputChange}
              rows={8}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-500"
              placeholder="Konten lengkap artikel (mendukung Markdown)..."
            />
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-2">
              🏷️ Tags
            </label>
            <div className="flex gap-2 mb-3">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-500"
                placeholder="Ketik tag dan tekan Enter..."
              />
              <button
                type="button"
                onClick={handleAddTag}
                className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 font-medium"
              >
                Tambah
              </button>
            </div>
            {formData.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {formData.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 border border-blue-200"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      className="ml-2 text-blue-600 hover:text-blue-800 font-bold"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Arsip */}
          <div className="flex items-center p-4 bg-yellow-50 rounded-lg">
            <input
              type="checkbox"
              name="arsip"
              checked={formData.arsip}
              onChange={handleInputChange}
              className="mr-3 w-4 h-4"
            />
            <label className="text-sm font-medium text-gray-800">
              Arsipkan post ini (tidak akan ditampilkan di halaman utama)
            </label>
          </div>

          {/* Submit Buttons */}
          <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onCancel}
              className="px-6 py-3 border-2 border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 font-medium transition"
            >
              {isSubmitting ? '⏳ Menyimpan...' : (isEditing ? '💾 Update' : '💾 Simpan')}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
