import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../services/api'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  async function handleSubmit(e){
    e.preventDefault()
    setError(null)
    try{
      const resp = await api.post('/auth/login', { email, password })
      const { access_token, refresh_token } = resp.data
      localStorage.setItem('access_token', access_token)
      localStorage.setItem('refresh_token', refresh_token)
      navigate('/')
    }catch(err){
      setError(err.response?.data?.error || 'Erro ao autenticar')
    }
  }

  return (
    <div style={{padding: 40, maxWidth: 420}}>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <div style={{marginBottom:12}}>
          <label>Email</label>
          <input value={email} onChange={e=>setEmail(e.target.value)} style={{width:'100%'}} />
        </div>
        <div style={{marginBottom:12}}>
          <label>Senha</label>
          <input type="password" value={password} onChange={e=>setPassword(e.target.value)} style={{width:'100%'}} />
        </div>
        {error && <div style={{color:'red', marginBottom:12}}>{error}</div>}
        <button type="submit">Entrar</button>
      </form>
    </div>
  )
}

