import React, { useEffect } from 'react';
import axios from 'axios';

const LandingPage = () => {
	useEffect(() => {
		axios.get('/api/hello');
	}, []);

	return <div>랜딩페이지</div>;
};

export default LandingPage;
