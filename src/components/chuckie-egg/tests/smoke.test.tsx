import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import ChuckieEgg from '../chuckie-egg';

describe('smoke', () => {
	it('boots a game when Play Game is pressed', async () => {
		render(<ChuckieEgg />);
		await userEvent.click(screen.getByRole('button', { name: 'Play Game' }));
		await waitFor(() => expect(screen.getByText('SCORE')).toBeInTheDocument());
		expect(screen.getAllByAltText('sprite').length).toBeGreaterThan(0);
	});
});
