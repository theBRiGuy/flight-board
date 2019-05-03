import React, { Component } from 'react'
import './Board.scss'
import Time from './Time'
import FlightTable from './FlightTable'

class Board extends Component {

	constructor(props) {
		super(props)

		this.state = {
			flights: []
		}

		this.handleUpdateFlights = this.handleUpdateFlights.bind(this)
	}

	handleUpdateFlights() {

	}

	render() {
		return (
			<div className="Board">
				<div className="Board__header">
					<div className="Board__header__title">FlightBoard</div>
					<div className="Board__header__time">
						<Time />
					</div>
				</div>
				<div className="Board__body">
					<FlightTable
						onHandleUpdateFlights={this.handleUpdateFlights}
					/>
				</div>
			</div>
		)
	}
}

export default Board