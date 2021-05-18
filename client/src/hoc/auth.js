import axios from 'axios';
import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { auth } from '../_actions/user_action';

export default function (SpecificComponent, option, adminRoute = null){
    /* option */
    //null => 아무나 출입이 가능한 페이지
    //true => 로그인된 유저만 출입이 가능한 페이지
    //flase => 로그인된 유저는 출입이 불가능한 페이지
    /* adminRoute default값 == null */
    //true => admin유저만 출입이 가능한 페이지
    //null => 
    function AuthenticationCheck(props){
        //backend(=node.js)에 request를 날려서 현재 유저의 상태(=현재페이지에 접근가능한 놈인지 아닌지)를 받아와야된다.
        const dispatch = useDispatch();

        useEffect(() => {
            dispatch(auth()).then(response => { // backend(Node.js)에서 처리한 정보들이 response에 들어있을 것이다.
                console.log(response) // -> 로그인 햇으면 isAuth : true | 로그인 안햇으면 isAuth: false
                // 로그인 하지 않은 상태
                if(!response.payload.isAuth){
                    if(option){//로그인 안한 상태로 option이 true인 페이지 들어가면 안되니까 다른페이지로 못가게 막아야댐
                        props.history.push('/login')
                    }
                } 
                else{ // 로그인 한 상태 -> 에서 일어날 수 있는 경우의 수 1. 어드민이 아닌대 어드민 페이지에 들어갈 경우 막아야댐 
                    if(adminRoute && !response.payload.isAdmin){
                        props.history.push('/')
                    }
                    else {
                        if(option === false){ // 2. 로그인 안한 유저만 출입할 수 잇는 (ex. login페이지 회원가입페이지)로 가면 막야야댐
                            props.history.push('/')

                        }
                        
                    }
                }

            })
            //axios.get('/api/users/auth') -> 이렇게 하면 쉽겟지만 redux를 사용해서 해보겟다
        }, [])
        return (
            <SpecificComponent />
        )
    }
    return AuthenticationCheck
}