import React from 'react';
import ReactDOM from 'react-dom';
import 'react-app-polyfill/ie11';
import 'react-app-polyfill/stable';

import ChuckieEgg from './components/chuckie-egg/chuckie-egg';

import './index.scss';
import reportWebVitals from './reportWebVitals';

ReactDOM.render(
    <React.StrictMode>
        <ChuckieEgg />
    </React.StrictMode>,
    document.getElementById('root')
);

reportWebVitals();
