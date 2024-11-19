import { Outlet } from 'react-router-dom';
import NavBar from '../NavBar/NavBar';


const PageLayout = () => {
	return (
		<>
			<NavBar/>	
			<Outlet />
		</>
	);
};

export default PageLayout;
