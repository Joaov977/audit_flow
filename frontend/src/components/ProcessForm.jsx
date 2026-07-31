import React, { useEffect, useState } from 'react'
import api from '../services/api'
import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'
import MenuItem from '@mui/material/MenuItem'
import Select from '@mui/material/Select'
import InputLabel from '@mui/material/InputLabel'
import FormControl from '@mui/material/FormControl'
import Button from '@mui/material/Button'

export default function ProcessForm({ onCreated }){
  const [audits, setAudits] = useState([])
  const [name, setName] = useState('')
  const [auditId, setAuditId] = useState('')
  const [description, setDescription] = useState('')
  const [ownerId, setOwnerId] = useState('')
  const [users, setUsers] = useState([])

  useEffect(()=>{ fetchAudits(); fetchUsers() }, [])

  async function fetchAudits(){
    try{ const resp = await api.get('/audits'); setAudits(resp.data.audits || []) }catch(e){console.error(e)}
  }

  async function fetchUsers(){
    try{ const resp = await api.get('/users'); setUsers(resp.data.users || []) }catch(e){console.error(e)}
  }

  async function handleSubmit(e){
    e.preventDefault()
    try{
      const payload = { audit_id: auditId || null, name, description, owner_id: ownerId || null }
      const resp = await api.post('/processes', payload)
      setName(''); setAuditId(''); setDescription(''); setOwnerId('')
      if(onCreated) onCreated(resp.data.process)
    }catch(err){ console.error(err) }
  }

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ display:'flex', gap:2, alignItems:'center', mb:2 }}>
      <TextField label="Nome" value={name} onChange={e=>setName(e.target.value)} required />

      <FormControl sx={{minWidth:200}}>
        <InputLabel id="audit-select-label">Auditoria</InputLabel>
        <Select labelId="audit-select-label" value={auditId} label="Auditoria" onChange={e=>setAuditId(e.target.value)}>
          <MenuItem value="">Nenhuma</MenuItem>
          {audits.map(a => <MenuItem key={a.id} value={a.id}>{a.title}</MenuItem>)}
        </Select>
      </FormControl>

      <TextField label="Descrição" value={description} onChange={e=>setDescription(e.target.value)} />

      <FormControl sx={{minWidth:200}}>
        <InputLabel id="owner-select-label">Responsável</InputLabel>
        <Select labelId="owner-select-label" value={ownerId} label="Responsável" onChange={e=>setOwnerId(e.target.value)}>
          <MenuItem value="">Nenhum</MenuItem>
          {users.map(u => <MenuItem key={u.id} value={u.id}>{u.full_name || u.email}</MenuItem>)}
        </Select>
      </FormControl>

      <Button variant="contained" color="primary" type="submit">Criar</Button>
    </Box>
  )
}
