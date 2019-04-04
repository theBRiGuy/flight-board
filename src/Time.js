import React, { Component } from 'react'
import Moment, { moment } from 'moment'

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
    return new Moment().format('MMM D YYYY HH:mm:ss')
  }
}

export default Time