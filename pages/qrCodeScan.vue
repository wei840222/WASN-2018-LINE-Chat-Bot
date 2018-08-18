<template>
  <b-container fluid>
    <b-navbar toggleable="md" type="dark" variant="info">
      <b-navbar-toggle target="nav_collapse"></b-navbar-toggle>
      <b-navbar-brand><img src="logo-white.png" style="height: 30px; margin-top: -10px; margin-right: 10px;"/>QR Code 掃描</b-navbar-brand>
      <b-navbar-nav class="ml-auto" style="height: 30px; margin-top: -10px;">
        <b-form-group horizontal>
          <b-input-group>
            <b-form-input v-model="qrCodeDataString" placeholder="QR Code 資料" @change="enterQRCodeData"/>
            <b-input-group-append>
              <b-btn @click="enterQRCodeData">執行</b-btn>
              <b-btn :disabled="!qrCodeDataString" @click="qrCodeDataString = ''">清除</b-btn>
            </b-input-group-append>
          </b-input-group>
        </b-form-group>
      </b-navbar-nav>
    </b-navbar>
    <b-container>
      <hr style="margin: 5rem 0;">
      <div class="row">
        <div class="col-md-7 order-md-2">
          <h2>{{ userName }} <span class="text-muted">{{ userMsg }}</span></h2>
          <p class="lead">QR Code Data：{{ qrCodeData }}</p>
        </div>
        <div class="col-md-5 order-md-1">
          <img class="featurette-image img-fluid mx-auto" src="lunchbox.jpg" style="width: 500px; height: 500px;">
        </div>
      </div>
      <hr style="margin: 5rem 0;">
    </b-container>
  </b-container>
</template>

<script>
import axios from "../plugins/axios";

export default {
  async asyncData(context) {
    return {
      accessToken: context.query.accessToken,
      login: false
    };
  },
  async created() {
    try {
      const userInfo = atob(this.accessToken);
      try {
        const res = await axios.post("/api/config/admins/auth", {
          userName: userInfo.split(".")[0],
          passwd: userInfo.split(".")[1]
        });
        if (res.data.accessToken === this.accessToken) this.login = true;
        else this.$router.replace("/");
      } catch (err) {
        console.log(err);
        this.$router.replace("/");
      }
    } catch (err) {
      console.log(err);
      this.$router.replace("/");
    }
  },
  data() {
    return {
      qrCodeDataString: "",
      qrCodeData: null,
      userName: "",
      userMsg: "祝您用餐愉快！"
    };
  },
  methods: {
    async enterQRCodeData() {
      this.qrCodeData = await JSON.parse(this.qrCodeDataString);
      let res = null;
      if (this.qrCodeData.id && this.qrCodeData.lunchBox) {
        try {
          res = await axios.get(`/api/person/${this.qrCodeData.id}?lunchBox=${this.qrCodeData.lunchBox}`);
          this.qrCodeData = res.data;
          this.userName = res.data.name;
          this.userMsg = "祝您用餐愉快！";
        } catch (err) {
          this.qrCodeData = err.response;
          this.userName = "";
          this.userMsg = err.response.data;
        }
      } else if (this.qrCodeData.id && this.qrCodeData.dinner) {
        try {
          res = await axios.get(`/api/person/${this.qrCodeData.id}?dinner=${this.qrCodeData.dinner}`);
          this.qrCodeData = res.data;
          this.userName = res.data.name;
          this.userMsg = "祝您用餐愉快！";
        } catch (err) {
          this.qrCodeData = err.response;
          this.userName = "";
          this.userMsg = err.response.data;
        }
      }
      else if (this.qrCodeData.id && this.qrCodeData.lunchBox2) {
        try {
          res = await axios.get(`/api/person/${this.qrCodeData.id}?lunchBox2=${this.qrCodeData.lunchBox2}`);
          this.qrCodeData = res.data;
          this.userName = res.data.name;
          this.userMsg = "祝您用餐愉快！";
        } catch (err) {
          this.qrCodeData = err.response;
          this.userName = "";
          this.userMsg = err.response.data;
        }
      }
      else this.qrCodeDataString = "";
    }
  }
};
</script>
