import React from 'react';
import ReactDOM from 'react-dom';
// redux - if/when
// import reducers from './reducers';
// import { Provider } from 'react-redux';
// import { createStore, applyMiddleware } from 'redux';
// const createStoreFromMiddleware = applyMiddleware()(createStore);

import App from './components/app.jsx';

ReactDOM.render(<App />, document.querySelector('#app'));


// ReactDOM.render(
//   <Provider store={createStoreWithMiddleware(reducers)}>
//     <App />
//   </Provider>
//   , document.querySelector('#app'));
