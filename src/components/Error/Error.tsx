import React from "react";
import "./Error.css";


export default function Error() {
    return (
        <div className="error-container">
            <div className="error-description">
                <span className="error-description--code"> ~ 404 ~ </span>
                <span className="error-description--text"> We can't find what you are looking for ... :(</span>
            </div>
            <img width="400" height="400" src="/404.png" />
            <input type="button" value="Back to app" />
        </div>
    );
}