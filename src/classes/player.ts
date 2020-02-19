import IPlayer from './interfaces/player';
import IPlayerConfig from './interfaces/player-config'
import DirectionEnum from './enums/direction-enum';
import PlayerResultEnum from './enums/player-result-enum';
import SpriteTypeEnum from './enums/sprite-type-enum';

import player1 from '../images/player1.png';

export default class Player implements IPlayer {
	public key: string;
	public visable: boolean;
	public x: number;
	public y: number;
	public height: number;
	public width: number;
	public image: string;
	public zIndex: number
	public direction: DirectionEnum;
	public score: number;
	public isFalling: boolean;

	private images = [
		[player1]
	]
	private readonly DEFAULT_Z_INDEX: number = 5000;
	private imageIteration: number = 0;

	constructor(config: IPlayerConfig) {
		this.key = config.key;
		this.visable = config.visable;
		this.x = config.x;
		this.y = config.y;
		this.height = config.height;
		this.width = config.width;
		this.zIndex = this.DEFAULT_Z_INDEX;
		this.direction = DirectionEnum.STAND;
		this.image = this.images[this.direction][this.imageIteration]
		this.score = 0;
		this.isFalling = false;
	}

	public move = (direction: DirectionEnum, board: number[][]): PlayerResultEnum => {
		let { x, y, outcome } = this.checkSpace(direction, board);

		this.x = x;
		this.y = y

		return outcome;
	}

	private checkSpace = (direction: DirectionEnum, board: number[][]): any => {
		let x = this.x;
		let y = this.y;
		let outcome = PlayerResultEnum.SAFE
		
		if (this.isFalling && direction !== DirectionEnum.FALL_DOWN) return { x, y, outcome };

		switch (direction) {
			case DirectionEnum.UP:
				y = this.checkUp(x, y, board); break;
			case DirectionEnum.RIGHT:
				return this.checkRight(x, y, board);
			case DirectionEnum.DOWN:
				y = this.checkDown(x, y, board); break;
			case DirectionEnum.LEFT:
				return this.checkLeft(x, y, board);
			case DirectionEnum.FALL_DOWN:
				return this.fall(x, y, board);
		}

		return { x, y, outcome };
	}

	private fall = (x: number, y: number, board: number[][]): any => {
		if (board[y+1][x] >= SpriteTypeEnum.FLOOR1 && board[y+1][x] <= SpriteTypeEnum.LADDER2) {
			this.isFalling = false;
			return { x, y, outcome: PlayerResultEnum.STOP_FALL_TIMER }
		}

		return { x, y: y + 1, outcome: PlayerResultEnum.SAFE }
	}

	private checkUp = (x: number, y: number, board: number[][]): number => y > 1 && board[y - 2][x] === SpriteTypeEnum.LADDER2 ? y - 1 : y;
	private checkDown = (x: number, y: number, board: number[][]): number => y < board.length - 2 && board[y + 1][x] === SpriteTypeEnum.LADDER2 ? y + 1 : y;

	private checkRight = (x: number, y: number, board: number[][]): any => {
		if (x >= board[0].length - 1) return { x, y, outcome: PlayerResultEnum.SAFE };

		const blankSpaceBelow = board[y+1][x] === SpriteTypeEnum.BLANK;
		const ladderSpaceBelow = board[y+1][x] === SpriteTypeEnum.LADDER2;
		this.isFalling = blankSpaceBelow && !ladderSpaceBelow

		const blockBelowRight = board[y+1][x] !== SpriteTypeEnum.BLANK;
		const blockNextToLadder = board[y+1][x+1] !== SpriteTypeEnum.BLANK;
		const canMoveRight = board[y+1][x] === SpriteTypeEnum.LADDER2 ? blockBelowRight && blockNextToLadder : blockBelowRight;
		
		const blockInfront = board[y][x+1] === SpriteTypeEnum.FLOOR1 || board[y][x+1] === SpriteTypeEnum.FLOOR2;

		x = (canMoveRight || this.isFalling) && !blockInfront ? x + 1 : x;
		return { x, y, outcome: this.isFalling ? PlayerResultEnum.START_FALL_TIMER : PlayerResultEnum.SAFE }
	}

	private checkLeft = (x: number, y: number, board: number[][]): any => {
		if (x < 2) return { x, y, outcome: PlayerResultEnum.SAFE };

		const blankSpaceBelow = board[y+1][x-1] === SpriteTypeEnum.BLANK;
		const ladderSpaceBelow = board[y+1][x] === SpriteTypeEnum.LADDER2;
		this.isFalling = blankSpaceBelow && !ladderSpaceBelow

		const blockBelowLeft = board[y+1][x] !== SpriteTypeEnum.BLANK;
		const blockNextToLadder = board[y+1][x-2] !== SpriteTypeEnum.BLANK;
		const canMoveRight = board[y+1][x] === SpriteTypeEnum.LADDER2 ? blockBelowLeft && blockNextToLadder : blockBelowLeft;
		
		const blockInfront = board[y][x-1] === SpriteTypeEnum.FLOOR1 || board[y][x-1] === SpriteTypeEnum.FLOOR2;

		x = (canMoveRight || this.isFalling) && !blockInfront ? x - 1 : x;
		return { x, y, outcome: this.isFalling ? PlayerResultEnum.START_FALL_TIMER : PlayerResultEnum.SAFE }
	}
}
