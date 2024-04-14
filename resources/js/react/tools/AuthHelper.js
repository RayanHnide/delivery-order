
export const AuthHelper = {
    token: () => {
        if (localStorage.hasOwnProperty("t")) {
            return "Bearer " + localStorage.getItem("t");
        }
        return undefined;
    },
    setToken : (token) => {
        localStorage.setItem("t",token)
    },
    user : () => {
        if (localStorage.hasOwnProperty("user")) {
            return JSON.parse(localStorage.getItem("user"));
        }
        return undefined;
    },
    setUser : (user) => {
        localStorage.setItem("user",JSON.stringify(user))
    },
    logout : () => {
        localStorage.removeItem('user');
        localStorage.removeItem('t');
    },
    role : () => {
        return AuthHelper.user()?.role;
    }
}
