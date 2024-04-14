import React, {useMemo, useState} from 'react';
import {AuthHelper} from "../tools/AuthHelper.js";
import {
    Button,
    Modal,
    ModalBody,
    ModalContent,
    ModalFooter,
    ModalHeader, Select, SelectItem, Spinner,
    useDisclosure
} from "@nextui-org/react";
import {Api} from "../tools/ApiHelper.js";
import getStatusColor from "../tools/statusColors.js";

const OrderStatus = ({status="pending", orderId, onUpdate}) => {
    const statusColor = useMemo(() => {
        return getStatusColor(status)
    }, [status])
    const {isOpen, onOpen, onClose} = useDisclosure();
    const role = AuthHelper.role();
    const commonClass = "p-2 min-w-[100px] absolute flex justify-center items-center rounded-3 z-2 top-2 -right-2"
    const [showEdit, setShowEdit] = useState(false)
    const [saving, setSaving] = useState(false)
    const [selectedStatus, setSelectedStatus] = useState(status)
    const editable = !saving && (status === "pending" || (role !== "user" && status !== "canceled"));
    const text = showEdit ? (role === "user" ? "Cancel?" : "Edit?") : status;

    const onStatusClicked = () => {
        if (text === "Cancel?") {
            sendToApi("canceled");
        } else if (text === "Edit?") {
            onOpen();
        }
    }

    const sendToApi = (newStatus) => {
        setSaving(true)
        Api.post({
            path: `/change-status-order/${orderId}`,
            data: {status: newStatus}
        }).then(r => {
            if (r?.success) {
                onUpdate && onUpdate();
            }
        }).finally(() => setSaving(false))
    }

    return (
        <>
            <div
                onMouseEnter={editable ? () => setShowEdit(true) : null}
                onMouseLeave={editable ? () => setShowEdit(false) : null}
                onClick={onStatusClicked}
                className={`${commonClass} ${statusColor} ${editable ? "pointer" : ""}`}>
                { saving ? <Spinner /> : text}
            </div>
            <Modal hideCloseButton isDismissable={false} backdrop="blur" isOpen={isOpen} onClose={onClose}>
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1">Change Order Status</ModalHeader>
                            <ModalBody className="px-10 gap-0">
                                <Select
                                    label="status"
                                    placeholder="change the status"
                                    variant="underlined"
                                    className="w-full mt-3 mb-2"
                                    defaultSelectedKeys={[selectedStatus]}
                                    onChange={(v) => setSelectedStatus(v.target.value)}
                                >
                                    {["pending","canceled","in-progress","done"].map((s) => (
                                        <SelectItem key={s} value={s}>
                                            {s.toUpperCase()}
                                        </SelectItem>
                                    ))}
                                </Select>
                            </ModalBody>
                            <ModalFooter>
                                <Button isDisabled={saving} color="danger" variant="light"
                                        onPress={onClose}>
                                    Close
                                </Button>
                                <Button isLoading={saving}
                                        isDisabled={selectedStatus === status}
                                        color="primary"
                                        onClick={() => {
                                            sendToApi(selectedStatus);
                                            onClose();
                                        }}>
                                    Change
                                </Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </>
    );
};

export default OrderStatus;
