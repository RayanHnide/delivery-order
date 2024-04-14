import React, {useEffect, useState} from 'react';
import {Navigate, Route, Routes, useNavigate} from "react-router-dom";
import {AuthHelper} from "../../tools/AuthHelper.js";
import routesResolver from "../../routes";
import MainDashboardLayout from "../../layouts/MainDashboardLayout";
import {Spinner} from "@nextui-org/react";
import websockets from "../../tools/websockets.js";

const Dashboard = () => {
    const navigate = useNavigate();
    const [routes, setRoutes] = useState(null)
    useEffect(() => {
        if (AuthHelper.token()){
            getRoutes();
            websockets.initialize();
        } else {
            navigate("/login", {replace: true})
        }
    },[])

    const getRoutes = async () => {
        const r = (await routesResolver());
        if (r) {
            setRoutes(r)
        } else {
            navigate("/login", {replace: true})
        }
    }

    if (routes) {
        return <Routes>
            <Route path="*" element={<MainDashboardLayout routes={routes.sidebar} />}>
                <Route index element={<Navigate to={routes.sidebar[0].path} replace />} />
                {
                    routes.sidebar.map((r,i) => {
                        if (r?.element) {
                            return <Route key={`dashboard-main-routes-${i}`} path={r.path} element={r.element} />
                        }
                    })
                }
                {
                    routes.subRoutes?.map((r,i) => <Route key={`dashboard-sub-routes-${i}`} path={r.path} element={r.element} />)
                }
            </Route>
        </Routes>
    }

    return (
        <div className="w-full h-full flex justify-center items-center">
            <Spinner />
        </div>
    );
};

export default Dashboard;
