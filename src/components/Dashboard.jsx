import { useTheme } from '../context/ThemeContext'
import AddItemForm from './AddItemForm'
import { useState, useEffect } from 'react'
import { supabase } from '../supabase'

function Dashboard() {
  const { isDark } = useTheme()
  const [items, setItems] = useState([])
  const [editingItem, setEditingItem] = useState(null)

  const fetchItems = async () => {
    const { data, error } = await supabase
      .from('items')
      .select('*')
      .order('expiry_date', { ascending: true })
    if (!error) setItems(data)
  }

  useEffect(() => {
    fetchItems()
  }, [])

  const getDaysLeft = (date) => {
    const today = new Date()
    const expiry = new Date(date)
    const diff = Math.ceil((expiry - today) / (1000 * 60 * 60 * 24))
    return diff
  }

  const getUrgencyColor = (days) => {
    if (days <= 0) return 'border-red-500 bg-red-500/10'
    if (days <= 30) return 'border-yellow-400 bg-yellow-400/10'
    return 'border-green-400 bg-green-400/10'
  }

  const getUrgencyBadge = (days) => {
    if (days <= 0) return { label: 'Expired', color: 'bg-red-500 text-white' }
    if (days <= 30) return { label: `${days}d left`, color: 'bg-yellow-400 text-black' }
    return { label: `${days}d left`, color: 'bg-green-400 text-black' }
  }

  const getPriorityStyle = (priority) => {
    if (priority === 'high') return { color: 'bg-red-500/20 text-red-400 border border-red-500/40' }
    if (priority === 'medium') return { color: 'bg-yellow-400/20 text-yellow-400 border border-yellow-400/40' }
    return { color: 'bg-green-400/20 text-green-400 border border-green-400/40' }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this item?')) return
    await supabase.from('items').delete().eq('id', id)
    fetchItems()
  }

  const handlePriorityChange = async (id, priority) => {
    await supabase.from('items').update({ priority }).eq('id', id)
    fetchItems()
  }

  const handleEditSave = async () => {
    const { error } = await supabase
      .from('items')
      .update({
        name: editingItem.name,
        expiry_date: editingItem.expiry_date,
        notes: editingItem.notes,
        category: editingItem.category
      })
      .eq('id', editingItem.id)
    if (error) alert(error.message)
    else {
      setEditingItem(null)
      fetchItems()
    }
  }

  return (
    <div className={`px-6 py-8 min-h-screen ${isDark ? 'bg-[#0a0f1e]' : 'bg-[#fefae0]'}`}>

      <h1 className={`text-3xl font-bold mb-2 ${isDark ? 'text-white' : 'text-[#0a0f1e]'}`}>
        Dashboard
      </h1>
      <p className={`text-sm mb-8 ${isDark ? 'text-blue-400' : 'text-blue-600'}`}>
        Track everything before it expires 🗄️
      </p>

      <AddItemForm onItemAdded={fetchItems} />

      {/* Edit Modal */}
      {editingItem && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className={`p-6 rounded-2xl border w-full max-w-md ${isDark ? 'bg-[#0f172a] border-blue-900' : 'bg-white border-gray-200'}`}>
            <h2 className={`text-xl font-bold mb-4 ${isDark ? 'text-white' : 'text-[#0a0f1e]'}`}>✏️ Edit Item</h2>
            <div className="flex flex-col gap-3">
              <input
                value={editingItem.name}
                onChange={e => setEditingItem({ ...editingItem, name: e.target.value })}
                placeholder="Name"
                className={`p-3 rounded-xl border outline-none ${isDark ? 'bg-[#0a0f1e] border-blue-900 text-white' : 'bg-gray-50 border-gray-300 text-black'}`}
              />
              <input
                type="date"
                value={editingItem.expiry_date}
                onChange={e => setEditingItem({ ...editingItem, expiry_date: e.target.value })}
                className={`p-3 rounded-xl border outline-none ${isDark ? 'bg-[#0a0f1e] border-blue-900 text-white' : 'bg-gray-50 border-gray-300 text-black'}`}
              />
              <input
                value={editingItem.notes || ''}
                onChange={e => setEditingItem({ ...editingItem, notes: e.target.value })}
                placeholder="Notes"
                className={`p-3 rounded-xl border outline-none ${isDark ? 'bg-[#0a0f1e] border-blue-900 text-white' : 'bg-gray-50 border-gray-300 text-black'}`}
              />
              <div className="flex gap-2 mt-2">
                <button
                  onClick={handleEditSave}
                  className="flex-1 p-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold">
                  Save
                </button>
                <button
                  onClick={() => setEditingItem(null)}
                  className="flex-1 p-3 rounded-xl bg-gray-500/20 text-gray-400 font-bold">
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Items Grid */}
      {items.length === 0 ? (
        <div className={`flex flex-col items-center justify-center mt-20 gap-4 ${isDark ? 'text-white/40' : 'text-gray-400'}`}>
          <span className="text-6xl">📭</span>
          <p className="text-lg">No items yet — add your first one!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map(item => {
            const days = getDaysLeft(item.expiry_date)
            const badge = getUrgencyBadge(days)
            return (
              <div
                key={item.id}
                className={`p-5 rounded-2xl border-2 cursor-pointer
                  transition-all duration-300 ease-in-out
                  hover:-translate-y-2 hover:shadow-2xl hover:scale-[1.02]
                  ${getUrgencyColor(days)}
                  ${isDark
                    ? 'bg-[#0f172a] hover:shadow-blue-900/40'
                    : 'bg-white hover:shadow-blue-200/60'
                  }`}>

                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className={`font-bold text-lg ${isDark ? 'text-white' : 'text-[#0a0f1e]'}`}>
                      {item.name}
                    </h3>
                    <span className={`text-xs px-2 py-1 rounded-full ${isDark ? 'bg-blue-900 text-blue-300' : 'bg-blue-100 text-blue-700'}`}>
                      {item.category}
                    </span>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full font-bold ${badge.color}`}>
                    {badge.label}
                  </span>
                </div>

                <p className={`text-sm mb-2 ${isDark ? 'text-white/50' : 'text-gray-500'}`}>
                  📅 Expires: {new Date(item.expiry_date).toLocaleDateString()}
                </p>

                {item.notes && (
                  <p className={`text-sm mb-3 ${isDark ? 'text-white/40' : 'text-gray-400'}`}>
                    📝 {item.notes}
                  </p>
                )}

                {/* Priority */}
                <div className="flex gap-2 mb-3">
                  {['high', 'medium', 'low'].map(p => (
                    <button
                      key={p}
                      onClick={() => handlePriorityChange(item.id, p)}
                      className={`text-xs px-2 py-1 rounded-full font-bold transition-all duration-200 hover:scale-110 ${
                        (item.priority || 'low') === p
                          ? getPriorityStyle(p).color
                          : isDark ? 'bg-white/5 text-white/30' : 'bg-gray-100 text-gray-400'
                      }`}>
                      {p === 'high' ? '🔴' : p === 'medium' ? '🟡' : '🟢'} {p}
                    </button>
                  ))}
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => setEditingItem(item)}
                    className="flex-1 p-2 rounded-xl bg-blue-500/20 text-blue-400 hover:bg-blue-500/40 hover:scale-105 transition-all duration-200 text-sm font-bold">
                    ✏️ Edit
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="flex-1 p-2 rounded-xl bg-red-500/20 text-red-400 hover:bg-red-500/40 hover:scale-105 transition-all duration-200 text-sm font-bold">
                    🗑️ Delete
                  </button>
                </div>

              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default Dashboard