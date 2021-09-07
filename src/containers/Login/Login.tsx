import React, { useState, FormEvent, useEffect, useRef } from 'react';
import { clean, submit } from "./loginSlice";
import { useAppSelector, useAppDispatch } from '../../app/hooks';
import { RootState } from '../../app/store';
import Password from '../../components/PaswordField/PasswordField';
import NickLabel from '../../components/NickLabel';
import { useHistory } from 'react-router-dom';
import './Login.css';

export default function Login() {

    const [nick, setNickName] = useState("");
    const [pwd, setPwd] = useState("");
    const [remember, setRemember] = useState(false);

    const error = useAppSelector((state: RootState) => state.login.error);
    const in_progress = useAppSelector((state: RootState) => state.login.in_progress);

    const dispatch = useAppDispatch();
    const history = useHistory();

    const submitForm = (ev: FormEvent) => {
        ev.preventDefault();

        if (!in_progress)
            dispatch(submit({ nick, pwd, remember, history }));
    }

    const errorTo = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {

        if (error) {

            if (errorTo.current)
                clearTimeout(errorTo.current);

            errorTo.current = setTimeout(() => {
                dispatch(clean());
            }, parseInt(process.env.REACT_APP_ERR_TO as string));
        }

    }, [error, dispatch]);

    return (
        <div className="form-container">
            <form className="login-form" onSubmit={submitForm}>

                <div className="login-field">
                    <label htmlFor="nick">
                        <NickLabel />
                    </label>
                    <input name="nick" id="nick" type="text" value={nick} onChange={(ev) => setNickName(ev.target.value)} autoFocus />
                </div>

                <Password set={setPwd} value={pwd} extraClass="login-field" />

                <div className="login-check">
                    <label htmlFor="remember">
                        <span> Remember me </span>
                    </label>
                    <input name="remember" id="remember" type="checkbox" onChange={(ev) => setRemember(ev.target.checked)} />
                </div>

                <input className="login-submit button" type="submit" value="Submit" onClick={submitForm} disabled={in_progress} />

            </form>

            <p className={`login-error ${error ? "opaque" : "transparent"}`}> {error} </p>

        </div>
    );
}