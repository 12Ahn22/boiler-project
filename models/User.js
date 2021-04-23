import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

// 몽구스를 이용해서 스키마 작성
const userSchema = mongoose.Schema({
	name: {
		type: String,
		maxLength: 50,
	},
	email: {
		type: String,
		trim: true,
		unique: 1,
	},
	password: {
		type: String,
		minLength: 5,
	},
	lastname: {
		type: String,
		maxLength: 50,
	},
	role: {
		type: Number,
		default: 0,
	},
	image: String,
	token: {
		type: String,
	},
	tokenExp: {
		type: Number,
	},
});

// 암호화
const saltRound = 10; // salt의 글자수
// 몽구스 메소드 pre(). 지정한 '함수'가 실행되기 전에 실행되는 함수
userSchema.pre('save', function (next) {
	const user = this; // this는 userSchema를 가리킨다

	// 비밀번호를 암호화 시킨다 = 단, 비밀번호를 변경할 때만
	if (user.isModified('password')) {
		bcrypt.genSalt(saltRound, (err, salt) => {
			if (err) return next(err); // 에러가 난 경우 err를 보냄

			bcrypt.hash(user.password, salt, (err, hash) => {
				if (err) return next(err);
				// hash는 암호화된 비밀번호
				// user의 password를 plain text에서 암호화된 해시값으로 변경해준다
				user.password = hash;
				// next를 실행하면 save()를 진행하러 간다
				next();
			});
		});
	} else {
		// 다른 걸 변경하는 경우 next로 바로 save를 하러 가도록한다
		next();
	}
});

// 비밀번호 맞는지 확인하는 메서드
userSchema.methods.comparePassword = function (plainPassword, callback) {
	// plainPassword : 클라이언트가 입력한 패스워드 = plain text
	// plainPassword을 암호화해서 DB에있는 password와 같은지 확인해야한다
	// bcrypt.compare(플레인텍스트, 해시, 콜백(에러,성공결과){} )

	bcrypt.compare(plainPassword, this.password, function (err, isMatch) {
		if (err) return callback(err);
		callback(null, isMatch);
	});
};

// Token을 생성하는 메서드
userSchema.methods.generateToken = function (callback) {
	const user = this;
	// jwt을 이용해서 토큰을 생성
	const token = jwt.sign(user._id.toHexString(), 'secretToken'); // DB에 저장되어있는 _id 값을 가져와 토큰을 생성한다
	// token = user._id + 'secretToken'
	// token + 'secretToken' => user._id 토큰과 문자를 통해 user._id값을 얻을 수 있다

	user.token = token;
	user.save((err, user) => {
		// 에러가 있다면 콜백에 err전달
		if (err) return callback(err);
		// 에러가 없다면 토큰값이 저장된 user정보 전달
		callback(null, user);
	});
};

// 모델로 스키마를 감싼다. (모델명, 스키마)
export const User = mongoose.model('User', userSchema);
