<template>
  <v-row justify="center">
    <v-dialog
      v-model="dialog"
      persistent
      max-width="600px"
    >
      <v-card>
        <v-card-title>
          <span class="headline">Channel Select</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col
                cols="12"
                sm="12"
                md="12"
              >
                <v-text-field
                  label="Chat Room Name*"
                  v-model="chatRoom"
                  required
                ></v-text-field>
              </v-col>
              <v-col
                cols="12"
                sm="12"
                md="12"
              >
                <v-text-field
                  v-model="password"
                  label="Password*"
                  type="password"
                  required
                ></v-text-field>
              </v-col>
            </v-row>
          </v-container>
          <small>*indicates required field</small>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="blue darken-1"
            text
            @click="changeDialogStatus"
          >
            Close
          </v-btn>
          <v-btn
            color="blue darken-1"
            text
            @click="sendData"
          >
            Connect
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script>
  export default {
    props: ['dialog', 'socket'],
    data() {
        return {
            chatRoom: '',
            password: ''
        }
    },
    methods: {
        changeDialogStatus() {
            this.$emit('change-dialog-status');
        },

        sendData() {
          this.socket.emit('user-changed-server', {
              chatroom: this.chatRoom,
              password: this.password
          });
          this.changeDialogStatus();
        }
    }
  }
</script>