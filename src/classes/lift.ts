import ILiftProps from './interfaces/lift-props';
import ILift from './interfaces/lift';
import PlayerResultEnum from './enums/player-result-enum';

import block04 from '../images/block04.png';

export default class Lift implements ILift {
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

	private readonly Z_INDEX: number = 5000;

	constructor(config: ILiftProps) {
		this.key = config.key;
		this.visable = config.visable;
		this.x = config.x;
		this.y = config.y;
		this.xPos = config.xPos;
		this.yPos = config.yPos;
		this.width = config.width;
		this.height = config.height;
		this.xOffset = config.xOffset;
		this.zIndex = this.Z_INDEX;
		this.image = block04;
	}

	public move = (playerX: number, playerY: number, boardHeight: number): PlayerResultEnum[] => {
		const result = [PlayerResultEnum.SAFE];

		if (
			this.xPos >= playerX &&
			this.xPos <= playerX + (this.width / 2) &&
			this.yPos - 2 === playerY
		) result.push(PlayerResultEnum.LIFT_MOVE_PLAYER)

		this.y --;
		if (this.y < 0) this.y = boardHeight;

		this.yPos = this.y - 1;

		return result;
	}
}
