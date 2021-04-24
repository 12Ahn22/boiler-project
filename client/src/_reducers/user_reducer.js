import { LOGIN_USER, REGISTER_USER, AUTH_USER } from '../_actions/types';

// 리듀서가 store를 변경한다.

// eslint-disable-next-line import/no-anonymous-default-export
export default function (state = {}, action) {
	switch (action.type) {
		case LOGIN_USER:
			return { ...state, loginSuccess: action.payload };
		case REGISTER_USER:
			return { ...state, register: action.payload };
		case AUTH_USER:
			return { ...state, userData: action.payload };
		default:
			return state;
	}
}
