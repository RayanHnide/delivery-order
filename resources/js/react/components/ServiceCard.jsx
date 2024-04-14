import React, {useState} from 'react';

const ServiceCard = ({service, deletable=false, onDelete}) => {
    if (!service) return <></>
    const {name, category, unit, quantity, description} = service;
    const [showDelete, setShowDelete] = useState(false)
    return (
        <div onMouseEnter={() => setShowDelete(true)} onMouseLeave={() => setShowDelete(false)} className="bg-white relative bg-opacity-25 rounded-3">
            <div className={showDelete && deletable ? "blur-sm" : ""}>
                <div className="text-small font-light bg-[#0F2133] bg-opacity-25 text-center p-1">{category?.name}</div>
                <div className="p-3">
                    <h5>{name}</h5>
                    {quantity > 0 && unit && <div className="text-center mt-3">
                        <div className="text-4xl inline-block">{quantity}</div><div className="text-smale ml-1 inline-block">{unit}</div>
                    </div>}
                    <p className="text-[#ccc] mt-3">{description}</p>
                </div>
            </div>
            {deletable && <div onClick={onDelete} className={`h-full rounded-3 w-full bg-black bg-opacity-50 text-red-500 text-2xl top-0 bottom-0 ${showDelete ? "absolute flex justify-center items-center pointer" : "hidden"}`}>delete?</div>}
        </div>
    );
};

export default ServiceCard;
