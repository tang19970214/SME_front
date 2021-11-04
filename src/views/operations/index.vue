<template>
  <div class="pageOperations">
    <Title title="營運狀況" />

    <el-form ref="ruleForm" :model="temp" label-width="120px" :rules="rules">
      <el-form-item size="small" :label="'主要產品/服務'">
        <el-input v-model="temp.mainProduct"></el-input>
      </el-form-item>
      <el-form-item size="small" :label="'營收模式'">
        <el-select class="filter-item w-full" v-model="temp.incomeModelITems" placeholder="請選擇營收模式" multiple>
          <el-option v-for="item in  incomeModelITemsList" :key="item.id" :label="item.name" :value="item.dtValue">
          </el-option>
        </el-select>
        <el-input v-model="temp.incomeModelOther" placeholder="請輸入其他營收模式" v-if="getOperationsOther()"></el-input>
      </el-form-item>
      <el-form-item size="small" :label="'市場評估'">
        <el-radio-group v-model="temp.marketAssess">
          <el-radio :label="'潛在對手小於兩家(獨佔or寡占)'">潛在對手小於兩家(獨佔or寡占)</el-radio>
          <el-radio :label="'至少3家以上的潛在對手，如：'">至少3家以上的潛在對手，如：</el-radio>
        </el-radio-group>
        <el-input v-model="temp.marketAssessOther" v-if="temp.marketAssess == '至少3家以上的潛在對手，如：'" placeholder="請填寫"></el-input>
      </el-form-item>
      <el-form-item size="small" :label="'目標市場/客戶'">
        <el-input v-model="temp.targetMarket"></el-input>
      </el-form-item>

      <div class="flex-items-c-justify-c mt-16">
        <el-input v-model="operationsYear" placeholder="請輸入年份，例：101" size="small"></el-input>
        <el-button type="success" size="small" @click="addTabOperations()" plain :disabled="!operationsYear">
          新增
        </el-button>
      </div>
      <el-tabs v-model="tabsOperationsValue" type="border-card" closable @tab-remove="removeTabOperations" v-if="tabsOperationsList.length > 0">
        <el-tab-pane v-for="(items, idx) in tabsOperationsList" :key="idx" :label="items.title + '年'" :name="items.name">
          <el-form-item size="small" :label="'年度營業額'">
            <el-input v-model="items.operationsYearList.businessAmount"></el-input>
          </el-form-item>
          <el-form-item size="small" :label="'年度毛利率'">
            <el-input v-model="items.operationsYearList.grossMarginRate"></el-input>
          </el-form-item>
          <el-form-item size="small" :label="'年度淨利率'">
            <el-input v-model="items.operationsYearList.profitMargin"></el-input>
          </el-form-item>
          <el-form-item size="small" :label="'年度每股淨值'">
            <el-input v-model="items.operationsYearList.pbr"></el-input>
          </el-form-item>
          <el-form-item size="small" :label="'年度每股盈餘(EPS)'">
            <el-input v-model="items.operationsYearList.eps"></el-input>
          </el-form-item>
        </el-tab-pane>
      </el-tabs>
    </el-form>

    <div class="pageOperations__btns">
      <el-button @click="$router.push('/')">取消</el-button>
      <el-button type="primary" @click="addOrUpdate()" :loading="btnLoading">確認</el-button>
    </div>
  </div>
</template>

<script>
import Title from "@/components/Title";

import * as categorys from "@/api/categorys";
import * as company from "@/api/company";

export default {
  components: { Title },
  data() {
    return {
      incomeModelITemsList: [],

      temp: {
        mainProduct: "",
        incomeModelITems: [],
        incomeModelOther: "",
        marketAssess: "",
        marketAssessOther: "",
        targetMarket: "",
        companyStockItmes: [],
      },
      rules: {},

      tabsOperationsValue: "1",
      operationsYear: "",
      tabsOperationsList: [],
      defaultOperationsName: 0,

      btnLoading: false,
    };
  },
  computed: {
    getOperationsOther() {
      return () => {
        if (this.temp.incomeModelITems?.includes("其他")) {
          return true;
        } else {
          this.temp.incomeModelOther = "";
          return false;
        }
      };
    },
  },
  methods: {
    getIncomeModelItemsList() {
      const listQuery = {
        page: 1,
        limit: 999,
        TypeId: "SYS_USER_INCOMEMODEL",
      };
      categorys.getList(listQuery).then((res) => {
        this.incomeModelITemsList = res.data;
      });
    },

    async getList() {
      await company
        .getCompanyOperations({ id: this.$store.state.user.userInfo.id })
        .then((res) => {
          res.result.companyStockItmes?.forEach((it, idx) => {
            this.tabsOperationsList.push({
              title: it.year,
              name: String(idx + 1),
              operationsYearList: it,
            });
          });
          this.defaultOperationsName =
            res.result.companyStockItmes?.length + 1 || 1;
          this.temp = Object.assign({}, res.result);
          this.temp.id = this.$store.state.user.userInfo.id;
        });
    },

    addTabOperations(txt) {
      this.tabsOperationsList.push({
        title: txt || this.operationsYear,
        name: String(this.defaultOperationsName),
        operationsYearList: {
          year: this.operationsYear,
          businessAmount: 0,
          grossMarginRate: 0,
          profitMargin: 0,
          pbr: 0,
          eps: 0,
        },
      });

      this.operationsYear = "";
      this.tabsOperationsValue = String(this.defaultOperationsName);
      this.defaultOperationsName = this.defaultOperationsName + 1;
    },
    removeTabOperations(targetName) {
      this.tabsOperationsList = this.tabsOperationsList.filter(
        (res) => res.name !== String(targetName)
      );
      this.tabsOperationsValue = this.tabsOperationsList[0].name;
    },

    async addOrUpdate() {
      this.btnLoading = true;
      this.temp.companyStockItmes = this.tabsOperationsList.map(
        (i) => i.operationsYearList
      );
      this.temp.businessStageItems =
        this.temp.businessStageItems?.length == 0
          ? null
          : this.temp.businessStageItems;
      this.temp.industryTypeItems =
        this.temp.industryTypeItems?.length == 0
          ? null
          : this.temp.industryTypeItems;
      await company.addOrUpdateCompanyOperations(this.temp).then((res) => {
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

        setTimeout(() => {
          this.btnLoading = false;
        }, 2000);
      });
    },
  },
  async mounted() {
    this.getIncomeModelItemsList();
    await this.getList();
    if (this.tabsOperationsList.length === 0) {
      this.addTabOperations("範例");
    }
  },
};
</script>

<style lang="scss" scoped>
.pageOperations {
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
    margin-top: 20px;
  }
}

::v-deep
  .el-tabs--border-card
  > .el-tabs__header
  > .el-tabs__nav-wrap
  > .el-tabs__nav-scroll
  > .el-tabs__nav
  > .el-tabs__item {
  color: gray !important;

  &.is-active {
    color: #0076c8 !important;
  }
}
</style>