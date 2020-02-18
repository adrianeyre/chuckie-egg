import IGame from './interfaces/game';
import PlayerResultEnum from './enums/player-result-enum';
import IChuckieEggProps from '../components/chuckie-egg/interfaces/chuckie-egg-props';
import IBoard from './interfaces/board';
import Board from './board';

export default class Game implements IGame {
	public timer: any
	public board: IBoard;
	public isGameInPlay: boolean;
	
	constructor(config: IChuckieEggProps) {
		this.board = new Board({});
		this.isGameInPlay = false;
	}

	public handleInput = (playerResult: PlayerResultEnum, key?: string): void => {
		switch (playerResult) {
			
		}
	}

	public handleTimer = (): void => {};
}
