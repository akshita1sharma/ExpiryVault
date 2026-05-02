import { useState } from 'react'
import { useTheme } from '../context/ThemeContext'
import { supabase } from '../supabase'

function AddItemForm({ onItemAdded }) {
  const { isDark } = useTheme()
  const [form, setForm] = useState({
    name: '',
    category: '',
    expiry_date: '',
    notes: ''
  })
  const [loading, setLoading] = useState(false)

  const categories = ['Document', 'Medicine', 'Warranty', 'Subscription', 'Food', 'Other']

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    const { error } = await supabase.from('items').insert([form])
    if (error) {
      alert('Error: ' + error.message)
    } else {
      setForm({ name: '', category: '', expiry_date: '', notes: '' })
      onItemAdded()
    }
    setLoading(false)
  }

  return (
    <div className={`p-6 rounded-2xl border mb-8 ${isDark ? 'bg-[#0f172a] border-blue-900' : 'bg-gray-50 border-gray-200'}`}>
      <h2 className={`text-xl font-bold mb-4 ${isDark ? 'text-white' : 'text-[#0a0f1e]'}`}>
        ➕ Add New Item
      </h2>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        {/* Name */}
        <input
          type="text"
          name="name"
          placeholder="Item name (e.g. Passport)"
          value={form.name}
          onChange={handleChange}
          required
          className={`p-3 rounded-xl border outline-none ${isDark ? 'bg-[#0a0f1e] border-blue-900 text-white placeholder-white/30' : 'bg-white border-gray-300 text-black'}`}
        />

        {/* Category */}
        <select
          name="category"
          value={form.category}
          onChange={handleChange}
          required
          className={`p-3 rounded-xl border outline-none ${isDark ? 'bg-[#0a0f1e] border-blue-900 text-white' : 'bg-white border-gray-300 text-black'}`}>
          <option value="">Select category</option>
          {categories.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>

        {/* Expiry Date */}
        <input
          type="date"
          name="expiry_date"
          value={form.expiry_date}
          onChange={handleChange}
          required
          className={`p-3 rounded-xl border outline-none ${isDark ? 'bg-[#0a0f1e] border-blue-900 text-white' : 'bg-white border-gray-300 text-black'}`}
        />

        {/* Notes */}
        <input
          type="text"
          name="notes"
          placeholder="Notes (optional)"
          value={form.notes}
          onChange={handleChange}
          className={`p-3 rounded-xl border outline-none ${isDark ? 'bg-[#0a0f1e] border-blue-900 text-white placeholder-white/30' : 'bg-white border-gray-300 text-black'}`}
        />

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="md:col-span-2 p-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold transition-all">
          {loading ? 'Adding...' : 'Add Item 🗄️'}
        </button>

      </form>
    </div>
  )
}

export default AddItemForm