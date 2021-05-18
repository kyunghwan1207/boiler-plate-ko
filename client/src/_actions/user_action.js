import axios from 'axios';
//import { response } from 'express';
import {
    LOGIN_USER,
    REGISTER_USER,
    AUTH_USER
} from './types';

export function loginUser(dataToSubmit){
    const request = axios.post('/api/users/login', dataToSubmit)
        .then(response => response.data )

        return {
            type: LOGIN_USER,
            payload: request
        }
        // server에 'api/users/login'으로 post로 request 날린 다음에
        //  서버로부터 response받은거(response.data)를 request에 저장한다.
        // 이후 return시켜서 reducer로 보내야됨(*Redux 데이터 Flow참고)
        // Reducer는 현재state(=previousState)과 현재 액션(=loginUser함수에서하는 post하는 것)을 조합해서
        // 그 다음state를 만들어준다
        // Action에는 reponse와 type필요(*Redux 데이터 Flow참고)
        // 여기서 response를 payload라 칭함


}

export function registerUser(dataToSubmit){
    const request = axios.post('/api/users/register', dataToSubmit)
        .then(response => response.data )

        return {
            type: REGISTER_USER,
            payload: request
        }
}

export function auth(){
    const request = axios.get('/api/users/auth')
        .then(response => response.data )

        return {
            type: AUTH_USER,
            payload: request
        }
}