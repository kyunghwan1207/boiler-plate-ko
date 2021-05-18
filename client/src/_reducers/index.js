import { combineReducers } from 'redux';
import user from './user_reducer';

// store안에 reducer가 여러개 있을 수 있다 (ex. UserReducer, CommentReducer, SubscribeReducer ...)
// 왜 여러개 가능?
// reducer가 하는 일이 어떻게 state가 변하는지 보여준 다음 그 변한 마지막 값을 return 해주는게 reducer의 일이다.
// User에 관한 state, Comment에 관한 state, Subscribe에 관한 state가 있을 수 있기에 -> reducer가 여러개 잇을 수 잇다.
// 이렇게 나눠진 reducer를 combinReducer를 활용해 root reducer로 하나로 합쳐준다.

const rootReducer = combineReducers({
    user
})

export default rootReducer;