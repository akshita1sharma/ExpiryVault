import { useState } from 'react'
import { supabase } from '../supabase'
import { useTheme } from '../context/ThemeContext'

function Navbar({ user }) {
  const { isDark, toggleTheme } = useTheme()
  const [editingName, setEditingName] = useState(false)
  const [newName, setNewName] = useState(user?.user_metadata?.full_name || '')

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
    <nav className={`w-full px-4 py-3 flex flex-col border-b sticky top-0 z-50 ${
      isDark ? 'bg-[#0a0f1e] border-blue-900' : 'bg-white border-gray-200'
    }`}>

      {/* Top row — Logo center, logout right */}
      <div className="flex items-center justify-between w-full">

        {/* Logo */}
        <div className="flex items-center gap-2">
          <span className="text-xl">🗄️</span>
          <span className={`text-lg font-bold ${isDark ? 'text-white' : 'text-[#0a0f1e]'}`}>
            ExpiryVault
          </span>
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={toggleTheme}
            className={`p-2 rounded-full text-lg transition-all ${
              isDark ? 'bg-blue-900 hover:bg-blue-800' : 'bg-gray-100 hover:bg-gray-200'
            }`}>
            {isDark ? '☀️' : '🌙'}
          </button>
          <button
            onClick={handleLogout}
            className="p-2 px-3 rounded-xl bg-red-500/20 text-red-400 hover:bg-red-500/40 text-sm font-bold transition-all">
            Logout
          </button>
        </div>
      </div>

      {/* Bottom row — User greeting */}
      <div className="flex items-center gap-2 mt-2">
        {editingName ? (
          <div className="flex items-center gap-2 flex-wrap">
            <input
              value={newName}
              onChange={e => setNewName(e.target.value)}
              className={`p-1 px-3 rounded-lg border outline-none text-sm ${
                isDark ? 'bg-[#0f172a] border-blue-900 text-white' : 'bg-gray-100 border-gray-300 text-black'
              }`}
            />
            <button
              onClick={handleNameUpdate}
              className="text-xs px-3 py-1 rounded-lg bg-blue-600 text-white font-bold">
              Save
            </button>
            <button
              onClick={() => setEditingName(false)}
              className="text-xs px-3 py-1 rounded-lg bg-gray-500/20 text-gray-400 font-bold">
              Cancel
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <span className={`text-sm font-semibold ${isDark ? 'text-white/80' : 'text-[#0a0f1e]'}`}>
              Hey, {user?.user_metadata?.full_name || user?.email} 👋
            </span>
            <button
              onClick={() => setEditingName(true)}
              className="text-xs px-2 py-1 rounded-lg bg-blue-500/20 text-blue-400 hover:bg-blue-500/40 transition-all">
              ✏️ Edit
            </button>
          </div>
        )}
      </div>

    </nav>
  )
}

export default Navbar