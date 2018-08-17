<template>
  <b-container fluid>
    <b-navbar toggleable="md" type="dark" variant="info">
      <b-navbar-toggle target="nav_collapse"></b-navbar-toggle>
      <b-navbar-brand><img src="logo-white.png" style="height: 30px; margin-top: -10px; margin-right: 10px;"/>WASN 2018</b-navbar-brand>
      <b-modal v-model="loginShow" title="登入" ok-only="true" ok-title="登入" @ok="login">
        <b-form-group :description="loginMsg">
          <b-form-input id="userName" type="text" v-model="userName" required placeholder="帳號"/>
          <br/>
          <b-form-input id="passwd" type="password" v-model="passwd" required placeholder="密碼"/>
        </b-form-group>
      </b-modal>
    </b-navbar>
  </b-container>
</template>

<script>
import axios from "../plugins/axios";

export default {
  data() {
    return { loginShow: true, loginMsg: "", userName: "", passwd: "" };
  },
  methods: {
    login() {
      axios
        .post("/api/config/admins/auth", {
          userName: this.userName,
          passwd: this.passwd
        })
        .then(res => {
          console.log(err);
          if (res.status === 200) {
            this.$router.push({
              path: "/admin",
              query: { accessToken: res.data.accessToken }
            });
          } else {
            this.loginMsg = "帳號或密碼錯誤，請重新輸入";
            this.loginShow = true;
          }
        })
        .catch(err => {
          console.log(err);
          this.loginMsg = "帳號或密碼錯誤，請重新輸入";
          this.loginShow = true;
        });
    }
  }
};
</script>
