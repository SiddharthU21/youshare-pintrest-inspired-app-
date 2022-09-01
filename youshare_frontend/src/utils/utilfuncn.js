
import jwt_decode from 'jwt-decode';

export const loginhandler = (resp) => {

     const decoded = jwt_decode(resp.credential);

    // console.log(decoded);

    const { sub , name , picture} = decoded;

    // console.log(picture);
    
    const userdoc = {
        _id : sub,
        _type : 'user',
        userName : name,
        image : picture
    }

    return userdoc;
 }

export const fetchuser = () => {
    
  const userInfo = localStorage.getItem('user') !== 'undefined' ? JSON.parse(localStorage.getItem('user')) : localStorage.clear();

  return userInfo;

}