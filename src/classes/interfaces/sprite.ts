import SpriteTypeEnum from '../enums/sprite-type-enum';

export default interface ISprite {
	key: string;
	visable: boolean;
	x: number;
	y: number;
	xPos: number;
	yPos: number;
	width: number;
	height: number;
	xOffset: number;
	zIndex: number
	image: string;
	type: SpriteTypeEnum;
}
