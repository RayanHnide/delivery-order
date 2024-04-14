import OrderDetails from "../Pages/dashboard/OrderDetails.jsx";
import ViewMessages from "../components/ViewMessages.jsx";

export default {
    viewMessages: {
        path: "messages/:userId/view",
        element: <ViewMessages />
    },
    orderDetails: {
        path: "orders/:orderId/details",
        element: <OrderDetails />
    },
    separatedOrders: [
        {
            label: "All Orders",
            icon : "layer-group",
            path: "all/orders",
        },
        {
            label: "Pending Orders",
            icon : "pause-circle",
            path: "pending/orders",
        },
        {
            label: "In-Progress",
            icon : "tasks",
            path: "in-progress/orders",
        },
        {
            label: "Completed Orders",
            icon : "check",
            path: "done/orders",
        },
        {
            label: "Canceled Orders",
            icon : "trash",
            path: "canceled/orders",
        },
    ]
}
