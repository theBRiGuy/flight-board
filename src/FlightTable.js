import React, { Component } from 'react'
import Flight from './Flight'
import { getISODay, startOfTomorrow, startOfYesterday, differenceInMinutes } from 'date-fns'
import arrivals from './arrivals'


class FlightTable extends Component {

  getFlights() {

    const now = new Date()
    const flights = []

    arrivals.forEach(flight => {
      console.log(`Flight ${flight['id']}, time: ${flight['arr_time']}, days: ${flight['days']} (current day is ${getISODay(now)})`);

      const arrTimeArr = flight['arr_time'].split(':')
      const newDateWithScheduledFlightTime = (date) => {
        date.setMinutes(arrTimeArr[1])
        date.setHours(arrTimeArr[0])
        date.setSeconds(0)
        return date
      }

      let findDisplayableFlight = () => {
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
        
        // 3. else, there should be no next flight to display
        // 4. if previous weeekday is scheduled, make new date object from yesterday + flight time
        if (flight['days'].includes(prevWeekday)) {
          candidates.push(newDateWithScheduledFlightTime(startOfYesterday()))
        }
        
        // then sort all flight times ascending into array
        // TODO: might not be necessary to sort
        // candidates.sort((a, b) => a.getTime() - b.getTime())

        console.log('candidates is', candidates)

        // for each flight time, if flight is within 4 hours of right now, return it
        console.log('xxx is', candidates.find( (candidate, idx) => {
          console.log(`minute diff between candidate ${idx} and now is`, differenceInMinutes(candidate, now));
          return Math.abs(differenceInMinutes(candidate, now)) <= 240
        }))

        return candidates.find(candidate => Math.abs(differenceInMinutes(candidate, now)) <= 240)
      }

      const displayableFlight = findDisplayableFlight()
      if (displayableFlight) flights.push(displayableFlight)
      console.log('flights is', flights)
    })

    return (
      <tbody>
      {flights.map((flight, idx) => (
        <Flight key={idx} time={flight.toString()} />
      ))}
      </tbody>
    ) 
  }

  componentDidMount() {
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