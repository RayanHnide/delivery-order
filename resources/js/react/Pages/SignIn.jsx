import React, {useState} from 'react'
import { useNavigate } from 'react-router-dom'
import {Api} from "../tools/ApiHelper.js";
import {AuthHelper} from "../tools/AuthHelper.js";
import {toast} from "react-toastify";
const SignIn=()=>{
	const navigate=useNavigate()
    const [data, setData] = useState({
        phone: "",
        password: "",
    })
	function handleSignIn(e){
        e.preventDefault();
        if (data.phone.length >= 8 && data.password.length >= 6) {
            Api.post({
                path: "/login",
                data,
                hasToken: false,
            }).then((r) => {
                if (r.success) {
                    AuthHelper.setToken(r.data.token)
                    AuthHelper.setUser(r.data?.user)
                    navigate('/dashboard/all/orders')
                }
            })
        } else if (data.phone.length === 0 || data.password.length === 0) {
            toast("Phone and Password are required!", {type:"warning"})
        } else {
            toast("Wrong Phone or Password", {type:"error"})
        }
	}

    const handleChange = (value, name) => {
        setData(prevState => ({...prevState, [name] : value.target.value}))
    }
    return (
        <>
            <div className="login color">Login</div>
            <input type="tel" onChange={(e) => handleChange(e,"phone")}   placeholder='Enter Your phone number'   className="input py-4 mb-2 mt-4"/>
            <input  onChange={(e) => handleChange(e,"password")} placeholder='Enter Your password'  type="password" className="input py-4"/>
            <button className="py-2" onClick={handleSignIn}>Log-in</button>
            <br/>
            <div className="color align">Don't have account? <span onClick={() => navigate("/register")} className="span pointer">Sign-Up</span>
            </div>
        </>
    )
}
export default SignIn
