import SessionService from "./session/SessionService";
import fetch from "cross-fetch";

export function postData(url: string = ``, data: object = {}, token?: string) {

    return fetch(process.env.REACT_APP_API_URL + url, {
        method: 'POST',
        mode: 'no-cors', /* Meterlo! */
        cache: 'no-cache',
        credentials: 'same-origin',
        headers: token ?
            {
                'Content-Type': 'application/json; charset=utf-8',
                Authorization: 'Rick_And_Morty ' + token
            } :
            {
                'Content-Type': 'application/json; charset=utf-8'
            },
        redirect: 'follow',
        referrer: 'no-referrer',
        body: JSON.stringify(data)
    }).then(response => {
        try {
            if (response.ok) return response.json();
            else {

                if (response.status === 401)
                    SessionService.removeData();

                return response.json().then(json => {
                    throw new Error(json.err);
                });
            }
        } catch (err) {
            return response.text().then(text => {
                throw new Error(text);
            });
        }
    });
}
