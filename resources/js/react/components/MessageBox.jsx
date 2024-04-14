import React from 'react';
import moment from "moment";

const MessageBox = ({msg, date, fromRight=false}) => {
    return (
        <div className={`flex gap-2 rounded-4 mb-2 flex-wrap bg-opacity-50 p-1 ${fromRight ? "ml-10 lg:ml-60 bg-primary" : "mr-10 lg:mr-60 bg-black"}`}>
            <div className={`${fromRight ? "ml-10" : "mr-10"} p-2`}>
                {msg?.split("\n")?.map(m => <>{m}<br/></>)}
            </div>
            <div className="flex items-end mr-2">
                {date && <div className="text-center">
                    <div className="text-small">{moment(date).format("hh:mm a")}</div>
                    <div className="text-tiny">{moment(date).format("DD/MM/YYYY")}</div>
                </div>}
            </div>
        </div>
    );
};

export default MessageBox;
