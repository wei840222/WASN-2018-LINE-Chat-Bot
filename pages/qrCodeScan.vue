<template>
  <b-container>
    QR Code 掃描
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
        console.log(res);
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
