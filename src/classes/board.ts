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

	private readonly SPRITE_WIDTH: number = 2;
	private readonly SPRITE_HEIGHT: number = 1;
	private readonly PLAYER_WIDTH: number = 2;
	private readonly PLAYER_HEIGHT: number = 2;
	private readonly DEFAULT_TIMER_ADD: number = 5;
	private readonly DEFAULT_TIME_DECREASE: number = 1;

	constructor(config: IBoardProps) {
		this.fileService = new FileService();
		this.board = [[]];
		this.sprites = [];
		this.player = this.setPlayer(1, 1, 1, 1);
		this.eggs = 0;
		this.time = 999;
	}

	public movePlayer = (direction: DirectionEnum): PlayerResultEnum[] => this.handleResult(this.player.move(direction, this.blocksAroundPoint))
	public decreaseTime = (): number => this.time -= this.DEFAULT_TIME_DECREASE;

	private blocksAroundPoint = (x: number, y: number) => ({
		[DirectionEnum.STAND]: this.board[y+1][x],
		[DirectionEnum.UP]: this.board[y-1][x],
		[DirectionEnum.UP_RIGHT]: this.board[y-1][x+1],
		[DirectionEnum.RIGHT]: this.board[y][x+1],
		[DirectionEnum.FLOOR_RIGHT]: this.board[y+1][x+1],
		[DirectionEnum.DOWN_RIGHT]: this.board[y+2][x+1],
		[DirectionEnum.DOWN]: this.board[y+2][x],
		[DirectionEnum.DOWN_LEFT]: this.board[y+2][x-1],
		[DirectionEnum.FLOOR_LEFT]: this.board[y+1][x-1],
		[DirectionEnum.LEFT]: this.board[y][x-1],
		[DirectionEnum.UP_LEFT]: this.board[y-1][x-1],
	})

	private handleResult = (result: PlayerResultEnum[]): PlayerResultEnum[] => {
		console.log('################################################')
		console.log(result);

		if (result.indexOf(PlayerResultEnum.COLLECT_EGG) > -1) this.collectEgg();
		if (result.indexOf(PlayerResultEnum.COLLECT_FOOD) > -1) this.collectFood();

		return result;
	}

	private collectEgg = (): PlayerResultEnum => {
		const sprite = this.sprites.find((s: ISprite) => s.key === `sprite-${ this.player.xPos }-${ this.player.yPos + 1 }`)
		if (!sprite) throw Error(`Egg not found in position x: ${ this.player.xPos }, y: ${ this.player.yPos + 1}`)

		sprite.visable = false;
		this.eggs --;

		this.board[this.player.yPos + 1][this.player.xPos] = SpriteTypeEnum.BLANK;

		if (this.eggs < 1) return PlayerResultEnum.LEVEL_COMPLETE;
		return PlayerResultEnum.SAFE;
	}

	private collectFood = (): PlayerResultEnum => {
		const sprite = this.sprites.find((s: ISprite) => s.key === `sprite-${ this.player.xPos }-${ this.player.yPos + 1 }`)
		if (!sprite) throw Error(`Food not found in position x: ${ this.player.xPos }, y: ${ this.player.yPos + 1 }`)

		sprite.visable = false;
		this.time += this.DEFAULT_TIMER_ADD;

		this.board[this.player.yPos + 1][this.player.xPos] = SpriteTypeEnum.BLANK;

		return PlayerResultEnum.SAFE;
	}

	public readBoard = async (level: number): Promise<void> => {
		this.board = await this.fileService.readLevel(level);
		this.sprites = [];
		let yPos = 0;

		for (let y = 1; y <= this.board.length; y++) {
			let xPos = 0;
			for (let x = 1; x <= this.board[0].length * 2; x += 2) {
				const block = this.board[yPos][xPos];

				if (block === SpriteTypeEnum.EGG) this.eggs ++;
				if (block === SpriteTypeEnum.PLAYER) this.player = this.setPlayer(x, y, xPos, yPos);
				if (block > 1) this.newSprite(x, y, xPos, yPos, block, SpriteTypeEnum.BLANK)
				xPos++;
			}
			yPos ++;
		}
	}

	private setPlayer = (x: number, y: number, xPos: number, yPos: number): IPlayer => new Player({
		key: 'player',
		visable: true,
		x,
		y,
		xPos,
		yPos,
		xOffset: 1,
		height: this.PLAYER_HEIGHT,
		width: this.PLAYER_WIDTH,
	})

	private newSprite = (x: number, y: number, xPos: number, yPos: number, block: number, type: SpriteTypeEnum): number => this.sprites.push(new Sprite({
		key: `sprite-${ xPos }-${ yPos }`,
		visable: true,
		x,
		y,
		xPos,
		yPos,
		xOffset: 2,
		width: this.SPRITE_WIDTH,
		height: this.SPRITE_HEIGHT,
		imageIndex: block,
		type,
	}))
}
