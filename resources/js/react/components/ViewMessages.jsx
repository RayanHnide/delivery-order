import React, {useEffect, useRef, useState} from 'react';
import useResources from "../hooks/useResources.ts";
import {AuthHelper} from "../tools/AuthHelper.js";
import {useParams} from "react-router-dom";
import {Spinner, Textarea} from "@nextui-org/react";
import {IconButton} from "@mui/material";
import {MDBIcon} from "mdb-react-ui-kit";
import MessageBox from "./MessageBox.jsx";
import {Api} from "../tools/ApiHelper.js";
import websockets from "../tools/websockets.js";

const ViewMessages = () => {
    const {userId} = useParams();
    const user = AuthHelper.user();
    const bottomRef = useRef();
    const isAdmin = user?.role === "admin";
    const [message, setMessage] = useState("")
    const [sending, setSending] = useState(false)
    const [loading, setLoading] = useState(true)
    const [messages, setMessages] = useState(null)
    const getMessagesFromServer = () => {
        setLoading(true)
        Api.get({
            path: isAdmin ? `/messages/view-messages/${userId}` : "/messages/view/my-chat"
        }).then(r => {
            if (r.data) {
                setMessages(r.data)
                websockets.userSubscription(user?.role === "admin" ? userId : AuthHelper.user().id)
                websockets.userListening({onMessage: onNewMessage});
            }
        }).finally(() => setLoading(false))
    }

    const onNewMessage = (msg) => {
        setMessages(prev => [...prev, msg?.message])
    }

    useEffect(() => {
        getMessagesFromServer();
        return () => {
            websockets.userStopListening({
                callback: () => {
                    websockets.userUnSubscribe();
                }
            })
        }
    }, []);

    useEffect(() => {
        if (bottomRef.current) {
            bottomRef.current.scrollIntoView({behavior: 'smooth'});
        }
    }, [messages]);

    if (loading) {
        return <div className="w-full h-full flex justify-center items-center">
            <Spinner/>
        </div>
    }

    if (!messages) {
        return <div className="w-full h-[90vh] flex justify-center items-center">
            <div className="text-danger text-4xl font-extrabold">Not found 404</div>
        </div>
    }

    const onMessageSent = (e) => {
        if (sending || message.length === 0) return;
        e.preventDefault();
        setSending(true)
        Api.post({
            path: "/messages/send",
            hideMessage: true,
            data: {message, userId},
        }).then(r => {
            if (r.data) {
                setMessage("")
            }
        }).finally(() => setSending(false))
    }

    return (
        <div className="container">
            <h4>Messages</h4>
            <div className="h-[75vh] bg-black overflow-auto pb-3 bg-opacity-25 rounded-4">
                {messages.map(m => <MessageBox key={`message-${m.id}`} msg={m.message} date={m.created_at}
                                               fromRight={isAdmin ? !m.fromCustomer : m.fromCustomer}/>)}
                <div ref={bottomRef}/>
            </div>
            <div className="flex flex-row w-full">
                <Textarea maxRows={3} value={message} onChange={(v) => setMessage(v.target.value)}
                          className="flex-grow-1 message-input" variant="bordered" color="primary"
                          placeholder="type something..."/>
                <div onClick={onMessageSent}
                     className="pointer px-5 bg-primary bg-opacity-25 flex justify-center items-center">
                    <IconButton disabled={sending || message.length === 0} className="p-3" color="primary">
                        {sending ? <Spinner/> : <MDBIcon far icon="paper-plane"/>}
                    </IconButton>
                </div>
            </div>
        </div>
    );
};

export default ViewMessages;
