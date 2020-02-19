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
	public lives: number;
	public isFalling: boolean;
	public isJumping: boolean;

	private readonly DEFAULT_Z_INDEX: number = 5000;
	private readonly DEFAULT_LIVES: number = 3;
	private readonly DEFAULT_EGG_SCORE: number = 20;
	private readonly DEFAULT_FOOD_SCORE: number = 10;
	private imageIteration: number = 0;
	private jumpIteration: number = 0;
	private images = [
		[playerRightStood],
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
		[[0, -1], [0, -1], [0, 1], [0, 1], [0, 0]],
		[[0, -1], [0, -1], [0, 1], [0, 1], [0, 0]],
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
		this.direction = DirectionEnum.STAND;
		this.image = this.images[this.direction][this.imageIteration]
		this.score = 0;
		this.lives = this.DEFAULT_LIVES;
		this.isFalling = false;
		this.isJumping = false;
	}

	public move = (direction: DirectionEnum, board: number[][]): PlayerResultEnum => {
		if (this.isJumping) return PlayerResultEnum.SAFE;

		let { x, y, outcome } = this.checkSpace(direction, board);

		this.x = x;
		this.y = y

		this.direction = direction;
		this.updateImage(this.direction)

		return outcome;
	}

	public jump = (board: number[][]): PlayerResultEnum => {
		let outcome = PlayerResultEnum.SAFE
		if (this.isFalling) return outcome;

		this.isJumping = true;
		const matrix = this.jumpMatrix[this.direction];
		if (matrix.length < 1) return outcome;

		const nextMove = matrix[this.jumpIteration];

		let x = this.x + nextMove[0];
		let y = this.y + nextMove[1];
		const lastMove = nextMove[0] === 0 && nextMove[1] === 0;

		if (lastMove || this.isBlock(x, y, board) || this.isLadder(x, y, board)) {
			this.isJumping = false;
			this.jumpIteration = 0;
			return PlayerResultEnum.STOP_JUMP_TIMER;
		}

		let blockInWay = false
		switch (this.direction) {
			case DirectionEnum.RIGHT:
				blockInWay = x > board[0].length - 1 || this.blockInFrontToRight(x, y, board); break;
			case DirectionEnum.LEFT:
				blockInWay = x < 1 || this.blockInFrontToLeft(x, y, board); break;
		}

		if (blockInWay) {
			this.resetDirection();
			return this.jump(board);
		}

		this.x = x;
		this.y = y;

		this.jumpIteration++;
		if (this.jumpIteration > matrix.length - 1) this.jumpIteration = matrix.length - 1;

		if (this.isEgg(x + 1, y, board)) outcome = this.collectEgg(x + 1, y, board);
		if (this.isFood(x + 1, y, board)) outcome = this.collectFood(x + 1, y, board);

		return outcome;
	}

	private resetDirection = () => {
		switch (this.direction) {
			case DirectionEnum.RIGHT:
				this.direction = DirectionEnum.LEFT; break;
			case DirectionEnum.LEFT:
				this.direction = DirectionEnum.RIGHT; break;
		}
	}

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

	private checkRight = (x: number, y: number, board: number[][]): any => {
		let outcome = PlayerResultEnum.SAFE;
		if (x >= board[0].length - 1) return { x, y, outcome};

		const blankSpaceBelow = this.blankSpaceBelowRight(x, y, board);
		const ladderSpaceBelow = this.ladderSpaceBelow(x, y, board);
		this.isFalling = blankSpaceBelow && !ladderSpaceBelow

		const blockBelowNotBlank = this.blockBelowNotBlank(x, y, board);
		const blockNextToLadder = this.blockNextToLadderRight(x, y, board);
		const canMoveRight = ladderSpaceBelow ? blockBelowNotBlank && blockNextToLadder : blockBelowNotBlank;
		
		const blockInfront = this.blockInFrontToRight(x, y, board);

		if (this.isEgg(x + 1, y, board)) outcome = this.collectEgg(x + 1, y, board);
		if (this.isFood(x + 1, y, board)) outcome = this.collectFood(x + 1, y, board);

		x = (canMoveRight || this.isFalling) && !blockInfront ? x + 1 : x;
		return { x, y, outcome: this.isFalling ? PlayerResultEnum.START_FALL_TIMER : outcome }
	}

	private checkLeft = (x: number, y: number, board: number[][]): any => {
		let outcome = PlayerResultEnum.SAFE;
		if (x < 2) return { x, y, outcome };

		const blankSpaceBelow = this.blankSpaceBelowLeft(x, y, board)
		const ladderSpaceBelow = this.ladderSpaceBelow(x, y, board);
		this.isFalling = blankSpaceBelow && !ladderSpaceBelow

		const blockBelowNotBlank = this.blockBelowNotBlank(x, y, board);
		const blockNextToLadder = this.blockNextToLadderLeft(x, y, board);
		const canMoveRight = ladderSpaceBelow ? blockBelowNotBlank && blockNextToLadder : blockBelowNotBlank;
		
		const blockInfront = this.blockInFrontToLeft(x, y, board);

		if (this.isEgg(x - 1, y, board)) outcome = this.collectEgg(x - 1, y, board);
		if (this.isFood(x - 1, y, board)) outcome = this.collectFood(x - 1, y, board);

		x = (canMoveRight || this.isFalling) && !blockInfront ? x - 1 : x;
		return { x, y, outcome: this.isFalling ? PlayerResultEnum.START_FALL_TIMER : outcome }
	}

	private isBlock = (x: number, y: number, board: number[][]): boolean =>
		board[y][x - 1] === SpriteTypeEnum.FLOOR1 ||
		board[y][x - 1] === SpriteTypeEnum.FLOOR2;
	
	private isLadder = (x: number, y: number, board: number[][]): boolean =>
		(this.direction === DirectionEnum.LEFT && board[y][x+1] === SpriteTypeEnum.LADDER2) ||
		(this.direction === DirectionEnum.RIGHT && board[y][x-1] === SpriteTypeEnum.LADDER2);

	private checkUp = (x: number, y: number, board: number[][]): number => y > 1 && board[y - 2][x] === SpriteTypeEnum.LADDER2 ? y - 1 : y;
	private checkDown = (x: number, y: number, board: number[][]): number => y < board.length - 2 && board[y + 1][x] === SpriteTypeEnum.LADDER2 ? y + 1 : y;
	private blockNextToLadderLeft = (x: number, y: number, board: number[][]): boolean => board[y+1][x-2] !== SpriteTypeEnum.BLANK;
	private blockNextToLadderRight = (x: number, y: number, board: number[][]): boolean => board[y+1][x+1] !== SpriteTypeEnum.BLANK;
	private blockBelowNotBlank = (x: number, y: number, board: number[][]): boolean => board[y+1][x] !== SpriteTypeEnum.BLANK;
	private ladderSpaceBelow = (x: number, y: number, board: number[][]): boolean => board[y+1][x] === SpriteTypeEnum.LADDER2;
	private blankSpaceBelowLeft = (x: number, y: number, board: number[][]): boolean => board[y+1][x-1] === SpriteTypeEnum.BLANK;
	private blankSpaceBelowRight = (x: number, y: number, board: number[][]): boolean => board[y+1][x] === SpriteTypeEnum.BLANK;
	private blockInFrontToLeft = (x: number, y: number, board: number[][]): boolean => board[y][x-1] === SpriteTypeEnum.FLOOR1 || board[y][x-1] === SpriteTypeEnum.FLOOR2;
	private blockInFrontToRight = (x: number, y: number, board: number[][]): boolean => board[y][x+1] === SpriteTypeEnum.FLOOR1 || board[y][x+1] === SpriteTypeEnum.FLOOR2;
	private isEgg = (x: number, y: number, board: number[][]): boolean => board[y][x] === SpriteTypeEnum.EGG;
	private isFood = (x: number, y: number, board: number[][]): boolean => board[y][x] === SpriteTypeEnum.FOOD;

	private collectEgg = (x: number, y: number, board: number[][]): PlayerResultEnum => {
		board[y][x] = SpriteTypeEnum.BLANK;
		this.score += this.DEFAULT_EGG_SCORE;
		return PlayerResultEnum.COLLECT_EGG;
	}

	private collectFood = (x: number, y: number, board: number[][]): PlayerResultEnum => {
		board[y][x] = SpriteTypeEnum.BLANK;
		this.score += this.DEFAULT_FOOD_SCORE;
		return PlayerResultEnum.COLLECT_FOOD;
	}
}
