import { Logout } from "@mui/icons-material";
import { Button } from "@mui/material";
import React from "react";
import { useNavigate } from "react-router-dom";

function Toolbar(props) {
    const title = props.title || "Attention Network Test";
    const navigate = useNavigate()

    const logout = () => {
        localStorage.removeItem("token")
        navigate("/")
    }

    return (
        <header className="toolbar">
            <h3>{title}</h3>
            <Button variant={"text"} title={"Keluar"} onClick={logout}><Logout sx={{color: "white"}}/></Button>
        </header>
    )
}

export default Toolbar;