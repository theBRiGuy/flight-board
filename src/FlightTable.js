import React, { Component } from 'react'
import Flight from './Flight'
import { getISODay, startOfTomorrow, startOfYesterday, differenceInMinutes } from 'date-fns'
import arrivals from './arrivals'


class FlightTable extends Component {

  constructor (props) {
    super(props)
    this.state = {}
  }

  getFlights() {
    const now = new Date()
    this.flights = []

    arrivals.forEach(flight => {
      console.log(`Flight ${flight['id']}, time: ${flight['arr_time']}, days: ${flight['days']} (current day is ${getISODay(now)})`);

      const newDateWithScheduledFlightTime = (date) => {
        const arrTimeArr = flight['arr_time'].split(':')
        date.setHours(arrTimeArr[0])
        date.setMinutes(arrTimeArr[1])
        date.setSeconds(0)
        return date
      }

      let displayableFlightDate = () => {
        const currentWeekday = getISODay(now)
        const prevWeekday = ((c = getISODay(now)) => (c === 1 ? 7 : c - 1))()
        const nextWeekday = ((c = getISODay(now)) => (c === 7 ? 1 : c + 1))()

        let candidates = []

        // 1. if current weekday is scheduled, make new date object from today + flight time
        if (flight['days'].includes(currentWeekday)) {
          candidates.push(newDateWithScheduledFlightTime(new Date(now.getTime())))
        }
        
        // 2. if next weekday is scheduled, make new date object from tomorrow + flight time
        if (flight['days'].includes(nextWeekday)) {
          candidates.push(newDateWithScheduledFlightTime(startOfTomorrow()))
        }
        
        // 3. if previous weeekday is scheduled, make new date object from yesterday + flight time
        if (flight['days'].includes(prevWeekday)) {
          candidates.push(newDateWithScheduledFlightTime(startOfYesterday()))
        }
        
        // then sort all flight times ascending into array
        // TODO: Not really necessary to sort - can remove sorting to optimize performance
        candidates.sort((a, b) => a.getTime() - b.getTime())

        return candidates.find(candidate => Math.abs(differenceInMinutes(candidate, now)) <= 180)
      }

      const displayableFlight = displayableFlightDate()
      if (displayableFlight) {
        const { id, orig_pretty, status } = flight
        this.flights.push(
          Object.assign(
            {id, orig_pretty, status}, 
            {
              time: `${('0' + displayableFlight.getHours()).slice(-2)}:${displayableFlight.getMinutes()}`,
              status: (() => {
                if (differenceInMinutes(displayableFlight, now) <= 0) return 'Departed'
                else return 'On time'
              })(),
              gate: this.getGate(id)
            }
          )
        )
      }
    })

    console.log('this.gates is ', this.gates)
    console.log('this.flights is ', this.flights)
    this.cleanGates()

    if (this.flights.length === 0) {
      return this.noFlights()
    }
    else {
      return (
        <tbody>
          {
            this.flights.map((flight, idx) => (
              <Flight key={idx} id={flight.id} orig_pretty={flight.orig_pretty} time={flight.time} status={flight.status} gate={flight.gate} />
            ))
          }
        </tbody>
      )
    }
  }

  getGate(id) {
    // If gate has already been assigned to flight, return it
    if (this.gates.hasOwnProperty(id)) {
      return this.gates[id]
    // Else generate a random gate, assign to flight, return it
    } else {
      const letters = 'ABCDEF'
      return this.gates[id] = '' + letters[Math.floor(Math.random() * letters.length)] + (Math.floor(Math.random() * 24) + 1)
    }
  }

  // Clears gates that aren't assigned to flights - current departed flights still have gate assigned
  cleanGates() {
    Object.keys(this.gates).forEach((gate) => {
      let found = this.flights.find((flight) => {
        return flight.id === gate
      })
      if (!found) {
        delete this.gates[gate]
      }
    })
    // this.flights.forEach((flight) => {
    //   if (!this.gates.hasOwnProperty(flight.id)) {
    //     delete this.gates[flight.id]
    //   }
    // })
  }

  noFlights() {
    return (
      <tbody>
        <tr>
          <td colSpan="4">No flights to display</td>
        </tr>
      </tbody>
    )
  }

  componentDidMount() {
    this.interval = setInterval(() => this.setState({
      lastUpdated: Date.now()
    }), 30000)
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  render() {
    return(
      <table>
        <thead>
          <tr>
            <th>Flight</th>
            <th>Origin</th>
            <th>Scheduled Time</th>
            <th>Status</th>
            <th>Gate</th>
          </tr>
        </thead>
          {
            this.getFlights()
          }
      </table>
    )
  }
}

export default FlightTable