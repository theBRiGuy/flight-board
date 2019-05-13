import React, { Component } from 'react'
import { format } from 'date-fns'

class Time extends Component {

  constructor(props) {
    super(props)
    this.state = {
      curTime: this.timeFactory()
    }
  }

  render() {
    return (
      <div className="Time">{this.state.curTime}</div>
    )
  }

  componentDidMount() {
    setInterval(() => {
      this.setState({
        curTime: this.timeFactory()
      })
    }, 1000)
  }

  timeFactory() {
    return format(new Date(), 'MMM D YYYY HH:mm:ss')
  }
}

export default Time