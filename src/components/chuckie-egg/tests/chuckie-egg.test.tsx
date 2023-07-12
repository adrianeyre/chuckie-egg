import { render } from '@testing-library/react';

import ChuckieEgg from '../chuckie-egg';
import IChuckieEggProps from '../interfaces/chuckie-egg-props';

describe('Battle Ships', () => {
	it('Should render correctly', () => {
		const defaultProps: IChuckieEggProps = {};
		const chuckieEgg = render(<ChuckieEgg {...defaultProps} />);
		expect(chuckieEgg).toMatchSnapshot();
	});
});