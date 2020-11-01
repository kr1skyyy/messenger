<template>
    <div v-if="showChatbox" class="chatbox">
        <div class="chatbox-holder">
            <v-text-field id="chatbox" v-model="currentMessage" label="Enter a message here.."></v-text-field>
        </div>
        <v-btn id="sendbtn" @click="sendMessage">Send</v-btn>
    </div>
</template>

<script>
export default {
    props: ['messages', 'showChatbox', 'selectedChannel'],
    data() {
        return {
            currentMessage: ''
        }
    },
    methods: {
        sendMessage() {
            fetch('', {
                message: this.currentMessage,
                chatroom: this.selectedChannel.chatroom,
                password: this.selectedChannel.password
            });
        }
    }
}
</script>

<style lang="scss">
.chatbox {
    display: flex;
    align-items: center;
    justify-content: space-evenly;

    .chatbox-holder {
        width: 90%;
        margin: auto;
        border-radius: 25px;
        background-color: rgba($color: #000000, $alpha: 0.3);

        div div {
            padding: 10px;
            width: 100%;
            height: 100px;
            border: none;
            #chatbox {
                margin: 0 auto;
                width: 90%;
                height: 200px;
            }
        }
    }

    #sendbtn {
        display: inline-block;
        margin-right: 20px;
    }
}
</style>