import 'babel-polyfill';
import React from 'react';
import ReactDOM from 'react-dom';

import App from './components/app';
import './styles/core.scss';

ReactDOM.render(
    <App />,
    document.getElementById('app')
);