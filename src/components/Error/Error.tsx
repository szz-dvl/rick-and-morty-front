import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import "./Error.css";


export default function Error() {

    const { state } = useLocation<{ error: string }>();

    const [code, setCode] = useState<string>("");
    const [desc, setDesc] = useState<string | null>(null);

    useEffect(() => {

        if (state) {

            console.log("Error", state.error);

            if (state.error === "404") {
                setCode("~ 404 ~");
                setDesc("We can't find what you are looking for ... :(");
            } else {
                setCode("~ Unexpected error ~");
            }

        } else {
            setCode("~ 404 ~");
            setDesc("We can't find what you are looking for ... :(");
        }

    }, [state]);

    return (
        <div className="container error-container">
            <div className="error-description">
                <span className="error-description--code"> {code} </span>
                {desc && <span className="error-description--text"> {desc} </span>}
            </div>
            <img width="400" height="400" src="/404.png" alt="" />
            <Link
                className="button"
                to={{
                    pathname: "/list"
                }}
            >
                Back to app
            </Link>
        </div>
    );
}