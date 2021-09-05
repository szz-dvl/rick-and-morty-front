import { postData } from "../../common";

export const submitRegister = async (user: string, pwd: string, check: string) => {
  
  if (user && pwd) {

    if (pwd === check)
      return await postData('/auth/register', { user, pwd })
    else 
      return Promise.reject(new Error("Password validation failed."));    
  
  } else return Promise.reject(new Error("Missing data."));

}
  