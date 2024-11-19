import { Outlet } from 'react-router-dom';
import {  Container } from '@mui/material';
import Login from '../Login/Login';

const Login_Layout = () => {


	return (
		<Container>
            <Login></Login>
			<Outlet></Outlet>
		</Container>
	);
};

export default Login_Layout;
