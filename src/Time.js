import React, { useState } from 'react'
import { format } from 'date-fns'
import useInterval from './helpers/useInterval'

function Time(props) {

  const timeFactory = () => {
    return format(new Date(), 'MMM D YYYY HH:mm:ss')
  }

  // state
  const [curTime, setCurTime] = useState(timeFactory())

  useInterval(() => {
    setCurTime(timeFactory());
  }, 1000)

  return (
    <div className="Time">{curTime}</div>
  )
}

export default Time