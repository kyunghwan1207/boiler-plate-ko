/* login이나 register같이 user에 관한 기능추가시 만져주는 곳 */
import { startSession } from 'mongoose';
import {
    LOGIN_USER,
    REGISTER_USER,
    AUTH_USER
} from '../_actions/types';

export default function (state ={}, action) { // 현재 state(={} 의미는 비어잇는 상태)와 action을 파라미터로 가짐
    switch (action.type) { // 다른 type이 올때마다 그에 따른 다른 명령문을 실행하기 위함
        case LOGIN_USER: // previous state와 action을 다 인지햇으므로 next state만들어 보자
            return { ...state, loginSuccess: action.payload } // ...state 의미 : spread operator는 파라미터로 받은 state를 똑같이 가져오는 것이다. 따라서 현재의 state는 그냥 빈상태( ={} )
            // user_action에서 준 payload를 현재의 loaginSuccess에 저장한것
            break;
        case REGISTER_USER:
            return { ...state, register: action.payload }
            break;
        case AUTH_USER:
            return { ...state, userData: action.payload } // action.payload에 server/indexjs에서 볼 수 있듯, _id, isAdmin .. 등 모든 정보가 action.payload에 담겨잇다 -> 그래서 이름을 userData로 지엇다
        default:
            return state;
            
    }
}