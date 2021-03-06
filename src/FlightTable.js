import React, { Component } from 'react'
import Table from '@material-ui/core/Table'
import TableHead from '@material-ui/core/TableHead'
import TableBody from '@material-ui/core/TableBody'
import TableRow from '@material-ui/core/TableRow'
import TableCell from '@material-ui/core/TableCell'
import Flight from './Flight'
import { getISODay, startOfTomorrow, startOfYesterday, differenceInMinutes } from 'date-fns'
import arrivals from './arrivals'
import statuses from './statuses'
import './FlightTable.scss'


class FlightTable extends Component {

  constructor (props) {
    super(props)
    this.gates = {}
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
        const { id, carrier_pretty, orig_pretty, arr_term } = flight
        this.flights.push(
          Object.assign(
            {id, carrier_pretty, orig_pretty, arr_term }, 
            {
              time: `${('0' + displayableFlight.getHours()).slice(-2)}:${displayableFlight.getMinutes()}`,
              status: (() => {
                var diff = differenceInMinutes(displayableFlight, now)
                if (diff <= 0) return statuses.arr.id
                else return statuses.on_time.id
              })(),
              gate: this.getGate(id, arr_term)
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
        <TableBody>
          {
            this.flights.map((flight, idx) => (
              <Flight
                key={idx}
                id={flight.id}
                carrier_pretty={flight.carrier_pretty}
                orig_pretty={flight.orig_pretty}
                time={flight.time}
                status={flight.status}
                arr_term={flight.arr_term}
                gate={flight.gate}
              />
            ))
          }
        </TableBody>
      )
    }
  }

  getGate(id, arr_term) {
    // If gate has already been assigned to flight, return it
    if (this.gates.hasOwnProperty(id)) {
      return this.gates[id]
    // Else generate a random gate, assign to flight, return it
    } else {
      const letters = ( arr_term === 'T3' ? 'ABC' : 'DEF' )
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
      <TableBody>
        <TableRow>
          <TableCell colSpan="4">No flights to display</TableCell>
        </TableRow>
      </TableBody>
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
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Flight</TableCell>
            <TableCell>Airline</TableCell>
            <TableCell>Origin</TableCell>
            <TableCell>Scheduled Time</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Terminal</TableCell>
            <TableCell>Gate</TableCell>
          </TableRow>
        </TableHead>
          {
            this.getFlights()
          }
      </Table>
    )
  }
}

export default FlightTable