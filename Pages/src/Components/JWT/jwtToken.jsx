import Cookies from 'js-cookie';

const isLoggedIn = () => {
    const token = Cookies.get('jwtToken');
    return !!token; 
};

export default isLoggedIn;


