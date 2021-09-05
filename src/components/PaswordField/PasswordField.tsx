import React, { useRef, useState } from "react";
import { ReactComponent as ShowPassword } from '../../images/open_eye.svg';
import { ReactComponent as HidePassword } from '../../images/closed_eye.svg';
import "./PasswordField.css"

interface PasswordProps {
    set: (pwd: string) => void;
    value: string;
    extraClass?: string;
    disabled?: boolean;
    label?: string
}

export default function Password({ set, value, extraClass, disabled = false, label = "Password" }: PasswordProps) {
    
    const pwdRef = useRef<HTMLInputElement>(null);
    const [pwdMode, setPwdMode] = useState("password");

    const togglePwdMode = () => {
        setPwdMode(pwdMode === "password" ? "text" : "password");

        if (pwdRef.current)
            pwdRef.current.focus();
    }

    return (
        <div className={`${extraClass || ''} password-field`}>
            <label htmlFor="pwd">
                <span> {label}: </span>
            </label>
            <input name="pwd" id="pwd" type={pwdMode} value={value} onChange={(ev) => set(ev.target.value)} ref={pwdRef} disabled={disabled}/>

            <span className="icon__pwd" onClick={() => !disabled && togglePwdMode()}>
                {pwdMode === 'password' ? <ShowPassword /> : <HidePassword />}
            </span>
        </div>
    );
}