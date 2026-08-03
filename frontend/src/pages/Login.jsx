import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../services/api'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  async function handleSubmit(e){
    e.preventDefault()
    setError(null)
    setLoading(true)
    try{
      const resp = await api.post('/auth/login', { email, password })
      const { access_token, refresh_token } = resp.data || {}
      if (access_token) {
        localStorage.setItem('access_token', access_token)
      }
      if (refresh_token) {
        localStorage.setItem('refresh_token', refresh_token)
      }
      navigate('/')
    }catch(err){
      setError(err.response?.data?.error || 'Erro ao autenticar')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{padding: 40, maxWidth: 420, margin: '40px auto', background: '#fff', borderRadius: 16, boxShadow: '0 8px 24px rgba(0,0,0,0.08)'}}>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <div style={{marginBottom:12}}>
          <label style={{display:'block', marginBottom:6}}>Email</label>
          <input value={email} onChange={e=>setEmail(e.target.value)} style={{width:'100%', padding:8}} />
        </div>
        <div style={{marginBottom:12}}>
          <label style={{display:'block', marginBottom:6}}>Senha</label>
          <input type="password" value={password} onChange={e=>setPassword(e.target.value)} style={{width:'100%', padding:8}} />
        </div>
        {error && <div style={{color:'red', marginBottom:12}}>{error}</div>}
        <button type="submit" disabled={loading} style={{padding:'10px 14px', cursor:'pointer'}}>
          {loading ? 'Entrando...' : 'Entrar'}
        </button>
      </form>
    </div>
  )
}

