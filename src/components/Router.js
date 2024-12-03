import React, { useState } from "react";
import { Routes, Route } from "react-router-dom";
import Auth from "../routes/Auth";
import Home from "../routes/Home";
import Nav from "./Nav";
import Profile from "../routes/Profile";

const AppRouter = ({isLoggedIn, userObj}) =>{
    return(
        <>
        <h1>Post Board</h1>
        {isLoggedIn && <Nav/>}
        <Routes>
            {isLoggedIn ? (
                <>
                <Route path="/" element={<Home userObj={userObj}/>}></Route>
                <Route path="/profile" element={<Profile/>}></Route>
                </>
            )
            : (
                <Route path="/" element={<Auth/>}></Route>
            )
            }
        </Routes>
        </>
    )
}

export default AppRouter;