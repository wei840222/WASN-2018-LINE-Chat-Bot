<template>
  <b-container fluid>
    <b-navbar toggleable="md" type="dark" variant="info">
      <b-navbar-toggle target="nav_collapse"></b-navbar-toggle>
      <b-navbar-brand>大會人員</b-navbar-brand>
      <b-collapse is-nav id="nav_collapse">
        <b-navbar-nav>
          <b-nav-item v-b-modal.add>新增</b-nav-item>
          <b-modal id="add" title="新增" ok-only="true" ok-title="新增" @ok="add" @hidden="claerAddUser">
            <form>
              <b-form-input type="text" placeholder="ID" v-model="addUser.id"></b-form-input>
              <b-form-input type="text" placeholder="姓名" v-model="addUser.name"></b-form-input>
              <b-form-input type="text" placeholder="單位" v-model="addUser.school"></b-form-input>
              <b-form-input type="text" placeholder="e-mail" v-model="addUser.email"></b-form-input>
            </form>
          </b-modal>
        </b-navbar-nav>
        <b-navbar-nav class="ml-auto">
          <b-nav-form>
            <b-form-group horizontal>
              <b-input-group>
                <b-form-input v-model="filter" placeholder="輸入關鍵字搜尋" />
                <b-input-group-append>
                  <b-btn :disabled="!filter" @click="filter = ''">清除</b-btn>
                </b-input-group-append>
              </b-input-group>
            </b-form-group>
          </b-nav-form>
        </b-navbar-nav>
      </b-collapse>
    </b-navbar>
    <b-table :fields="fields" :items="items" sort-by="id" :filter="filter">
      <template slot="checkin" slot-scope="data">
        <b-form-input type="datetime" v-model="data.item.checkin" @focus.native="stopUpdate = true" @blur.native="stopUpdate = false"/>
      </template>
      <template slot="lunchBox" slot-scope="data">
        <b-form-input type="datetime" v-model="data.item.lunchBox" @focus.native="stopUpdate = true" @blur.native="stopUpdate = false"/>
      </template>
      <template slot="dinner" slot-scope="data">
        <b-form-input type="datetime" v-model="data.item.dinner" @focus.native="stopUpdate = true" @blur.native="stopUpdate = false"/>
      </template>
      <template slot="edit" slot-scope="data">
        <b-button-group>
          <b-button variant="primary" @click="save({_id:data.item._id, checkin:data.item.checkin, lunchBox:data.item.lunchBox, dinner:data.item.dinner})">儲存</b-button>
          <b-button variant="danger" @click="del(data.item._id)">刪除</b-button>
        </b-button-group>
      </template>
    </b-table>
  </b-container>
</template>

<script>
import axios from "../plugins/axios";
import { json } from "body-parser";
import { setInterval } from "timers";

export default {
  async asyncData() {
    const res = await axios.get(`/api/person`);
    return {
      items: res.data,
      fields: {
        id: {
          label: "ID",
          sortable: true
        },
        name: {
          label: "姓名",
          sortable: true
        },
        school: {
          label: "單位",
          sortable: true
        },
        email: {
          label: "e-amil"
        },
        checkin: {
          label: "報到"
        },
        lunchBox: {
          label: "便當"
        },
        dinner: {
          label: "晚宴"
        },
        edit: {
          label: ""
        }
      },
      filter: null,
      addUser: {
        id: "",
        name: "",
        school: "",
        email: ""
      },
      stopUpdate: false
    };
  },
  created() {
    setInterval(() => {
      if (!this.stopUpdate) {
        this.update();
      }
    }, 5000);
  },
  methods: {
    claerAddUser() {
      this.addUser = {
        id: "",
        name: "",
        school: "",
        email: ""
      };
    },
    async add() {
      const res = await axios.post(`/api/person`, this.addUser);
      if (res.statusText === "OK") {
        this.update();
      }
    },
    async save(data) {
      const res = await axios.get(
        `/api/person/${data._id}?checkin=${data.checkin}&lunchBox=${data.lunchBox}&dinner=${data.dinner}`
      );
      if (res.statusText === "OK") {
        this.update();
      }
    },
    async del(_id) {
      const res = await axios.delete(`/api/person/${_id}`);
      if (res.statusText === "OK") {
        this.update();
      }
    },
    async update() {
      const res = await axios.get(`/api/person`);
      this.items = res.data;
    }
  }
};
</script>
