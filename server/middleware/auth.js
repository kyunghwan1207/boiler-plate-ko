const { User } = require('../models/User');

let auth = (req, res, next) => { // auth를 정의한다.
    //cookie에 저장되있는 token과 서버(DB)에 저장되있는 token과의 인증처리

    // 클라이언트 쿠키에서 토큰을 가져온다
    console.log('auth.js/authStart');
    let token = req.cookies.x_auth; // 쿠키 저장할때 x_auth로 저장햇음
    console.log('auth.js/req.cookies', req.cookies);
    console.log('auth.js/let token', token);
    // 토큰을 복화하 한후 유저를 찾는다
    User.findByToken(token, (err, userInfo) => {
        if(err) {
            console.log('auth.js/findByTokenError');
            throw err;
        }

        if(!userInfo) {
            console.log('auth.js/findByTokenNoUserInfor');
            return res.json({ isAuth: false, error: true })
        }
        console.log('auth.js/findByTokenNoErrorYesUserInfor');
        // userInfo가 잇다면 == 유저가 잇다면
        req.token = token; // req.user = userInfo ???
        req.userInfo = userInfo;// 이렇게 해주면 index.js에서 req.으로 token이나 userInfo에 접근할 수 있게된다. 
        next(); // auth 호출한쪽(index.js -> get -> /api/users/auth)에서 스무스하게 볼일마치고 다음 instrucion수행하게하기위함
    })
    // 유저가 있으면 인증 okay
    // 유저가 없으면 인증 no


}

module.exports = { auth }; // 다른 파일에서도 사용가능하게하기위함