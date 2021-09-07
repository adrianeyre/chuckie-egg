import { FC } from 'react';
import { range } from 'lodash';

import IGameStatusTopProps from './interfaces/game-status-top-props';

import lives from '../../images/player-right-stood.png';

import './styles/game-status-top.scss';

const GameStatusTop: FC<IGameStatusTopProps> = (props: IGameStatusTopProps) => {
	return <div className="game-status-top">
		<div className="game-status-left">SCORE <span className="variable-text">{ props.score }</span></div>
		<div className="game-status-centre-left">LIVES <span className="variable-text">{ props.lives > 0 && range(props.lives - 1).map((livesIndex: number) => <img className="player-lives" key={ `lives-image-${ livesIndex }` } src={ lives } alt="lives" />) }</span></div>
		<div className="game-status-centre-right">LEVEL <span className="variable-text">{ props.level }</span></div>
		<div className="game-status-right">TIME <span className="variable-text">{ props.time }</span></div>
	</div>
}

export default GameStatusTop;
