<template>
  <div class="home">
    <div class="half-screen">
      <h5>Users</h5>
      <hr />
      <div style="text-align:left">
        <div v-for="u in users" :key="u.id">
          <button @click="edit(u.id)">Edit</button>
          {{ u.firstname }} {{ u.lastname }}
        </div>
      </div>
    </div>
    <div class="half-screen">
      <h5>Options</h5>
      <hr />
      <div><label>Screen Width:</label> <input type="number" v-model.number="width" /></div>
      <div><label>Screen Height:</label> <input type="number" v-model.number="height" /></div>
      <div><label>Top *:</label> <input type="number" v-model.number="top" /></div>
      <div><label>Left *:</label> <input type="number" v-model.number="left" /></div>
      <div><label>Window for each user:</label> <input type="checkbox" v-model="windowPerUser" /></div>
      <br />
      <p>* Top/Left are relative to the primary screen. If the user has multiple monitors the new window will always open on the primary screen.</p>
      <p>Once a windows is opened it will remember it's location if minimized, even if it is moved to a second screen. (it will NOT be remembered if you close the window)</p>
    </div>
    <p>
      How does this work? Browsers have supported JavaScript <code>window.open</code> for years, but we seldom take advantage of it's options.<br /><code>window.open(<i>url</i>, <i>name</i>, <i>options</i>)</code><br />
      So when opening a new window here we callilng it like so:<br /><code>window.open('edituser/1', 'EditUser', <br />'resizable=no,scrollbars=no,status=no,height=150,width=300,top=300,left=300')</code><br />
    </p>
    <p>See <a href="https://developer.mozilla.org/en-US/docs/Web/API/Window/open" target="_blank">Mozilla Docs</a> for more information.</p>
    <p>
      To communicate between different windows you can use the <a href="https://developer.mozilla.org/en-US/docs/Web/API/BroadcastChannel" target="_blank">BroadCastChannel API</a>, however it does not supported by older browsers or Safari. This site
      is using a NPM package (<a href="https://www.npmjs.com/package/broadcast-channel" target="_blank">broadcast channel</a>) that brings support to 'all' broswers.
    </p>
    <p>Broadcast-channel can be thought of as an event bus that works across same domain windows. You create a channel with a key name, then any window can listen to events on that channel and act accordingly.</p>
  </div>
</template>

<script>
// @ is an alias to /src
import HelloWorld from "@/components/HelloWorld.vue";

import * as _userService from "../services/userService";

const { BroadcastChannel } = require("broadcast-channel");
const channel = new BroadcastChannel("users");
let windowObjectReference = null;
let previousUrl = "";
export default {
  name: "Home",
  components: {
    HelloWorld,
  },
  props: ["value"],
  data: () => ({
    users: [],
    width: 300,
    height: 150,
    top: 300,
    left: 300,
    windowPerUser: false,
  }),
  methods: {
    load() {
      console.log("loading...");
      _userService.getUsers().then((result) => {
        this.users = result.users;
      });
    },
    edit(id) {
      let windowName = "EditUser";
      if (this.windowPerUser) windowName += id;
      let url = "#/edituser/" + id;
      let options = "resizable=no,scrollbars=no,status=no";
      options += ",height=" + this.height;
      options += ",width=" + this.width;
      options += this.windowPerUser ? ",top=" + parseInt(this.top + id * 40) : ",top=" + this.top;
      options += this.windowPerUser ? ",left=" + parseInt(this.left + id * 40) : ",left=" + this.left;
      console.log(options);
      if (windowObjectReference == null || windowObjectReference.closed) {
        windowObjectReference = window.open(url, windowName, options);
      } else if (previousUrl != url) {
        windowObjectReference = window.open(url, windowName, options);
        windowObjectReference.focus();
        previousUrl == url;
      } else {
        windowObjectReference.focus();
      }
      //alert("edit id: " + id);
    },
  },
  computed: {},
  watch: {},
  mounted: function() {
    this.load();
    channel.onmessage = (msg) => {
      console.log(msg);
      this.load();
    };
  },
};
</script>

<style>
.home {
  text-align: left;
}
.half-screen {
  display: inline-block;
  width: 45%;
  padding: 15px;
  vertical-align: text-top;
}
label,
input {
  width: 100px;
}
input[type="number"] {
  text-align: right;
}
code {
  font-size: 16px;
  color: green;
}
</style>
