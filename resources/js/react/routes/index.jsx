import {AuthHelper} from "../tools/AuthHelper.js";

const RoutesIndex = async () => {
    const role = AuthHelper.role()
    if (["admin",
        "employee",
        "user",
    ].includes(role)) {
        return (await import(`./${role}-routes.jsx`)).default
    }
};

export default RoutesIndex;
