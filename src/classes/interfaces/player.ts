import DirectionEnum from '../enums/direction-enum';
import PlayerResultEnum from '../enums/player-result-enum';

export default interface IPlayer {
	key: string;
	visable: boolean;
	x: number;
	y: number;
	xPos: number;
	yPos: number;
	height: number;
	width: number;
	xOffset: number;
	image: string;
	zIndex: number
	direction: DirectionEnum;
	score: number;
	lives: number;
	isFalling: boolean;
	isJumping: boolean;
	move(direction: DirectionEnum, blocksAroundPoint: any): PlayerResultEnum[];
	setStart(x: number, y: number, xPos: number, yPos: number): void;
}
