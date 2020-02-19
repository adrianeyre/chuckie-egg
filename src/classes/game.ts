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
	public level: number;

	private refreshGameState: any;
	
	constructor(config: IChuckieEggProps) {
		this.level = config.level || 1;
		this.board = new Board({ level: this.level });
		this.isGameInPlay = false;
		this.refreshGameState = config.refreshGameState;

		this.levelSetup();
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
			case PlayerResultEnum.ENTER:
				return this.board.player.isJumping ? PlayerResultEnum.SAFE : PlayerResultEnum.START_JUMP_TIMER;
		}

		return PlayerResultEnum.SAFE;
	}

	private levelSetup = async (): Promise<void> => {
		await this.board.readBoard(this.level);

		this.refreshGameState();
	}

	public handleFallTimer = (): PlayerResultEnum => this.board.movePlayer(DirectionEnum.FALL_DOWN);
	public handleJumpTimer = (): PlayerResultEnum => this.board.jump();
}
