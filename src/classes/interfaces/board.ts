import ISprite from './sprite';
import IPlayer from './player';
import DirectionEnum from '../enums/direction-enum';
import PlayerResultEnum from '../enums/player-result-enum';
import IFileService from '../../services/interfaces/file-service';

export default interface IBoard {
	sprites: ISprite[];
	player: IPlayer;
	board: number[][];
	fileService: IFileService;
	readBoard(level: number): Promise<void>;
	movePlayer(direction: DirectionEnum): PlayerResultEnum;
	jump(): PlayerResultEnum;
}
