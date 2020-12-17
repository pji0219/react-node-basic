const express = require('express') // express 모듈을 가져옴
const app = express(); // express 함수를 이용해서 새로운 App을 만듦
const port = 5000;
const bodyParser = require('body-parser');
const { User } = require('./models/User');

// application/x-www-form-urlencoded 이렇게 된 데이터를 분석해서 가지고 오는 것
app.use(bodyParser.urlencoded({extended: true}));

// application.json 타입으로 된 것을 분석해서 가지고 올 수 있게 해주는 것
app.use(bodyParser.json());

const mongoose = require('mongoose') // 몽구스 불러옴
mongoose.connect( {
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


app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
}) // 서버 가동시 5000포트 듣게 되고 콘솔 출력됨