import React from 'react';
import moment from "moment";
import {useNavigate} from "react-router-dom";

const ComplaintsComponent = ({complaints = []}) => {
    const nav = useNavigate();
    if (complaints.length === 0) return <></>
    const lastComplaint = complaints[complaints.length - 1];
    const client = complaints.find(c => c.isReply === 0)?.creator;
    const order = lastComplaint.order;

    const onClick = () => {
        nav(`/dashboard/orders/${order.id}/details`)
    }

    return (
        <div onClick={onClick} className='position-relative rounded-4 bg-[#0F2133] bg-opacity-50 text-white p-4 pointer' >
            <div>last time updated</div>
            <h1 className='fs-2'>{moment(lastComplaint.created_at).format("DD/MM/YYYY hh:mm a")}</h1>
            <div className="font-light">order:</div>
            <div className='mt-1'>{order.description}</div>
            <div className='mt-1'>services: ({order.itemsCount})</div>
            <hr/>
            <div className="font-light">last complaint:</div>
            <div>{lastComplaint.description}</div>
            <div className={`p-2 absolute flex justify-center items-center rounded-3 min-w-[100px] -top-2 -right-2 bg-[#FFF266] text-black`}>
                {client.name}
            </div>
        </div>
    );
};

export default ComplaintsComponent;
