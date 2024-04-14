import React from 'react';
import moment from "moment";
import getStatusColor from "../../tools/statusColors.js";

const OrderCard = ({order, onClick}) => {
    if (!order) return <></>
    return (
        <div onClick={onClick} className='position-relative rounded-4 bg-[#0F2133] bg-opacity-50 text-white p-4 pointer' >
            <h1 className='fs-2'> {moment(order.created_at).format("DD/MM/YYYY")}</h1>
            <div className='mt-4'>{order.description}</div>
            <div className="flex flex-wrap flex-row gap-1 mt-2">{order.order_items?.map(o => (
                <div className="border-1 border-[#FFF266] py-1 px-2 rounded-3" key={`${o.id}-${o.item?.id ?? o.description}`}>{o.item?.name ?? `${o.description?.slice(0,10)}...`}</div>
            ))}</div>
            <div className="text-right">{moment(order.created_at).format("hh:mm a")}</div>
            <div className={`p-2 absolute flex justify-center items-center rounded-3 min-w-[100px] -top-2 -right-2 ${getStatusColor(order.status)}`}>
                {order.status}
            </div>
        </div>
    );
};

export default OrderCard;
