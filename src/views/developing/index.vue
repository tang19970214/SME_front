<template>
  <div class="pageDeveloping">
    <Title title="公司發展階段" />

    <el-form :model="temp" :rules="rules" ref="ruleForm" label-width="150px">
      <el-form-item size="small" :label="'公司名稱'">
        <el-input v-model="temp.companyName"></el-input>
      </el-form-item>
      <el-form-item size="small" :label="'統一編號'">
        <el-input v-model="temp.einno"></el-input>
      </el-form-item>
      <el-form-item size="small" :label="'成立年度'">
        <el-date-picker class="w-full" v-model="temp.setUpDate" type="date" value-format="yyyy-MM-dd" placeholder="請選擇日期">
        </el-date-picker>
      </el-form-item>
      <el-form-item size="small" :label="'資本額'">
        <el-input v-model.trim="temp.capital" @blur="inputMoney($event, 'temp', 'capital')" placeholder="請輸入資本額"></el-input>
      </el-form-item>
      <el-form-item size="small" :label="'負責人姓名'">
        <el-input v-model="temp.principalName"></el-input>
      </el-form-item>
      <el-form-item size="small" :label="'公司登記地址'">
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
      <el-form-item size="small" :label="'公司員工人數(不包含負責人)'">
        <el-input v-model="temp.staffCount"></el-input>
      </el-form-item>
      <el-form-item size="small" :label="'是否已有管理階層'">
        <el-radio-group v-model="temp.hasManagement">
          <el-radio :label="true">是</el-radio>
          <el-radio :label="false">否</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item size="small" :label="'是否已有顯著獲利'">
        <el-radio-group v-model="temp.hasProfit">
          <el-radio :label="true">是</el-radio>
          <el-radio :label="false">否</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item size="small" :label="'是否擁有100萬以上的資產'">
        <el-radio-group v-model="temp.hasMillionAssets">
          <el-radio :label="true">是</el-radio>
          <el-radio :label="false">否</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item size="small" :label="'是否有大公司投資'">
        <el-radio-group v-model="temp.hasInvestment">
          <el-radio :label="true">是</el-radio>
          <el-radio :label="false">否</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item size="small" :label="'是否擁有專利權'">
        <el-radio-group v-model="temp.hasPatent">
          <el-radio :label="true">是</el-radio>
          <el-radio :label="false">否</el-radio>
        </el-radio-group>
      </el-form-item>
    </el-form>

    <div class="pageDeveloping__btns">
      <el-button @click="$router.push('/')">取消</el-button>
      <el-button type="primary" @click="addOrUpdate()">確認</el-button>
    </div>
  </div>
</template>

<script>
import { cityAndCountiesLite, Counties } from "@/assets/taiwan";

import Title from "@/components/Title";

import * as company from "@/api/company";

export default {
  components: { Title },
  data() {
    return {
      countyData: Counties,
      districtData: cityAndCountiesLite,

      temp: {
        companyName: "",
        einno: "",
        setUpDate: "",
        capital: 0,
        principalName: "",
        county: "",
        district: "",
        address: "",
        staffCount: 0,
        hasManagement: true,
        hasProfit: true,
        hasMillionAssets: true,
        hasInvestment: true,
        hasPatent: true,
        companyStockItems: [
          {
            year: 0,
            businessAmount: 0,
            grossMarginRate: 0,
            profitMargin: 0,
            pbr: 0,
            eps: 0,
          },
        ],
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
  },
  methods: {
    getList() {
      company
        .getCompanys({ id: this.$store.state.user.userInfo.id })
        .then((res) => {
          this.temp = Object.assign({}, res.result);
          this.temp.id = this.$store.state.user.userInfo.id;
        });
    },

    addOrUpdate() {
      console.log(this.temp);
      company.addOrUpdateCompanys(this.temp).then((res) => {
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

    /* 數字千位數 */
    inputMoney(el, listName, name) {
      this[listName][name] = this.getInputValue(el);
    },
    // 獲取輸入框的值
    getInputValue(el) {
      let inputVal = el.target.value || "";
      return this.comdify(this.delcommafy(inputVal));
    },
    // 金額添加千分位
    comdify(n) {
      if (!n) return n;
      let str = n.split(".");
      let re = /\d{1,3}(?=(\d{3})+$)/g;
      let n1 = str[0].replace(re, "$&,");
      return str.length > 1 && str[1] ? `${n1}.${str[1]}` : `${n1}`;
    },
    //去除千分位中的‘，’
    delcommafy(num) {
      if (!num) return num;
      num = num.toString();
      num = num.replace(/,/gi, "");
      return num;
    },
  },
  mounted() {
    this.getList();
  },
};
</script>

<style lang="scss" scoped>
.pageDeveloping {
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