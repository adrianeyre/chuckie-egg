import { render } from '@testing-library/react';

import InfoBoard from '../info-board';
import IInfoBoardProps from '../interfaces/info-board-props';

describe('Info Board', () => {
	it('Should render correctly', () => {
		const defaultProps: IInfoBoardProps = {
			containerHeight: 1000,
			startGame: jest.fn(),
		};

		const infoBoard = render(<InfoBoard {...defaultProps} />);
		expect(infoBoard).toMatchSnapshot();
	});
});