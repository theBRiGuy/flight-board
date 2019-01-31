import React from 'react'

const Time = () => {

  const dateNow = () => {
    const d = new Date()
    return `${d.getDate()} ${d.getMonth()}++ ${d.getFullYear()}`
  }

  return (
    <div className="Time">{ dateNow() }</div>
  )
}

export default Time