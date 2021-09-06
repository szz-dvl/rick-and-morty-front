import React, { useState, FormEvent, useEffect, useRef } from 'react';
import { submit, clean } from "./registerSlice";
import { useAppSelector, useAppDispatch } from '../../app/hooks';
import { RootState } from '../../app/store';
import Password from '../../components/PaswordField/PasswordField';
import NickLabel from '../../components/NickLabel';
import { Link, useHistory } from "react-router-dom";
import './Register.css';

export default function Register() {

    const [nick, setNickName] = useState("");
    const [pwd, setPwd] = useState("");
    const [check, setPwdCheck] = useState("");

    const error = useAppSelector((state: RootState) => state.register.error);
    const in_progress = useAppSelector((state: RootState) => state.register.in_progress);

    const dispatch = useAppDispatch();
    const history = useHistory();

    const submitForm = (ev: FormEvent) => {
        ev.preventDefault();

        if (!in_progress)
            dispatch(submit({ nick, pwd, check, history }));
    }

    const errorTo = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {

        if (error) {

            if (errorTo.current)
                clearTimeout(errorTo.current);

            errorTo.current = setTimeout(() => {
                dispatch(clean());
            }, parseInt(process.env.REACT_APP_ERR_TO as string))

        }

    }, [error, dispatch]);

    return (
        <div className="register-container">
            <form className="register-form" onSubmit={submitForm}>

                <div className="register-field">
                    <label htmlFor="nick">
                        <NickLabel />
                    </label>
                    <input name="nick" id="nick" type="text" value={nick} onChange={(ev) => setNickName(ev.target.value)} autoFocus />
                </div>

                <Password set={setPwd} value={pwd} extraClass="register-field" />

                <Password set={setPwdCheck} value={check} extraClass="register-field" disabled={!pwd} label="Password check" />

                <input className="register-submit" type="submit" value="Submit" onClick={submitForm} disabled={in_progress} />

                <Link
                    to={{
                        pathname: "/",
                    }}
                >
                    <input className="register-submit" type="button" value="Cancel" disabled={in_progress} />
                </Link>
            </form>

            <p className={`register-error ${error ? "opaque" : "transparent"}`}> {error} </p>

        </div>
    );
}