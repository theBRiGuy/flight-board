import React, { Component } from 'react'
import TableRow from '@material-ui/core/TableRow'
import TableCell from '@material-ui/core/TableCell'
import statuses from './statuses'

class Flight extends Component {

  prettyStatus(statusId) {
    return statuses[statusId].pretty_name
  }
  render() {
    return(
      <TableRow className={'Flight ' + this.props.status}>
        <TableCell className="Flight__id">{this.props.id}</TableCell>
        <TableCell className="Flight__carrier">{this.props.carrier_pretty}</TableCell>
        <TableCell className="Flight__origin">{this.props.orig_pretty}</TableCell>
        <TableCell className="Flight__time">{this.props.time}</TableCell>
        <TableCell className="Flight__status">{this.prettyStatus(this.props.status)}</TableCell>
        <TableCell className="Flight__terminal">{this.props.arr_term}</TableCell>
        <TableCell className="Flight__gate">{this.props.gate}</TableCell>
      </TableRow>
    )
  }
}

export default Flight