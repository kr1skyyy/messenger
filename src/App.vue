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
      <!-- for each chat <div class="user-chats">
      <v-avatar color="primary" size="40">K</v-avatar>
      <router-link to="/">Home</router-link>
    </div> -->
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
      <h1 class="title mb-2">KIK Messenger</h1>
    </v-app-bar>

    <!-- Sizes your content based upon application components -->
    <v-main>
      <!-- Provides the application the proper gutter -->
      <v-container fluid>
        <!-- If using vue-router -->
        <router-view></router-view>
      </v-container>
    </v-main>

    <v-footer app>
      <!-- -->
    </v-footer>
  </v-app>
</template>

<script>
import NewChatDialog from './components/Dialogs/NewChatDialog';

export default {
  name: "App",

  components: {
    NewChatDialog
  },

  data: () => ({
    newChatDialog: false
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
      fetch(`http://localhost:3000/server?chatroom=${encodeURIComponent(data.chatroom)}&password=${encodeURIComponent(data.password)}`)
      .then((res) => res.json())
      .then((channel) => console.log(channel));
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