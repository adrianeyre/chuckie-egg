import PlayerResultEnum from '../enums/player-result-enum';
import IBoard from './board';

export default interface IGame {
	isGameInPlay: boolean;
	board: IBoard;
	timer: any;
	handleInput(playerResult: PlayerResultEnum, key?: string): PlayerResultEnum;
	handleFallTimer(): PlayerResultEnum;
}
