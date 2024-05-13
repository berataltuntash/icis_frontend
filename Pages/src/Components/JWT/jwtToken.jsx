import Cookies from 'js-cookie';

const saveTokenToCookie = (token) => {
  Cookies.set('jwt', token, { expires: 1 }); 
};


const getTokenFromCookie = () => {
    return Cookies.get('jwt');
    };

export { saveTokenToCookie, getTokenFromCookie };


import Cookies from 'js-cookie';

const isLoggedIn = () => {
    const token = Cookies.get('jwtToken');
    return !!token; // Token varsa true döner, yoksa false döner
};

export default isLoggedIn;


