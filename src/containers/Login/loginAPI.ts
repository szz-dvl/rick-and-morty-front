import { postData } from "../../common";

export const submitLogin = async (user: string, pwd: string, remember: boolean) => {
    
  return user && pwd ? await postData('/auth/login', { user, pwd, remember }) : Promise.reject(new Error("Missing data."));

}
  