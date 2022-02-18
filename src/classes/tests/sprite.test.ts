import SpriteTypeEnum from '../enums/sprite-type-enum';
import Sprite from '../sprite';
import ISpriteProps from '../interfaces/sprite-props';
import ISprite from '../interfaces/sprite';

describe('Sprite', () => {
	let defaultConfig: ISpriteProps
	let sprite: ISprite;

	beforeEach(() => {
		defaultConfig = {
			key: 'sprite',
			visable: true,
			x: 10,
			y: 10,
			xPos: 1,
			yPos: 1,
			height: 1,
			width: 1,
			xOffset: 0,
			imageIndex: 0,
			type: SpriteTypeEnum.BLANK,
		}

		sprite = new Sprite(defaultConfig);
	})

	it('Should create Sprite class', () => {
		expect(sprite.key).toEqual('sprite');
		expect(sprite.visable).toEqual(true);
		expect(sprite.x).toEqual(10);
		expect(sprite.y).toEqual(10);
		expect(sprite.zIndex).toEqual(5000);
		expect(sprite.type).toEqual(SpriteTypeEnum.BLANK);
	});
});