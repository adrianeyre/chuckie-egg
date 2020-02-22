import SpriteTypeEnum from '../enums/sprite-type-enum';

export default interface ISpriteProps {
	key: string;
	visable: boolean;
	x: number;
	y: number;
	xPos: number;
	yPos: number;
	width: number;
	height: number;
	xOffset: number;
	imageIndex: number;
	type: SpriteTypeEnum;
}
