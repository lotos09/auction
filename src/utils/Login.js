import React, {useContext, useEffect} from "react";
import {Button} from "@mui/material";
import {Context} from "../index";
import firebase from "firebase/compat";

export const Login = () => {
    const {auth} = useContext(Context);

    const loginHandler = async () => {
        const provider = new firebase.auth.GoogleAuthProvider()
        const {user} = await auth.signInWithPopup(provider)
        console.log(user)
    }

    return (
            <Button color="inherit" onClick={loginHandler}>login</Button>
    )
}