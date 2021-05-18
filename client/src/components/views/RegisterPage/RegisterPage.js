import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { registerUser } from '../../../_actions/user_action';
import { withRouter } from 'react-router-dom';

function RegisterPage(props){
    const dispatch = useDispatch();


    const [FirstName, setFirstName] = useState("")
    const [LastName, setLastName] = useState("")
    const [Email, setEmail]= useState("")
    const [Password, setPassword] = useState("")
    const [ConfirmPassword, setConfirmPassword] = useState("")
    const [Country, setCountry] = useState("")
    const [Language, setLanguage] = useState("")

    const onFirstNameHandler = (event) => {
        setFirstName(event.currentTarget.value)
    }

    const onLastNameHandler = (event) => {
        setLastName(event.currentTarget.value)
    }

    const onEmailHandler = (event) => { // input tag내에서 사용자가 입력하는 값(=Email state를 변경하는 행위)을 실시간으로 반영하기위함
        setEmail(event.currentTarget.value)
    }
    const onPasswordHandler = (event) => {
        setPassword(event.currentTarget.value)
    } 
    const onConfirmPasswordHandler = (event) => {
        setConfirmPassword(event.currentTarget.value)
    }
    const onCountryHandler = (event) => {
        setCountry(event.currentTarget.value)
    }
    const onLanguageHandler = (event) => {
        setLanguage(event.currentTarget.value)
    } 
    const onSubmitHandler = (event) => {
        event.preventDefault();
        // console.log('Email', Email) 
        // console.log('Password', Password) 
        // 하면 사용자가 입력한 정보 잘 나옴 -> 서버에 보낼 정보를 각 state가 담고있다.
        if(Password !== ConfirmPassword){
            return alert('비밀번호와 비밀번호 확인은 같아야 합니다.')
        }
        let body = {
            email: Email,
            firstname: FirstName,
            lastname: LastName,
            password: Password,
            country: Country,
            language: Language
        }
        dispatch(registerUser(body)) // 으로 어떤 Action을 취할 것이다. = loginUser라는..
            .then(response => {
                if(response.payload.success){ // login 성공하면 페이지를 '/'로 보낸다
                    props.history.push("/login")
                }
                else {
                    alert("Failed to sign up!")
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
                {/* 소셜로그인 */}
                <h3>NEW TO kediTalk?</h3>
                <label>First Name</label>
                <input type="text" value={FirstName} onChange={onFirstNameHandler} />

                <label>Last Name</label>
                <input type="text" value={LastName} onChange={onLastNameHandler} />

                <label>Email</label>
                <input type="email" value={Email} onChange={onEmailHandler} />

                <label>Password</label>
                <input type="password" value={Password} onChange={onPasswordHandler} />

                <label>Confirm Password</label>
                <input type="password" value={ConfirmPassword} onChange={onConfirmPasswordHandler} />

                <label>Country</label>
                <input type="text" value={Country} onChange={onCountryHandler} />

                <label>Language</label>
                <input type="text" value={Language} onChange={onLanguageHandler} />

                <br />
                <button type="submit">
                    회원가입
                </button>
            </form>
        </div>
    )
}

export default withRouter(RegisterPage)