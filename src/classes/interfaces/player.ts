import DirectionEnum from '../enums/direction-enum';
import PlayerResultEnum from '../enums/player-result-enum';

export default interface IPlayer {
	key: string;
	visable: boolean;
	x: number;
	y: number;
	height: number;
	width: number;
	image: string;
	zIndex: number
	direction: DirectionEnum;
	score: number;
	isFalling: boolean;
	isJumping: boolean;
	move(direction: DirectionEnum, board: number[][]): PlayerResultEnum;
	jump(board: number[][]): PlayerResultEnum;
}
