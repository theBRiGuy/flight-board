import React, { useState } from 'react'
import useInterval from './helpers/useInterval'
import Table from '@material-ui/core/Table'
import TableHead from '@material-ui/core/TableHead'
import TableBody from '@material-ui/core/TableBody'
import TableRow from '@material-ui/core/TableRow'
import TableCell from '@material-ui/core/TableCell'
import Flight from './Flight'
import { getISODay, startOfTomorrow, startOfYesterday, differenceInMinutes } from 'date-fns'

function FlightTable(props) {

  // state
  const [flightData, setFlightData] = useState([])
  const [gates, setGates] = useState({})

  const getGate = id => {
    console.log('gates is ', gates)
    // If gate has already been assigned to flight, return it
    if (gates.hasOwnProperty(id)) {
      return gates[id];
      // Else generate a random gate, assign to flight, return it
    } else {
      const letters = "ABCDEF";
      setGates({...gates, [id]: "" +
        letters[Math.floor(Math.random() * letters.length)] +
        (Math.floor(Math.random() * 24) + 1)});
      return gates[id];
    }
  }

  const noFlights = () => (
    <TableBody>
      <TableRow>
        <TableCell colSpan="5">No flights to display</TableCell>
      </TableRow>
    </TableBody>
  )

  const getFlights = () => {
    const now = new Date()
    const flights = []

    flightData.forEach(flight => {
      console.log(`Flight ${flight['id']}, time: ${flight['arr_time']}, days: ${flight['days']} (current day is ${getISODay(now)})`)

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
        flights.push(
          Object.assign(
            {id, orig_pretty, status}, 
            {
              time: `${('0' + displayableFlight.getHours()).slice(-2)}:${displayableFlight.getMinutes()}`,
              status: (() => {
                if (differenceInMinutes(displayableFlight, now) <= 0) return 'Departed'
                else return 'On time'
              })(),
              gate: getGate(id)
            }
          )
        )
      }
    })

    // Clears gates that aren't assigned to flights - current departed flights still have gate assigned
    Object.keys(gates).forEach((gate) => {
      let found = flights.find((flight) => {
        return flight.id === gate
      })
      if (!found) {
        delete gates[gate]
      }
    })

    return (
      <>
      { !flights.length && noFlights() }
      <TableBody>
        {
          flights.map((flight, idx) => (
            <Flight key={idx} id={flight.id} orig_pretty={flight.orig_pretty} time={flight.time} status={flight.status} gate={flight.gate} />
          ))
        }
      </TableBody>
      </>
    )
  }

  const fetchFlights = () => {
    fetch("http://localhost:4000/arrivals")
      .then(res => res.json())
      .then(result => {
        setFlightData(result);
      })
      .catch(error => {
        console.log("error! error is", error);
      })
  }

  useInterval(() => {
    fetchFlights()
  }, 5000)

  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>Flight</TableCell>
          <TableCell>Origin</TableCell>
          <TableCell>Scheduled Time</TableCell>
          <TableCell>Status</TableCell>
          <TableCell>Gate</TableCell>
        </TableRow>
      </TableHead>
        { flightData && getFlights() }
    </Table>
  )
}

export default FlightTable