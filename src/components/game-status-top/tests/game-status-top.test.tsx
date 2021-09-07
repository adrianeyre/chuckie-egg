import { shallow } from 'enzyme';

import GameStatusTop from '../game-status-top';
import IGameStatusTopProps from '../interfaces/game-status-top-props';

describe('Game Status Top', () => {
	it('Should render correctly', () => {
		const defaultProps: IGameStatusTopProps = {
			score: 1000,
			level: 1,
			lives: 3,
			time: 0,
		};

		const gameStatus = shallow(<GameStatusTop {...defaultProps} />);
		expect(gameStatus).toMatchSnapshot();
	});
});