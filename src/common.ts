import SessionService from "./session/SessionService";

function api(url: string, method: string, data?: object | null, userOptions?: object ) {

    return new Promise<any>((resolve, reject) => {

        const token = SessionService.getToken();

        const headers: any = {
            'Content-Type': 'application/json; charset=utf-8'
        };

        if (token)
            headers.Authorization = 'Rick_And_Morty ' + token;

        let options: any = {
            method,
            mode: 'cors',
            cache: 'default',
            credentials: 'same-origin',
            headers,
            redirect: 'follow',
            referrer: 'no-referrer',
        }

        if (userOptions)
            options = { ...options, ...userOptions };

        if (data)
            options.body = JSON.stringify(data);

        fetch(process.env.REACT_APP_API_URL + url, options)
            .then(response => {

                if (response.ok)
                    return resolve(response.json());
                else {

                    if (response.status === 401)
                        SessionService.removeData();

                    return response.text().then(text => {
                        try {

                            let json = JSON.parse(text);
                            reject(new Error(json.err));

                        } catch (err) {
                            reject(new Error(text));
                        }
                    });
                }

            }).catch(reject);
    });
}

export function postData(url: string = ``, data: object = {}, options?: object) {

    return api(url, "POST", data, options);

}

export function getData(url: string = ``, options?: object) {

    return api(url, "GET", null, options);

}

export function deleteData(url: string = ``, options?: object) {

    return api(url, "DELETE", null, options);

}

