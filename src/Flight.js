import React, { Component } from 'react'
import TableRow from '@material-ui/core/TableRow'
import TableCell from '@material-ui/core/TableCell'

class Flight extends Component {

  render() {
    return(
      <TableRow>
        <TableCell className="id">{this.props.id}</TableCell>
        <TableCell className="origin">{this.props.orig_pretty}</TableCell>
        <TableCell className="time">{this.props.time}</TableCell>
        <TableCell className="status">{this.props.status}</TableCell>
        <TableCell className="gate">{this.props.gate}</TableCell>
      </TableRow>
    )
  }
}

export default Flight