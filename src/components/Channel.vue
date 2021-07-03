<template>
  <div id="messages-field" v-if="messages">
      <CustomUserMessage v-for="message in messages" :key="message.timestamp" :message="message" />
    <v-chip id="isTypingChip" v-if="typing.length" >
        {{ getTypingUsersNames() }}
    </v-chip>
  </div>
</template>

<script>
import CustomUserMessage from './User/UserMessage';

export default {
  props: ["messages", "selectedChannel", "userColor", "socket", "typing"],
  components: {
    CustomUserMessage,
  },
  methods: {
    updateChannelFeed() {
      this.socket.emit("user-changed-server", {
        chatroom: this.selectedChannel.chatroom,
        password: this.selectedChannel.password,
      });
    },

    getTypingUsersNames() {
      const typing = this.typing;
      if (typing.length === 1) return `${typing[0]} is typing..`;
      if (typing.length >= 5) return `${typing.length} people are typing..`;

      return typing.reduce((acc, elem, index) => index < typing.length - 1 ? acc += `${elem} and ` : acc += `${elem} are typing..`, '');
    },
  },
};
</script>

<style lang="scss">
#messages-field {
  margin-left: 30px;
  padding-bottom: 10px;
  display: inline-block;
  overflow-y: scroll;
  max-height: calc(100vh - 200px);
}

#isTypingChip {
  position: absolute;
  bottom: 110px;
}
</style>