import React, { Component } from 'react'
import airlines from './airlines'

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

  componentDidMount() {
    console.log(airlines)
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