<template>
  <div class="pageBasic">
    <Title title="基本資料" />

    <el-form :model="temp" :rules="rules" ref="ruleForm" label-width="130px">
      <el-form-item :label="'Email'">
        <el-input v-model="temp.email"></el-input>
      </el-form-item>
      <el-form-item :label="'暱稱'">
        <el-input v-model="temp.nickName"></el-input>
      </el-form-item>
      <el-form-item :label="'性別'">
        <el-radio-group v-model="temp.sex">
          <el-radio :label="1">男</el-radio>
          <el-radio :label="0">女</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item :label="'聯絡電話'">
        <el-input v-model="temp.phone1"></el-input>
        <el-input v-model="temp.phone2"></el-input>
      </el-form-item>
      <el-form-item :label="'通訊地址'">
        <el-select class="filter-item w-full" v-model="temp.county" placeholder="請選擇縣市">
          <el-option v-for="(item, idx) in countyData" :key="idx" :label="item.label" :value="item.value">
          </el-option>
        </el-select>
        <el-select class="filter-item w-full" v-model="temp.district" placeholder="請選擇區域" no-data-text="請先選擇縣市">
          <el-option v-for="(items, $index) in ChooseCounty(districtData, 'temp')" :key="'DT_' + $index" :label="items.label" :value="items.value">
          </el-option>
        </el-select>
        <el-input v-model="temp.address"></el-input>
      </el-form-item>
      <el-form-item :label="'是否已成立公司'">
        <el-radio-group v-model="temp.hasCompany">
          <el-radio :label="true">是</el-radio>
          <el-radio :label="false">否</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item :label="'創業階段'">
        <el-select class="filter-item w-full" v-model="temp.businessStageItems" placeholder="請選擇創業階段" multiple>
          <el-option v-for="item in  businessList" :key="item.id" :label="item.name" :value="item.dtValue">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item :label="'產業類別'">
        <el-select class="filter-item w-full" v-model="temp.industryTypeItems" placeholder="請選擇產業類別" multiple>
          <el-option v-for="item in  industryList" :key="item.id" :label="item.name" :value="item.dtValue">
          </el-option>
        </el-select>
        <el-input v-model="temp.industryTypeOther" placeholder="請輸入其他產業類別" v-if="getBasicOther()"></el-input>
      </el-form-item>
    </el-form>

    <div class="pageBasic__btns">
      <el-button @click="$router.push('/')">取消</el-button>
      <el-button type="primary" @click="addOrUpdate()">確認</el-button>
    </div>
  </div>
</template>

<script>
import { cityAndCountiesLite, Counties } from "@/assets/taiwan";

import Title from "@/components/Title";

import * as categorys from "@/api/categorys";
import * as company from "@/api/company";

export default {
  components: { Title },
  data() {
    return {
      countyData: Counties,
      districtData: cityAndCountiesLite,

      businessList: [],
      industryList: [],

      temp: {
        email: "",
        sex: 1,
        nickName: "",
        phone1: "",
        phone2: "",
        county: "",
        district: "",
        address: "",
        hasCompany: 1,
        businessStageItems: [],
        industryTypeItems: [],
        industryTypeOther: "",
      },
      rules: {},
    };
  },
  computed: {
    ChooseCounty() {
      return (data, tempName) => {
        return data[this[tempName].county];
      };
    },
    getBasicOther() {
      return () => {
        if (this.temp.industryTypeItems?.includes("其他")) {
          return true;
        } else {
          this.temp.industryTypeOther = "";
          return false;
        }
      };
    },
  },
  methods: {
    getBusiness() {
      const listQuery = {
        page: 1,
        limit: 999,
        TypeId: "SYS_USER_BUSINESSSTAGE",
      };
      categorys.getList(listQuery).then((res) => {
        this.businessList = res.data;
      });
    },
    getIndustryType() {
      const listQuery = {
        page: 1,
        limit: 999,
        TypeId: "SYS_USER_INDUSTRYTYPE",
      };
      categorys.getList(listQuery).then((res) => {
        this.industryList = res.data;
      });
    },

    getList() {
      company
        .getUserExts({ id: this.$store.state.user.userInfo.id })
        .then((res) => {
          this.temp = Object.assign({}, res.result);
          this.temp.id = this.$store.state.user.userInfo.id;
          this.temp.email = this.$store.state.user.userInfo.account;
        });
    },

    addOrUpdate() {
      console.log(this.temp);
      this.temp.id = this.$store.state.user.userInfo.id;
      this.temp.businessStageItems =
        this.temp.businessStageItems?.length > 0
          ? this.temp.businessStageItems
          : null;
      this.temp.industryTypeItems =
        this.temp.industryTypeItems?.length > 0
          ? this.temp.industryTypeItems
          : null;
      company.addOrUpdateUserExts(this.temp).then((res) => {
        if (res.code == 200) {
          this.$notify({
            title: "成功",
            message: "填寫成功",
            type: "success",
            duration: 2000,
          });
        } else {
          this.$message({
            title: "錯誤",
            message: res.message,
            type: "error",
            duration: 2000,
          });
        }
      });
    },
  },
  mounted() {
    this.getBusiness();
    this.getIndustryType();
    this.getList();
  },
};
</script>

<style lang="scss" scoped>
.pageBasic {
  width: 100%;
  min-height: 100%;
  padding: 16px;
  box-sizing: border-box;
  background-color: white;

  &__btns {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: flex-end;
  }
}
</style>