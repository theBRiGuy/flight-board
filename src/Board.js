import React, { Component } from 'react'
import './Board.scss'
import Time from './Time'

class Board extends Component {

    render() {
        return (
            <div className="Board">
                <div className="Board__header">
                    <div className="Board__header__title">FlightBoard</div>
                    <div className="Board__header__time"><Time /></div>
                </div>
            </div>
        )
    }
}

export default Board