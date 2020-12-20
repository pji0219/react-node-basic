const express = require('express') // express 모듈을 가져옴
const app = express(); // express 함수를 이용해서 새로운 App을 만듦
const port = 5000;
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const { User } = require('./models/User');
const config = require('./config/key');

// application/x-www-form-urlencoded 이렇게 된 데이터를 분석해서 가지고 오는 것
app.use(bodyParser.urlencoded({extended: true}));

// application.json 타입으로 된 것을 분석해서 가지고 올 수 있게 해주는 것
app.use(bodyParser.json());
app.use(cookieParser());

const mongoose = require('mongoose') // 몽구스 불러옴
mongoose.connect(config.mongoURI, {
  useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false
}).then(() => console.log('Mongo DB Connected!'))
  .catch(error => console.log(error));

app.get('/', (req, res) => {
  res.send('Hello World! 안녕 세상아!')
}) // 루트 디렉토리에 헬로 월드 출력 되게 함


/* 회원 가입할 때 필요한 정보들을 클라이언트에서 가져오면
그 것들을 데이터 베이스에 넣어 준다. */

app.post('/register', (req, res) => {
  // req.body 안에는 json형식으로 클라이언트로부터 받아온 id, password등등이 들어 있다.
  // 이렇게 클라이언트로 부터 데이터를 받아 올 수 있는 것은 bodyParser가 있기 때문이다.
  const user = new User(req.body) 

  // save()는 몽고DB에서 오는 메서드
  // 이렇게 해주면 User 모델이 저장됨
  user.save((err, userInfo) => {
    
    // 에러가 났을 때 성공하지 못했다고 json 형식으로 전달해주고 에러 메세지도 전달 해줌
    if(err) return res.json({ success: false, err })

    // userInfo에는 저장된 유저 정보가 있는데 status 200은 성공 했다는 뜻이고
    // json 형식으로  성공했다고 전달해주면 된다.
    return res.status(200).json({ success: true })
  })
})

app.post('/login', (req, res) => {

  // 요청된 이메일이 데이터베이스에 있는지 찾는다.
  // 몽고 DB의 findOne() 메서드 사용
  User.findOne({ email: req.body.email }, (err, user) => {
    if(!user) {
      return res.json({
        loginSuccess: false,
        message: "이메일에 해당하는 유저가 없습니다."
      })
    }

    // 요청된 이메일이 데이터베이스에 있다면 비밀번호가 맞는지 확인한다.
    // 메서드 이름은 자신이 아무거나 정해도 된다.
    user.comparePassword(req.body.password, (err, isMatch) => {
      if(!isMatch)
        return res.json({ loginSuccess: false, message: "비밀번호가 틀렸습니다."})
      
      // 비밀번호 까지 맞다면 토큰을 생성한다.
      // 메서드 이름은 자신이 아무거나 정해도 된다.
      user.generateToken((err, user) => {
        if (err) return res.status(400).send(err);

        /* 토큰을 저장한다. 어디에? 쿠키, 로컬스토로리지, 세션 중에 하나, 
        어디에 저장해야 안전한지에 대한 것은 논란이 많다. 그래서 여러가지 방법이 
        있다고 알아두면 된다. 여기서는 쿠키에다 저장하도록 하겠다. */

        // 여기서는 x_auth은 쿠키 이름을 정하는 것인데 아무거나 써도 된다.
        return res.cookie("x_auth", user.token)
          .status(200)
          .json({ loginSuccess: true, userId: user._id })

      })

    })
  })
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
}) // 서버 가동시 5000포트 듣게 되고 콘솔 출력됨