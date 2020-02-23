import DirectionEnum from '../enums/direction-enum';
import PlayerResultEnum from '../enums/player-result-enum';

export default interface IHen {
	key: string;
	visable: boolean;
	x: number;
	y: number;
	xPos: number;
	yPos: number;
	width: number;
	height: number;
	xOffset: number;
	zIndex: number
	image: string;
	direction: DirectionEnum;
	move(blocksAroundPoint: any): PlayerResultEnum[];
}
