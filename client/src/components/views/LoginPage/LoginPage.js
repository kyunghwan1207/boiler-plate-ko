//import { response } from 'express';
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { loginUser } from '../../../_actions/user_action';
import { withRouter } from 'react-router-dom';
function LoginPage(props){

    const dispatch = useDispatch();

    const [Email, setEmail]= useState("")
    const [Password, setPassword] = useState("")
    const onEmailHandler = (event) => { // input tag내에서 사용자가 입력하는 값(=Email state를 변경하는 행위)을 실시간으로 반영하기위함
        setEmail(event.currentTarget.value)
    }
    const onPasswordHandler = (event) => {
        setPassword(event.currentTarget.value)
    } 
    const onSubmitHandler = (event) => {
        event.preventDefault();
        // console.log('Email', Email) 
        // console.log('Password', Password) 
        // 하면 사용자가 입력한 정보 잘 나옴 -> 서버에 보낼 정보를 각 state가 담고있다.
        let body = {
            email: Email,
            password: Password
        }
        dispatch(loginUser(body)) // 으로 어떤 Action을 취할 것이다. = loginUser라는..
            .then(response => {
                if(response.payload.loginSuccess){ // login 성공하면 페이지를 '/'로 보낸다
                    props.history.push('/')
                }
                else {
                    alert('error!')
                }
            })

    }
    return (
        <div style={{
            display: 'flex', justifyContent: 'center', alignItems: 'center'
            , width: '100%', height: '100vh'
        }}>
            <form style={{ display: 'flex', flexDirection: 'column' }}
                onSubmit={onSubmitHandler}
            >
                <h3>ALREADY REGISTERED?</h3>
                {/* 소셜로그인추가 */}

                <label>Email</label>
                <input type="email" value={Email} onChange={onEmailHandler} />
                <label>Password</label>
                <input type="password" value={Password} onChange={onPasswordHandler} />

                <br />
                <button type="submit">
                    Login
                </button>
            </form>
        </div>
    )
}

export default withRouter(LoginPage)