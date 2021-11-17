<template>
  <div class="pageShareHolders">
    <Title title="股東結構說明" />

    <el-form ref="ruleForm" label-width="80px">
      <div class="flex-items-c-justify-c mt-16">
        <el-input v-model="shareHoldersName" placeholder="請輸入股東姓名" size="small"></el-input>
        <el-button type="success" size="small" @click="addTabShareHolders()" plain :disabled="!shareHoldersName">
          新增
        </el-button>
      </div>
      <el-tabs v-model="tabsShareHoldersValue" type="border-card" closable @tab-remove="removeTabShareHolders" v-if="tabsShareHoldersList.length > 0">
        <el-tab-pane v-for="(items, idx) in tabsShareHoldersList" :key="idx" :label="items.title" :name="items.name">
          <!-- <el-form-item size="small" :label="'股東A姓名'">
              <el-input v-model="items.shareHoldersItems.name"></el-input>
            </el-form-item> -->
          <el-form-item size="small" :label="'持股股數'">
            <el-input v-model="items.shareHoldersItems.stockCount"></el-input>
          </el-form-item>
          <el-form-item size="small" :label="'持股比例'">
            <el-input v-model="items.shareHoldersItems.stockRate" placeholder="請用0.xxx表示，請勿使用%否則會存失敗"></el-input>
          </el-form-item>
          <el-form-item size="small" :label="'出資額度'">
            <el-input v-model="items.shareHoldersItems.capital"></el-input>
          </el-form-item>
        </el-tab-pane>
      </el-tabs>

    </el-form>

    <div class="pageShareHolders__btns">
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
      temp: {},

      tabsShareHoldersValue: "1",
      shareHoldersName: "",
      tabsShareHoldersList: [],
      defaultShareHoldersName: 0,

      btnLoading: false,
    };
  },
  methods: {
    async getList() {
      await company
        .getCompanyShareHolders({
          CompanyId: this.$store.state.user.userInfo.id,
        })
        .then((res) => {
          res.data.forEach((it, idx) => {
            this.tabsShareHoldersList?.push({
              title: it.name,
              name: String(idx + 1),
              shareHoldersItems: it,
            });
          });
          this.defaultShareHoldersName = res.data.length + 1;
        });
    },

    addTabShareHolders(txt) {
      this.tabsShareHoldersList.push({
        title: txt || this.shareHoldersName,
        name: String(this.defaultShareHoldersName),
        shareHoldersItems: {
          //   companyId: this.chooseInfo.id,
          name: txt || this.shareHoldersName,
          stockCount: 0,
          stockRate: 0,
          capital: 0,
        },
      });

      this.shareHoldersName = "";
      this.tabsShareHoldersValue = String(this.defaultShareHoldersName);
      this.defaultShareHoldersName = this.defaultShareHoldersName + 1;
    },
    removeTabShareHolders(targetName) {
      this.tabsShareHoldersList = this.tabsShareHoldersList.filter(
        (res) => res.name !== String(targetName)
      );
      this.tabsShareHoldersValue = this.tabsShareHoldersList[0].name;
    },

    async addOrUpdate() {
      this.btnLoading = true;
      this.temp = this.tabsShareHoldersList.map((i) => i.shareHoldersItems);
      this.temp.map((res) => {
        res.companyId = this.$store.state.user.userInfo.id;
        return res;
      });
      await company.addOrUpdateCompanyShareHolders(this.temp).then((res) => {
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
    if (this.tabsShareHoldersList.length === 0) {
      this.addTabShareHolders("範例");
    }
  },
};
</script>

<style lang="scss" scoped>
.pageShareHolders {
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