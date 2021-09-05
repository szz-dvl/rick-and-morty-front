import { AppStore } from "../app/store";
import { authenticate, deauthenticate } from "./sessionSlice";

enum keys {
    USER_TOKEN = "USER_TOKEN",
    USER_NAME = "USER_NAME"
}

export default class SessionService {

    private static self: SessionService;

    constructor(private store: AppStore) {}

    static init (store: AppStore) {

        if (!SessionService.self)
            SessionService.self = new SessionService(store);
        
        let token = sessionStorage.getItem(keys.USER_TOKEN);

        if (token) {
            let user = sessionStorage.getItem(keys.USER_NAME);
            SessionService.self.store.dispatch(authenticate({user, token}));
        }
    }

    static saveData (user: string, token: string) {

        sessionStorage.setItem(keys.USER_NAME, user);
        sessionStorage.setItem(keys.USER_TOKEN, token);

        SessionService.self.store.dispatch(authenticate({user, token}));
    }

    static removeData () {

        sessionStorage.removeItem(keys.USER_NAME);
        sessionStorage.removeItem(keys.USER_TOKEN);

        SessionService.self.store.dispatch(deauthenticate());
    }

    static getToken () {

        return SessionService.self.store.getState().session.token;
    }
}