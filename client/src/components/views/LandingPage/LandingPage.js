/* Extension에서 es7다운 받으면 됨 */
// rcc -> 기본적인 Class Component구조 나옴
// rfce -> 기본적인 function component구조 나옴

/* 초기화면 구성 */

import React, {useEffect}from 'react';
import axios from 'axios'; // React JS 부분에서 Request보낼때 사용 == jQuery를 사용할때 AJAX라고 보면됨
// import { response } from 'express'; -> 이거 있으면
//  Uncaught TypeError: Cannot read property 'prototype' of undefined 에러 뜸
import { withRouter } from 'react-router-dom'; // props.history.push() 쓰기 위함

function LandingPage(props){

    useEffect(() => {
        axios.get('/api/hello') // 이 엔드포인트가 서버로 보낼것이다. -> server/index.js 로 올 것이다.
        .then(response => console.log(response.data)) // server/index.js로 부터 send되어온 "안녕하세요 ~"(response.data)를 console.log로 찍어주겟다

    }, [])

    const onClickHandler = () => { // 로그아웃은 복잡하게 할 것 없으므로 dispatch안하고 바로 axios하겟다
        axios.get('api/users/logout')
        .then(response => {
            if(response.data.success){ // 로그아웃 성공하면 success : true 이므로 
                props.history.push("/login") // login페이지로 넘긴다
            }
            else {
                alert("로그아웃 하는데 실패했습니다.")
            } 
        })

    }

    return (
        <div style={{
            display: 'flex', justifyContent: 'center', alignItems: 'center'
            , width: '100%', height: '100vh'
        }}>
            <h2>시작 페이지</h2>
            <button onClick={onClickHandler}>
                로그아웃
            </button>
        </div>
    )
}

export default  withRouter(LandingPage)