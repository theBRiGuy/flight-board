import React, { Component } from 'react';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles'
import CssBaseLine from '@material-ui/core/CssBaseline'
import logo from './logo.svg';
import './App.css';
import Board from './Board'

const theme = createMuiTheme({
	palette: {
		type: 'dark'
	}
})

class App extends Component {
	render() {
		return (
			<MuiThemeProvider theme={theme}>
				<div className="App">
					<CssBaseLine>
						<main>
							<Board />
						</main>
					</CssBaseLine>
				</div>
			</MuiThemeProvider>
		);
	}
}

export default App;
