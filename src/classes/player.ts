import IPlayer from './interfaces/player';
import IPlayerConfig from './interfaces/player-config'
import DirectionEnum from './enums/direction-enum';
import PlayerResultEnum from './enums/player-result-enum';
import SpriteTypeEnum from './enums/sprite-type-enum';
import IBlockPosition from './interfaces/block-position';
import IJumpMatrix from './interfaces/jump-matrix';

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
	public xPos: number;
	public yPos: number;
	public height: number;
	public width: number;
	public image: string;
	public xOffset: number;
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
	private images = {
		[DirectionEnum.STAND]: [playerRightStood],
		[DirectionEnum.UP]: [playerUp1, playerUp2, playerUp1, playerUp3],
		[DirectionEnum.UP_RIGHT]: [],
		[DirectionEnum.RIGHT]: [playerRightStood, playerRight],
		[DirectionEnum.DOWN_RIGHT]: [],
		[DirectionEnum.DOWN]: [playerUp1, playerUp2, playerUp1, playerUp3],
		[DirectionEnum.DOWN_LEFT]: [],
		[DirectionEnum.LEFT]: [playerLeftStood, playerLeft],
		[DirectionEnum.UP_LEFT]: [],
		[DirectionEnum.FLOOR_RIGHT]: [],
		[DirectionEnum.FLOOR_LEFT]: [],
		[DirectionEnum.FALL_DOWN]: [playerRightStood],
		[DirectionEnum.JUMP]: [],
	}
	private jumpMatrix: IJumpMatrix = {
		// [DirectionEnum.STAND]: [[0, -1], [0, -1], [0, 1], [0, 1], [0, 0]],
		[DirectionEnum.UP]: [
			{ direction: DirectionEnum.UP, x: 0, y: -1 },
			{ direction: DirectionEnum.UP, x: 0, y: -1 },
			{ direction: DirectionEnum.DOWN, x: 0, y: 1 },
			{ direction: DirectionEnum.DOWN, x: 0, y: 1 },
			{ direction: DirectionEnum.DOWN, x: 0, y: 0 },
		],
		[DirectionEnum.RIGHT]: [
			{ direction: DirectionEnum.UP, x: 0, y: -1 },
			{ direction: DirectionEnum.UP, x: 1, y: -1 },
			{ direction: DirectionEnum.UP, x: 1, y: -1 },
			{ direction: DirectionEnum.DOWN, x: 1, y: 1 },
		],
		[DirectionEnum.LEFT]: [
			{ direction: DirectionEnum.UP, x: -1, y: -1 },
			{ direction: DirectionEnum.UP, x: -1, y: -1 },
			{ direction: DirectionEnum.DOWN, x: -1, y: 1 },
		],
		// [DirectionEnum.FALL_DOWN]: [[0, 0]],
	}

	constructor(config: IPlayerConfig) {
		this.key = config.key;
		this.visable = config.visable;
		this.x = config.x;
		this.y = config.y;
		this.xPos = config.xPos;
		this.yPos = config.yPos;
		this.height = config.height;
		this.width = config.width;
		this.xOffset = config.xOffset;
		this.zIndex = this.DEFAULT_Z_INDEX;
		this.direction = DirectionEnum.STAND;
		this.image = this.images[this.direction][this.imageIteration]
		this.score = 0;
		this.lives = this.DEFAULT_LIVES;
		this.isFalling = false;
		this.isJumping = false;
	}

	public move = (direction: DirectionEnum, blocksAroundPoint: any): PlayerResultEnum[] => {
		if (this.isFalling && direction !== DirectionEnum.FALL_DOWN) return [];

		let x = this.xPos;
		let y = this.yPos;
		const isOnBlock = !Number.isInteger(this.x / 2)
		const result = this.checkIfDirectionValid(direction, x, y, blocksAroundPoint, isOnBlock);

		if (result.validMove) {
			this.direction = direction;
			this.updateValidMove();
			this.updateImage();
		}

		const blocksAroundPlayer = blocksAroundPoint(this.xPos, this.yPos);
		this.checkForEgg(blocksAroundPlayer, direction, isOnBlock, result.outcome);
		this.checkForFood(blocksAroundPlayer, isOnBlock, result.outcome);

		return result.outcome;
	}

	private checkIfDirectionValid = (direction: DirectionEnum, x: number, y: number, blocksAroundPoint: any, isOnBlock: boolean): any => {
		const blocksAroundPlayer = blocksAroundPoint(x, y);
		let result = { validMove: false, outcome: [] }

		switch (direction) {
			case DirectionEnum.UP:
				result = this.checkUp(blocksAroundPlayer, isOnBlock); break;
			case DirectionEnum.RIGHT:
				result = this.checkRight(x, y, blocksAroundPlayer, isOnBlock); break;
			case DirectionEnum.DOWN:
				result = this.checkDown(blocksAroundPlayer, isOnBlock); break;
			case DirectionEnum.LEFT:
				result = this.checkLeft(x, y, blocksAroundPlayer, isOnBlock); break;
			case DirectionEnum.FALL_DOWN:
				result = this.fall(x, y, blocksAroundPlayer); break;
			case DirectionEnum.JUMP:
				result = this.jump(x, y, blocksAroundPoint); break;
		}

		return result;
	}

	private updateValidMove = (): void => {
		switch (this.direction) {
			case DirectionEnum.UP:
				this.y--; break;
			case DirectionEnum.RIGHT:
				this.x++; break;
			case DirectionEnum.DOWN:
			case DirectionEnum.FALL_DOWN:
				this.y++; break;
			case DirectionEnum.LEFT:
				this.x--; break;
		}

		this.xPos = Math.floor(this.x / 2);
		this.yPos = this.y - 1;
	}

	private jump = (x: number, y: number, blocksAroundPoint: any): any => {
		let result = { validMove: false, outcome: this.isJumping ? [] : [PlayerResultEnum.START_JUMP_TIMER] }
		if (this.isFalling) return result;

		const matrix = this.jumpMatrix[this.direction];
		if (!matrix) throw Error(`No jump matrix found for direction id: ${ this.direction }`);

		this.isJumping = true;
		// const isOnBlock = !Number.isInteger(this.x / 2)
		
		if (this.jumpIteration > matrix.length - 1) this.jumpIteration = matrix.length - 1;
		console.log(`this.jumpIteration = ${this.jumpIteration}`)
		const nextMove = matrix[this.jumpIteration];
		const lastMove = nextMove.x === 0 && nextMove.y === 0;

		x += nextMove.x;
		y += nextMove.y;

		console.log(`x: ${x}, y: ${y}`)

		// if (lastMove || this.isBlock(x, y, board)) {//} || this.isLadder(x, y, board)) {
		// 	this.isJumping = false;
		// 	this.jumpIteration = 0;
		// 	console.log('LANDED')
		// 	result.outcome = PlayerResultEnum.STOP_JUMP_TIMER;
		// 	return result
		// }

		// let blockInWay = false
		// switch (this.direction) {
		// 	case DirectionEnum.RIGHT:
		// 		blockInWay = x > board[0].length - 1 || this.blockInFrontToRight(x, y, board); break;
		// 	case DirectionEnum.LEFT:
		// 		blockInWay = x < 1 || this.blockInFrontToLeft(x, y, board); break;
		// }

		// if (blockInWay) {
		// 	console.log('BLOCK IN WAY!!!!!!!!!!!')
		// 	this.resetDirection();
		// 	return this.jump(x, y, board);
		// }

		this.xPos = x;
		this.yPos = y;
		this.x = this.xPos * 2 + 1;
		this.y = this.yPos + 1;

		const blocksAroundPlayer = blocksAroundPoint(x, y);
		const blockBelowWhenGoingDown = nextMove.direction === DirectionEnum.DOWN && blocksAroundPlayer[DirectionEnum.DOWN] === SpriteTypeEnum.FLOOR
		const ladderBelowWhenGoingDown = nextMove.direction === DirectionEnum.DOWN && blocksAroundPlayer[DirectionEnum.DOWN] === SpriteTypeEnum.LADDER

		if (lastMove || blockBelowWhenGoingDown || ladderBelowWhenGoingDown) {
			this.isJumping = false;
			this.jumpIteration = 0;
			result.outcome.push(PlayerResultEnum.STOP_JUMP_TIMER);

			return result
		}

		this.jumpIteration++;

		return result;
	}

	// private resetDirection = () => {
	// 	switch (this.direction) {
	// 		case DirectionEnum.RIGHT:
	// 			this.direction = DirectionEnum.LEFT; break;
	// 		case DirectionEnum.LEFT:
	// 			this.direction = DirectionEnum.RIGHT; break;
	// 	}
	// }

	private updateImage = (): void => {
		this.imageIteration ++;
		if (this.imageIteration > this.images[this.direction].length - 1) this.imageIteration = 0;
		this.image = this.images[this.direction][this.imageIteration]
	}

	private fall = (x: number, y: number, blocksAroundPlayer: any): any => {
		if (blocksAroundPlayer[DirectionEnum.DOWN] >= SpriteTypeEnum.FLOOR && blocksAroundPlayer[DirectionEnum.DOWN] <= SpriteTypeEnum.LADDER) {
			this.isFalling = false;
			return { validMove: false, outcome: [PlayerResultEnum.STOP_FALL_TIMER] }
		}

		return { validMove: true, outcome: [] }
	}

	private checkUp = (blocksAroundPlayer: IBlockPosition, isOnBlock: boolean): any => ({
		validMove: isOnBlock && blocksAroundPlayer[DirectionEnum.UP] === SpriteTypeEnum.LADDER,
		outcome: []
	})

	private checkDown = (blocksAroundPlayer: IBlockPosition, isOnBlock: boolean): any => ({
		validMove: isOnBlock && blocksAroundPlayer[DirectionEnum.DOWN] === SpriteTypeEnum.LADDER,
		outcome: []
	})

	private checkRight = (x: number, y: number, blocksAroundPlayer: IBlockPosition, isOnBlock: boolean): any => {
		let outcome: PlayerResultEnum[] = [];

		if (blocksAroundPlayer[DirectionEnum.RIGHT] === undefined && isOnBlock) return { x, y, outcome};

		const notFloorSpaceBelow = blocksAroundPlayer[DirectionEnum.DOWN] !== SpriteTypeEnum.FLOOR;
		const ladderSpaceBelow = blocksAroundPlayer[DirectionEnum.DOWN] === SpriteTypeEnum.LADDER;
		this.isFalling = !isOnBlock && notFloorSpaceBelow && !ladderSpaceBelow
		console.log(`notFloorSpaceBelow = ${notFloorSpaceBelow}, ladderSpaceBelow = ${ladderSpaceBelow}, isFalling = ${this.isFalling}`)

		const blockBelowNotBlank = blocksAroundPlayer[DirectionEnum.DOWN] !== SpriteTypeEnum.BLANK;
		const blockNextToLadder = blocksAroundPlayer[DirectionEnum.DOWN_RIGHT] === SpriteTypeEnum.FLOOR;
		const canMoveRight = ladderSpaceBelow ? blockBelowNotBlank && blockNextToLadder : blockBelowNotBlank;
		console.log(`blockBelowNotBlank = ${blockBelowNotBlank}, blockNextToLadder = ${blockNextToLadder}, ladderSpaceBelow = ${ladderSpaceBelow}, canMoveRight = ${canMoveRight}`)
		
		const blockInfront = isOnBlock && blocksAroundPlayer[DirectionEnum.FLOOR_RIGHT] === SpriteTypeEnum.FLOOR;
		console.log(`blockInfront = ${blockInfront}`)

		const validMove = (canMoveRight || this.isFalling) && !blockInfront;
		console.log(`validMove = ${validMove}`)
		return { validMove, outcome: this.isFalling ? [PlayerResultEnum.START_FALL_TIMER] : outcome }
	}

	private checkLeft = (x: number, y: number, blocksAroundPlayer: IBlockPosition, isOnBlock: boolean): any => {
		let outcome: PlayerResultEnum[] = [];

		if (blocksAroundPlayer[DirectionEnum.LEFT] === undefined && isOnBlock) return { x, y, outcome};

		const notFloorSpaceBelow = blocksAroundPlayer[DirectionEnum.DOWN_LEFT] !== SpriteTypeEnum.FLOOR;
		const ladderSpaceBelow = isOnBlock && blocksAroundPlayer[DirectionEnum.DOWN] === SpriteTypeEnum.LADDER;
		// this.isFalling = isOnBlock && blankSpaceBelow && !ladderSpaceBelow
		this.isFalling = notFloorSpaceBelow && !ladderSpaceBelow

		const blockBelowNotBlank = blocksAroundPlayer[DirectionEnum.DOWN] !== SpriteTypeEnum.BLANK;
		const blockNextToLadder = blocksAroundPlayer[DirectionEnum.DOWN_LEFT] === SpriteTypeEnum.FLOOR;
		const canMoveRight = ladderSpaceBelow ? blockBelowNotBlank && blockNextToLadder : blockBelowNotBlank;
		
		const blockInfront = isOnBlock && blocksAroundPlayer[DirectionEnum.FLOOR_LEFT] === SpriteTypeEnum.FLOOR;

		const validMove = (canMoveRight || this.isFalling) && !blockInfront
		return { validMove, outcome: this.isFalling ? [PlayerResultEnum.START_FALL_TIMER] : outcome }
	}

	private checkForEgg = (blocksAroundPlayer: IBlockPosition, direction: DirectionEnum, isOnBlock: boolean, outcome: PlayerResultEnum[]): PlayerResultEnum[] => {
		if (
			(direction === DirectionEnum.FALL_DOWN && blocksAroundPlayer[DirectionEnum.STAND] === SpriteTypeEnum.EGG) ||
			(!isOnBlock && blocksAroundPlayer[DirectionEnum.STAND] === SpriteTypeEnum.EGG)
		) {
			this.score += this.DEFAULT_EGG_SCORE;
			outcome.push(PlayerResultEnum.COLLECT_EGG);
		}

		return outcome;
	}

	private checkForFood = (blocksAroundPlayer: IBlockPosition, isOnBlock: boolean, outcome: PlayerResultEnum[]): PlayerResultEnum[] => {
		if (!isOnBlock && blocksAroundPlayer[DirectionEnum.STAND] === SpriteTypeEnum.FOOD) {
			this.score += this.DEFAULT_FOOD_SCORE;
			outcome.push(PlayerResultEnum.COLLECT_FOOD);
		}

		return outcome;
	}
}
