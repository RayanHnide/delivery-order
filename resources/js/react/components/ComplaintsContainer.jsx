import React, {useState} from 'react';
import {
    Button, Modal,
    ModalBody,
    ModalContent, ModalFooter,
    ModalHeader,
    Textarea, useDisclosure
} from "@nextui-org/react";
import {Api} from "../tools/ApiHelper.js";
import {AuthHelper} from "../tools/AuthHelper.js";
import moment from "moment";

const ComplaintsContainer = ({complaints = [], orderId, onUpdate}) => {
    const {isOpen, onOpen, onClose} = useDisclosure();
    const [description, setDescription] = useState("")
    const [saving, setSaving] = useState(false)
    const role = AuthHelper.role();
    const onSave = () => {
        setSaving(true);
        const role = AuthHelper.role();
        Api.post({
            path: "/add-complaint",
            data: {description, orderId}
        }).then(r => {
            if (r?.success) {
                setDescription("")
                onUpdate && onUpdate();
                onClose();
            }
        }).finally(() => setSaving(false))
    }

    if (role === "employee") {
        return <></>
    }

    return (
        <div className="mt-3">
            <h5>Complaints</h5>
            <div
                className="min-h-44 p-3 backdrop-blur-2xl bg-[#0F2133] bg-opacity-50 rounded-4 text-white">
                {
                    complaints.length > 0 ?
                        <div>
                            {complaints.map(c => (
                                <div key={`complaint-${c.id}`}>
                                    <div className="font-bold">{c.creator?.name}</div>
                                    <p className="ml-3 mb-0">{c.description}</p>
                                    <div
                                        className="text-small font-light">{moment(c.created_at).format("DD/MM/YYYY hh:mm:ss a")}</div>
                                </div>
                            ))}
                            <Button className="mt-3" onClick={onOpen} size="sm" variant="ghost"
                                    color="danger">Reply</Button>
                        </div>
                        :
                        <div className="w-full h-44 flex items-center justify-center">
                            {
                                role === "user" ? <>
                                    <div className="mb-2">
                                        have complaints?
                                    </div>
                                    <Button onClick={onOpen} size="sm" variant="ghost" color="danger">Send
                                        Complaint</Button></>
                                    :
                                    <>
                                        No Complaints yet :)
                                    </>
                            }
                        </div>
                }
                <Modal hideCloseButton isDismissable={false} backdrop="blur" isOpen={isOpen} onClose={onClose}>
                    <ModalContent>
                        {(onClose) => (
                            <>
                                <ModalHeader className="flex flex-col gap-1">Add Complaint</ModalHeader>
                                <ModalBody className="px-10 gap-0">
                                    <Textarea
                                        label="Details"
                                        color="default" variant="flat" maxRows={10} minRows={7}
                                        onChange={(v) => setDescription(v.target.value)}
                                        className='w-100 rounded-top-4 bg-[#0F2133] bg-opacity-50'
                                        placeholder="add some details ..."/>
                                </ModalBody>
                                <ModalFooter>
                                    <Button isDisabled={saving} color="danger" variant="light"
                                            onPress={onClose}>
                                        Close
                                    </Button>
                                    <Button isLoading={saving}
                                            isDisabled={description.length === 0}
                                            color="primary"
                                            onClick={onSave}>
                                        Send
                                    </Button>
                                </ModalFooter>
                            </>
                        )}
                    </ModalContent>
                </Modal>
            </div>
        </div>
    );
};

export default ComplaintsContainer;
