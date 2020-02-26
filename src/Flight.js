import React from 'react'
import TableRow from '@material-ui/core/TableRow'
import TableCell from '@material-ui/core/TableCell'

function Flight(props) {

  return (
    <TableRow>
      <TableCell className="id">{props.id}</TableCell>
      <TableCell className="origin">{props.orig_pretty}</TableCell>
      <TableCell className="time">{props.time}</TableCell>
      <TableCell className="status">{props.status}</TableCell>
      <TableCell className="gate">{props.gate}</TableCell>
    </TableRow>
  )
}

export default Flight