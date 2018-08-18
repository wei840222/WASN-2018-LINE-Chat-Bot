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
            </b-input-group-append>
          </b-input-group>
        </b-form-group>
      </b-navbar-nav>
    </b-navbar>
    <b-container>
      <hr style="margin: 5rem 0;">
      <div class="row">
        <div class="col-md-7 order-md-2">
          <h2>Oh yeah, it's that good. <span class="text-muted">See for yourself.</span></h2>
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
      qrCodeData: null
    };
  },
  methods: {
    enterQRCodeData() {
      this.qrCodeData = JSON.parse(this.qrCodeDataString);
      this.qrCodeDataString = "";
      alert(this.qrCodeData.id)
    }
  }
};
</script>
