import React from 'react'
import Moment, { moment } from 'moment'

const Time = () => {

  const dateNow = () => {
    return new Moment().format("MMM D YYYY")
  }

  return (
    <div className="Time">{ dateNow() }</div>
  )
}

export default Time