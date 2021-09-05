import React, { useState } from "react";

export default function RNick() {
    
    const [label, setLabel] = useState("Nick Name");

    return (
        <span onMouseEnter={() => setLabel("Rick Name")} onMouseLeave={() => setLabel("Nick Name")}>
            {label}:
        </span>
    );
}