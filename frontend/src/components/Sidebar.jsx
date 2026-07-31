import React from 'react'
import { Link } from 'react-router-dom'

export default function Sidebar(){
  return (
    <aside style={{width: 240, padding: 16, background: '#f5f5f5'}}>
      <h3>AuditFlow</h3>
      <nav>
        <ul style={{listStyle:'none', padding:0}}>
          <li><Link to="/">Dashboard</Link></li>
          <li><Link to="/companies">Empresas</Link></li>
          <li><Link to="/audits">Auditorias</Link></li>
        </ul>
      </nav>
    </aside>
  )
}
