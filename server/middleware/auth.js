import { User } from '../models/User.js';
// 미들웨어 auth
// 인증을 처리한다
export const auth = (req, res, next) => {
	// 클라이언트 쿠키에서 토큰을 가져온다
	const token = req.cookies.x_auth; // 토큰을 쿠키에서 가져온다
	// 토큰을 복호화 후, user를 찾는다
	User.findByToken(token, (err, user) => {
		if (err) throw err;
		if (!user) return res.json({ isAuth: false, error: true });

		// requset에 토큰하고 유저를 넣어줌
		// 미들웨어 이후에 token과 user를 사용하기 위해서
		req.token = token;
		req.user = user;
		next();
	});
};
