<template>
  <div class="pageFundsplan">
    <Title title="資金方案推薦" />
    <strong class="pageFundsplan__subTitle">資金方案百百種，政府補助、銀行融資、天使投資...等，透過簡單的問題幫你找到適合的投資方案！</strong>

    <div class="pageFundsplan__form">
      <el-form :label-position="'top'" label-width="120px" ref="ruleForm" :model="temp" :rules="rules">
        <el-form-item label="Q1 希望資金來源(多選)" prop="Q1">
          <el-select class="w-full" v-model="temp.Q1" size="small" multiple>
            <el-option label="融資貸款" value="融資貸款"></el-option>
            <el-option label="政府補助" value="政府補助"></el-option>
            <el-option label="創投資金" value="創投資金"></el-option>
            <el-option label="競賽獎金" value="競賽獎金"></el-option>
            <el-option label="其他" value="其他"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="Q2.1 是否已成立公司行號" prop="Q2">
          <el-select class="w-full" v-model="temp.Q2" size="small" @change="getQ2">
            <el-option label="是" value="是"></el-option>
            <el-option label="否" value="否"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="Q2.2 公司登記日期" prop="Q3" v-if="temp.Q2 == '是'">
          <el-date-picker class="w-full" v-model="temp.Q3" type="date" placeholder="請選擇日期" value-format="yyyy-MM-dd" :picker-options="disAfterDate" size="small">
          </el-date-picker>
        </el-form-item>

        <el-form-item label="Q2.3 公司登記地" prop="county" v-if="temp.Q2 == '是'">
          <el-select class="w-full" v-model="temp.county" placeholder="請選擇縣市" size="small">
            <el-option v-for="(item, idx) in countyData" :key="idx" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
          <el-select class="w-full" v-model="temp.district" placeholder="請選擇區域" no-data-text="請先選擇縣市" size="small">
            <el-option v-for="(items, $idx) in ChooseCounty(districtData)" :key="$idx" :label="items.label" :value="items.value">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="Q3. 主要產品/服務" prop="Q5" :rules="temp.Q2 == '是' ? rules.Q5 : [{ required: false }]">
          <el-input size="small" class="w-full" v-model="temp.Q5"></el-input>
        </el-form-item>

        <el-form-item label="Q4. 發展階段(多選)" prop="Q6" :rules="temp.Q2 == '是' ? rules.Q6 : [{ required: false }]">
          <el-select class="w-full" v-model="temp.Q6" size="small" multiple>
            <el-option label="尚無具體想法" value="尚無具體想法"></el-option>
            <el-option label="已有創業點子" value="已有創業點子"></el-option>
            <el-option label="產品開發中" value="產品開發中"></el-option>
            <el-option label="完成最小可行性產品並測試市場" value="完成最小可行性產品並測試市場"></el-option>
            <el-option label="已組成經營團隊" value="已組成經營團隊"></el-option>
            <el-option label="已籌促到營運資金" value="已籌促到營運資金"></el-option>
            <el-option label="已有營運計劃書" value="已有營運計劃書"></el-option>
            <el-option label="已經登記設立公司/行號" value="已經登記設立公司/行號"></el-option>
            <el-option label="已經進入成長期" value="已經進入成長期"></el-option>
            <el-option label="已經進入成熟期" value="已經進入成熟期"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="Q5. 資金需求範圍" prop="Q7" :rules="temp.Q2 == '是' ? rules.Q7 : [{ required: false }]">
          <el-select class="w-full" v-model="temp.Q7" size="small">
            <el-option label="50萬以下" value="50萬以下"></el-option>
            <el-option label="50-100萬" value="50-100萬"></el-option>
            <el-option label="100-300萬" value="100-300萬"></el-option>
            <el-option label="300-500萬" value="300-500萬"></el-option>
            <el-option label="500-1000萬" value="500-1000萬"></el-option>
            <el-option label="1000萬以上" value="1000萬以上"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="Q6. 資金用途(多選)" prop="Q8">
          <el-select class="w-full" v-model="temp.Q8" size="small" multiple>
            <el-option label="創業啟動金" value="創業啟動金"></el-option>
            <el-option label="營運資金" value="營運資金"></el-option>
            <el-option label="研發費用" value="研發費用"></el-option>
            <el-option label="資產購置" value="資產購置"></el-option>
            <el-option label="週轉金" value="週轉金"></el-option>
            <el-option label="公司擴編" value="公司擴編"></el-option>
            <el-option label="行銷推廣" value="行銷推廣"></el-option>
            <el-option label="其他" value="其他"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="Q7. 產業類別(多選)" prop="Q9">
          <el-select class="w-full" v-model="temp.Q9" size="small" multiple>
            <el-option label="綠能環保" value="綠能環保"></el-option>
            <el-option label="生技產業" value="生技產業"></el-option>
            <el-option label="智慧雲端" value="智慧雲端"></el-option>
            <el-option label="智慧製造" value="智慧製造"></el-option>
            <el-option label="循環經濟" value="循環經濟"></el-option>
            <el-option label="新農業" value="新農業"></el-option>
            <el-option label="數位媒體" value="數位媒體"></el-option>
            <el-option label="社會創新" value="社會創新"></el-option>
            <el-option label="文創產業" value="文創產業"></el-option>
            <el-option label="電子商務" value="電子商務"></el-option>
            <el-option label="金融科技" value="金融科技"></el-option>
            <el-option label="區塊鏈" value="區塊鏈"></el-option>
            <el-option label="資訊科技" value="資訊科技"></el-option>
            <el-option label="其他" value="其他"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </div>

    <div class="pageFundsplan__btn">
      <button @click="startFind()">開始找方案</button>
    </div>
  </div>
</template>

<script>
import { cityAndCountiesLite, Counties } from "@/assets/taiwan";

import Layout from "@/views/layout/Layout";
import Title from "@/components/Title";

import * as planss from "@/api/planss";

export default {
  components: { Title },
  data() {
    return {
      countyData: Counties,
      districtData: cityAndCountiesLite,

      temp: {
        county: "",
        district: "",

        Q1: "",
        Q2: "",
        Q3: "2001-01-01",
        Q4: "",
        Q5: "",
        Q6: "",
        Q7: "",
        Q8: "",
        Q9: "",
      },
      rules: {
        Q1: [{ required: true, message: "必填欄位", trigger: "change" }],
        Q2: [{ required: true, message: "必填欄位", trigger: "change" }],
        Q3: [{ required: true, message: "必填欄位", trigger: "change" }],
        county: [{ required: true, message: "必填欄位", trigger: "change" }],
        Q5: [{ required: true, message: "必填欄位", trigger: "blur" }],
        Q6: [{ required: true, message: "必填欄位", trigger: "change" }],
        Q7: [{ required: true, message: "必填欄位", trigger: "change" }],
        Q8: [{ required: true, message: "必填欄位", trigger: "change" }],
        Q9: [{ required: true, message: "必填欄位", trigger: "change" }],
      },
      disAfterDate: {
        disableDate(time) {
          return time.getTime() < Date.now() - 8.64e7;
        },
      },
    };
  },
  computed: {
    ChooseCounty() {
      return (data) => {
        return data[this.temp.county];
      };
    },
  },
  methods: {
    getQ2(val) {
      if (val == "否") {
        this.temp.Q5 = "";
        this.temp.Q6 = "";
        this.temp.Q7 = "";
      }
    },
    startFind() {
      this.$refs["ruleForm"].validate((valid) => {
        if (valid) {
          this.temp.Q1 =
            this.temp.Q1.length > 0 ? this.temp.Q1.join(",") : "無";
          this.temp.Q4 = `${this.temp.county}${this.temp.district}` || "無";
          this.temp.Q5 = this.temp.Q5 !== "" ? this.temp.Q5 : "無";
          this.temp.Q6 =
            this.temp.Q6.length > 0 ? this.temp.Q6.join(",") : "無";
          this.temp.Q7 = this.temp.Q7 !== "" ? this.temp.Q7 : "無";
          this.temp.Q8 =
            this.temp.Q8.length > 0 ? this.temp.Q8.join(",") : "無";
          this.temp.Q9 =
            this.temp.Q9.length > 0 ? this.temp.Q9.join(",") : "無";

          planss.userLoadView(this.temp).then((res) => {
            this.$store.dispatch("setPlanssList", res.data);
            this.$router.push({ name: "fundsplanRecommend" });
          });
        } else {
          this.$nextTick(() => {
            let isError = document.getElementsByClassName("is-error");
            isError[0].scrollIntoView({
              block: "center",
              behavior: "smooth",
            });
          });
        }
      });
    },
  },
  mounted() {
    this.$refs["ruleForm"].resetFields();
  },
  created() {
    const addRouter = [
      {
        path: "/fundsplan",
        component: Layout,
        redirect: "noredirect",
        name: "fundsplan",
        meta: {
          title: "資金方案推薦",
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