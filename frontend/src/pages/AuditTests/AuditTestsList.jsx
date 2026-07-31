import React, { useEffect, useState } from 'react'
import api from '../../services/api'
import AuditTestForm from '../../components/AuditTestForm'
import Container from '@mui/material/Container'
import Typography from '@mui/material/Typography'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Paper from '@mui/material/Paper'

export default function AuditTestsList(){
  const [tests, setTests] = useState([])

  useEffect(()=>{ fetchTests() }, [])

  async function fetchTests(){
    try{ const resp = await api.get('/audit-tests'); setTests(resp.data.audit_tests || []) }catch(e){console.error(e)}
  }

  function handleCreated(t){
    setTests(ts => [t, ...ts])
  }

  return (
    <Container sx={{py:3}}>
      <Typography variant="h5" gutterBottom>Audit Tests</Typography>
      <AuditTestForm onCreated={handleCreated} />

      <Paper>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Title</TableCell>
              <TableCell>Audit</TableCell>
              <TableCell>Result</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {tests.map(t => (
              <TableRow key={t.id}>
                <TableCell>{t.id}</TableCell>
                <TableCell>{t.title}</TableCell>
                <TableCell>{t.audit_id}</TableCell>
                <TableCell>{t.result}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </Container>
  )
}
