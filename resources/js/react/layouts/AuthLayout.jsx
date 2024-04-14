import React from 'react';
import backgroundImage from "../../../assets/photo_2024-01-16_20-59-10.jpg";
import {Outlet} from "react-router-dom";

const AuthLayout = () => {
    return (
        <div style={{height:'100vh', maxWidth:"100%"}} className='sss d-flex justify-content-center align-items-center row'>
            <div className='col-md-4 d-none d-lg-flex'>
                <img style={{width:'75%'}} src={backgroundImage} alt=""/>
            </div>
            <div className='col-md-4 p-4'>
                <form className="form">
                    <div className="flex">
                        <Outlet />
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AuthLayout;
