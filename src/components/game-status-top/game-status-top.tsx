import React from 'react';
import { range } from 'lodash';

import IGameStatusTopProps from './interfaces/game-status-top-props';

import lives from '../../images/player-right-stood.png';

import './styles/game-status-top.scss';

export default class GameStatusTop extends React.Component<IGameStatusTopProps, {}> {

	public render() {
		return <div className="game-status-top">
			<div className="game-status-left">SCORE <span className="variable-text">{ this.props.score }</span></div>
			<div className="game-status-centre-left">LIVES <span className="variable-text">{ this.props.lives > 0 && range(this.props.lives - 1).map((livesIndex: number) => <img className="player-lives" key={ `lives-image-${ livesIndex }` } src={ lives } alt="lives" />) }</span></div>
			<div className="game-status-centre-right">LEVEL <span className="variable-text">{ this.props.level }</span></div>
			<div className="game-status-right">TIME <span className="variable-text">{ this.props.time }</span></div>
		</div>
	}
}
