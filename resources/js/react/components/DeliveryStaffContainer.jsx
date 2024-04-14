import React, {useEffect, useState} from 'react';
import {
    Avatar,
    Button, Modal,
    ModalBody,
    ModalContent, ModalFooter,
    ModalHeader, Select, SelectItem,
    useDisclosure, User
} from "@nextui-org/react";
import {Api, apiFullPath} from "../tools/ApiHelper.js";
import {AuthHelper} from "../tools/AuthHelper.js";
import useResources from "../hooks/useResources.ts";

const DeliveryStaffContainer = ({deliveryGuy, editable=false, orderId, onUpdate}) => {
    const {isOpen, onOpen, onClose} = useDisclosure();
    const [selectedDelivery, setSelectedDelivery] = useState(deliveryGuy?.id)
    const {data, refresh} = useResources({apiRoute: "/view-all-staff", disableAutoStart:true})
    const [saving, setSaving] = useState(false)
    const role = AuthHelper.role();
    const onSave = () => {
        setSaving(true);
        const role = AuthHelper.role();
        Api.post({
            path: `/employee-for-order/${orderId}`,
            data: {employeeId: selectedDelivery}
        }).then(r => {
            if (r?.success) {
                onUpdate && onUpdate();
                onClose();
            }
        }).finally(() => setSaving(false))
    }

    useEffect(() => {
        if (role === "admin") {
            refresh();
        }
    }, []);

    if (role === "employee" || (role === "user" && !deliveryGuy)) {
        return <></>
    }

    return (
        <div className="mt-3">
            <h5>Delivery Staff</h5>
            <div
                className="p-3 backdrop-blur-2xl bg-[#0F2133] bg-opacity-50 rounded-4 text-white">
                {
                    deliveryGuy ?
                        <>
                            <div>
                                <User
                                    name={deliveryGuy?.name}
                                    description={deliveryGuy?.role}
                                    avatarProps={{
                                        src: apiFullPath("/person.jpg")
                                    }}
                                />
                            </div>
                            {editable && role !== "user" && <Button className="mt-3" onClick={onOpen} size="sm" variant="ghost" color="danger">Change Delivery Guy</Button>}
                        </>
                        :
                        <div className="w-full h-44 flex items-center justify-center">
                            <div className="mb-2">
                                this order has no delivery guy
                            </div>
                            {editable && <Button onClick={onOpen} size="sm" variant="ghost" color="primary">Set Delivery Guy</Button>}
                        </div>
                }
                <Modal hideCloseButton isDismissable={false} backdrop="blur" isOpen={isOpen} onClose={onClose}>
                    <ModalContent>
                        {(onClose) => (
                            <>
                                <ModalHeader className="flex flex-col gap-1">Delivery Guy Assigning</ModalHeader>
                                <ModalBody className="px-10 gap-0">
                                    <Select
                                        items={data ?? []}
                                        label="Assigned to"
                                        placeholder="Select delivery guy"
                                        labelPlacement="outside"
                                        className="w-full"
                                        defaultSelectedKeys={[`${selectedDelivery}`]}
                                        onChange={(v) => setSelectedDelivery(v.target.value)}
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
                                    <Button isDisabled={saving} color="danger" variant="light"
                                            onPress={onClose}>
                                        Close
                                    </Button>
                                    <Button isLoading={saving}
                                            isDisabled={selectedDelivery === deliveryGuy?.id}
                                            color="primary"
                                            onClick={onSave}>
                                        Save
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

export default DeliveryStaffContainer;
