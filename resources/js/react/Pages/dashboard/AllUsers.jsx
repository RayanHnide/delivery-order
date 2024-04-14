import React, {useEffect, useMemo, useState} from 'react';
import DashboardLayout from "../../layouts/DashboardLayout.jsx";
import useResources from "../../hooks/useResources.ts";
import {
    Avatar,
    Button,
    Input,
    Modal,
    ModalBody,
    ModalContent,
    ModalFooter,
    ModalHeader, Select, SelectItem, Spinner,
} from "@nextui-org/react";
import {Api, apiFullPath} from "../../tools/ApiHelper.js";

const AllUsers = () => {
    const [saving, setSaving] = useState(false)
    const [selectedUser, setSelectedUser] = useState(null)
    const [state, setState] = useState(null)
    const {data, loading, refresh} = useResources({apiRoute: "/view-all-users"})

    const isSaveDisabled = useMemo(() => {
        if (!selectedUser || !state?.name?.length > 0 || !state?.phone?.length > 0) return true;
        return (state?.name === selectedUser?.name && state?.address === (selectedUser?.address ?? "") && state?.phone === selectedUser?.phone && state?.role === selectedUser?.role)
    }, [state, selectedUser])

    useEffect(() => {
        setState({
            name: selectedUser?.name ?? "",
            address: selectedUser?.address ?? "",
            phone: selectedUser?.phone ?? "",
            role: selectedUser?.role ?? "",
        })
    }, [selectedUser]);

    if (loading) {
        return <div className="w-full h-full flex justify-center items-center">
            <Spinner />
        </div>
    }

    const onUserClicked = (user) => {
        setSelectedUser(user)
    }

    const onSave = () => {
        if (!selectedUser || !state) return;
        setSaving(true)
        const d = {};
        Object.entries(state).forEach(([k,v]) => {
            if (v?.length > 0 && selectedUser[k] !== v) {
                d[k] = v;
            }
        })
        Api.post({
            path: `/edit-user/${selectedUser?.id}`,
            data: d
        }).then(r => {
            if (r?.success) {
                onModalClose();
                refresh();
            }
        }).finally(() => setSaving(false))
    }

    const handleState = (value, name) => {
        const v = typeof (value) === "string" ? value : (value?.target?.value ? value?.target?.value : value)
        setState(prev => ({...prev, [name]: v}))
    }

    const onModalClose = () => setSelectedUser(null)

    return (
        <>
            <DashboardLayout title="Users">
                <div className="grid grid-cols-2 lg:grid-cols-5 container gap-3 mt-10">
                    {data.map((user) => (
                        <div key={`${user.name}-${user.id}`} className="flex flex-row gap-2 items-center">
                            <Avatar onClick={() => onUserClicked(user)} alt={user.name} className="flex-shrink-0 pointer" size="lg" src={user.avatar ?? apiFullPath("/person.jpg")} />
                            <div onClick={() => onUserClicked(user)} className="flex flex-col pointer">
                                <span className="text-large">{user.name}</span>
                                <span className="text-small text-default-300">{user.role}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </DashboardLayout>

            <Modal hideCloseButton isDismissable={false} backdrop="blur" onClose={onModalClose} isOpen={Boolean(state?.name?.length > 0)}>
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1">User Details</ModalHeader>
                            <ModalBody className="px-10 gap-1">
                                <Input defaultValue={state?.name} variant="underlined" label="name" onChange={(v) => handleState(v,"name")} />
                                <Input defaultValue={state?.phone} variant="underlined" label="phone" onChange={(v) => handleState(v,"phone")} />
                                <Input defaultValue={state?.address} variant="underlined" label="address" onChange={(v) => handleState(v,"address")} />
                                <Select
                                    disallowEmptySelection
                                    label="role"
                                    placeholder="select a role"
                                    variant="underlined"
                                    className="w-full mt-3 mb-2"
                                    defaultSelectedKeys={[state?.role]}
                                    onChange={(v) => handleState(v,"role")}
                                >
                                    {["admin","employee","user"].map((s) => (
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
                                        isDisabled={Boolean(isSaveDisabled)}
                                        color="primary"
                                        onClick={onSave}>
                                    Update
                                </Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </>
    )
};

export default AllUsers;
