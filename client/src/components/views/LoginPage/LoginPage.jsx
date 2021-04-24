import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { loginUser } from '../../../_actions/user_action';
import { withRouter } from 'react-router-dom';

const LoginPage = (props) => {
	// 리덕스 dispatch
	const dispatch = useDispatch();

	// State - 서버에 보내고싶은 값
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');

	// 타이핑을 할 떄, state를 변경해준다
	const onEmailHandler = (e) => {
		setEmail(e.currentTarget.value);
	};
	const onPasswordHandler = (e) => {
		setPassword(e.currentTarget.value);
	};

	const onSubmitHandler = (e) => {
		e.preventDefault(); // 브라우저 자체의 기능을 중단시킨다. submit시 새로고침 막기

		// state값을 서버에 보낸다
		const body = {
			email,
			password,
		};

		// 로그인이 되면 렌딩페이지로 이동시키기
		dispatch(loginUser(body)).then((response) => {
			if (response.payload.loginSuccess) {
				props.history.push('/'); // 페이지 이동, 사용하려면 withRouter를 써줘야한다 리액트라우터돔
			} else {
				alert('로그인할수없습니다');
			}
		});
	};

	return (
		<div
			style={{
				display: 'flex',
				justifyContent: 'center',
				alignItems: 'center',
				width: '100%',
				height: '100vh',
			}}
		>
			<form
				style={{ display: 'flex', flexDirection: 'column' }}
				onSubmit={onSubmitHandler}
			>
				<label>
					Email
					<input type="email" value={email} onChange={onEmailHandler} />
				</label>
				<label>
					Password
					<input
						type="password"
						value={password}
						onChange={onPasswordHandler}
					/>
				</label>
				<button type="submit">Login</button>
			</form>
		</div>
	);
};

export default withRouter(LoginPage);
