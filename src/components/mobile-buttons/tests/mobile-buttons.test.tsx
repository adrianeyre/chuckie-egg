import { render } from '@testing-library/react';

import MobileButtons from '../mobile-buttons';
import IMobileButtonsProps from '../interfaces/mobile-buttons-props';

describe('Info Board', () => {
	it('Should render correctly', () => {
		const defaultProps: IMobileButtonsProps = {
			handleMobileButton: jest.fn(),
		};

		const infoBoard = render(<MobileButtons {...defaultProps} />);
		expect(infoBoard).toMatchSnapshot();
	});
});