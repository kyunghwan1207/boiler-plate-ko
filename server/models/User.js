// schema는 model로 감싼다.
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const jwt = require('jsonwebtoken'); // 비밀번호를 제대로 작성한 유저를 위해 token 생성하기 위함
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
    token: { // purpose to manage 유효성 -> user._id + 'secreteToken'이 된 token저장
        type: String
    },
    toeknExp: { // token의 사용가능 기간
        type: Number
    },
    //ko
    country: {
        type: String
    },
    language: {
        type: String
    },
    firstname: {
        type: String,
        maxlength: 50
    }
})

// index.js의 'register'에서 'save'하기 전에 ~를 하겠다.
userSchema.pre('save', function( next ){
    var user = this; // 위에잇는 userSchema접근 가능
    if(user.isModified('password')){ // password가 바뀔때만 암호화해야되므로
        // 비밀번호를 암호화 시킨다 , https://www.npmjs.com/package/bcrypt
        bcrypt.genSalt(saltRounds, function(err, salt) { // bcrypt 사용해서 비밀번호를 암호화하기 위해 필요한 salt를 만들때(getSalt)그 전에 saltRounds 가 필요(=10 이면 10개로 제한한다는 의미)
            if(err) return next(err)
            bcrypt.hash(user.password, salt, function(err, hash) { //myPlaintextPassword(현재는 this.password) = 1234같은 사용자가 입력한 password | hash가 암호화된 비밀번호에 해당한다
                if(err) return next(err)
                user.password = hash
                next() // 기존의 1234(this.password)를 암호화된_password(hash)로 바꿧으므로 볼일 다 봣으니까 next로 save 쪽으로 보냄
                // Store hash in your password DB.
            });
        });
    }
    else{ // password변경하지 않을경우 그냥 바로 save쪽으로 보내준다
        next()
    }
})

userSchema.methods.comparePassword = function(plainPassword, cb) { //index.js의 login 파트 Step2에 대응됨 비교대상되는 password는 우리가 실제로 입력하는 plainpassword(ex. 1234)이다, cb는 call back함수 의미
    // 하지만 DB에는 암호화되어서 저장되있으므로 plainPassword(= 1234567)과 암호화된 비밀번호($2b$1492~)를 비교해야되는대
    // 암호화된 비밀번호는 복호화가 불가능하므로 plainPassword를 암호화해서 DB의 암호화된 비밀번호와 같은지 확인해보자!
    bcrypt.compare(plainPassword, this.password, function(err, isMatch){
        if(err){return cb(err) // 둘이 다르다면 cb로 error주고
        }
        cb(null, isMatch)   // 둘이 같다면   cb로 error는 null이고, 해당 결과를 저장하는 isMatch(=True)를 보낸다.

    })    

}

userSchema.methods.generateToken = function(cb) {
    var user = this;
    // jsonwebtoken을 이용해서 token을 생성하기 
    var token = jwt.sign(user._id.toHexString(), 'secretToken') // user._id + 'secreteToken'으로 token생성! -> secreteToken만 잇으면 user._id에 접근할 수 있게 됨 -> userSchme에 token필드 추가하자
    // user._id가 plain object로 인식되게 하기 위해서 .toHexString를 추가함
    // token에 'secreteToken'로 접근하면 -> user._id 찾을 수 있다.
    user.token = token
    user.save(function(err, userInfo){ // 변경내용 userInfo에 저장
        if(err){  // 에러 발생o시
            return cb(err)
        }
        cb(null, userInfo) // 에러 발생x -> error는 null이고 userInfo정보 전달

    })
}   

userSchema.statics.findByToken = function(token, cb){ //복호화 purpose
    var user = this;
    console.log('User.js/findByTokenStart');
    // 토큰을 복호화(decode)한다 -> token = userInfor._id + 'secretToken'이엇다
    jwt.verify(token, 'secretToken', function(err, decoded){ // decoded에 복호화된userInfo._id가 잇다
        console.log('User.js/findByToken/jwt.verify');
        //유저 아이디를 이용해서 유저를 찾은 다음에
        //클라이언트에서 가져온 토큰 과 DB에 저장된 토큰이 일치하는지 확인하자
        //몽고에 내장된 함수인 findOne사용 해당 정보가 일치하는 유저 찾아냄
        user.findOne({ "_id": decoded, "token": token }, function(err, userInfo){
            console.log('User.js/findOne');
            if(err) {
                console.log('User.js/findByTokenError');
                return cb(err);
            }
            console.log('User.js/findByTokenNoError');
            cb(null, userInfo)
        })
    })
}

const User = mongoose.model('User', userSchema)

module.exports = { User } // User.js를 다른 파일에서도 접근할 수 있게하기 위함
