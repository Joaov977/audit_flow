import React, { useEffect, useState } from 'react'
import api from '../../services/api'
import ProcessForm from '../../components/ProcessForm'
import Container from '@mui/material/Container'
import Typography from '@mui/material/Typography'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Paper from '@mui/material/Paper'

export default function ProcessesList(){
  const [processes, setProcesses] = useState([])

  useEffect(()=>{ fetchProcesses() }, [])

  async function fetchProcesses(){
    try{ const resp = await api.get('/processes'); setProcesses(resp.data.processes || []) }catch(e){console.error(e)}
  }

  function handleCreated(p){
    setProcesses(ps => [p, ...ps])
  }

  return (
    <Container sx={{py:3}}>
      <Typography variant="h5" gutterBottom>Processes</Typography>
      <ProcessForm onCreated={handleCreated} />

      <Paper>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Audit</TableCell>
              <TableCell>Owner</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {processes.map(p => (
              <TableRow key={p.id}>
                <TableCell>{p.id}</TableCell>
                <TableCell>{p.name}</TableCell>
                <TableCell>{p.audit_id}</TableCell>
                <TableCell>{p.owner_id}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </Container>
  )
}
