import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { registerUser } from '../../../_actions/user_action';

const RegisterPage = (props) => {
	// 리덕스 dispatch
	const dispatch = useDispatch();

	// State - 서버에 보내고싶은 값
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [confirmPW, setConfirmPW] = useState('');
	const [name, setName] = useState('');

	// 타이핑을 할 떄, state를 변경해준다
	const onEmailHandler = (e) => {
		setEmail(e.currentTarget.value);
	};
	const onNameHandler = (e) => {
		setName(e.currentTarget.value);
	};
	const onPasswordHandler = (e) => {
		setPassword(e.currentTarget.value);
	};
	const onConfirmPWHandler = (e) => {
		setConfirmPW(e.currentTarget.value);
	};

	// submit 핸들러
	const onSubmitHandler = (e) => {
		e.preventDefault(); // 브라우저 자체의 기능을 중단시킨다. submit시 새로고침 막기

		// 비밀번호가 같은지 확인하기
		if (password !== confirmPW) {
			return alert('비밀번호와 비밀번호 확인이 다릅니다!');
		}

		// state값을 서버에 보낸다
		const body = {
			email,
			password,
			name,
			confirmPW,
		};

		// 로그인이 되면 렌딩페이지로 이동시키기
		dispatch(registerUser(body)) //
			.then((response) => {
				if (response.payload.success) {
					// console.log('response:', response); // action에서 return 값 = response
					props.history.push('/login');
				} else {
					alert('회원가입에 실패했습니다');
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
					이름
					<input type="text" value={name} onChange={onNameHandler} />
				</label>

				<label>
					비밀번호
					<input
						type="password"
						value={password}
						onChange={onPasswordHandler}
					/>
				</label>

				<label>
					비밀번호 확인
					<input
						type="password"
						value={confirmPW}
						onChange={onConfirmPWHandler}
					/>
				</label>
				<button type="submit">회원가입</button>
			</form>
		</div>
	);
};

export default RegisterPage;
