import IBoard from './interfaces/board';
import IBoardProps from './interfaces/board-props';
import ISprite from './interfaces/sprite';
import Sprite from './sprite';
import SpriteTypeEnum from './enums/sprite-type-enum';

import * as level01 from './data/level01';

export default class Board implements IBoard {
	public sprites: ISprite[];

	constructor(config: IBoardProps) {
		this.sprites = [];

		this.readBoard();
	}


	private readBoard = () => {
		this.sprites = [];

		const level = level01.default;

		for (let y = 1; y <= level.length; y++) {
			for (let x = 1; x <= level[0].length; x++) {
				this.sprites.push(new Sprite({
					key: `block-${ x }-${ y }`,
					visable: true,
					x,
					y,
					width: 1,
					height: 1,
					imageIndex: level[y-1][x-1],
					type: SpriteTypeEnum.BLANK
				}));
			}
		}
	}
}
