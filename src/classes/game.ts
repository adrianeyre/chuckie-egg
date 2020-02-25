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
	private AMOUNT_OF_LEVELS: number = 7;
	private HEN_ITERATION: number = 5;
	private LIFT_ITERATION: number = 5;
	
	constructor(config: IChuckieEggProps) {
		this.level = config.level || 1;
		this.board = new Board({ level: this.level });
		this.isGameInPlay = false;
		this.refreshGameState = config.refreshGameState;

		this.levelSetup();
	}

	public handleInput = (playerResult: PlayerResultEnum): PlayerResultEnum[] => {
		switch (playerResult) {
			case PlayerResultEnum.ARROW_UP:
				return this.handleBoardResponse(this.board.movePlayer(DirectionEnum.UP));
			case PlayerResultEnum.ARROW_RIGHT:
				return this.handleBoardResponse(this.board.movePlayer(DirectionEnum.RIGHT));
			case PlayerResultEnum.ARROW_DOWN:
				return this.handleBoardResponse(this.board.movePlayer(DirectionEnum.DOWN));
			case PlayerResultEnum.ARROW_LEFT:
				return this.handleBoardResponse(this.board.movePlayer(DirectionEnum.LEFT));
			case PlayerResultEnum.ENTER:
				return this.handleBoardResponse(this.board.movePlayer(DirectionEnum.JUMP));
		}

		return [];
	}

	public handleTimer = (): void => {
		this.board.decreaseTime();
		if (this.board.time < 1) this.isGameInPlay = false;

		if (this.board.time % this.HEN_ITERATION === 0) this.handleBoardResponse(this.board.moveHens());
		if (this.board.time % this.LIFT_ITERATION === 0) this.handleBoardResponse(this.board.moveLifts());
	}

	public handleFallTimer = (): PlayerResultEnum[] => this.handleBoardResponse(this.board.movePlayer(DirectionEnum.FALL_DOWN));
	public handleJumpTimer = (): PlayerResultEnum[] => this.handleBoardResponse(this.board.movePlayer(DirectionEnum.JUMP));

	private levelSetup = async (): Promise<void> => {
		await this.board.readBoard(this.level, true);

		this.refreshGameState();
	}

	private handleBoardResponse = (response: PlayerResultEnum[]): PlayerResultEnum[] => {
		if (response.indexOf(PlayerResultEnum.LEVEL_COMPLETE) > -1) this.nextLevel();

		if (response.indexOf(PlayerResultEnum.LOOSE_LIFE) > -1) this.looseLife();

		return response;
	}

	private nextLevel = (): void => {
		this.level ++;
		if (this.level > this.AMOUNT_OF_LEVELS) this.level = 1;
		this.board.readBoard(this.level, true);
	}

	private looseLife = (): void => {
		this.isGameInPlay =this.board.player.looseLife() > 0;

		if (this.isGameInPlay) this.board.readBoard(this.level, false);
	}
}
