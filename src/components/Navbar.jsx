import { useState } from 'react'
import { supabase } from '../supabase'
import { useTheme } from '../context/ThemeContext'

function Navbar({ user, search, setSearch, selectedCategory, setSelectedCategory }) {
  const { isDark, toggleTheme } = useTheme()
  const [editingName, setEditingName] = useState(false)
  const [newName, setNewName] = useState(user?.user_metadata?.full_name || '')

  const categories = ['All', 'Document', 'Medicine', 'Warranty', 'Subscription', 'Food', 'Other']

  const handleLogout = async () => {
    await supabase.auth.signOut()
    window.location.href = '/login'
  }

  const handleNameUpdate = async () => {
    const { error } = await supabase.auth.updateUser({
      data: { full_name: newName }
    })
    if (error) alert(error.message)
    else setEditingName(false)
  }

  return (
    <nav className={`w-full px-4 py-3 border-b sticky top-0 z-50 ${
      isDark ? 'bg-[#0a0f1e] border-blue-900' : 'bg-white border-gray-200'
    }`}>

      {/* Top Row */}
      <div className="flex items-center justify-between w-full mb-3">

        {/* Left - User */}
        <div className="flex items-center gap-2">
          {editingName ? (
            <div className="flex items-center gap-2">
              <input
                value={newName}
                onChange={e => setNewName(e.target.value)}
                className={`p-1 px-3 rounded-lg border outline-none text-sm ${
                  isDark ? 'bg-[#0f172a] border-blue-900 text-white' : 'bg-gray-100 border-gray-300 text-black'
                }`}
              />
              <button onClick={handleNameUpdate} className="text-xs px-3 py-1 rounded-lg bg-blue-600 text-white font-bold">Save</button>
              <button onClick={() => setEditingName(false)} className="text-xs px-3 py-1 rounded-lg bg-gray-500/20 text-gray-400 font-bold">Cancel</button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <span className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-[#0a0f1e]'}`}>
                Hey, {user?.user_metadata?.full_name || user?.email} 👋
              </span>
              <button onClick={() => setEditingName(true)} className="text-xs px-2 py-1 rounded-lg bg-blue-500/20 text-blue-400 hover:bg-blue-500/40 transition-all">
                ✏️
              </button>
            </div>
          )}
        </div>

        {/* Center - Logo */}
        <div className="flex items-center gap-2 absolute left-1/2 transform -translate-x-1/2">
          <span className="text-xl">🗄️</span>
          <span className={`text-lg font-bold ${isDark ? 'text-white' : 'text-[#0a0f1e]'}`}>Expire_X</span>
        </div>

        {/* Right - Actions */}
        <div className="flex items-center gap-2">
          <button onClick={toggleTheme} className={`p-2 rounded-full text-lg transition-all ${isDark ? 'bg-blue-900 hover:bg-blue-800' : 'bg-gray-100 hover:bg-gray-200'}`}>
            {isDark ? '☀️' : '🌙'}
          </button>
          <button onClick={handleLogout} className="p-2 px-3 rounded-xl bg-red-500/20 text-red-400 hover:bg-red-500/40 text-sm font-bold transition-all">
            Logout
          </button>
        </div>
      </div>

      {/* Bottom Row - Search + Categories */}
      <div className="flex items-center gap-3 flex-wrap">

        {/* Search */}
        <div className="relative flex-1 min-w-[200px]">
          <span className="absolute left-3 top-1/2 -translate-y-1/2">🔍</span>
          <input
            type="text"
            placeholder="Search items..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className={`w-full pl-9 pr-4 py-2 rounded-xl border outline-none text-sm ${
              isDark ? 'bg-[#0f172a] border-blue-900 text-white placeholder-white/30' : 'bg-gray-50 border-gray-300 text-black'
            }`}
          />
        </div>

        {/* Categories */}
        <div className="flex gap-2 flex-wrap">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                selectedCategory === cat
                  ? 'bg-blue-600 text-white'
                  : isDark
                    ? 'bg-[#0f172a] border border-blue-900 text-white/50 hover:text-white'
                    : 'bg-white border border-gray-300 text-gray-500 hover:text-black'
              }`}>
              {cat}
            </button>
          ))}
        </div>
      </div>

    </nav>
  )
}

export default Navbar