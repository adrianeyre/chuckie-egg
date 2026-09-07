import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import ChuckieEgg from './components/chuckie-egg/chuckie-egg';

import './index.scss';

// `ReactDOM.render` was removed in React 19; `createRoot` is the replacement.
// The Create React App polyfills that used to be imported here went with it —
// the build now targets ES2022, which no version of IE ever reached.
const container = document.getElementById('root');

if (!container) throw new Error('Cannot start Chuckie Egg: no #root element in the document.');

createRoot(container).render(
	<StrictMode>
		<ChuckieEgg />
	</StrictMode>,
);
