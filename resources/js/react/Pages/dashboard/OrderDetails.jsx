import React from 'react';
import {useNavigate, useParams} from "react-router-dom";
import useResources from "../../hooks/useResources.ts";
import moment from "moment";
import ServicesContainer from "../../components/ServicesContainer.jsx";
import {ArrowBackIos} from "@mui/icons-material";
import {IconButton} from "@mui/material";
import ComplaintsContainer from "../../components/ComplaintsContainer.jsx";
import OrderStatus from "../../components/OrderStatus.jsx";
import DeliveryStaffContainer from "../../components/DeliveryStaffContainer.jsx";
import {apiFullPath} from "../../tools/ApiHelper.js";
import {Spinner, User} from "@nextui-org/react";

const OrderDetails = () => {
    const nav = useNavigate();
    const {orderId} = useParams();
    const {data, loading, refresh} = useResources({
        apiRoute: `/order/${orderId}/details`
    })
    if (loading) {
        return <div className="w-full h-full flex justify-center items-center">
            <Spinner />
        </div>
    }

    if (!data) {
        return <div className="w-full h-[90vh] flex justify-center items-center">
            <div className="text-danger text-4xl font-extrabold">Not found 404</div>
        </div>
    }

    return (
        <>
            <IconButton color="inherit" onClick={() => nav("/dashboard/all/orders")}>
                <ArrowBackIos/>
            </IconButton>
            <div className="text-center mb-5">
                <User
                    name={data?.user?.name}
                    description={data?.user?.phone}
                    avatarProps={{
                        src: apiFullPath("/person.jpg")
                    }}
                />
                <h5> {data?.created_at && moment(data?.created_at).format("DD/MM/YYYY hh:mm:ss a")}</h5>
            </div>
            <div className="container min-h-96">
                <div className="relative">
                    <OrderStatus onUpdate={refresh} orderId={data?.id} status={data?.status} />
                    <h5>Services</h5>
                    <ServicesContainer initialOrders={data?.order_items?.map(o => ({
                        id: o.item?.id,
                        name: o.item?.name,
                        unit: o.item?.unit,
                        quantity: o.quantity,
                        description: o.description,
                        category: o.category,
                    }))}/>
                </div>
                <h5>Order Description</h5>
                <div
                    className="min-h-44 p-3 backdrop-blur-2xl bg-[#0F2133] bg-opacity-50 rounded-4 text-white">
                    {data?.description}
                </div>
                <h5 className="mt-3">Order Destination</h5>
                <div
                    className="min-h-20 p-3 backdrop-blur-2xl bg-[#0F2133] bg-opacity-50 rounded-4 text-white">
                    {data?.address}
                </div>
                <ComplaintsContainer orderId={data?.id} onUpdate={refresh} complaints={data?.complaints} />
                <DeliveryStaffContainer editable={data?.status !== "canceled"} orderId={data?.id} onUpdate={refresh} deliveryGuy={data?.employee} />
            </div>
        </>
    );
};

export default OrderDetails;
