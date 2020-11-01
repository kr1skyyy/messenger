<template>
  <v-app>
    <NewChatDialog
      :dialog="newChatDialog"
      @change-dialog-status="newChatDialog = !newChatDialog"
      @channel-change="channelChange"
    />

    <v-navigation-drawer app>
      <div class="user-chats home" @click="redirectHome">
        <v-avatar color="primary" size="40">K</v-avatar>
        <a>Site Logo</a>
      </div>
      <v-divider class="separator" />

      <div v-for="channel in channels" :key="channel.chatroom" class="user-chats">
        <v-avatar color="primary" size="40">{{ channel.chatroom.charAt(0).toUpperCase() }}</v-avatar>
        <router-link :to="'/' + channel.chatroom">{{ channel.chatroom }}</router-link>
      </div>

      <v-btn
        block
        depressed
        elevation="0"
        text
        tile
        class="new-chat-btn"
        @click="newChatDialog = true"
        >New Chat</v-btn
      >
    </v-navigation-drawer>

    <v-app-bar app>
      <h1 class="title mb-2">{{ selectedChannel.chatroom || 'KIK Messenger' }}</h1>
    </v-app-bar>

    <!-- Sizes your content based upon application components -->
        <Channel :messages="messages" />
    <v-main>
      <!-- Provides the application the proper gutter -->
         <ChatboxInput :messages="messages" :showChatbox="true" :selectedChannel="selectedChannel" />
    </v-main>

    <v-footer app>
      <!-- -->
    </v-footer>
  </v-app>
</template>

<script>
import NewChatDialog from './components/Dialogs/NewChatDialog';
import Channel from './components/Channel';
import ChatboxInput from './components/ChatInput';

export default {
  name: "App",

  components: {
    NewChatDialog,
    Channel,
    ChatboxInput
  },

  data: () => ({
    newChatDialog: false,
    selectedChannel: {},
    channels: [],
    messages: [],
  }),

  methods: {
    redirectHome() {
      if (this.$router.history.current.fullPath !== "/") {
        this.$router.push({
          path: "/",
        });
      }
    },

    channelChange(data) {
      fetch('http://localhost:3000/server', {
        method: 'POST', // *GET, POST, PUT, DELETE, etc.
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data) // body data type must match "Content-Type" header
      })
      .then((res) => res.json())
      .then((channel) => {
        console.log(channel);
       // if (!this.channels.indexOf(channel)) {
          this.channels.push(channel);
        // }

        this.selectedChannel = channel;
        this.messages = channel.messages;

        console.log(this)
      });
    }
  },
};
</script>

<style lang="scss" scoped>
h1 {
  margin: 0 auto;
}

.user-chats {
  display: flex;
  height: 63px;
  align-items: center;
  justify-content: center;
  padding-right: 30px;
  font-size: 20px;

  &.home {
    cursor: pointer;
  }

  a {
    padding: 0 0 0 10px;
    text-decoration: none;
  }
}

.new-chat-btn {
  width: 90%;
  margin-top: 20px;
}

.separator {
  margin-left: 5%;
  width: 90%;
}
</style>