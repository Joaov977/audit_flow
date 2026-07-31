import React, { useEffect, useState } from 'react'
import api from '../services/api'
import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'
import MenuItem from '@mui/material/MenuItem'
import Select from '@mui/material/Select'
import InputLabel from '@mui/material/InputLabel'
import FormControl from '@mui/material/FormControl'
import Button from '@mui/material/Button'

export default function AuditTestForm({ onCreated }){
  const [audits, setAudits] = useState([])
  const [processes, setProcesses] = useState([])
  const [title, setTitle] = useState('')
  const [auditId, setAuditId] = useState('')
  const [processId, setProcessId] = useState('')
  const [description, setDescription] = useState('')
  const [result, setResult] = useState('')
  const [evidence, setEvidence] = useState('')
  const [performedBy, setPerformedBy] = useState('')
  const [performedAt, setPerformedAt] = useState('')

  const [users, setUsers] = useState([])

  useEffect(()=>{ fetchAudits(); fetchUsers() }, [])

  async function fetchUsers(){
    try{ const resp = await api.get('/users'); setUsers(resp.data.users || []) }catch(e){console.error(e)}
  }

  async function fetchAudits(){
    try{ const resp = await api.get('/audits'); setAudits(resp.data.audits || []) }catch(e){console.error(e)}
  }

  async function fetchProcesses(audit_id){
    try{ const resp = await api.get('/processes', { params: { audit_id } }); setProcesses(resp.data.processes || []) }catch(e){console.error(e)}
  }

  function onAuditChange(aid){
    setAuditId(aid)
    setProcessId('')
    if(aid) fetchProcesses(aid)
    else setProcesses([])
  }

  async function handleSubmit(e){
    e.preventDefault()
    try{
      const payload = {
        audit_id: auditId || null,
        process_id: processId || null,
        title,
        description,
        result,
        evidence,
        performed_by: performedBy,
        performed_at: performedAt || null
      }
      const resp = await api.post('/audit-tests', payload)
      setTitle(''); setAuditId(''); setProcessId(''); setDescription(''); setResult(''); setEvidence(''); setPerformedBy(''); setPerformedAt('')
      if(onCreated) onCreated(resp.data.audit_test)
    }catch(err){ console.error(err) }
  }

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ display:'flex', gap:2, alignItems:'center', mb:2, flexWrap:'wrap' }}>
      <TextField label="Título" value={title} onChange={e=>setTitle(e.target.value)} required />

      <FormControl sx={{minWidth:200}}>
        <InputLabel id="audit-select-label">Auditoria</InputLabel>
        <Select labelId="audit-select-label" value={auditId} label="Auditoria" onChange={e=>onAuditChange(e.target.value)}>
          <MenuItem value="">Selecione</MenuItem>
          {audits.map(a => <MenuItem key={a.id} value={a.id}>{a.title}</MenuItem>)}
        </Select>
      </FormControl>

      <FormControl sx={{minWidth:200}}>
        <InputLabel id="process-select-label">Processo</InputLabel>
        <Select labelId="process-select-label" value={processId} label="Processo" onChange={e=>setProcessId(e.target.value)}>
          <MenuItem value="">Nenhum</MenuItem>
          {processes.map(p => <MenuItem key={p.id} value={p.id}>{p.name}</MenuItem>)}
        </Select>
      </FormControl>

      <TextField label="Descrição" value={description} onChange={e=>setDescription(e.target.value)} />

      <FormControl sx={{minWidth:160}}>
        <InputLabel id="result-select-label">Resultado</InputLabel>
        <Select labelId="result-select-label" value={result} label="Resultado" onChange={e=>setResult(e.target.value)}>
          <MenuItem value="">--</MenuItem>
          <MenuItem value="pass">Pass</MenuItem>
          <MenuItem value="fail">Fail</MenuItem>
          <MenuItem value="needs_attention">Needs Attention</MenuItem>
        </Select>
      </FormControl>

      <TextField label="Evidência" value={evidence} onChange={e=>setEvidence(e.target.value)} />
      <FormControl sx={{minWidth:200}}>
        <InputLabel id="performed-by-select">Performed By</InputLabel>
        <Select labelId="performed-by-select" value={performedBy} label="Performed By" onChange={e=>setPerformedBy(e.target.value)}>
          <MenuItem value="">--</MenuItem>
          {users.map(u => <MenuItem key={u.id} value={u.id}>{u.full_name || u.email}</MenuItem>)}
        </Select>
      </FormControl>
      <TextField type="datetime-local" label="Performed At" value={performedAt} onChange={e=>setPerformedAt(e.target.value)} InputLabelProps={{ shrink:true }} />
      <Button variant="contained" color="primary" type="submit">Criar</Button>
    </Box>
  )
}
