import React, {useEffect, useState} from 'react';
import ServicesContainer from "../../components/ServicesContainer.jsx";
import {Button, Textarea} from "@nextui-org/react";
import {useNavigate} from "react-router-dom";
import {Api} from "../../tools/ApiHelper.js";
import {AuthHelper} from "../../tools/AuthHelper.js";
import {toast} from "react-toastify";

const AddOrder = () => {
    const nav = useNavigate();
    const [description, setDescription] = useState("")
    const [address, setAddress] = useState("")
    const [saving, setSaving] = useState(false)
    const [services, setServices] = useState([])

    useEffect(() => {
        setAddress(AuthHelper.user()?.address ?? "")
    }, []);
    const onSave = () => {
        if (address.length < 5) {
            toast("You have to enter order destination");
            return;
        }
        setSaving(true)
        const q = {address};
        if (description.length > 0) {
            q.description = description;
        }
        if (services.length > 0) {
            q.services = services.map(s => {
                console.log(s)
                if (!s.category?.hasItems) {
                    return {...s, categoryId: s.category?.id}
                }
                return {
                    ...s,
                    itemId: s.id,
                    categoryId: s.category?.id
                }
            })
        }
        Api.post({
            path: "/order/add",
            data: q
        }).then(r => {
            if (r?.success) {
                goBack();
            }
        }).finally(() => setSaving(false))
    }

    const goBack = () => nav("/dashboard");

    return (
        <div className='container mt-2'>
            <h1 className="text-center">New Order</h1>
            <hr/>
            <h3 className='mt-4'>
                Services
            </h3>
            <ServicesContainer onChange={(s) => setServices(s)} />
            <div className='w-100 mt-5'>
                <h3>Order Description</h3>
                <Textarea color="white" variant="underlined" maxRows={20} minRows={10} onChange={(v) => setDescription(v.target?.value ?? "")} className='w-100 rounded-top-4 bg-[#0F2133] outline-0 bg-opacity-50' placeholder='enter some extra details if you want ...' />
            </div>
            <div className='w-100 mt-5'>
                <h3>Order Destination</h3>
                <Textarea value={address} color="white" variant="underlined" maxRows={4} minRows={2} onChange={(v) => setAddress(v.target?.value ?? "")} className='w-100 rounded-top-4 bg-[#0F2133] outline-0 bg-opacity-50' placeholder='enter your current address' />
            </div>
            <div className="mt-3 flex flex-wrap flex-row justify-center gap-1">
                <Button isDisabled={saving} onClick={goBack} color="danger" >Go Back</Button>
                <Button isLoading={saving} isDisabled={!(description.length > 0 || services.length > 0)} onClick={onSave} color="primary" >Send</Button>
            </div>
        </div>
    );
};

export default AddOrder;
