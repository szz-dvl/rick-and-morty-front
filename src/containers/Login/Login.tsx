import React, { useState, useRef } from 'react';
import { ReactComponent as ShowPassword } from '../../images/open_eye.svg';
import { ReactComponent as HidePassword } from '../../images/closed_eye.svg';
import { submit } from "./loginSlice";
import { useAppSelector, useAppDispatch } from '../../app/hooks';
import { RootState } from '../../app/store';
import './Login.css';

function Login() {

    const [nick, setNickName] = useState("");
    const [pwd, setPwd] = useState("");
    const [pwdMode, setPwdMode] = useState("password");
    const pwdRef = useRef<HTMLInputElement>(null);
    const error = useAppSelector((state: RootState) => state.login.error);
    const in_progress = useAppSelector((state: RootState) => state.login.in_progress);
    const dispatch = useAppDispatch();

    const togglePwdMode = () => {
        setPwdMode(pwdMode === "password" ? "text" : "password");

        if (pwdRef.current)
            pwdRef.current.focus();
    }

    return (
        <div className="login-container">
            <form className="login-form">

                <div className="login-field">
                    <label htmlFor="nick">
                        <span> Nick Name: </span>
                    </label>
                    <input name="nick" id="nick" type="text" value={nick} onChange={(ev) => setNickName(ev.target.value)} autoFocus />
                </div>

                <div className="login-field">
                    <label htmlFor="pwd">
                        <span> Password: </span>
                    </label>
                    <input name="pwd" id="pwd" type={pwdMode} value={pwd} onChange={(ev) => setPwd(ev.target.value)} ref={pwdRef} />

                    <span className="login-icon__pwd" onClick={() => togglePwdMode()}>
                        {pwdMode === 'password' ? <ShowPassword /> : <HidePassword />}
                    </span>
                </div>

                <input className="login-submit" type="button" value="Submit" onClick={() => dispatch(submit({ nick, pwd }))} disabled={in_progress} />

            </form>

            <p className={`login-error ${error ? "visible" : "invisible"}`}> {error} </p>
            
        </div>
    );
}

export default Login;