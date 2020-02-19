import IBoard from './interfaces/board';
import IBoardProps from './interfaces/board-props';
import ISprite from './interfaces/sprite';
import Sprite from './sprite';
import SpriteTypeEnum from './enums/sprite-type-enum';
import IPlayer from './interfaces/player';
import Player from './player';

import * as level01 from './data/level01';
import DirectionEnum from './enums/direction-enum';
import PlayerResultEnum from './enums/player-result-enum';

export default class Board implements IBoard {
	public sprites: ISprite[];
	public player: IPlayer;
	public board: number[][];

	private readonly SPRITE_WIDTH: number = 1;
	private readonly SPRITE_HEIGHT: number = 1;
	private readonly PLAYER_WIDTH: number = 2;
	private readonly PLAYER_HEIGHT: number = 2;

	constructor(config: IBoardProps) {
		this.board = level01.default;
		this.sprites = [];
		this.player = this.newPlayer();

		this.readBoard();
	}

	public movePlayer = (direction: DirectionEnum): PlayerResultEnum => this.player.move(direction, this.board);

	private newPlayer = (): IPlayer => new Player({
		key: 'player',
		visable: true,
		x: 20,
		y: 17,
		height: this.PLAYER_HEIGHT,
		width: this.PLAYER_WIDTH,
	});

	private readBoard = () => {
		this.sprites = [];

		for (let y = 1; y <= this.board.length; y++) {
			for (let x = 1; x <= this.board[0].length; x++) {
				const block = this.board[y-1][x-1];

				if (block > 0) this.newSprite(x, y, block, SpriteTypeEnum.BLANK)
			}
		}
	}

	private newSprite = (x: number, y: number, block: number, type: SpriteTypeEnum): number => this.sprites.push(new Sprite({
		key: `sprite-${ x }-${ y }`,
		visable: true,
		x,
		y,
		width: this.SPRITE_WIDTH,
		height: this.SPRITE_HEIGHT,
		imageIndex: block,
		type,
	}))
}
