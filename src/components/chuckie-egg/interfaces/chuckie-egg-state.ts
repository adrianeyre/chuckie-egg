import IGame from '../../../classes/interfaces/game';

export default interface IChuckieEggState {
	game?: IGame;
	spriteWidth: number;
	spriteHeight: number;
	containerWidth: number
	containerHeight: number;
	containerMargin: number;
	fallTimer?: any;
	fallTimerInterval: number;
	jumpTimer?: any;
	jumpTimerInterval: number;
}
