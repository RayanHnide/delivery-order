import React from 'react';
import avatar from "../../../assets/person.jpg";
const ConversationCard = ({name, lastMessage, photo, onClick}) => {
    return (
        <div onClick={onClick} className="pointer h-[80px] overflow-hidden flex flex-row gap-2.5 backdrop-blur-2xl bg-[#0F2133] bg-opacity-50 rounded-4 text-white">
            <img className="h-full w-[80px]" src={photo ?? avatar} alt=""/>
            <div className="flex justify-center">
                <div className="text-2xl font-extrabold">{name}</div>
                <div className="text-small">{lastMessage}</div>
            </div>
        </div>
    );
};

export default ConversationCard;
