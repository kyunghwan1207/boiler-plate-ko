const express = require('express')
const app = express()
const port = 5000
const bodyParser = require('body-parser'); // client에서 오는 정보를 server에서 분석해서 가져올 수 있게 해주는 것
const config = require('./config/key');
const { User } = require("./models/User");

//application/x-www-form-urlencoded => 이렇게 된 데이터를 분석해서 가져올 수 있게 해주는 것이다
app.use(bodyParser.urlencoded({extended: true}));

//application/json => 이렇게 된 데이터를 분석해서 가져올 수 있게 해주는 것이다
app.use(bodyParser.json());

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

// 회원가입을 위한 Route만들기
app.post('/register', (req, res) =>{
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

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})