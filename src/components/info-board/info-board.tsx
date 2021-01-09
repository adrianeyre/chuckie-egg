import React, { FC } from 'react';

import IInfoBoardProps from './interfaces/info-board-props';

import playerRight from '../../images/player-right.png';
import playerLeft from '../../images/player-left.png';

import './styles/info-board.scss';

const InfoBoard: FC<IInfoBoardProps> = (props: IInfoBoardProps) => {
	const styleInfoBoard = () => ({
		width: `100%`,
		maxWidth: `${ props.containerHeight }px`,
	})

	return <div className="info-board" style={ styleInfoBoard() }>
		<div className="info-board-header">
			<img src={ playerRight } alt="player" />
			<span className="header-text">Chuckie Egg</span>
			<img src={ playerLeft } alt="player" />
		</div>

		<div className="info-board-instructions">
			<p>As Hen-House Harry, the player must collect the twelve eggs positioned in each level, before a countdown timer reaches zero. In addition there are piles of seed which may be collected to increase points and stop the countdown timer for a while, but will otherwise be eaten by hens that patrol the level, causing them to pause. If the player touches a hen or falls through a gap in the bottom of the level, he loses a life. Each level is made of solid platforms, ladders and occasionally lift platforms that constantly move upwards but upon leaving the top of the screen will reappear at the bottom. Hitting the top of the screen while on one of these lifts, however, will also cause the player to lose a life.</p>
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
			<button type="button" onClick={ props.startGame }>Play Game</button>
		</div>
	</div>
}

export default InfoBoard;
