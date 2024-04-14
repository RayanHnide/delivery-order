import React, {useEffect} from 'react';
import {useNavigate, useParams} from "react-router-dom";
import DashboardLayout from "../../layouts/DashboardLayout.jsx";
import CircleButton from "../../components/ClientComponent/CircleButton.jsx";
import OrderCard from "../../components/ClientComponent/OrderCard.jsx";
import useResources from "../../hooks/useResources.ts";
import {Spinner} from "@nextui-org/react";

const AllOrders = ({role="user"}) => {
    const {status} = useParams();
    const nav = useNavigate()
    const {data, loading, refresh} = useResources({
        apiRoute: "/view/my-orders",
        data: {status}
    })

    useEffect(() => {
        refresh();
    }, [status]);

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
            <DashboardLayout title={`${status.toUpperCase()} ORDERS`} floatingButton={role === "user" && <CircleButton onClick={() => nav("/dashboard/orders/new-order")} />} >
                <div className="flex container gap-3 mt-10">
                    {data?.map((o) => <OrderCard key={`order-${o.id}`} onClick={() => nav(`/dashboard/orders/${o.id}/details`)} order={o}/>)}
                </div>
            </DashboardLayout>

        </>
    )
};

export default AllOrders;
