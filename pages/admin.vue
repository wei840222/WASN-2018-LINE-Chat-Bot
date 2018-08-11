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
              大會編號：<b-form-input type="text" v-model="addUser.id"></b-form-input><br/>
              姓名：<b-form-input type="text" v-model="addUser.name"></b-form-input><br/>
              單位/學校：<b-form-input type="text" v-model="addUser.school"></b-form-input><br/>
              電話/手機：<b-form-input type="text" v-model="addUser.phone"></b-form-input><br/>
              葷/素：
              <b-form-radio-group id="modal-vegetarian" v-model="addUser.vegetarian">
                <b-form-radio value=false>葷</b-form-radio>
                <b-form-radio value=true>素</b-form-radio>
              </b-form-radio-group><br/>
              便當：
              <b-form-radio-group id="modal-lunchBox" v-model="addUser.lunchBox">
                <b-form-radio value="">需要</b-form-radio>
                <b-form-radio value="notNeed">不需要</b-form-radio>
              </b-form-radio-group><br/>
              晚宴：
              <b-form-radio-group id="modal-dinner" v-model="addUser.dinner">
                <b-form-radio value="">參加</b-form-radio>
                <b-form-radio value="notNeed">不參加</b-form-radio>
              </b-form-radio-group><br/>
              餐盒：
              <b-form-radio-group id="modal-lunchBox2" v-model="addUser.lunchBox2">
                <b-form-radio value="">需要</b-form-radio>
                <b-form-radio value="notNeed">不需要</b-form-radio>
              </b-form-radio-group>
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
      <template slot="vegetarian" slot-scope="data">
        {{ data.item.vegetarian ? '素' : '葷' }}
      </template>
      <template slot="lunchBox" slot-scope="data">
        <b-form-input type="datetime" v-model="data.item.lunchBox" @focus.native="stopUpdate = true" @blur.native="stopUpdate = false"/>
      </template>
      <template slot="dinner" slot-scope="data">
        <b-form-input type="datetime" v-model="data.item.dinner" @focus.native="stopUpdate = true" @blur.native="stopUpdate = false"/>
      </template>
      <template slot="lunchBox2" slot-scope="data">
        <b-form-input type="datetime" v-model="data.item.lunchBox2" @focus.native="stopUpdate = true" @blur.native="stopUpdate = false"/>
      </template>
      <template slot="edit" slot-scope="data">
        <b-button-group>
          <b-button variant="primary" @click="save({ _id:data.item._id, checkin:data.item.checkin, lunchBox:data.item.lunchBox, dinner:data.item.dinner, lunchBox2:data.item.lunchBox2 })">儲存</b-button>
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
          label: "大會編號",
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
        phone: {
          label: "電話/手機"
        },
        checkin: {
          label: "報到"
        },
        vegetarian: {
          label: "葷/素",
          sortable: true
        },
        lunchBox: {
          label: "便當"
        },
        dinner: {
          label: "晚宴"
        },
        lunchBox2: {
          label: "餐盒"
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
        phone: "",
        vegetarian: false,
        lunchBox: "",
        dinner: "",
        lunchBox2: ""
      },
      stopUpdate: false
    };
  },
  created() {
    this.dataPreProcess();
    setInterval(() => {
      if (!this.stopUpdate) {
        this.update();
      }
    }, 5000);
  },
  methods: {
    dataPreProcess() {
      this.items.forEach(element => {
        if (element.lunchBox === "notNeed") element.lunchBox = "不需要";
        if (element.dinner === "notNeed") element.dinner = "不參加";
        if (element.lunchBox2 === "notNeed") element.lunchBox2 = "不需要";
      });
    },
    claerAddUser() {
      this.addUser = {
        id: "",
        name: "",
        school: "",
        phone: "",
        vegetarian: false,
        lunchBox: "",
        dinner: "",
        lunchBox2: ""
      };
    },
    async add() {
      const res = await axios.post(`/api/person`, this.addUser);
      if (res.statusText === "OK") {
        this.update();
      }
    },
    async save(data) {
      const res = await axios.post(`/api/person/${data._id}`, {
        checkin: data.checkin,
        lunchBox: data.lunchBox,
        dinner: data.dinner,
        lunchBox2: data.lunchBox2
      });
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
      this.dataPreProcess();
    }
  }
};
</script>
