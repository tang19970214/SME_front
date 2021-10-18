<template>
  <div class="pageOperations">
    <Title title="經營團隊說明" />

    <el-form ref="ruleForm" :model="temp" label-width="100px" :rules="rules">
      <el-form-item size="small" :label="'過去是否有相關技術經驗'">
        <el-radio-group v-model="temp.hasTechnologyExperience">
          <el-radio :label="true">是</el-radio>
          <el-radio :label="false">否</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item size="small" :label="'技術來源'">
        <el-input v-model="temp.technologyFrom"></el-input>
      </el-form-item>
      <el-form-item size="small" :label="'企業優勢說明'">
        <el-input v-model="temp.advantageDescription"></el-input>
      </el-form-item>

      <div class="flex-items-c-justify-c mt-16">
        <el-input v-model="teamsName" placeholder="請輸入團隊成員姓名" size="small"></el-input>
        <el-button type="success" size="small" @click="addTabTeams()" plain :disabled="!teamsName">
          新增
        </el-button>
      </div>

      <el-tabs v-model="tabsTeamsValue" type="border-card" closable @tab-remove="removeTabTeams" v-if="tabsTeamsList.length > 0">
        <el-tab-pane v-for="(items, idx) in tabsTeamsList" :key="idx" :label="items.title" :name="items.name">
          <el-form-item size="small" :label="'經歷'">
            <el-input v-model="items.companyTeamMemberItems.memberExperience"></el-input>
          </el-form-item>
          <el-form-item size="small" :label="'專長'">
            <el-input v-model="items.companyTeamMemberItems.memberExpertise"></el-input>
          </el-form-item>
        </el-tab-pane>
      </el-tabs>
    </el-form>

    <div class="pageOperations__btns">
      <el-button @click="$router.push('/')">取消</el-button>
      <el-button type="primary" @click="addOrUpdate()">確認</el-button>
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
      incomeModelITemsList: [],

      temp: {
        hasTechnologyExperience: true,
        technologyFrom: "",
        advantageDescription: "",
        companyTeamMemberItems: [],
      },
      rules: {},

      tabsTeamsValue: "1",
      teamsName: "",
      tabsTeamsList: [],
      defaultTeamsName: 0,
    };
  },
  methods: {
    getList() {
      company
        .getCompanyTeams({ id: this.$store.state.user.userInfo.id })
        .then((res) => {
          res.result.companyTeamMemberItems?.forEach((it, idx) => {
            this.tabsTeamsList.push({
              title: it.memberName,
              name: String(idx + 1),
              companyTeamMemberItems: it,
            });
          });
          this.defaultTeamsName =
            res.result.companyTeamMemberItems?.length + 1 || 1;
          this.temp = Object.assign({}, res.result);
          this.temp.id = this.$store.state.user.userInfo.id;
        });
    },

    addTabTeams() {
      this.tabsTeamsList.push({
        title: this.teamsName,
        name: String(this.defaultTeamsName),
        companyTeamMemberItems: {
          memberName: this.teamsName,
          memberExperience: "",
          memberExpertise: "",
        },
      });

      this.teamsName = "";
      this.tabsTeamsValue = String(this.defaultTeamsName);
      this.defaultTeamsName = this.defaultTeamsName + 1;
    },
    removeTabTeams(targetName) {
      this.tabsTeamsList = this.tabsTeamsList.filter(
        (res) => res.name !== String(targetName)
      );
      this.tabsTeamsValue = this.tabsTeamsList[0].name;
    },

    addOrUpdate() {
      this.temp.companyTeamMemberItems = this.tabsTeamsList.map(
        (i) => i.companyTeamMemberItems
      );
      company.addOrUpdateCompanyTeams(this.temp).then((res) => {
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
    this.getList();
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