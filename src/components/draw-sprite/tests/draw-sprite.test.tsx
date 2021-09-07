import { shallow } from 'enzyme';

import DrawSprite from '../draw-sprite';
import IDrawSpriteProps from '../interfaces/draw-sprite-props';
import Player from '../../../classes/player';

describe('Draw Sprite', () => {
	it('Should render correctly', () => {
		const defaultProps: IDrawSpriteProps = {
			sprite: new Player({
				key: 'key',
				visable: true,
				x: 1,
				y: 1,
				xPos: 1,
				yPos: 1,
				height: 1,
				width: 1,
				xOffset: 1,
			}),
			height: 1,
			width: 1,
			containerWidth: 1,
			onClick: jest.fn(),
		};

		const drawFish = shallow(<DrawSprite {...defaultProps} />);
		expect(drawFish).toMatchSnapshot();
	});
});