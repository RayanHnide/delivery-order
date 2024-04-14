import Complaints from "../Pages/dashboard/Client/Complaints.jsx";
import AllOrders from "../Pages/dashboard/AllOrders.jsx";
import common from "./common.jsx";
import AllUsers from "../Pages/dashboard/AllUsers.jsx";
import Conversations from "../Pages/dashboard/Conversations.jsx";
export default {
    sidebar : [
        ...common.separatedOrders,
        {
            label: "Complaints",
            icon : "frown",
            path: "complaints",
            element: <Complaints />
        },
        {
            label: "Users",
            icon : "users",
            path: "users",
            element: <AllUsers />
        },
        {
            label: "Messages",
            icon : "comment",
            path: "messages",
            element: <Conversations />
        },
    ],
    subRoutes : [
        common.orderDetails,
        common.viewMessages,
        {
            path: ":status/orders",
            element: <AllOrders role="admin" />
        }
    ]
}
