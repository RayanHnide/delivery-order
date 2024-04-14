import DashboardLayout from "../../../layouts/DashboardLayout";
import React from "react";
import ComplaintsComponent from "../../../components/ClientComponent/ComplaintsComponent.jsx";
import useResources from "../../../hooks/useResources.ts";
import {Spinner} from "@nextui-org/react";

const Complaints = () => {
    const {data, loading} = useResources({apiRoute: "/view-my-complaints"})

    if (loading) {
        return <div className="w-full h-full flex justify-center items-center">
            <Spinner />
        </div>
    }

    if (!data) {
        return <div className="w-full h-[90vh] flex justify-center items-center">
            <div className="text-danger text-4xl font-extrabold">Not found 404</div>
        </div>
    }

    return (
        <DashboardLayout title=" Complaints">
            <div className="flex container gap-3 mt-10">
                {
                    Object.values(data).map((complaints, i) =>  {
                        return (
                            <>
                                <ComplaintsComponent key={`complaint-${i}`} complaints={complaints} />
                            </>
                        )
                    })
                }
            </div>
        </DashboardLayout>
    )
}
export default Complaints
