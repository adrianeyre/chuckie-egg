import IGame from './interfaces/game';
import PlayerResultEnum from './enums/player-result-enum';
import IChuckieEggProps from '../components/chuckie-egg/interfaces/chuckie-egg-props';
import IBoard from './interfaces/board';
import Board from './board';
import DirectionEnum from './enums/direction-enum';

export default class Game implements IGame {
	public timer: any
	public board: IBoard;
	public isGameInPlay: boolean;
	
	constructor(config: IChuckieEggProps) {
		this.board = new Board({});
		this.isGameInPlay = false;
	}

	public handleInput = (playerResult: PlayerResultEnum, key?: string): PlayerResultEnum => {
		switch (playerResult) {
			case PlayerResultEnum.ARROW_UP:
				return this.board.movePlayer(DirectionEnum.UP);
			case PlayerResultEnum.ARROW_RIGHT:
				return this.board.movePlayer(DirectionEnum.RIGHT);
			case PlayerResultEnum.ARROW_DOWN:
				return this.board.movePlayer(DirectionEnum.DOWN);
			case PlayerResultEnum.ARROW_LEFT:
				return this.board.movePlayer(DirectionEnum.LEFT);
		}

		return PlayerResultEnum.SAFE;
	}

	public handleFallTimer = (): PlayerResultEnum => this.board.movePlayer(DirectionEnum.FALL_DOWN);
}
