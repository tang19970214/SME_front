<template>
  <div class="pageFundsplan">
    <Title title="資金方案推薦" />
    <strong class="pageFundsplan__subTitle">資金方案百百種，政府補助、銀行融資、天使投資...等，透過簡單的問題幫你找到適合的投資方案！</strong>

    <div class="pageFundsplan__form">
      <el-form :label-position="'top'" label-width="120px" :model="temp">
        <el-form-item label="Q1.希望的資金來源(多選)">
          <el-checkbox-group size="small" v-model="temp.checkList">
            <el-checkbox label="補助"></el-checkbox>
            <el-checkbox label="融資"></el-checkbox>
            <el-checkbox label="投資"></el-checkbox>
            <el-checkbox label="競賽"></el-checkbox>
          </el-checkbox-group>
        </el-form-item>

        <el-form-item label="Q2.是否已成立公司行號(單選)">
          <el-input size="small"></el-input>
        </el-form-item>

        <el-form-item label="Q3.主要產品服務">
          <el-select size="small" class="w-full" v-model="temp.mainProduct">
            <el-option label="123" value="123"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="Q4.公司發展階段(多選)">
          <el-checkbox-group size="small" v-model="temp.checkList">
            <el-checkbox label="已有營運計畫書"></el-checkbox>
            <el-checkbox label="選項目明文字"></el-checkbox>
            <el-checkbox label="選項目明文字"></el-checkbox>
          </el-checkbox-group>
        </el-form-item>

        <el-form-item label="Q5.此次資金需求範圍(單選)">
          <el-input size="small"></el-input>
        </el-form-item>

        <el-form-item label="Q6.此次資金用途(多選)">
          <el-checkbox-group size="small" v-model="temp.checkList">
            <el-checkbox label="研發費用、資產購置、周轉止"></el-checkbox>
          </el-checkbox-group>
        </el-form-item>

        <el-form-item label="Q7.公司產業類別(多選)">
          <el-checkbox-group size="small" v-model="temp.checkList">
            <el-checkbox label="研發費用、資產購置、周轉止"></el-checkbox>
          </el-checkbox-group>
        </el-form-item>
      </el-form>
    </div>

    <div class="pageFundsplan__btn">
      <button @click="$router.push({name: 'fundsplanRecommend'})">開始找方案</button>
    </div>
  </div>
</template>

<script>
import Layout from "@/views/layout/Layout";

import Title from "@/components/Title";

export default {
  components: { Title },
  data() {
    return {
      temp: {
        checkList: [],
        mainProduct: "",
      },
      //   rules: {},
    };
  },
  methods: {},
  mounted() {},
  created() {
    const addRouter = [
      {
        path: "/fundsplan",
        component: Layout,
        redirect: "noredirect",
        name: "fundsplan",
        meta: {
          title: "資金方案推薦",
          //   icon: "eye",
        },
        children: [
          {
            path: "recommend",
            component: () => import("@/views/fundsplan/recommend"),
            name: "fundsplanRecommend",
            meta: {
              notauth: true,
              title: "資金方案推薦-媒合",
              noCache: true,
              //   icon: "star",
            },
          },
        ],
      },
    ];
    this.$router.addRoutes(addRouter);
  },
};
</script>

<style lang="scss" scoped>
.pageFundsplan {
  width: 100%;
  min-height: 100%;
  padding: 16px;
  box-sizing: border-box;
  background-color: white;

  &__subTitle {
    font-size: 14px;
    color: #006587;
  }

  &__form {
    margin-top: 30px;
    padding-left: 40px;

    ::v-deep .el-form-item__label {
      color: #006587;
      padding-bottom: 0;
    }
  }

  &__btn {
    width: 100%;
    text-align: center;

    button {
      color: white;
      background-color: #0092c3;
      padding: 8px 60px;
      border-radius: 8px;
      border: 1px solid white;
      box-shadow: 4px 5px 5px -3px #000000;
      transition: all 0.5s;
      cursor: pointer;

      &:hover {
        box-shadow: none;
        background-color: white;
        color: #0092c3;
        border-color: #0092c3;
      }
    }
  }
}
</style>