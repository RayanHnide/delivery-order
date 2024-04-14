import {ApiConnection, apiFullPath} from "./ApiHelper.js";
import {AuthHelper} from "./AuthHelper.js";
import Pusher from "pusher-js";
import Echo from "laravel-echo";

export default {
    initialize: () => {
        if (!window.Echo) {
            window.Pusher = Pusher;
            window.Echo = new Echo({
                broadcaster: 'pusher',
                key: ApiConnection.soketi.key,
                wsHost: ApiConnection.soketi.host,
                wsPort: ApiConnection.soketi.port,
                wssPort: ApiConnection.soketi.port,
                forceTLS: ApiConnection.soketi.scheme === "https",
                encrypted: true,
                disableStats: true,
                enabledTransports: ['ws', 'wss'],
                cluster: "mt1",
                auth: AuthHelper.token() && {
                    headers: {Authorization: AuthHelper.token()}
                },
            });
        }
    },
    userSubscription: (userId) => {
        window.userChannel = window.Echo.private(`user.${userId}`);
    },
    userListening: ({onMessage}) => {
        window.userChannel.listen("UserMessageEvent", onMessage)
    },
    userStopListening: ({callback}) => {
        window.userChannel.stopListening("UserMessageEvent",callback)
    },
    userUnSubscribe: () => {
        window.userChannel.cancelSubscription();
    }
}
