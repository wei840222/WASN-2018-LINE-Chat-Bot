<template>
  <b-container>
    <div v-if="checkined">
      <b-card title="午餐便當餐券" :img-src="qrCodeUrlLunchBox" img-top v-if="now <= config.lunchBox.end && now >= config.lunchBox.start">
        <p class="card-text">渴望會館-B1-綠灣餐廳</p>
        <div slot="footer">
          <small class="text-muted">2018/8/26 11:30~13:00</small>
        </div>
      </b-card>
      <b-card title="午餐便當餐券" v-else>
        <p class="card-text">渴望會館-B1-綠灣餐廳(尚未開放)</p>
        <div slot="footer">
          <small class="text-muted">2018/8/26 11:30~13:00</small>
        </div>
      </b-card>
      <br/>
      <b-card title="晚宴餐券" :img-src="qrCodeUrlDinner" img-top v-if="now <= config.dinner.end && now >= config.dinner.start">
        <p class="card-text">渴望會館-B1-渴望餐廳</p>
        <div slot="footer">
          <small class="text-muted">2018/8/26 18:30~20:30</small>
        </div>
      </b-card>
      <b-card title="晚宴餐券" v-else>
        <p class="card-text">渴望會館-B1-渴望餐廳(尚未開放)</p>
        <div slot="footer">
          <small class="text-muted">2018/8/26 18:30~20:30</small>
        </div>
      </b-card>
      <br/>
      <b-card title="餐盒券" :img-src="qrCodeUrlLunchBox2" img-top v-if="now <= config.lunchBox2.end && now >= config.lunchBox2.start">
        <p class="card-text">渴望會館-2F-國際會議廳-外廳</p>
        <div slot="footer">
          <small class="text-muted">2018/8/27 12:00~12:15</small>
        </div>
      </b-card>
      <b-card title="餐盒券" v-else>
        <p class="card-text">渴望會館-2F-國際會議廳-外廳(尚未開放)</p>
        <div slot="footer">
          <small class="text-muted">2018/8/27 12:00~12:15</small>
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
    const config = await axios.get(`/api/config`);
    return {
      checkined: checkined,
      config: config.data[0],
      now: now
        .toLocaleString("zh-CN", {
          timeZone: "Asia/Taipei",
          hour12: false
        })
        .replace(/\//g, "-"),
      userData: res.data[0],
      // 方碼科技 QR Code 產生 API https://www.funcode-tech.com/QR_Code_Generator_API.html
      qrCodeApi:
        "http://www.funcode-tech.com/Encoder_Service/img.aspx?custid=1&username=public&codetype=QR&EClevel=0&data="
    };
  },
  computed: {
    qrCodeUrlLunchBox() {
      return this.userData
        ? `${this.qrCodeApi}{"id":"${this.userData._id}","lunchBox":"${this.now}"}`
        : "";
    },
    qrCodeUrlDinner() {
      return this.userData
        ? `${this.qrCodeApi}{"id":"${this.userData._id}","dinner":"${this.now}"}`
        : "";
    },
    qrCodeUrlLunchBox2() {
      return this.userData
        ? `${this.qrCodeApi}{"id":"${this.userData._id}","lunchBox2":"${this.now}"}`
        : "";
    }
  }
};
</script>
