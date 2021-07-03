<template>
<div>
  <v-form @submit="sendMessage">
    <div v-if="showChatbox" class="chatbox">
      <div class="chatbox-holder">
        <v-text-field
          id="chatbox"
          v-model="currentMessage"
          v-on:change="emitTyping"
          label="Enter a message here.."
          outlined
        ></v-text-field>
      </div>
      <v-btn id="sendbtn" type="submit">Send</v-btn>
    </div>
  </v-form>
</div>
</template>

<script>
export default {
  props: ["messages", "showChatbox", "selectedChannel", "username", "socket", "typing", "userSettings"],
  data() {
    return {
      currentMessage: "",
    };
  },
  methods: {
    sendMessage(e) {
      e.preventDefault();
      if (this.currentMessage) {
        const channelObject = {
          message: {
            author: this.username,
            body: this.currentMessage,
            timestamp: new Date().getTime(),
            bodyColor: this.userSettings.bodyColor,
            fontSize: this.userSettings.fontSize,
            nameColor: this.userSettings.nameColor,
          },
          chatroom: this.selectedChannel.chatroom,
        };
        this.selectedChannel.chatroom !== 'public-chat' ? channelObject.password = this.selectedChannel.password : null;

        this.socket.emit('new-message-added', channelObject);

        this.$emit("new-message-sent", channelObject.message);
        this.currentMessage = '';
      }
    },

    emitTyping() {
      this.socket.emit('typing', {user: this.username, chatroom: this.selectedChannel.chatroom});
      setTimeout(() => { this.socket.emit('stopTyping', {user: this.username, chatroom: this.selectedChannel.chatroom}) }, 2000);
    }
  },
};
</script>

<style lang="scss">
.v-input__slot fieldset {
  border: none !important;
}

.chatbox {
  height: 14%;
  position: absolute;
  bottom: 0;
  left: 20px;
  margin: 10px 0;

  width: 100%;
  padding-right: 20px;
  display: flex;
  align-items: center;
  justify-content: space-evenly;

  .chatbox-holder {
    width: 100%;
    margin: auto;
    border-radius: 25px;
    background-color: rgba($color: #000000, $alpha: 0.3);

    .v-input__control {
      padding: 10px;
      width: 100%;
      height: 80px;
      border-bottom-style: none !important;
      caret-color: unset !important;

      #chatbox {
        margin: 0 auto;
        width: 100%;
        height: 200px;
      }
    }
  }

  #sendbtn {
    display: inline-block;
    width: 10%;
    margin: 0 20px;
  }
}
</style>