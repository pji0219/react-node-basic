const { User } = require('../models/User');

let auth = (req, res, next) => {

    // 인증 처리를 하는 곳

    /* 클라이언트 쿠키에서 토큰을 가져온다.
    예전에 토큰을 저장할 때 사용한 쿠키의 이름을 넣어준다. */
    let token = req.cookies.x_auth;

    // 토큰을 복호화 한 후 유저를 찾는다.
    // 메서드 이름은 자유롭게 지으면 된다.
    User.findByToken(token, (err, user) => {
        if (err) throw err;
        if (!user) return res.json({ isAuth: false, error: true })

        // 토큰과 유저를 리퀘스트한 이유는 index.js파일의 코드에서 사용할 수 있게 하기 위함
        req.token = token;
        req.user = user;
        return next();
    })

    // 유저가 있으면 인증 Ok

    // 유저가 없으면 인증 no
}

module.exports = { auth };