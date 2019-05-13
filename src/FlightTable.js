import React, { Component } from 'react'
import Flight from './Flight'
import { getISODay, startOfTomorrow, startOfYesterday, differenceInMinutes } from 'date-fns'
import arrivals from './arrivals'


class FlightTable extends Component {

  constructor (props) {
    super(props)

    this.state = {
      flights: []
    }
  }

  getFlights() {

    const now = new Date()

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

      const displayableFlight = displayableFlightDate()
      if (displayableFlight) {
        const { id, orig_pretty, status } = flight
        this.state.flights.push(
          Object.assign(
            {id, orig_pretty, status}, 
            {
              time: `${('0' + displayableFlight.getHours()).slice(-2)}:${displayableFlight.getMinutes()}`,
              status: (() => {
                if (differenceInMinutes(displayableFlight, now) <= 0) return 'Departed'
                else return 'On time'
              })()
            }
          )
        )

        console.log('flights is', this.state.flights)
        
      }
    })

    return (
      <tbody>
      {this.state.flights.map((flight, idx) => (
        <Flight key={idx} id={flight.id} orig_pretty={flight.orig_pretty} time={flight.time} status={flight.status} />
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