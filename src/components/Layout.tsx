import React from "react";
import { useAppSelector } from "../app/hooks";
import { RootState } from "../app/store";
import { ReactComponent as Register } from '../images/register.svg';
import { ReactComponent as Logout } from '../images/logout.svg';
import SessionService from "../session/SessionService";
import { Link } from "react-router-dom";

interface LayoutProps {
    children: any;
}

export default function Layout({ children }: LayoutProps) {

    const authenticated = useAppSelector((state: RootState) => state.session.authenticated);
    const user = useAppSelector((state: RootState) => state.session.user);

    return (
        <div className="App">
            <div className="App-header">
                {
                    authenticated &&
                    <span className="App-header--logout" title="Logout">
                        <Logout onClick={() => {
                            SessionService.removeData();
                        }} />
                    </span>
                }
                {
                    authenticated &&
                    <span className="App-header--logged-user">
                        @{user}
                    </span>
                }
                {
                    !authenticated &&
                    <span className="App-header--register" title="Register">
                        <Link
                            to={{
                                pathname: "/register",
                            }}
                        >
                            <Register />
                        </Link>
                    </span>
                }
            </div>
            {children}
        </div>
    );
}