import React, {useEffect} from 'react';
import {useNavigate} from "react-router-dom";

const LandingPage = () => {
    const navigate = useNavigate();
    useEffect(() => {
        navigate("/login");
    }, [])
    return (
        <></>
    );
};

export default LandingPage;
