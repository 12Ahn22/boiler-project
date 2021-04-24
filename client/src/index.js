import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
// ant design
import 'antd/dist/antd.css';
// redux
import { Provider } from 'react-redux';
import { applyMiddleware, createStore } from 'redux';
// redux - middleware
import promiseMiddleware from 'redux-promise';
import ReduxThunk from 'redux-thunk';
// reducer
import Reducer from './_reducers/index';

// Store를 미들웨어를 사용해 만든다
const createStoreWithMiddleware = applyMiddleware(
	promiseMiddleware,
	ReduxThunk
)(createStore);

ReactDOM.render(
	<Provider
		store={createStoreWithMiddleware(
			Reducer,
			window.__REDUX_DEVTOOLS_EXTENSION__ &&
				window.__REDUX_DEVTOOLS_EXTENSION__()
		)}
	>
		<React.StrictMode>
			<App />
		</React.StrictMode>
	</Provider>,
	document.getElementById('root')
);

reportWebVitals();
