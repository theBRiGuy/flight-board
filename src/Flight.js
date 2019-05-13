import React, { Component } from 'react'

class Flight extends Component {

  render() {
    return(
      <tr>
        <td className="id">{this.props.id}</td>
        <td className="origin">{this.props.origin}</td>
        <td className="time">{this.props.time}</td>
        <td className="status">{this.props.status}</td>
        <td className="gate">{this.props.gate}</td>
      </tr>
    )
  }
}

export default Flight