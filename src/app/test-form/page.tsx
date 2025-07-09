'use client'

import { useState } from 'react'

export default function TestFormPage() {
  const [formData, setFormData] = useState({
    judul: '',
    kategori: 'Magang',
    deskripsi: '',
    konten: '',
    sumber: '',
    poster_url: ''
  })
  const [result, setResult] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      const response = await fetch('/api/content/infoprof', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()
      setResult(JSON.stringify(data, null, 2))
    } catch (error) {
      setResult(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Test Form InfoProf</h1>
      
      <form onSubmit={handleSubmit} className="space-y-4 mb-8">
        <div>
          <label className="block mb-2">Judul:</label>
          <input
            type="text"
            name="judul"
            value={formData.judul}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        
        <div>
          <label className="block mb-2">Kategori:</label>
          <select
            name="kategori"
            value={formData.kategori}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          >
            <option value="Magang">Magang</option>
            <option value="Beasiswa">Beasiswa</option>
            <option value="Lowongan">Lowongan</option>
            <option value="Kompetisi">Kompetisi</option>
          </select>
        </div>
        
        <div>
          <label className="block mb-2">Deskripsi:</label>
          <textarea
            name="deskripsi"
            value={formData.deskripsi}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            rows={3}
            required
          />
        </div>
        
        <div>
          <label className="block mb-2">Konten:</label>
          <textarea
            name="konten"
            value={formData.konten}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            rows={5}
          />
        </div>
        
        <div>
          <label className="block mb-2">Sumber:</label>
          <input
            type="text"
            name="sumber"
            value={formData.sumber}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        
        <div>
          <label className="block mb-2">Poster URL (optional):</label>
          <input
            type="url"
            name="poster_url"
            value={formData.poster_url}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            placeholder="https://example.com/image.jpg"
          />
        </div>
        
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50"
        >
          {loading ? 'Submitting...' : 'Submit'}
        </button>
      </form>
      
      {result && (
        <div>
          <h2 className="text-xl font-bold mb-2">Result:</h2>
          <pre className="bg-gray-100 p-4 rounded overflow-auto text-sm">
            {result}
          </pre>
        </div>
      )}
    </div>
  )
}
