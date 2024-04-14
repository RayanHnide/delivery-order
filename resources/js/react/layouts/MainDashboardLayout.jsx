import React from "react";
import SideBar from "../components/ClientComponent/SideBar.jsx";
import {Outlet} from "react-router-dom";

export default ({routes}) => {
    return (
        <div className="main-dashboard">
            <div className="main-contents">
                <SideBar routes={routes}/>
                <div className="p-5 ml-10">
                    <div className="text-white">
                        <Outlet />
                    </div>
                </div>
            </div>
        </div>
    )
}
