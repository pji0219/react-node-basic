const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const saltRounds = 10; // salt를 몇 글자로 할건지 정하는 것
const jwt = require('jsonwebtoken');

// 스키마 작성
const userSchema = mongoose.Schema({
    name: {
        type: String,
        maxlength: 50
    },
    email: {
        type: String,
        trim: true, // 띄어쓰기 된 것을 붙여줌
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
    role: {
        type: Number,
        default: 0
    },
    image: String,
    token: {
        type: String
    },
    tokenExp: {
        type: Number
    }
})

/* pre()는 몽구스에서 가져온 메서드, 거기에 첫번째 파라미터로 'save'를 넣어주고 두번째 파라미터로는
함수를 넣어주면 되는데 유저 정보를 저장 하기 전에 함수 안의 코드를 수행 한다는것 이다. 
함수에 파라미터로 next를 주면 된다. */ 

userSchema.pre('save', function(next) {
    let user = this; // this는 스키마를 가르킨다.

    // 비밀번호 변경 시에 암호화 시킨다.
    if (user.isModified('password')) {
         
        // 암호화를 시킨다.
        bcrypt.genSalt(saltRounds, function(err, salt) {
        
            // 에러시 DB 저장 코드로 넘어가서 에러 발생 시킴
            if(err) return next(err) 

            // user.password는 암호화 되지 않은 비밀번호, hash는 암호화 된 것
            bcrypt.hash(user.password, salt, function(err,hash) {
                if(err) return next(err)
                user.password = hash // 비밀번호를 암호화 시켜줌
               return next() // 암호화 코드 실행 후 index.js의 DB 저장 코드로 넘어가고 저장 시킴
            })
        })
    } else {
       return next() // 비밀번호 외에 다른것을 변경시에는 암호화 시키지 않고 저장 코드로 넘어간다.
    }
})


// 비밀번호 일치 불일치 확인 index.js에서 내가 만든 함수의 두번째 파라미터를 콜백 함수로 이용한다.
userSchema.methods.comparePassword = function(plainPassword, cb) {
    
    // 오리지날 패스워드와 암호화된 비밀번호를 비교할 때 bcrypt의 compare()메서드로 오리지날 비번을 암호화 시켜서 비교한다.
    bcrypt.compare(plainPassword, this.password, function(err, ismatch) {
        if(err) return cb(err)
        return cb(null, ismatch) 
    })
}

userSchema.methods.generateToken = function(cb) {

    var user = this;

    // jsonwebtoken을 이용해서 token을 생성하기
    /* 몽고 DB에 저장된 아이디와 뒤에 내가 지정해준 문자열이 합쳐져서 토큰이 생성 된다.
    user._id + 'secretToken' = token
    그리고 나중에 토큰을 해석할때 'secretToken'를 넣으면 user_id가 나와서 토큰을 가지고
    이 사람이 누구인지 알 수 있다.
    그래서 secretToken을 기억해둬야 한다. */
    var token = jwt.sign(user._id.toHexString(), 'secretToken')

    user.token = token
    user.save(function(err, user) {
        if(err) return cb(err)
        return cb(null, user)
    })

}


// 인증
// 토큰 복호화
userSchema.statics.findByToken = function(token, cb) {
    var user = this;

    // 토큰을 decode 한다. 토큰을 decode하면 아이디가 나온다.
    jwt.verify(token, 'secretToken', function(err, decoded) {

        /* 유저 아이디를 이용해서 유저를 찾은 다음에
        클라이언트에서 가져온 token과 DB에 보관된 토큰이 일치하는지 확인 */
        user.findOne({ "_id": decoded, "token": token }, function(err, user) {
            if (err) return cb(err);
            return cb(null, user)
        })

    })
}

// 모델로 스키마를 감싸줌
const User = mongoose.model('User', userSchema)

module.exports = { User }