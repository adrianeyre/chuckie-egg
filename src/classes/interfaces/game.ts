import PlayerResultEnum from '../enums/player-result-enum';
import IBoard from './board';

export default interface IGame {
	isGameInPlay: boolean;
	board: IBoard;
	timer: any;
	level: number;
	handleInput(playerResult: PlayerResultEnum): PlayerResultEnum[];
	handleTimer(): void;
	handleFallTimer(): PlayerResultEnum[];
	handleJumpTimer(): PlayerResultEnum[];
}
