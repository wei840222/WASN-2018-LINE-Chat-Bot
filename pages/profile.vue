<template>
  <b-container>
    <div v-if="checkined">
      <b-card :title="name">
      <p class="card-text">
        大會編號：{{ userData.id }}<br/>
        單位：{{ userData.school }}<br/>
        e-mail：{{ userData.email }}<br/>
        報到：{{ userData.checkin === "" ? "尚未報到" : "已報到 " + userData.checkin}}<br/>
        便當：{{ userData.lunchBox === "" ? "尚未領取" : "已領取 " + userData.lunchBox }}<br/>
        晚宴：{{ userData.dinner === "" ? "尚未參加" : "已參加 " + userData.dinner }}</p>
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
    return {
      checkined: checkined,
      userData: res.data[0]
    };
  }
};
</script>
