import ISpriteProps from './interfaces/sprite-props';
import ISprite from './interfaces/sprite';
import SpriteTypeEnum from './enums/sprite-type-enum';

import block00 from '../images/block00.png';
import block01 from '../images/block01.png';
import block02 from '../images/block02.png';
import block03 from '../images/block03.png';
import block04 from '../images/block04.png';
import block05 from '../images/block05.png';
import block06 from '../images/block06.png';

export default class Sprite implements ISprite {
	public key: string;
	public visable: boolean;
	public x: number;
	public y: number;
	public width: number;
	public height: number;
	public zIndex: number;
	public image: string;
	public type: SpriteTypeEnum;

	private readonly Z_INDEX: number = 5000;
	private readonly images = [
		block00, block01, block02, block03, block04, block05,
		block06,
	]

	constructor(config: ISpriteProps) {
		this.key = config.key;
		this.visable = config.visable;
		this.x = config.x;
		this.y = config.y;
		this.width = config.width;
		this.height = config.height;
		this.zIndex = this.Z_INDEX;
		this.image = this.images[config.imageIndex];
		this.type = config.type;
	}

	public updateImage = (image: string): string => this.image = this.images[image];
	public updateType = (type: SpriteTypeEnum): SpriteTypeEnum => this.type = type;
}
