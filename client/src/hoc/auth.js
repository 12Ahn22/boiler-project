/* eslint-disable import/no-anonymous-default-export */
import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { auth } from '../_actions/user_action';

export default function (SpecificComponent, option, adminRoute = null) {
	// option
	//  - null 아무나 , true - 로그인 한 유저만 , false - 로그인 한 유저는 불가
	function AuthenticationCheck(props) {
		const dispatch = useDispatch();

		useEffect(() => {
			dispatch(auth()).then((response) => {
				console.log(response);

				// 분기 처리를 해준다
				// 로그인 하지 않은 상태
				if (!response.payload.isAuth) {
					// option == true면 로그인 안하면 못들어감
					if (option) {
						// 로그인 하라고 로그인 페이지로 보냄
						props.history.push('/login');
					}
				} else {
					// 로그인 한 상태
					if (adminRoute && !response.payload.isAdmin) {
						// 어드민이 아닌데 어드민 페이지를 가려 하는 경우
						props.history.push('/'); // landing Page로 보내버림
					}

					if (option === false) {
						// 로그인 한 유저는 출입 불가
						props.history.push('/');
					}
				}
			});
		}, []);

		return <SpecificComponent />;
	}
	return AuthenticationCheck;
}
