/** Inspired by:  https://www.npmjs.com/package/redux-react-session */

import { AppStore } from "../app/store";
import { authenticate, deauthenticate } from "./sessionSlice";

enum keys {
    USER_TOKEN = "USER_TOKEN",
    USER_NAME = "USER_NAME"
}

export default class SessionService {

    private storage: Storage;
    private static self: SessionService;

    constructor(private store: AppStore) {
        switch(process.env.REACT_APP_STORAGE) {
            case "local":
                this.storage = localStorage;
                break;
            case "session":
            default:
                this.storage = sessionStorage;
                break;
        }
    }

    static init (store: AppStore) {

        if (!SessionService.self)
            SessionService.self = new SessionService(store);
        
        let token = SessionService.self.storage.getItem(keys.USER_TOKEN);

        if (token) {
            let user = SessionService.self.storage.getItem(keys.USER_NAME);
            SessionService.self.store.dispatch(authenticate({user, token}));
        }
    }

    static saveData (user: string, token: string) {

        SessionService.self.storage.setItem(keys.USER_NAME, user);
        SessionService.self.storage.setItem(keys.USER_TOKEN, token);

        SessionService.self.store.dispatch(authenticate({user, token}));
    }

    static removeData () {

        SessionService.self.storage.removeItem(keys.USER_NAME);
        SessionService.self.storage.removeItem(keys.USER_TOKEN);

        SessionService.self.store.dispatch(deauthenticate());
    }

    static getToken () {

        return SessionService.self.store.getState().session.token;
    }
}