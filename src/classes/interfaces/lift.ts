import PlayerResultEnum from '../enums/player-result-enum';

export default interface ILift {
	key: string;
	visable: boolean;
	x: number;
	y: number;
	xPos: number;
	yPos: number;
	width: number;
	height: number;
	xOffset: number;
	zIndex: number;
	image: string;
	move(playerX: number, playerY: number, boardHeight: number): PlayerResultEnum[];
}
