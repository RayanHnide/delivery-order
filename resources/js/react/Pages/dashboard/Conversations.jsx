import React, {useEffect, useState} from 'react';
import CircleButton from "../../components/ClientComponent/CircleButton.jsx";
import DashboardLayout from "../../layouts/DashboardLayout.jsx";
import {
    Avatar,
    Button, Modal,
    ModalBody,
    ModalContent, ModalFooter,
    ModalHeader,
    Select,
    SelectItem,
    Spinner,
    useDisclosure
} from "@nextui-org/react";
import ConversationCard from "../../components/ConversationCard.jsx";
import {Api, apiFullPath} from "../../tools/ApiHelper.js";
import {useNavigate} from "react-router-dom";
import useResources from "../../hooks/useResources.ts";

const Conversations = () => {
    const nav = useNavigate();
    const {isOpen, onOpen, onClose} = useDisclosure();
    const [loading, setLoading] = useState(true)
    const [conversations, setConversations] = useState(null)
    const [selectedClient, setSelectedClient] = useState(null)
    const {data: clients} = useResources({apiRoute: "/view-all-clients"})
    const getConversationsFromServer = () => {
        setLoading(true)
        Api.get({
            path: "/messages/view-users-chat"
        }).then(r => {
            if (r.data) {
                setConversations(Object.values(r.data))
            }
        }).finally(() => setLoading(false))
    }

    useEffect(() => {
        getConversationsFromServer();
    }, []);

    if (loading) {
        return <div className="w-full h-full flex justify-center items-center">
            <Spinner />
        </div>
    }

    if (!conversations) {
        return <div className="w-full h-[90vh] flex justify-center items-center">
            <div className="text-danger text-4xl font-extrabold">Not found 404</div>
        </div>
    }

    const onStartConversation = () => {
        if (!selectedClient) return;
        nav(`/dashboard/messages/${selectedClient}/view`)
        setSelectedClient(null)
    }

    return (
        <>
            <DashboardLayout title="CONVERSATIONS" floatingButton={<CircleButton onClick={onOpen} />}>
                <div className="container mt-5 h-full gap-y-2.5">
                    {
                        conversations.length > 0 ?
                        conversations.map(c => <ConversationCard key={c.id} onClick={() => nav(`/dashboard/messages/${c.user?.id}/view`)} name={c.user?.name} lastMessage={c.message} />)
                            :
                            <div className="h-[50vh] flex justify-center items-center">
                                <div className="mb-2">
                                    there's no conversations yet
                                </div>
                                <Button onClick={onOpen} size="sm" variant="ghost" color="primary">Start Conversation</Button>
                            </div>
                    }
                </div>
            </DashboardLayout>
            <Modal hideCloseButton isDismissable={false} backdrop="blur" isOpen={isOpen} onClose={onClose}>
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1">New Conversation</ModalHeader>
                            <ModalBody className="px-10 gap-0">
                                <Select
                                    items={clients ?? []}
                                    label="Client"
                                    placeholder="Select a client"
                                    labelPlacement="outside"
                                    className="w-full"
                                    onChange={(v) => setSelectedClient(v.target.value)}
                                >
                                    {(user) => (
                                        <SelectItem key={user.id} textValue={user.name}>
                                            <div className="flex gap-2 items-center">
                                                <Avatar alt={user.name} className="flex-shrink-0" size="sm" src={user.avatar ?? apiFullPath("/person.jpg")} />
                                                <div className="flex flex-col">
                                                    <span className="text-small">{user.name}</span>
                                                    <span className="text-tiny text-default-400">{user.role}</span>
                                                </div>
                                            </div>
                                        </SelectItem>
                                    )}
                                </Select>
                            </ModalBody>
                            <ModalFooter>
                                <Button color="danger" variant="light"
                                        onPress={onClose}>
                                    Close
                                </Button>
                                <Button isDisabled={!selectedClient}
                                        color="primary"
                                        onClick={onStartConversation}>
                                    Start Conversation
                                </Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </>
    );
};

export default Conversations;
