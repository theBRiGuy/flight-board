import React, { Component } from 'react'

class FlightTable extends Component {

  getFlights() {
   return (
     <tr>
       <td colSpan="4">
        Flights here
       </td>
     </tr>
   ) 
  }

  render() {
    return(
      <table>
        <thead>
          <tr>
            <th>Flight</th>
            <th>Origin</th>
            <th>Gate</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {
            this.getFlights()
          }
        </tbody>
      </table>
    )
  }
}

export default FlightTable