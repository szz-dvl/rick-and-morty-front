import { postData } from "../../common";

export const submitLogin = async (user: string, pwd: string) => {
    
  const response = await postData('/auth/login', { user, pwd, remember: false });
  return response.token;

}
  