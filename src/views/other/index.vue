<template>
  <div class="pageOther">
    <Title title="其他項目" />

    <el-form ref="ruleForm" :model="temp" label-width="230px" :rules="rules">
      <el-form-item size="small" :label="'是否有打算拓展海外市場'">
        <el-radio-group v-model="temp.hasOverseasMarkets">
          <el-radio :label="true">是</el-radio>
          <el-radio :label="false">否</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item size="small" :label="'是否有打算上市櫃'">
        <el-radio-group v-model="temp.hasListed">
          <el-radio :label="true">是</el-radio>
          <el-radio :label="false">否</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item size="small" :label="'是否有接觸過投資者'">
        <el-radio-group v-model="temp.hasContactInvestors">
          <el-radio :label="true">是</el-radio>
          <el-radio :label="false">否</el-radio>
        </el-radio-group>
      </el-form-item>

      <div class="flex-items-c-justify-c mt-16">
        <el-input v-model="otherName" placeholder="請輸入獎項或政府補助計畫名稱" size="small"></el-input>
        <el-button type="success" size="small" @click="addTabOther()" plain :disabled="!otherName">
          新增
        </el-button>
      </div>

      <el-tabs v-model="tabsOtherValue" type="border-card" closable @tab-remove="removeTabOther" v-if="tabsOtherList.length > 0">
        <el-tab-pane v-for="(items, idx) in tabsOtherList" :key="idx" :label="items.title" :name="items.name">
          <el-form-item size="small" :label="'獲得獎項或政府補助計畫年度'">
            <el-select class="filter-item w-full" v-model="items.companyGovSubsidyPlanItems.year" placeholder="請選擇年度">
              <el-option v-for="i in 22" :key="i" :label="1999+ i + '年'" :value="1999+ i + '年'"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item size="small" :label="'獎項或政府補助計畫單位'">
            <el-input v-model="items.companyGovSubsidyPlanItems.unit"></el-input>
          </el-form-item>
          <el-form-item size="small" :label="'獲得獎項或政府補助計畫內容概述'">
            <el-input v-model="items.companyGovSubsidyPlanItems.summary"></el-input>
          </el-form-item>
        </el-tab-pane>
      </el-tabs>

    </el-form>

    <div class="pageOther__btns">
      <el-button @click="$router.push('/')">取消</el-button>
      <el-button type="primary" @click="addOrUpdate()" :loading="btnLoading">確認</el-button>
    </div>
  </div>
</template>

<script>
import Title from "@/components/Title";

import * as company from "@/api/company";

export default {
  components: { Title },
  data() {
    return {
      temp: {
        hasOverseasMarkets: true,
        hasListed: true,
        hasContactInvestors: true,
        companyGovSubsidyPlanItems: [],
      },
      rules: {},

      tabsOtherValue: "1",
      otherName: "",
      tabsOtherList: [],
      defaultOtherName: 0,

      btnLoading: false,
    };
  },
  methods: {
    async getList() {
      await company
        .getCompanyOtherss({ id: this.$store.state.user.userInfo.id })
        .then((res) => {
          res.result.companyGovSubsidyPlanItems?.forEach((it, idx) => {
            this.tabsOtherList.push({
              title: it.name,
              name: String(idx + 1),
              companyGovSubsidyPlanItems: it,
            });
          });
          this.defaultOtherName =
            res.result.companyGovSubsidyPlanItems?.length + 1 || 1;
          this.temp = Object.assign({}, res.result);
          this.temp.id = this.$store.state.user.userInfo.id;
        });
    },

    addTabOther(txt) {
      this.tabsOtherList.push({
        title: txt || this.otherName,
        name: String(this.defaultOtherName),
        companyGovSubsidyPlanItems: {
          year: "",
          unit: "",
          name: this.otherName,
          summary: "",
        },
      });

      this.otherName = "";
      this.tabsOtherValue = String(this.defaultOtherName);
      this.defaultOtherName = this.defaultOtherName + 1;
    },
    removeTabOther(targetName) {
      this.tabsOtherList = this.tabsOtherList.filter(
        (res) => res.name !== String(targetName)
      );
      this.tabsOtherValue = this.tabsOtherList[0].name;
    },

    async addOrUpdate() {
      this.btnLoading = true;
      this.temp.companyGovSubsidyPlanItems = this.tabsOtherList.map(
        (i) => i.companyGovSubsidyPlanItems
      );
      await company.addOrUpdateCompanyOtherss(this.temp).then((res) => {
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
    await this.getList();
    if (this.tabsOtherList.length === 0) {
      this.addTabOther("範例");
    }
  },
};
</script>

<style lang="scss" scoped>
.pageOther {
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