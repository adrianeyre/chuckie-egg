import React from 'react';

import IInfoBoardProps from './interfaces/info-board-props';

import player1 from '../../images/player1.png';
import player2 from '../../images/player2.png';

import './styles/info-board.scss';

export default class InfoBoard extends React.Component<IInfoBoardProps, {}> {
	public render() {
		return <div className="info-board" style={ this.styleInfoBoard() }>
			<div className="info-board-header">
				<img src={ player1 } alt="ship" />
				<span className="header-text">Chuckie Egg</span>
				<img src={ player2 } alt="ship" />
			</div>

			<div className="info-board-instructions">
				<p></p>
				<table>
					<tbody>
						<tr>
							<td className="title">Function</td>
							<td className="title">Key</td>
						</tr>
						<tr>
							<td>Move Up</td>
							<td>Arrow Up</td>
						</tr>
						<tr>
							<td>Move Down</td>
							<td>Arrow Down</td>
						</tr>
						<tr>
							<td>Move Left</td>
							<td>Arrow Left</td>
						</tr>
						<tr>
							<td>Move Right</td>
							<td>Arrow Right</td>
						</tr>
						<tr>
							<td>Jump</td>
							<td>Enter</td>
						</tr>
					</tbody>
				</table>
			</div>

			<div className="button-area">
				<button type="button" onClick={ this.props.startGame }>Play Game</button>
			</div>
		</div>
	}

	private styleInfoBoard = () => ({
		width: `100%`,
		maxWidth: `${ this.props.containerHeight }px`,
	})

}
