<template>
  <v-app>
    <v-navigation-drawer v-model="drawerOpen" app>
      <div class="user-chats home" @click="usernameDialog = true">
        <v-avatar color="primary" size="40">{{
          username.charAt(0).toUpperCase()
        }}</v-avatar>
        <a>{{ username }}</a>
      </div>
      <v-divider class="separator" />

      <div
        v-for="channel in channels"
        :key="channel.chatroom"
        class="user-chats"
      >
        <v-avatar
          v-if="channel && channel.chatroom"
          color="primary"
          size="40"
          >{{ channel.chatroom.charAt(0).toUpperCase() }}</v-avatar
        >
        <router-link :to="'/' + channel.chatroom">{{
          channel.chatroom
        }}</router-link>
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
      <v-app-bar-nav-icon
        @click="drawerOpen = !drawerOpen"
      ></v-app-bar-nav-icon>
      <h1 class="title mb-2">
        {{ selectedChannel.chatroom || "KIK Messenger" }}
      </h1>
    </v-app-bar>

    <!-- Sizes your content based upon application components -->
    <v-main>
      <Channel
        :socket="socket"
        :userColor="userColor"
        :messages="messages"
        :username="username"
        :selectedChannel="selectedChannel"
        :typing="typing"
      />

      <!-- Provides the application the proper gutter -->
      <ChatboxInput
        @new-message-sent="onNewMessage"
        :socket="socket"
        :userSettings="userSettings"
        :messages="messages"
        :showChatbox="true"
        :selectedChannel="selectedChannel"
        :username="username"
      />

      <div class="hidden">
        <a v-if="forceRerender" />
        <NewChatDialog
          v-if="newChatDialog"
          :socket="socket"
          :dialog="newChatDialog"
          @change-dialog-status="newChatDialog = !newChatDialog"
        />
        <ChangeUsernameDialog
          v-if="usernameDialog"
          :userSettings="userSettings"
          :socket="socket"
          :dialog="usernameDialog"
          @user-settings-updated="updateUserSettings"
          @change-dialog-status="usernameDialog = !usernameDialog"
          @username-changed="username = $event"
        />
      </div>
    </v-main>
  </v-app>
</template>

<script>
import NewChatDialog from "./components/Dialogs/NewChatDialog";
import Channel from "./components/Channel";
import ChatboxInput from "./components/ChatInput";
import ChangeUsernameDialog from "./components/Dialogs/ChangeUsername";
import io from "socket.io-client";
import socketConfig from './helpers/socket';

const defaultUserSettings = {
  bodyColor: 'white',
  nameColor: 'green',
  fontSize: 16
};

export default {
  name: "App",
  components: {
    NewChatDialog,
    Channel,
    ChatboxInput,
    ChangeUsernameDialog,
  },

  data: () => ({
    username: '',
    userSettings: {},
    newChatDialog: false,
    usernameDialog: false,
    selectedChannel: {},
    channels: [],
    messages: [],
    socket: io("77.78.32.18:7777"),
    userColor: "red",
    drawerOpen: null,
    forceRerender: false,
    typing: []
  }),

  mounted() {
    const userSettings = localStorage.getItem('userSettings');
    this.username = localStorage.getItem('username') || 'User';

    this.updateUserSettings(userSettings ? JSON.parse(userSettings) : defaultUserSettings);

    if (this.username === 'User') this.usernameDialog = true;

    socketConfig(this);

    this.socket.emit('user-changed-server', { chatroom: 'public-chat' });
  },

  methods: {
    updateUserSettings(settings) {
      this.userSettings = settings;
      localStorage.setItem('userSettings', JSON.stringify(this.userSettings));
    },
    onNewMessage(message) {
      this.messages = this.messages.sort((a, b) => a.timestamp - b.timestamp);
      //.slice(Math.max(this.messages.length - 14, 1));
      this.messages.push(message);
      this.scrollToBottom();
    },

    scrollToBottom() {
      var chatScreen = this.$el.querySelector("#messages-field");
      console.log(chatScreen);
        chatScreen.scrollTop = chatScreen.scrollHeight;
        this.rerender()
      },
      
      rerender() {
        this.forceRerender = true;

        setTimeout(() => this.forceRerender = false, 100);
      }
  },
};
</script>

<style lang="scss">
html,
body {
  overflow: hidden !important;
}
h1 {
  margin: 0 auto;
}

main div.v-main__wrap {
  display: flex;
  flex-direction: column;
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

.hidden {
  display: none!important;
  height: 0!important;
}
</style>