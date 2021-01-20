<template>
  <div>
    <div>User Id: {{ user.id }}</div>
    <div>First Name: <input type="text" v-model="user.firstname" /></div>
    <div>Last Name: <input type="text" v-model="user.lastname" /></div>
    <button @click="saveProfile">Save</button>
  </div>
</template>

<script>
import * as _userService from "../services/userService";

const { BroadcastChannel } = require("broadcast-channel");
const channel = new BroadcastChannel("users");
export default {
  name: "EditUser",
  components: {},
  props: [],
  data: () => ({
    user: { id: 0, firstname: "", lastname: "" },
  }),
  methods: {
    load(id) {
      channel.onmessage = (msg) => console.log(msg);
      _userService.getUser(id).then((result) => {
        this.user = result.user;
      });
    },
    saveProfile() {
      _userService.saveUser(this.user).then((result) => {
        channel.postMessage("User id: " + this.user.id + " has been changed...");
        window.blur();
      });
    },
  },
  computed: {},
  watch: {},
  mounted: function() {
    const params = this.$route.params;
    let id = 0;
    if (params != null && params.id != null) id = params.id;
    this.load(id);
  },
};
</script>

<style></style>
