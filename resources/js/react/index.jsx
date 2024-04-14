import {createRoot} from 'react-dom/client';
import {
    createBrowserRouter, createRoutesFromElements, Route,
    RouterProvider, Routes,
} from "react-router-dom";
import SignIn from "./Pages/SignIn.jsx";
import Dashboard from "./Pages/dashboard";
import LandingPage from "./Pages/index.jsx";
import {ToastContainer} from "react-toastify";
import 'react-toastify/dist/ReactToastify.min.css';
import '../../css/Home.css'
import React from "react";
import AuthLayout from "./layouts/AuthLayout.jsx";
import SignUp from "./Pages/SignUp.jsx";
import {NextUIProvider} from "@nextui-org/react";

const routes = createBrowserRouter(
    createRoutesFromElements(
        <Route>
            <Route path="/*" element={<AuthLayout/>}>
                <Route index element={<LandingPage/>}/>
                <Route path="login" element={<SignIn/>}/>
                <Route path="register" element={<SignUp/>}/>
            </Route>
            <Route path="/dashboard/*" element={<Dashboard/>}/>
        </Route>
    )
)

const root = createRoot(document.getElementById('react-app'));
root.render(<>
    <ToastContainer
        position="top-right"
        autoClose={4000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
    />
    <NextUIProvider>
        <RouterProvider router={routes}/>
    </NextUIProvider>
</>);
