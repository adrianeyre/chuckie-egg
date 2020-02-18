import SpriteTypeEnum from '../enums/sprite-type-enum';

export default interface ISprite {
	key: string;
	visable: boolean;
	x: number;
	y: number;
	width: number;
	height: number;
	zIndex: number
	image: string;
	type: SpriteTypeEnum;
	updateImage(image: string): string;
	updateType(type: SpriteTypeEnum): SpriteTypeEnum;
}
