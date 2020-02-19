import IBoard from './interfaces/board';
import IBoardProps from './interfaces/board-props';
import ISprite from './interfaces/sprite';
import Sprite from './sprite';
import SpriteTypeEnum from './enums/sprite-type-enum';
import IPlayer from './interfaces/player';
import Player from './player';
import IFileService from '../services/interfaces/file-service';
import FileService from '../services/file-service';
import DirectionEnum from './enums/direction-enum';
import PlayerResultEnum from './enums/player-result-enum';

export default class Board implements IBoard {
	public sprites: ISprite[];
	public player: IPlayer;
	public board: number[][];
	public fileService: IFileService;
	public eggs: number;
	public time: number;

	private readonly SPRITE_WIDTH: number = 1;
	private readonly SPRITE_HEIGHT: number = 1;
	private readonly PLAYER_WIDTH: number = 2;
	private readonly PLAYER_HEIGHT: number = 2;
	private readonly DEFAULT_TIMER_ADD: number = 5;
	private readonly DEFAULT_TIME_DECREASE: number = 1;

	constructor(config: IBoardProps) {
		this.fileService = new FileService();
		this.board = [[]];
		this.sprites = [];
		this.player = this.newPlayer();
		this.eggs = 0;
		this.time = 999;
	}

	public movePlayer = (direction: DirectionEnum): PlayerResultEnum => {
		const result = this.player.move(direction, this.board);
		if (result === PlayerResultEnum.COLLECT_EGG) this.collectEgg();
		if (result === PlayerResultEnum.COLLECT_FOOD) this.collectFood();

		return result;
	}

	public jump = (): PlayerResultEnum => this.player.jump(this.board);
	public decreaseTime = (): number => this.time -= this.DEFAULT_TIME_DECREASE;

	private collectEgg = (): PlayerResultEnum => {
		const sprite = this.sprites.find((s: ISprite) => s.key === `sprite-${ this.player.x + 1 }-${ this.player.y + 1 }`)
		if (!sprite) return PlayerResultEnum.SAFE;

		sprite.visable = false;
		this.eggs --;

		if (this.eggs < 1) return PlayerResultEnum.LEVEL_COMPLETE;
		return PlayerResultEnum.SAFE;
	}

	private collectFood = (): PlayerResultEnum => {
		const sprite = this.sprites.find((s: ISprite) => s.key === `sprite-${ this.player.x + 1 }-${ this.player.y + 1 }`)
		console.log(sprite)
		if (!sprite) return PlayerResultEnum.SAFE;

		sprite.visable = false;
		this.time += this.DEFAULT_TIMER_ADD;
		return PlayerResultEnum.SAFE;
	}

	private newPlayer = (): IPlayer => new Player({
		key: 'player',
		visable: true,
		x: 20,
		y: 18,
		height: this.PLAYER_HEIGHT,
		width: this.PLAYER_WIDTH,
	});

	public readBoard = async (level: number): Promise<void> => {
		this.board = await this.fileService.readLevel(level);
		this.sprites = [];

		for (let y = 1; y <= this.board.length; y++) {
			for (let x = 1; x <= this.board[0].length; x++) {
				const block = this.board[y-1][x-1];

				if (block === SpriteTypeEnum.EGG) this.eggs ++;
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
