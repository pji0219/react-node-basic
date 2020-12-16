const express = require('express') // express 모듈을 가져옴
const app = express(); // express 함수를 이용해서 새로운 App을 만듦
const port = 5000;
const mongoose = require('mongoose') // 몽구스 불러옴
mongoose.connect('mongodb+srv://pji0219:vhqlels1@cluster0.4isia.mongodb.net/<dbname>?retryWrites=true&w=majority', {
  useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false
}).then(() => console.log('Mongo DB Connected!'))
  .catch(error => console.log(error));

app.get('/', (req, res) => {
  res.send('Hello World! 안녕 세상아!')
}) // 루트 디렉토리에 헬로 월드 출력 되게 함


/* 회원 가입할 때 필요한 정보들을 클라이언트에서 가져오면
그 것들을 데이터 베이스에 넣어 준다. */
app.post('/register', (req, res) => {
  
})


app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
}) // node run start시 5000포트 듣게 되고 콘솔 출력됨