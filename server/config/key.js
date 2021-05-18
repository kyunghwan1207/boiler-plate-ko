const { model } = require('mongoose');
// process.env.NODE_ENV는 환경변수
// 만약 deveopmet환경에 있을 때는 위 환경변수가 development라고 나오고
// 만약 deploy(배포)한 후 라면 위 환경변수는 production이 된다.
if(process.env.NODE_ENV === 'production'){
    module.exports = require('./prod');
} else {
    module.exports = require('./dev');
}