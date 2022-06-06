import React from "react";

function Toolbar(props) {
    const title = props.title || "Attention Network Test";
    return (
        <header className="toolbar">
            <h3>{title}</h3>
        </header>
    )
}

export default Toolbar;