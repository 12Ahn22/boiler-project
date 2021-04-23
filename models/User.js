import mongoose from 'mongoose';

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

// 모델로 스키마를 감싼다. (모델명, 스키마)
export const User = mongoose.model('User', userSchema);
