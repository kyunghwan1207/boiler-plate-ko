import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
// 우리가 사용한 애플리케이션 (현재의 경우 App에) redux연결해주자
import { Provider } from 'react-redux';
import { applyMiddleware, createStore } from 'redux';
import promiseMiddleware from 'redux-promise';
import ReduxThunk from 'redux-thunk';
import Reducer from './_reducers';// 이렇게하면 './_reducers/index.js'로 굳이 안해도 알아서 index.js알아서 잘 해줌

import 'antd/dist/antd.css';
// 그냥 store는 객체밖에 못 받기 때문에 promise와 function도 받을 수 있게 promiseMiddleware와 ReduxThunk라는 미들웨어를 추가해준다
const createStoreWithMiddleWare = applyMiddleware(promiseMiddleware, ReduxThunk)(createStore)

// ReactDOM.render(
//   <React.StrictMode>
//     <App />
//   </React.StrictMode>,
//   document.getElementById('root')
// );
ReactDOM.render( // redux와 App연결시킴
  <Provider 
    store={createStoreWithMiddleWare(Reducer, 
      window.__REDUX_DEVTOOLS_EXTENSION__ && 
      window.__REDUX_DEVTOOLS_EXTENSION__()
         // google에 redux devtool과 연결하기 위함
      )}
  >
    <App />
  </Provider>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
