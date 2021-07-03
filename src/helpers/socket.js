export default function (vue) {
    vue.socket.on("connect", () => {
        vue.socket.emit('user-connected', vue.username);
    });

    vue.socket.on("server-changed", (channel) => {
        var chatScreen = document.getElementById("messages-field");
        chatScreen.scrollTop = chatScreen.scrollHeight;
        // vue.channels.push(channel);
        // console.log(channel);
        // vue.channels = [...new Set(vue.channels.map(item => item.chatroom))];

        vue.selectedChannel = channel;
        vue.messages = channel.messages ?
            channel.messages
            .sort((a, b) => a.timestamp - b.timestamp) :
            // .slice(Math.max(channel.messages.length - 15, 1)) :
            [];
    });

    vue.socket.on("new-message-sent", (channel) => {       
        if (vue.selectedChannel.chatroom === channel.chatroom) {
            vue.messages = channel.messages ?
                channel.messages
                .sort((a, b) => a.timestamp - b.timestamp) :
                // .slice(Math.max(channel.messages.length - 15, 1)) :
                [];  
        }
    });

    vue.socket.on('typing', (data) => {
        if (data.chatroom === vue.selectedChannel.chatroom) vue.typing.push(data.user);
    });

    vue.socket.on('stopTyping', (data) => {
        if (data.chatroom === vue.selectedChannel.chatroom) vue.typing = vue.typing.filter((typer) => typer !== data.user);
    });

    window.onbeforeunload = () => {
        vue.socket.emit('user-disconnected', `${vue.username} from ${vue.selectedChannel.chatroom}`);
    }
}