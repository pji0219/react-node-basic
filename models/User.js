const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const saltRounds = 10; // salt를 몇 글자로 할건지 정하는 것

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
                next() // 암호화 코드 실행 후 index.js의 DB 저장 코드로 넘어가고 저장 시킴
            })
        })
    } else {
        next() // 비밀번호 외에 다른것을 변경시에는 암호화 시키지 않고 저장 코드로 넘어간다.
    }
})

// 비밀번호 일치 불일치 확인 index.js에서 내가 만든 함수의 두번째 파라미터를 콜백 함수로 이용한다.
userSchema.methods.comparePassword = function(plainPassword, cb) {
    
    // 오리지날 패스워드와 암호화된 비밀번호를 비교할 때 bcrypt의 compare()메서드로 오리지날 비번을 암호화 시켜서 비교한다.
    bcrypt.compare(plainPassword, this.password, function(err, ismatch) {
        if(err) return cb(err)
        cb(null, ismatch) 
    })
}

// 모델로 스키마를 감싸줌
const User = mongoose.model('User', userSchema)

module.exports = { User }