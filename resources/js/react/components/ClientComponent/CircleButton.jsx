import React from 'react';
import {Fab} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";

export default function CircleButton({onClick, icon}) {
    if (!icon) {
        icon = <AddIcon/>
    }
    return (
        <>
            <div className="App p-4">
                <Fab onClick={onClick} style={{
                    position:'absolute',
                    bottom:'0',
                    right:'0',

                }}
                >
                    {icon}
                </Fab>
            </div>
        </>
    );
}
