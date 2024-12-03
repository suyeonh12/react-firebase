import React from "react";
import { Link } from "react-router-dom";

const Nav = () => 
    <>
    <h2>navigation</h2>
    <nav>
        <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/profile">Profile</Link></li>
        </ul>
    </nav>
    </>

export default Nav;