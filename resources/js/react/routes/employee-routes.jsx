import Complaints from "../Pages/dashboard/Client/Complaints.jsx";
import AllOrders from "../Pages/dashboard/AllOrders.jsx";
import common from "./common.jsx";
export default {
    sidebar : [
        ...common.separatedOrders
    ],
    subRoutes : [
        common.orderDetails,
        {
            path: ":status/orders",
            element: <AllOrders role="employee" />
        }
    ]
}
