import React, {useState} from 'react';
import {useNavigate} from "react-router-dom";
import {Api} from "../tools/ApiHelper.js";
import {AuthHelper} from "../tools/AuthHelper.js";
import {toast} from "react-toastify";

const SignUp = () => {
    const navigate=useNavigate()
    const [data, setData] = useState({
        name: "",
        address: "",
        phone: "",
        password: "",
        passwordConfirmation: "",
    })
    function handleRegister(e){
        e.preventDefault();
        if (data.name.length > 0 && data.phone.length >= 8 && data.password.length >= 6 && data.passwordConfirmation === data.password) {
            const d = {...data};
            if (data.address.length === 0) {
                delete d["address"];
            }
            Api.post({
                path: "/signup",
                data: d,
                hasToken: false,
            }).then((r) => {
                if (r.success) {
                    AuthHelper.setToken(r.data.token)
                    AuthHelper.setUser(r.data?.user)
                    navigate('/dashboard/all/orders')
                }
            })
        } else if (data.phone.length === 0 || data.password.length === 0 || data.passwordConfirmation.length === 0 || data.name.length === 0) {
            toast("Name, Phone, Password and Password Confirmation are required!", {type:"warning"})
        } else {
            toast("Password and Password Confirmation are mismatching", {type:"error"})
        }
    }

    const handleChange = (value, name) => {
        setData(prevState => ({...prevState, [name] : value.target.value}))
    }
    return (
        <>
            <div className="login color">Sign-up</div>
            <input value={data.name} type="text" onChange={(e) => handleChange(e,"name")}   placeholder='Enter Your Name'   className="input py-4 mb-2 mt-4"/>
            <input value={data.address} type="text" onChange={(e) => handleChange(e,"address")}   placeholder='Enter Your Address'   className="input py-4"/>
            <input value={data.phone} type="tel" onChange={(e) => handleChange(e,"phone")}   placeholder='Enter Your phone number'   className="input py-4 mb-2 mt-4"/>
            <input value={data.password}  onChange={(e) => handleChange(e,"password")} placeholder='Enter Your password'  type="password" className="input py-4"/>
            <input value={data.passwordConfirmation}  onChange={(e) => handleChange(e,"passwordConfirmation")} placeholder='Re-Type Your password'  type="password" className="input py-4 mt-2"/>
            <button className="py-2" onClick={handleRegister}>Register</button>
            <br/>
            <div className="color align">already have an account? <span onClick={() => navigate("/login")} className="span pointer">Login</span>
            </div>
        </>
    )
};

export default SignUp;
