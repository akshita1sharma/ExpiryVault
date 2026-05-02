import { useState } from 'react'
import { supabase } from '../supabase'
import { useTheme } from '../context/ThemeContext'

function Signup() {
  const { isDark } = useTheme()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const handleSignup = async (e) => {
    e.preventDefault()
    setLoading(true)
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: name } }
    })
    if (error) {
      alert(error.message)
    } else {
      alert('Account created! Please login.')
      window.location.href = '/login'
    }
    setLoading(false)
  }

  const handleGoogleSignup = async () => {
    await supabase.auth.signInWithOAuth({ provider: 'google' })
  }

  return (
    <div className={`min-h-screen flex items-center justify-center ${isDark ? 'bg-[#0a0f1e]' : 'bg-white'}`}>
      <div className={`p-8 rounded-2xl border w-full max-w-md ${isDark ? 'bg-[#0f172a] border-blue-900' : 'bg-gray-50 border-gray-200'}`}>

        {/* Logo */}
        <div className="flex items-center gap-2 mb-6 justify-center">
          <span className="text-3xl">🗄️</span>
          <span className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-[#0a0f1e]'}`}>ExpiryVault</span>
        </div>

        <h2 className={`text-xl font-bold mb-6 text-center ${isDark ? 'text-white' : 'text-[#0a0f1e]'}`}>
          Create your account
        </h2>

        <form onSubmit={handleSignup} className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={e => setName(e.target.value)}
            required
            className={`p-3 rounded-xl border outline-none ${isDark ? 'bg-[#0a0f1e] border-blue-900 text-white placeholder-white/30' : 'bg-white border-gray-300 text-black'}`}
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            className={`p-3 rounded-xl border outline-none ${isDark ? 'bg-[#0a0f1e] border-blue-900 text-white placeholder-white/30' : 'bg-white border-gray-300 text-black'}`}
          />

          {/* Password with eye toggle */}
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Password (min 6 characters)"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              className={`w-full p-3 rounded-xl border outline-none ${isDark ? 'bg-[#0a0f1e] border-blue-900 text-white placeholder-white/30' : 'bg-white border-gray-300 text-black'}`}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-lg">
              {showPassword ? '🙈' : '👁️'}
            </button>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="p-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold transition-all">
            {loading ? 'Creating account...' : 'Sign Up'}
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center gap-3 my-4">
          <div className={`flex-1 h-px ${isDark ? 'bg-blue-900' : 'bg-gray-200'}`}></div>
          <span className={`text-sm ${isDark ? 'text-white/40' : 'text-gray-400'}`}>or</span>
          <div className={`flex-1 h-px ${isDark ? 'bg-blue-900' : 'bg-gray-200'}`}></div>
        </div>

        {/* Google Signup */}
        <button
          onClick={handleGoogleSignup}
          className={`w-full p-3 rounded-xl border font-bold flex items-center justify-center gap-2 transition-all ${isDark ? 'border-blue-900 text-white hover:bg-blue-900/30' : 'border-gray-300 text-black hover:bg-gray-100'}`}>
          <img src="https://www.google.com/favicon.ico" className="w-5 h-5" />
          Continue with Google
        </button>

        <p className={`text-center mt-4 text-sm ${isDark ? 'text-white/50' : 'text-gray-500'}`}>
          Already have an account?{' '}
          <a href="/login" className="text-blue-400 hover:underline">Login</a>
        </p>

      </div>
    </div>
  )
}

export default Signup