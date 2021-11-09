<template>
  <div class="pageRecommend">
    <Title title="資金方案推薦" />

    <div v-if="planssList.length > 0">
      <strong class="pageRecommend__subTitle">依據你此次的需求，推薦以下幾個方案：</strong>

      <div class="pageRecommend__card" v-for="item in planssList" :key="item">
        <!-- 計畫種類 -->
        <div class="pageRecommend__card--header">
          <strong>{{item.planType === "不限" ? "不限對象" : item.planType}}</strong>
        </div>
        <div class="pageRecommend__card--body">
          <div class="company">
            <div class="w-full">
              <!-- 公司名 -->
              <strong>{{item.planObject}}</strong>
            </div>
            <div class="w-full company__tags">
              <!-- 即將受理 -->
              <span class="company__tags--mainColor" v-if="!!item.planState">{{item.planState}}</span>
              <!-- 顯示地區名 -->
              <span class="company__tags--subColor" v-if="!!item.planArea">{{item.planArea === "不限" ? "不限地區" : item.planArea}}</span>
              <!-- 顯示對象名 -->
              <span class="company__tags--subColor" v-if="!!item.planObject">{{item.planObject}}</span>
            </div>
          </div>

          <!-- 計劃名 -->
          <div class="title">
            <strong>{{item.planName}}</strong>
          </div>

          <!-- 摘要 -->
          <div class="introduce">
            <p>{{item.planSummary}}</p>
          </div>

          <div class="viewMore" v-if="!!item.url">
            <a :href="item.url">＋了解更多</a>
          </div>
        </div>
      </div>

      <div class="pageRecommend__btn">
        <button @click="$router.push('/fundsplan/index')">返回</button>
      </div>
    </div>

    <div v-else>
      <div class="pageRecommend__noData">
        <div class="pageRecommend__noData--left">
          <img src="@/assets/login/iconservice.png" alt="" width="40px">
          <strong>電話諮詢</strong>
        </div>

        <div class="pageRecommend__noData--right">
          <strong>即時的電話諮詢</strong>

          <ul>
            <li>撥打0800-056-476，經濟部中小企業處馬上辦辦公室，找到自己適合的方案。</li>
            <li>或撥0800-589-168，創業諮詢專業，尋找合適</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Title from "@/components/Title";

export default {
  data() {
    return {
      planssList: [],
    };
  },
  components: { Title },
  mounted() {
    this.planssList = this.$store.state.plans?.planssList || [];
  },
};
</script>

<style lang="scss" scoped>
.pageRecommend {
  width: 100%;
  min-height: 100%;
  padding: 16px;
  box-sizing: border-box;
  background-color: white;

  &__subTitle {
    font-size: 14px;
    color: #006587;
  }

  &__card {
    width: 100%;
    display: flex;
    flex-direction: column;
    margin-top: 20px;
    border: 1px solid #0092c3;
    border-radius: 8px;

    &--header {
      width: 100%;
      padding: 8px;
      background-color: #0092c3;
      border-radius: 8px 8px 0 0;
      color: white;
      text-align: center;
      letter-spacing: 0.1rem;
    }

    &--body {
      width: 100%;
      padding: 16px;
      box-sizing: border-box;
      display: flex;
      flex-direction: column;

      .company {
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: space-between;
        color: #0092c3;

        &__tags {
          display: flex;
          align-items: center;
          justify-content: flex-end;

          span {
            margin-right: 8px;
            color: white;
            border: none;
            padding: 6px 16px;
            border-radius: 8px;
          }

          &--mainColor {
            background-color: #0161a5;
          }

          &--subColor {
            background-color: #0092c3;
          }
        }
      }

      .title {
        width: 100%;
        text-align: left;
        font-size: 20px;
        color: #0092c3;
        margin-top: 8px;
      }

      .introduce {
        widows: 100%;
        text-align: left;
        margin-top: 16px;
        p {
          margin: 0;
          font-size: 14px;
        }
      }

      .viewMore {
        width: 100%;
        text-align: right;

        a {
          color: #0092c3;
          text-decoration: underline;
          font-weight: bold;
          transition: all 0.5s;

          &:hover {
            letter-spacing: 0.1rem;
          }
        }
      }
    }
  }

  &__btn {
    width: 100%;
    text-align: center;
    margin-top: 32px;

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

  &__noData {
    display: flex;
    align-items: center;
    width: 100%;
    height: 200px;
    min-height: 200px;

    &--left {
      width: 200px;
      height: 100%;
      background-color: #d34a4a;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;
      padding: 16px;
      box-sizing: border-box;

      strong {
        margin-top: 8px;
        color: white;
        font-size: 18px;
      }
    }

    &--right {
      width: calc(100% - 200px);
      height: 100%;
      display: flex;
      align-items: flex-start;
      justify-content: center;
      flex-direction: column;
      color: #d34a4a;
      border: 1px solid gray;
      border-left: none;
      padding: 16px;

      strong {
        font-size: 24px;
      }

      ul {
        list-style: none;
        padding-left: 0;
      }
    }
  }
}
</style>