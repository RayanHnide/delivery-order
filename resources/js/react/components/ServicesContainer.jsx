import React, {useEffect, useMemo, useState} from 'react';
import AddCircleIcon from "@mui/icons-material/AddCircle";
import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Button,
    useDisclosure,
    Select,
    SelectItem, Autocomplete, AutocompleteItem, Input, Textarea
} from "@nextui-org/react";
import useResources from "../hooks/useResources.ts";
import {useDebounce} from "primereact/hooks";
import {Api} from "../tools/ApiHelper.js";
import ServiceCard from "./ServiceCard.jsx";

const ServicesContainer = ({initialOrders = [],onChange}) => {
    const {data: categories, refresh} = useResources({apiRoute: "/category/view", disableAutoStart:true})
    const {isOpen, onOpen, onClose} = useDisclosure();
    const [_, searchItemDebounce, setSearchItem] = useDebounce("", 400);
    const [fetchingItems, setFetchingItems] = useState(false);
    const [saving, setSaving] = useState(false);
    const [items, setItems] = useState([]);
    const [state, setState] = useState({
        selectedCategory: null,
        amount: 0,
        description: "",
        unit: null
    })

    const [order, setOrder] = useState(initialOrders)

    const getItemsFromCategory = (pattern) => {
        if (!state.selectedCategory?.id) return;
        setFetchingItems(true)
        Api.get({
            path: `/item/view/${state.selectedCategory?.id}`,
            data: {pattern},
        }).then(r => {
            setItems(r?.success && r?.data ? r?.data : [])
        }).finally(() => setFetchingItems(false))
    }

    useEffect(() => {
        if (onChange) {
            refresh();
        }
    }, []);

    useEffect(() => {
        setItems([])
        setSearchItem("")
        setState(prev => ({...prev, description: "", unit: null, amount: 0}))
    }, [state.selectedCategory?.id]);

    useEffect(() => {
        getItemsFromCategory(searchItemDebounce)
    }, [searchItemDebounce]);

    const addServiceToOrders = ({id, name, quantity, unit, categoryId, description = ""}) => {
        const cat = categories?.find(c => c.id === categoryId)
        if (cat) {
            const q = {id, name, quantity, unit, category: cat};
            if (description.length > 0) {
                q["description"] = description;
            }
            setOrder(prev => {
                const s = [...prev, q];
                onChange && onChange(s)
                return s
            })
        }
    }
    const handleState = (value, name) => {
        const v = typeof (value) === "string" ? value : (value?.target?.value ? value?.target?.value : value)
        setState(prev => ({...prev, [name]: v}))
    }

    const onSave = () => {
        if (state.selectedCategory?.hasItems) {
            const itm = items.find(i => i.name === searchItemDebounce);
            if (itm) {
                AddAndClose(itm);
                return;
            }
            setSaving(true)
            Api.post({
                path: "/item/add",
                hideMessage:true,
                data: {
                    name: searchItemDebounce,
                    categoryId: state.selectedCategory?.id,
                    unit: state.unit
                }
            }).then(r => {
                if (r.data) {
                    AddAndClose(r.data)
                }
            }).finally(() => setSaving(false))
        } else {
            AddAndClose({categoryId: state.selectedCategory?.id,description: state.description})
        }
    }
    const AddAndClose = (itemToBeAdded,hasItems=true) => {
        if (hasItems) {
            addServiceToOrders({...(itemToBeAdded ?? {}), quantity: state.amount, description: state.description})
        } else {
            addServiceToOrders(itemToBeAdded)
        }
        setState({
            selectedCategory: null,
            amount: 0,
            description: "",
            unit: null,
        })
        setSearchItem("")
        setItems([])
        onClose();
    }

    const onItemDeleted = (id) => {
        setOrder(prev => {
            const s = prev.filter(p => p.id !== id);
            onChange && onChange(s)
            return s
        })
    }

    const unit = useMemo(() => {
        if (searchItemDebounce.length === 0) return null
        const itm = items.find(i => i.name === searchItemDebounce);
        if (itm) {
            return <div className="w-[45%]">
                <div className="text-medium font-light pb-0">unit</div>
                <p>{itm.unit}</p>
            </div>
        }
        return <>
            <Select
                label="Unit"
                placeholder="Select a unit"
                variant="underlined"
                className="w-[45%] mb-2"
                onChange={(v) => {
                    handleState(v, "unit")
                }}
            >
                {["kg", "piece", "litre", "box", "meter"].map((u) => (
                    <SelectItem key={u} value={u}>
                        {u}
                    </SelectItem>
                ))}
            </Select>
        </>
    }, [searchItemDebounce])

    return (
        <>
            <div
                className='position-relative min-h-60 px-3 py-5 backdrop-blur-2xl bg-[#0F2133] bg-opacity-50 rounded-4 text-white mb-4 w-100'>
                <div className="grid grid-cols-3 lg:grid-cols-5 gap-1">
                    {order.map(s => <ServiceCard key={`added-service-${s.name}`} deletable={onChange} onDelete={() => onItemDeleted(s.id)} service={s} />)}
                </div>
                {onChange && <div className="absolute bottom-2.5 right-2.5" onClick={onOpen}>
                    <AddCircleIcon sx={{fontSize: '50px', cursor: 'pointer'}}/>
                </div>}
            </div>
            {onChange && <Modal hideCloseButton isDismissable={false} backdrop="blur" isOpen={isOpen} onClose={onClose}>
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1">Add Service</ModalHeader>
                            <ModalBody className="px-10 gap-0">
                                <Select
                                    label="Category"
                                    placeholder="Select a category"
                                    variant="underlined"
                                    className="w-full mt-3 mb-2"
                                    onChange={(v) => {
                                        handleState(categories?.find(c => c.id === parseInt(v.target.value)), "selectedCategory")
                                    }}
                                >
                                    {categories.map((category) => (
                                        <SelectItem key={category.id} value={category.id}>
                                            {category.name}
                                        </SelectItem>
                                    ))}
                                </Select>
                                {state.selectedCategory?.hasItems && (
                                    <>
                                        <Autocomplete
                                            className="mb-2"
                                            variant="underlined"
                                            isLoading={fetchingItems}
                                            defaultItems={items}
                                            onInputChange={(v) => setSearchItem(v)}
                                            label="Item of service"
                                            placeholder="Select an item"
                                            selectionMode="single"
                                            allowsCustomValue
                                        >
                                            {(item) => (
                                                <AutocompleteItem key={item.name} className="capitalize">
                                                    {item.name}
                                                </AutocompleteItem>
                                            )}
                                        </Autocomplete>
                                        {
                                            unit &&
                                            <div className="mt-3 flex flex-wrap flex-row justify-between align-bottom">
                                                {unit}
                                                <Input type="number" min={0} variant="underlined" className="w-[45%]"
                                                       label="amount"
                                                       onChange={(v) => handleState(v, "amount")}
                                                />
                                            </div>
                                        }
                                    </>
                                )
                                }
                                {state.selectedCategory &&
                                    <Textarea label={state.selectedCategory?.hasItems ? "Details (optional)": "Details"} color="default" variant="flat" maxRows={5} minRows={3}
                                              onChange={(v) => handleState(v, "description")}
                                              className='w-100 rounded-top-4 bg-[#0F2133] bg-opacity-50'
                                              placeholder={state.selectedCategory?.hasItems ? 'enter some extra details if you want ...' : "enter some details ..."}/>}

                            </ModalBody>
                            <ModalFooter>
                                <Button isDisabled={saving} color="danger" variant="light" onPress={onClose}>
                                    Close
                                </Button>
                                <Button isLoading={saving}
                                        isDisabled={!state.selectedCategory?.id || (state.selectedCategory?.hasItems ? (state.amount === 0) : (state.description.length === 0))}
                                        color="primary"
                                        onClick={onSave}>
                                    Add
                                </Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>}
        </>
    );
};

export default ServicesContainer;
