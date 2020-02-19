import ISprite from './sprite';
import IPlayer from './player';
import DirectionEnum from '../enums/direction-enum';
import PlayerResultEnum from '../enums/player-result-enum';

export default interface IBoard {
	sprites: ISprite[];
	player: IPlayer;
	board: number[][];
	movePlayer(direction: DirectionEnum): PlayerResultEnum
}
