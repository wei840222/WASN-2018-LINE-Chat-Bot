<template>
  <b-container>
    <b-card v-if="!checkined" title="輸入大會編號報到">
      <b-form>
        <b-input v-model="id" type="number" placeholder="ID"></b-input>
        <b-button variant="secondary" @click="getUserDataById">搜尋</b-button>
      </b-form>
      <div v-if="userData">
        <p class="card-text">
          大會編號：{{ userData.id }}<br/>
          姓名：{{ userData.name }}<br/>
          單位：{{ userData.school }}<br/>
          e-mail：{{ userData.email }}
        </p>
        <b-button variant="secondary" @click="checkin">報到</b-button>
      </div>
    </b-card>
    <div v-else>已經完成報到！</div>
  </b-container>
</template>

<script>
import axios from "../plugins/axios";

export default {
  async asyncData() {
    const hash = window.location.hash.substring(1).split("&");
    let uid = "";
    let checkined = false;
    hash.forEach(element => {
      if (element.includes("context_token")) {
        uid = JSON.parse(atob(element.split("=")[1].split(".")[1])).userId;
      }
    });
    const res = await axios.get(`/api/person?uid=${uid}`);
    if (res.data.length > 0 && res.data[0].checkin !== "") checkined = true;
    return {
      uid: uid,
      checkined: checkined,
      id: "",
      userData: null
    };
  },
  methods: {
    async getUserDataById() {
      const res = await axios.get(`/api/person?id=${this.id}`);
      this.userData = res.data[0];
    },
    async checkin() {
      const now = new Date(Date.now());
      const data = {
        uid: this.uid,
        checkin: now
          .toLocaleString("zh-CN", {
            timeZone: "Asia/Taipei",
            hour12: false
          })
          .replace(/\//g, "-")
      };
      const res = await axios.post(`/api/person/${this.userData._id}`, data);
      if (res.statusText === "OK") {
        this.checkined = true;
      }
    }
  }
};
</script>
