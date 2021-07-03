<template>
  <v-row justify="center">
    <v-dialog v-model="dialog" persistent max-width="600px">
      <v-card>
        <v-card-title>
          <span class="headline">User Profile</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-text-field
              label="Username"
              v-model="username"
              required
            ></v-text-field>
            <div class="form__field swatch-picker">
              <div class="form__label">
                <strong>Name Color:</strong>
              </div>
              <div class="form__input">
                <VSwatches
                  v-model="nameColor"
                  row-length="6"
                  shapes="circles"
                  show-border
                ></VSwatches>
              </div>

              <div class="form__label">
                <strong>Text message color:</strong>
              </div>
              <div class="form__input">
                <VSwatches
                  v-model="bodyColor"
                  row-length="6"
                  shapes="circles"
                  show-border
                ></VSwatches>
              </div>
            </div>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="changeDialogStatus">
            Close
          </v-btn>
          <v-btn color="blue darken-1" text @click="changeUsername">
            Update profile
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script>
import VSwatches from "vue-swatches";

export default {
  components: {
    VSwatches,
  },
  props: ["dialog", "userSettings"],
  data() {
    const userSettings = this.userSettings && this.userSettings.bodyColor ? this.userSettings : JSON.parse(localStorage.getItem('userSettings'));
  console.log(userSettings);
    return {
      disabled: true,
      username: localStorage.getItem('username') || 'User',
      bodyColor: userSettings.bodyColor || "#FFFFFF",
      nameColor: userSettings.nameColor || "green",
      fontSize: 16,
    };
  },
  mounted() {
    console.log((this.userSettings));
    this.bodyColor = this.userSettings.bodyColor;
    this.nameColor = this.userSettings.nameColor;
  },

  methods: {
    changeDialogStatus() {
      this.$emit("change-dialog-status");
    },
    changeUsername() {

      localStorage.setItem("username", this.username);
      this.$emit("username-changed", this.username);
      this.$emit("user-settings-updated", Object.assign(this.userSettings, { bodyColor: this.bodyColor, nameColor: this.nameColor }));
      this.changeDialogStatus();
    },
  },
};
</script>

<style lang="scss">
.swatch-picker {
  display: flex;
  justify-content: space-between;
}

.vue-swatches__container {
  background-color: unset!important;
}
</style>