import React from "react";

export default ({title, floatingButton, children}) => {
    return (
        <>
            <div className="pb-3 pt-1" style={{borderBottom:'2px solid rgb(147, 199, 250)'}}>
                {
                    typeof(title) === "string" ? <h1 className="text-center fw-bold">
                        {title}
                    </h1> : title
                }
            </div>
            {floatingButton && <div style={{position:'fixed',right:'20px',top:'30px',zIndex:'999'}}>
                {floatingButton}
            </div>}
            {children}
        </>
    )
}
