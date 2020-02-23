import ISprite from './sprite';
import IPlayer from './player';
import IHen from './hen';
import DirectionEnum from '../enums/direction-enum';
import PlayerResultEnum from '../enums/player-result-enum';
import IFileService from '../../services/interfaces/file-service';

export default interface IBoard {
	sprites: ISprite[];
	player: IPlayer;
	hens: IHen[];
	board: number[][];
	fileService: IFileService;
	eggs: number;
	time: number;
	readBoard(level: number): Promise<void>;
	movePlayer(direction: DirectionEnum): PlayerResultEnum[];
	decreaseTime(): void;
	moveHens(): PlayerResultEnum[];
}
