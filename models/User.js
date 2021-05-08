// schema는 model로 감싼다.
const mongoose = require('mongoose')
const userSchema = mongoose.Schema({
    name : {
        type: String,
        maxlength: 50
    },
    email: {
        type: String,
        trim: true,
        unique: 1
    },
    password: {
        type: String,
        minlength: 5
    },
    lastname: {
        type: String,
        maxlength: 50
    },
    role: { // some user can be administor(Number = 1) and some user can be just user(Number = 0)
        type: Number,
        default: 0
    },
    image: String,
    token: { // purpose to manage 유효성
        type: String
    },
    toeknExp: { // token의 사용가능 기간
        type: Number
    }
})

const User = mongoose.model('User', userSchema)

module.exports = { User } // User.js를 다른 파일에서도 접근할 수 있게하기 위함
