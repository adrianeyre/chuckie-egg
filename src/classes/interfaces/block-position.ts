import DirectionEnum from '../enums/direction-enum';
import SpriteTypeEnum from '../enums/sprite-type-enum';

export default interface IBlockPosition {
	[DirectionEnum.STAND]: SpriteTypeEnum;
	[DirectionEnum.UP]: SpriteTypeEnum;
	[DirectionEnum.UP_RIGHT]: SpriteTypeEnum;
	[DirectionEnum.RIGHT]: SpriteTypeEnum;
	[DirectionEnum.DOWN_RIGHT]: SpriteTypeEnum;
	[DirectionEnum.DOWN]: SpriteTypeEnum;
	[DirectionEnum.DOWN_LEFT]: SpriteTypeEnum;
	[DirectionEnum.LEFT]: SpriteTypeEnum;
	[DirectionEnum.UP_LEFT]: SpriteTypeEnum;
	[DirectionEnum.FLOOR_RIGHT]: SpriteTypeEnum;
	[DirectionEnum.FLOOR_LEFT]: SpriteTypeEnum;
}