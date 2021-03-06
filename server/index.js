// 백엔드의 시작점 index.js
import express from 'express'; // package.json에서 type을 module로 설정
import mongoose from 'mongoose'; // mongoose를 이용해 mongoDB와 app 연결
import { User } from './models/User.js'; // 만든 User 모델 가져오기
import { config } from './config/key.js'; //
import cookieParser from 'cookie-parser';
import { auth } from './middleware/auth.js';

const app = express();
const port = 5000;
// body parser
// application/x-www-form-urlencoded 타입의 데이터를 분석
app.use(express.urlencoded({ extended: true }));
// application/json 타입의 데이터를 분석
app.use(express.json());
// 쿠키파서 사용하기
app.use(cookieParser());

// mongoose를 이용해 mongoDB와 연결하기
mongoose
	.connect(config.mongoURI, {
		// 아래 옵션을 사용하지 않으면 오류가 발생할 수 있다.
		useNewUrlParser: true,
		useUnifiedTopology: true,
		useCreateIndex: true,
		useFindAndModify: true,
	}) // Promise를 반환한다
	.then(() => console.log('MongoDB connected')) // 연결이 됬다면
	.catch((error) => console.log(error)); // 연결이 되지 않았다면
//
//
//
// 라우트
app.get('/', (req, res) => {
	res.send('Hello World!~~');
});

// 회원 가입용 라우트
app.post('/api/users/register', (req, res) => {
	// 회원 가입할 떄 필요한 정보들을 client에서 가져오면
	// 이것들을 데이터 베이스에 넣기

	// req.body에는 json 형식으로 데이터가 들어있다 = body-parser가 있기 때문에 가능
	const user = new User(req.body); // user 모델에 req.body값을 넣은 상태

	// save() : mongoDB의 메서드, 정보를 유저 모델에 저장시킨다
	user.save((err) => {
		if (err) return res.json({ success: false, err }); // 실패한 경우, 에러 메세지를 json으로 전달
		return res.status(200).json({ success: true });
	});
});

// 로그인용 라우트
app.post('/api/users/login', (req, res) => {
	// DB에서 요청된 이메일 주소 찾기
	User.findOne({ email: req.body.email }, (err, user) => {
		// 유저가 없다면
		if (!user) {
			return res.json({
				loginSuccess: false,
				message: '제공된 Email에 해당하는 유저가 없습니다',
			});
		}
		// DB에 이메일이 있다면 비밀번호가 맞는지 확인하기
		// UserModel에서 메소드 만들기
		user.comparePassword(req.body.password, (err, isMatch) => {
			if (err) {
				return res.json({
					loginSuccess: false,
					meesage: '에러가 발생했습니다',
				});
			}
			// isMatch가 null이면 비밀번호가 틀린 것
			if (!isMatch) {
				return res.json({
					loginSuccess: false,
					message: '비밀번호가 일치하지않습니다',
				});
			}
			// 비밀번호까지 같다면 Token 생성하기
			// UserModel에서 메소드 만들기
			user.generateToken((err, user) => {
				// err가 있다면
				if (err) return res.status(400).send(err);

				// 클라이언트에 토큰을 저장한다.
				// 저장가능한 위치 : 쿠키, 로컬스토리지, 세션 스토리지
				// 여기에선 쿠키 - 쿠키 파서 설치
				res
					.cookie('x_auth', user.token)
					.status(200)
					.json({ loginSuccess: true, userId: user._id });
			});
		});
	});
});

// Auth 라우터
// 미들웨어 auth를 사용한다. 콜백을 시작하기 전에 중간에 실행할 함수 auth
app.get('/api/users/auth', auth, (req, res) => {
	// 여기까지 미들웨어를 통과했다 = auth가 true이다
	res.status(200).json({
		_id: req.user._id,
		isAdmin: req.user.role === 0 ? false : true,
		isAuth: true,
		email: req.user.email,
		name: req.user.name,
		lastname: req.user.lastname,
		role: req.user.role,
		image: req.user.image,
	});
});

// 로그아웃 라우트
// 로그 아웃 하는 유저의 DB를 찾아서 토큰을 지워준다
// 로그인 된 상태라서 auth 미들웨어를 사용
app.get('/api/users/logout', auth, (req, res) => {
	// req.user는 미들웨어어서 넣어줬음 . _id로 유저를 찾고 , {삭제}
	User.findOneAndUpdate({ _id: req.user._id }, { token: ' ' }, (err, user) => {
		if (err) return res.json({ success: false, err });
		return res.status(200).send({
			success: true,
		});
	});
});

//
app.get('/api/hello', (req, res) => {
	res.send('안녕하세요?');
});

// 서버가 열려있는 상태인 경우
app.listen(port, () => {
	console.log(`Example app listening at http://localhost:${port}`);
});
