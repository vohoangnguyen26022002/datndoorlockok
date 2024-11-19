import { createBrowserRouter } from 'react-router-dom';
import HomePage from '../Components/Home/HomePage';
import PageLayout from '../Components/pages/Layout';
import Login from '../Components/Login/Login';
import Register from '../Components/Register/Register';
import HomeAdmin from '../Components/Home/HomeAdmin/HomeAmin';
import HomeUser from '../Components/Home/HomeUser/HomeUser';
import ChangePassword from '../Components/Home/PassWord/PassWord';


const router = createBrowserRouter([
	{
		path: '/',
		Component: PageLayout,
		children: [
			{
				path: '/',
				Component: HomePage,
			},
            
			{
				path:'/login',
				Component: Login,
			},

			{
				path: '/register',
				Component:  Register,
			},

			{
	           path: '/adminPage',
               Component: HomeAdmin,
			},

            {
                path: '/clientPage',
                Component: HomeUser,
            },
			{
			    path: '/changePassword',
				Component: ChangePassword,
			}
		],
	},
]);

export default router;
