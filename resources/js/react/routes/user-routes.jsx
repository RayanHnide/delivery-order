import Complaints from "../Pages/dashboard/Client/Complaints.jsx";
import AddOrder from "../Pages/dashboard/AddOrder.jsx";
import AllOrders from "../Pages/dashboard/AllOrders.jsx";
import OrderDetails from "../Pages/dashboard/OrderDetails.jsx";
import common from "./common.jsx";
import {AuthHelper} from "../tools/AuthHelper.js";
import ViewMessages from "../components/ViewMessages.jsx";

const userId = AuthHelper.user()?.id;
export default {
    sidebar: [
        {
            label: "Home",
            icon: "home",
            path: "all/orders",
        },
        {
            label: "Messages",
            icon: "comment",
            path: `messages/${userId}/view`,
        },
    ],
    subRoutes: [
        {
            path: "orders/new-order",
            element: <AddOrder />
        },
        {
            path: ":status/orders",
            element: <AllOrders role="user" />
        },
        common.viewMessages,
        common.orderDetails
    ]
}
