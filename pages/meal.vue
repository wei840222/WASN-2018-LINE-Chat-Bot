<template>
  <b-container>
    <div v-if="checkined">
      <b-card title="午餐便當餐券" :img-src="qrCodeUrlLunchBox" img-top>
        <p class="card-text">渴望會館-B1-綠灣餐廳</p>
        <div slot="footer">
          <small class="text-muted">2018/8/26 11:30~13:00</small>
        </div>
        </b-card>
        <b-card title="晚宴餐券" :img-src="qrCodeUrlDinner" img-top>
        <p class="card-text">渴望會館-B1-渴望餐廳</p>
        <div slot="footer">
          <small class="text-muted">2018/8/26 18:30~20:30</small>
        </div>
      </b-card>
    </div>
    <div v-else>請報到後再查看</div>
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
    const now = new Date(Date.now());
    return {
      checkined: checkined,
      now: now
        .toLocaleString("zh-CN", {
          timeZone: "Asia/Taipei",
          hour12: false
        })
        .replace(/\//g, "-"),
      userData: res.data[0],
      // 方碼科技 QR Code 產生 API https://www.funcode-tech.com/QR_Code_Generator_API.html
      qrCodeApi:
        "http://www.funcode-tech.com/Encoder_Service/img.aspx?custid=1&username=public&codetype=QR&EClevel=0&data=",
      personUpdateApi: "https://wasn2018tw-bot.herokuapp.com/api/person/"
    };
  },
  computed: {
    qrCodeUrlLunchBox() {
      return this.userData
        ? `${this.qrCodeApi}${this.personUpdateApi}${
            this.userData._id
          }?lunchBox=${this.now}`
        : "";
    },
    qrCodeUrlDinner() {
      return this.userData
        ? `${this.qrCodeApi}${this.personUpdateApi}${
            this.userData._id
          }?dinner=${this.now}`
        : "";
    }
  }
};
</script>
