// 백엔드의 시작점 index.js
import express from 'express'; // package.json에서 type을 module로 설정
import mongoose from 'mongoose'; // mongoose를 이용해 mongoDB와 app 연결
import { User } from './models/User.js'; // 만든 User 모델 가져오기
import { config } from './config/key.js'; //

const app = express();
const port = 5000;
// body parser
// application/x-www-form-urlencoded 타입의 데이터를 분석
app.use(express.urlencoded({ extended: true }));
// application/json 타입의 데이터를 분석
app.use(express.json());

mongoose
	.connect(config.mongoURI, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
		useCreateIndex: true,
		useFindAndModify: true,
	}) // Promise를 반환
	.then(() => console.log('MongoDB connected'))
	.catch((error) => console.log(error));

// 라우트
app.get('/', (req, res) => {
	res.send('Hello World!~~');
});
// 회원 가입용 라우트
app.post('/register', (req, res) => {
	// 회원 가입할 떄 필요한 정보들을 client에서 가져오면
	// 이것들을 데이터 베이스에 넣기

	// req.body에는 json 형식으로 데이터가 들어있다 = body-parser가 있기 때문에 가능
	const user = new User(req.body);

	// save() : mongoDB의 메서드, 정보를 유저 모델에 저장시킨다
	user.save((err, userInfo) => {
		if (err) return res.json({ success: false, err }); // 실패한 경우, 에러 메세지를 json으로 전달
		return res.status(200).json({ success: true });
	});
});

app.listen(port, () => {
	console.log(`Example app listening at http://localhost:${port}`);
});
