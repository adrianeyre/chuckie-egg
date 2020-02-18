import React from 'react';
import ReactDOM from 'react-dom';
import 'react-app-polyfill/ie11';
import 'react-app-polyfill/stable';

import ChuckieEgg from './components/chuckie-egg/chuckie-egg';

import './index.scss';
import * as serviceWorker from './serviceWorker';

ReactDOM.render(<ChuckieEgg />, document.getElementById('root'));
serviceWorker.unregister();
