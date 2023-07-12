import IHenProps from './interfaces/hen-props';
import IHen from './interfaces/hen';
import DirectionEnum from './enums/direction-enum';
import PlayerResultEnum from './enums/player-result-enum';
import IBlockPosition from './interfaces/block-position';
import SpriteTypeEnum from './enums/sprite-type-enum';

import * as henImagesData from './data/hen-images';

export default class Hen implements IHen {
	public key: string;
	public visable: boolean;
	public x: number;
	public y: number;
	public xPos: number;
	public yPos: number;
	public width: number;
	public height: number;
	public xOffset: number;
	public zIndex: number;
	public image: string;
	public direction: DirectionEnum;

	private readonly Z_INDEX: number = 5000;
	private readonly images = henImagesData.default as any;
	private imageIteration: number = 0;
	private originalWidth: number = 1;

	constructor(config: IHenProps) {
		this.key = config.key;
		this.visable = config.visable;
		this.x = config.x;
		this.y = config.y;
		this.xPos = config.xPos;
		this.yPos = config.yPos;
		this.width = config.width;
		this.height = config.height;
		this.originalWidth = config.width
		this.xOffset = config.xOffset;
		this.zIndex = this.Z_INDEX;
		this.direction = DirectionEnum.RIGHT;
		this.image = this.images[this.direction][this.imageIteration];
	}

	public move = (blocksAroundPoint: any): PlayerResultEnum[] => {
		let x = this.xPos;
		let y = this.yPos;
		const isOnBlock = !Number.isInteger(this.x / 2)
		const blocksAroundHen = blocksAroundPoint(x, y);
		const result = this.checkIfDirectionValid(x, y, blocksAroundHen, isOnBlock);

		if (result.indexOf(PlayerResultEnum.SAFE) > -1) this.updateValidMove();
		if (result.indexOf(PlayerResultEnum.HEN_COULD_CHANGING_DIRECTION) > -1) this.randomChangeDirection(blocksAroundHen);
		if (result.indexOf(PlayerResultEnum.HEN_CHANGING_DIRECTION) > -1) this.updateDirection(blocksAroundHen);
		if (this.direction === DirectionEnum.RIGHT && result.indexOf(PlayerResultEnum.HEN_EATING) > -1) this.setEatRight();
		if (this.direction === DirectionEnum.LEFT && result.indexOf(PlayerResultEnum.HEN_EATING) > -1) this.setEatLeft();
		if (this.direction === DirectionEnum.EATING_RIGHT || this.direction === DirectionEnum.EATING_LEFT) result.push(this.eatFood());

		return result;
	}

	private eatFood = (): PlayerResultEnum => {
		this.updateImage();
		if (this.direction === DirectionEnum.EATING_RIGHT && this.imageIteration === 1) return PlayerResultEnum.COLLECT_FOOD;
		if (this.direction === DirectionEnum.EATING_LEFT && this.imageIteration === 1) return PlayerResultEnum.COLLECT_FOOD;
		
		if (this.direction === DirectionEnum.EATING_RIGHT && this.imageIteration === this.images[this.direction].length - 1) this.direction = DirectionEnum.RIGHT;
		if (this.direction === DirectionEnum.EATING_LEFT && this.imageIteration === this.images[this.direction].length - 1) this.direction = DirectionEnum.LEFT;

		return PlayerResultEnum.SAFE;
	}

	private setEatRight = (): void => {
		this.imageIteration = -1;
		this.width = this.originalWidth * 2;
		this.direction = DirectionEnum.EATING_RIGHT;
	}

	private setEatLeft = (): void => {
		this.imageIteration = -1;
		this.width = this.originalWidth * 2;
		this.x --;
		this.xPos = Math.floor(this.x / 2);
		this.direction = DirectionEnum.EATING_LEFT;
	}

	private randomChangeDirection = (blocksAroundHen: IBlockPosition): void => {
		const changeDirection = Math.floor(Math.random() * 100) > 50;

		if (changeDirection) return this.updateDirection(blocksAroundHen);

		this.updateValidMove();
	}

	private updateDirection = (blocksAroundHen: IBlockPosition): void => {
		this.direction = this.randomAvailableDirection(blocksAroundHen);
		this.updateValidMove();
	}

	private updateValidMove = (): void => {
		switch (this.direction) {
			case DirectionEnum.UP:
				this.y --; break;
			case DirectionEnum.RIGHT:
				this.x ++; break;
			case DirectionEnum.DOWN:
				this.y ++; break;
			case DirectionEnum.LEFT:
				this.x --; break;
		}

		this.width = this.originalWidth
		this.xPos = Math.floor(this.x / 2);
		this.yPos = this.y - 1;
		this.updateImage();
	}

	private checkIfDirectionValid = (x: number, y: number, blocksAroundHen: IBlockPosition, isOnBlock: boolean): any => {
		let result: PlayerResultEnum[] = [];

		switch (this.direction) {
			case DirectionEnum.UP:
				result.push(this.checkUp(y, blocksAroundHen, isOnBlock)); break;
			case DirectionEnum.RIGHT:
				result.push(this.checkRight(blocksAroundHen, isOnBlock)); break;
			case DirectionEnum.DOWN:
				result.push(this.checkDown(blocksAroundHen, isOnBlock)); break;
			case DirectionEnum.LEFT:
				result.push(this.checkLeft(x, blocksAroundHen, isOnBlock)); break;
		}

		return result;
	}

	private checkUp = (y: number, blocksAroundHen: IBlockPosition, isOnBlock: boolean): PlayerResultEnum => {
		if (
			y < 0 ||
			(isOnBlock && blocksAroundHen[DirectionEnum.UP] === SpriteTypeEnum.BLANK) ||
			(isOnBlock && blocksAroundHen[DirectionEnum.UP] === SpriteTypeEnum.FLOOR) ||
			blocksAroundHen[DirectionEnum.FLOOR_RIGHT] === SpriteTypeEnum.FLOOR ||
			blocksAroundHen[DirectionEnum.FLOOR_LEFT] === SpriteTypeEnum.FLOOR
		) {
			return PlayerResultEnum.HEN_CHANGING_DIRECTION;
		}

		return PlayerResultEnum.SAFE
	}

	private checkDown = (blocksAroundHen: IBlockPosition, isOnBlock: boolean): PlayerResultEnum => {
		if (
			blocksAroundHen[DirectionEnum.DOWN] === undefined ||
			blocksAroundHen[DirectionEnum.DOWN] === SpriteTypeEnum.BLANK ||
			blocksAroundHen[DirectionEnum.DOWN] === SpriteTypeEnum.FLOOR ||
			blocksAroundHen[DirectionEnum.DOWN_RIGHT] === SpriteTypeEnum.FLOOR ||
			blocksAroundHen[DirectionEnum.DOWN_LEFT] === SpriteTypeEnum.FLOOR
		) {
			return PlayerResultEnum.HEN_CHANGING_DIRECTION;
		}

		return PlayerResultEnum.SAFE
	}

	private checkRight = (blocksAroundHen: IBlockPosition, isOnBlock: boolean): PlayerResultEnum => {
		if (isOnBlock && blocksAroundHen[DirectionEnum.FLOOR_RIGHT] === SpriteTypeEnum.FOOD) return PlayerResultEnum.HEN_EATING;

		if (
			(isOnBlock && blocksAroundHen[DirectionEnum.RIGHT] === undefined) ||
			(isOnBlock && blocksAroundHen[DirectionEnum.DOWN_RIGHT] === SpriteTypeEnum.BLANK) ||
			(isOnBlock && blocksAroundHen[DirectionEnum.FLOOR_RIGHT] === SpriteTypeEnum.FLOOR)
		) {
			return PlayerResultEnum.HEN_CHANGING_DIRECTION;
		}

		if (
			(isOnBlock && blocksAroundHen[DirectionEnum.UP] === SpriteTypeEnum.LADDER) ||
			(isOnBlock && blocksAroundHen[DirectionEnum.DOWN] === SpriteTypeEnum.LADDER)
		) {
			return PlayerResultEnum.HEN_COULD_CHANGING_DIRECTION;
		}

		return PlayerResultEnum.SAFE
	}

	private checkLeft = (x: number, blocksAroundHen: IBlockPosition, isOnBlock: boolean): PlayerResultEnum => {
		if (isOnBlock && blocksAroundHen[DirectionEnum.FLOOR_LEFT] === SpriteTypeEnum.FOOD) return PlayerResultEnum.HEN_EATING;

		if (
			x < 1 ||
			(isOnBlock && blocksAroundHen[DirectionEnum.DOWN_LEFT] === SpriteTypeEnum.BLANK) ||
			(isOnBlock && blocksAroundHen[DirectionEnum.FLOOR_LEFT] === SpriteTypeEnum.FLOOR)
		) {
			return PlayerResultEnum.HEN_CHANGING_DIRECTION;
		}

		if (
			(isOnBlock && blocksAroundHen[DirectionEnum.UP] === SpriteTypeEnum.LADDER) ||
			(isOnBlock && blocksAroundHen[DirectionEnum.DOWN] === SpriteTypeEnum.LADDER)
		) {
			return PlayerResultEnum.HEN_COULD_CHANGING_DIRECTION;
		}

		return PlayerResultEnum.SAFE
	}

	private updateImage = (): void => {
		this.imageIteration ++;
		if (this.imageIteration > this.images[this.direction].length - 1) this.imageIteration = 0;

		this.image = this.images[this.direction][this.imageIteration];
	}

	private randomAvailableDirection = (blocksAroundHen: IBlockPosition): DirectionEnum => {
		const availableDirections: DirectionEnum[] = [];

		if (this.direction !== DirectionEnum.DOWN && blocksAroundHen[DirectionEnum.UP] === SpriteTypeEnum.LADDER) availableDirections.push(DirectionEnum.UP);
		if (this.direction !== DirectionEnum.RIGHT && blocksAroundHen[DirectionEnum.DOWN_RIGHT] === SpriteTypeEnum.FLOOR) availableDirections.push(DirectionEnum.RIGHT);
		if (this.direction !== DirectionEnum.UP && blocksAroundHen[DirectionEnum.DOWN] === SpriteTypeEnum.LADDER) availableDirections.push(DirectionEnum.DOWN);
		if (this.direction !== DirectionEnum.LEFT && blocksAroundHen[DirectionEnum.DOWN_LEFT] === SpriteTypeEnum.FLOOR) availableDirections.push(DirectionEnum.LEFT);

		if (availableDirections.length < 1) {
			switch (this.direction) {
				case DirectionEnum.UP:
					availableDirections.push(DirectionEnum.DOWN); break;
				case DirectionEnum.RIGHT:
					availableDirections.push(DirectionEnum.LEFT); break;
				case DirectionEnum.DOWN:
					availableDirections.push(DirectionEnum.UP); break;
				case DirectionEnum.LEFT:
					availableDirections.push(DirectionEnum.RIGHT); break;
			}
		}

		return availableDirections[Math.floor(Math.random() * availableDirections.length)];
	}
}
