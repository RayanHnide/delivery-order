import {AuthHelper} from "./AuthHelper.js";
import {toast} from "react-toastify";
export const ApiConnection = {
    host : "127.0.0.1",
    port : 8000,
    scheme : "http",
    soketi: {
        key: "55da66b23af9",
        host: "127.0.0.1",
        port: 6009,
        scheme: "http"
    }
}

const domain = `${ApiConnection.scheme}://${ApiConnection.host}:${ApiConnection.port}`;
export const apiFullPath = (path) => domain + path;
export const Api = {
    post: async function ({
                              path,
                              data = {},
                              hasToken = true,
                              hideMessage = false,
                              method = "post",
                          }) {
        let result = {
            message: undefined,
            success: false,
            data: null
        };
        try {
            let r = await axios.request({
                method: method.toUpperCase(),
                url: apiFullPath(`/api${path}`),
                data: method.toUpperCase() !== "GET" ? data : null,
                params: method.toUpperCase() === "GET" ? data : null,
                headers: hasToken && AuthHelper.token() ? {
                    Authorization: AuthHelper.token(),
                    Accept: "application/json"
                } : {
                    Accept: "application/json"
                }
            });
            if (r.data) {
                result = r.data;
            }
        } catch (e) {
            if (e.response?.data?.message) {
                result = {...result, message: e.response.data.message}
            } else {
                result = {...result, message: "Something Went Wrong!!"}
            }
        }
        if (!hideMessage && (method !== "GET" || (method === "GET" && !result.success)) && ((!result.success) || result.message)) {
            const msgs = result.message;
            let msg = "";
            if (typeof (msgs) === "object") {
                Object.entries(msgs).forEach(([k, v]) => {
                    msg += `[${k}] : ${v}\n`;
                })
            } else if (typeof (msgs) === "string") {
                msg = msgs;
            } else {
                msg = "something went wrong!!";
            }
            toast(msg, {type: result.success ? "success" : "error"})
        }
        return Promise.resolve(result);
    },
    get: async ({
                    path,
                    data = {},
                    hideMessage = false,
                    hasToken = true,
                }) => Api.post({
        path,
        data,
        hideMessage,
        hasToken,
        method: "GET",
    }),
}
