import './App.css';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
// components
import LandingPage from './components/views/LandingPage/LandingPage';
import LoginPage from './components/views/LoginPage/LoginPage';
import RegisterPage from './components/views/RegisterPage/RegisterPage';

import Auth from './hoc/auth';

// App에서 라우터 설정하기
function App() {
	return (
		<Router>
			<div>
				<Switch>
					<Route exact path="/" component={Auth(LandingPage, null)}></Route>
					<Route exact path="/login" component={Auth(LoginPage, false)}></Route>
					<Route
						exact
						path="/register"
						component={Auth(RegisterPage, false)}
					></Route>
				</Switch>
			</div>
		</Router>
	);
}

export default App;
