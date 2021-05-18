const express = require('express')
const app = express()
const port = 5000
const bodyParser = require('body-parser'); // client에서 오는 정보를 server에서 분석해서 가져올 수 있게 해주는 것
const cookieParser = require('cookie-parser'); // token을 저장하기위한 공간으로 cookie를 사용할건대 그때 필요함
const config = require('./config/key');
const { auth } = require('./middleware/auth');
const { User } = require("./models/User");

//application/x-www-form-urlencoded => 이렇게 된 데이터를 분석해서 가져올 수 있게 해주는 것이다
app.use(bodyParser.urlencoded({extended: true}));

//application/json => 이렇게 된 데이터를 분석해서 가져올 수 있게 해주는 것이다
app.use(bodyParser.json()); // bodyParser사용하기 위함
app.use(cookieParser()); // cookieParser사용하기 위함
const mongoose = require('mongoose')
mongoose.connect(config.mongoURI, {
    useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false
}).then(() => console.log('MongoDB Connected...'))
  .catch(err => console.log(err))
// mongoose.connect('mongodb+srv://<id>:<password>@boilerplate.tqpcu.mongodb.net/myFirstDatabase?retryWrites=true&w=majority', {
//   useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false
// }).then(() => console.log('MongoDB Connected...'))
// .catch(err => console.log(err))

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.get('/api/hello', (req, res) => {
  res.send("안녕하세요 ~ ")

})

// 회원가입을 위한 Route만들기
app.post('/api/users/register', (req, res) =>{
    // 회원 가입 할때 필요한 정보들을 client에서 가져오면
    // 그것들을 데이터 베이스에 넣어준다.

    const user = new User(req.body) // req.body로 client가 보내는 정보를 받을 수 있다 by BodyParser덕분
    // req.body (=모든 정보)를 User Model에 넣어줫다.

    // save하기 전에 password를 암호화한다음 save해야된다. -> mongoose활용! goto User.js/userSchema.pre('save')

    user.save((err, userInfo) => {
        if(err) return res.json({ success: false, err })
        return res.status(200).json({
            success: true
        })
    })
})

app.post('/api/users/login', (req, res) => { // 앤드포인트가 '/login'이다.
  /* 로그인을 위해 필요한 3가지 Step */
  // 1. 요청된 이메일을 데이터베이스에 있는지 찾는다.
   // -> User모델을 가져오고 몽고에서 제공하는 .findOne함수 사용
  User.findOne({ email: req.body.email }, (err, userInfo) => { // (err, uerInfo)는 call back함수 이다.
    if(!userInfo) { // 해당하는 이메일의 유저를 찾지 못햇을 경우 == 등록된 회원이 아닌경우
      return res.json({
        loginSuccess: false,
        message: "제공된 이메일에 해당하는 유저가 없습니다."
      })
    }
    // 해당하는 이메일의 유저가 있다면 userInfo에 그 유저의 이름, 비밀번호, 이메일

    // 2. 요청된 이메일이 데이터베이스에 있다면 비밀번호가 맞는지 확인하자
    userInfo.comparePassword(req.body.password, (err, isMatch) => { // comparePassword는 User모델에서 구현(goto User.js), isMatch에 해당 유저가 비밀번호를 맞게 입력했는지 결과 저장
      if(!isMatch) {
        return res.json({ 
          loginSuccess: false, 
          message: "비밀번호가 일치하지 않습니다." })
      }
      // 만약 비밀번호가 일치한다면 -> Token을 생성한다 -> *npm install jsonwebtoken --save
      // https://www.npmjs.com/package/jsonwebtoken
      userInfo.generateToken((err, userInfo) => {// 바로 call back함수 부름
        console.log('User.js/generateTokenBeforeCheck')
        if(err){
          console.log('User.js/generateTokenError')
          return res.status(400).send(err); // err잇으면 400띄우고 error message띄움
        }
        // 토큰을 저장한다.  어디에? 쿠키, 로컬 스토리지 다양하게 가능
        // 웹 브라우저에서 F12 -> Application에서 보면 -> Local Storage 랑 Session Storage있음 session안에 cookies잇음
        // 어디가 제일 안전한지에 대해선 논란많음 , But 여기선 token을 coockie에 저장하겟다
        // *npm install cookie-parser --save
        // x_auth라는 이름으로 userInfo.token이 저장됨 => 웹브라우저에서 F12 -> Application -> Session Storage애서 Cookies에서 확인가능
        console.log('User.js/generateTokenNoError')
        res.cookie("x_auth", userInfo.token).status(200).json({ loginSuccess: true, userId: userInfo._id })
      })
    })
  })
  
  //비밀번호까지 맞다면 토큰을 생성하기
})


//role 1 어드민    role 2 특정 부서 어드민
//role 0 -> 일반유저  role 0 이 아니면 관리자
app.get('/api/users/auth', auth, (req, res) => { // auth는 middleware이다
  //여 기까지 미들웨어를 잘 통과해서 왔다는 애기는 Authentication이 true라는 의미.
  res.status(200).json({ // 클라이언트에게 정상적으로 인증됫음을 알리고 userInfo에 담긴 정보 저장
    _id: req.userInfo._id, // req.user._id ???
    isAdmin: req.userInfo.role === 0 ? false : true,
    isAuth: true,
    email: req.userInfo.email,
    firstname: req.userInfo.firstname,
    lastname: req.userInfo.lastname,
    image: req.userInfo.image,
    //ko
    country: req.userInfo.country,
    language: req.userInfo.language
  })//auth.js에서 req.userInfo && req.token한 덕분에 index.js에서도 접근가능
}) // 이렇게 하면 어느page에서든지 유저정보를 이용할 수 있어 편리

/*로그아웃 구현 */
// 서버(DB)에 있는 token을 지워버리면 로그아웃된거랑 마찬가지
app.get('/api/users/logout', auth, (req, res) => { // _id와 req.userInfo._id와 일치하는 사용자 찾으면 해당 사용자에 저장되있는 token을 지워버림(ex. "")
  User.findOneAndUpdate({_id: req.userInfo._id},
    {token: ""}
    , (err, userInfo) => {
      if(err) {
        console.log('index.js/findOneAndUpdateError')  
        return res.json({ success: false, err });
      }
      console.log('index.js/findOneAndUpdateNoError')
      return res.status(200).send({
        success: true
      })
    })
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})