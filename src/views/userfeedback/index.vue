<template>
  <div class="pageUserFeedBack">
    <Title title="意見回饋" />

    <el-form ref="ruleForm" :model="temp" label-width="120px" :rules="rules">
      <el-form-item size="small" :label="'請選擇您的身分'">
        <el-select class="w-full" v-model="temp.typeName" clearable placeholder="請選擇身分">
          <el-option v-for="item in identityList" :key="item.id" :label="item.name" :value="item.dtValue"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item size="small" :label="'意見回饋概述'">
        <el-input v-model="temp.summary" maxlength="30" show-word-limit></el-input>
      </el-form-item>
      <el-form-item size="small" :label="'意見回饋'">
        <el-input type="textarea" rows="8" v-model="temp.sysFeedBack" maxlength="500" show-word-limit></el-input>
      </el-form-item>
    </el-form>

    <div class="pageUserFeedBack__btns">
      <el-button @click="$router.push('/')">取消</el-button>
      <el-button type="primary" @click="saveFeedback()" :loading="btnLoading" :disabled="!temp.typeName || !temp.summary || !temp.sysFeedBack">確認</el-button>
    </div>
  </div>
</template>

<script>
import Title from "@/components/Title";

import * as categorys from "@/api/categorys";
import * as feedback from "@/api/feedback";

export default {
  components: { Title },
  data() {
    return {
      identityList: [],

      temp: {
        typeName: "",
        summary: "",
        sysFeedBack: "",
        sysFeedBackDate: "",
        status: "",
      },
      rules: {},

      btnLoading: false,
    };
  },
  methods: {
    getIdentityList() {
      const listQuery = {
        page: 1,
        limit: 999,
        TypeId: "SYS_FEEDBACK",
      };
      categorys.getList(listQuery).then((res) => {
        this.identityList = res.data;
      });
    },

    async saveFeedback() {
      this.btnLoading = true;
      await feedback.add(this.temp).then((res) => {
        if (res.code == 200) {
          this.$notify({
            title: "成功",
            message: "已通知管理員，會盡快以Mail的方式回覆您的問題!",
            type: "success",
            duration: 2000,
          });
        } else {
          this.$notify({
            title: "錯誤",
            message: res.message,
            type: "error",
            duration: 2000,
          });
        }
        this.btnLoading = false;
      });
    },
  },
  mounted() {
    this.getIdentityList();
  },
};
</script>

<style lang="scss" scoped>
.pageUserFeedBack {
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
</style>