import IPlayer from './interfaces/player';
import IPlayerConfig from './interfaces/player-config'
import DirectionEnum from './enums/direction-enum';
import PlayerResultEnum from './enums/player-result-enum';
import SpriteTypeEnum from './enums/sprite-type-enum';

import playerRightStood from '../images/player-right-stood.png';
import playerRight from '../images/player-right.png';
import playerLeftStood from '../images/player-left-stood.png';
import playerLeft from '../images/player-left.png';
import playerUp1 from '../images/player-up-1.png';
import playerUp2 from '../images/player-up-2.png';
import playerUp3 from '../images/player-up-3.png';

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
	public isJumping: boolean;

	private readonly DEFAULT_Z_INDEX: number = 5000;
	private imageIteration: number = 0;
	private jumpIteration: number = 0;
	private images = [
		[],
		[playerUp1, playerUp2, playerUp1, playerUp3],
		[],
		[playerRightStood, playerRight],
		[],
		[playerUp1, playerUp2, playerUp1, playerUp3],
		[],
		[playerLeftStood, playerLeft],
		[],
		[playerRightStood]
	]
	private jumpMatrix = [
		[],
		[[-1, -1], [-1, -1], [1, 1], [1, 1], [0, 0]],
		[],
		[[1, -1], [1, -1], [1, 1]],
		[],
		[],
		[],
		[[-1, -1], [-1, -1], [-1, 1]],
		[],
		[]
	]

	constructor(config: IPlayerConfig) {
		this.key = config.key;
		this.visable = config.visable;
		this.x = config.x;
		this.y = config.y;
		this.height = config.height;
		this.width = config.width;
		this.zIndex = this.DEFAULT_Z_INDEX;
		this.direction = DirectionEnum.RIGHT;
		this.image = this.images[this.direction][this.imageIteration]
		this.score = 0;
		this.isFalling = false;
		this.isJumping = false;
	}

	public move = (direction: DirectionEnum, board: number[][]): PlayerResultEnum => {
		let { x, y, outcome } = this.checkSpace(direction, board);

		this.x = x;
		this.y = y

		this.direction = direction;
		this.updateImage(this.direction)

		return outcome;
	}

	public jump = (board: number[][]): PlayerResultEnum => {
		this.isJumping = true;
		const matrix = this.jumpMatrix[this.direction];
		if (matrix.length < 1) return PlayerResultEnum.SAFE;

		const nextMove = matrix[this.jumpIteration];

		let x = this.x + nextMove[0];
		let y = this.y + nextMove[1];

		if (this.isBlock(x, y, board) || this.isLadder(x, y, board)) {
			this.isJumping = false;
			this.jumpIteration = 0;
			return PlayerResultEnum.STOP_JUMP_TIMER;
		}

		this.x = x;
		this.y = y;

		this.jumpIteration++;
		if (this.jumpIteration > matrix.length - 1) this.jumpIteration = matrix.length - 1;
		return PlayerResultEnum.SAFE;
	}

	private isBlock = (x: number, y: number, board: number[][]): boolean =>
		board[y][x] === SpriteTypeEnum.FLOOR1 ||
		board[y][x] === SpriteTypeEnum.FLOOR2;
	
	private isLadder = (x: number, y: number, board: number[][]): boolean =>
		(this.direction === DirectionEnum.LEFT && board[y][x+1] === SpriteTypeEnum.LADDER2) ||
		(this.direction === DirectionEnum.RIGHT && board[y][x-1] === SpriteTypeEnum.LADDER2);

	private updateImage = (direction: DirectionEnum): void => {
		this.imageIteration ++;
		if (this.imageIteration > this.images[this.direction].length - 1) this.imageIteration = 0;
		this.image = this.images[this.direction][this.imageIteration]
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
