import React from 'react'
import './Board.scss'
import Time from './Time'
import FlightTable from './FlightTable'

function Board() {

	return (
		<div className="Board">
			<div className="Board__header">
				<div className="Board__header__title">FlightBoard</div>
				<div className="Board__header__time">
					<Time />
				</div>
			</div>
			<div className="Board__body">
				<FlightTable />
			</div>
		</div>
	)
}

export default Board