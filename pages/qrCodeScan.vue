<template>
  <b-container fluid>
    <b-navbar toggleable="md" type="dark" variant="info">
      <b-navbar-toggle target="nav_collapse"></b-navbar-toggle>
      <b-navbar-brand><img href="/" src="logo-white.png" style="height: 30px; margin-top: -10px; margin-right: 10px;"/>QR Code 掃描</b-navbar-brand>
    </b-navbar>
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
  }
};
</script>
