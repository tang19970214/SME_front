<template>
  <div class="pageRecommend">
    <Title title="資金方案推薦" />
    <strong class="pageRecommend__subTitle">依據你此次的需求，推薦以下幾個方案：</strong>

    <div class="pageRecommend__card" v-for="item in 3" :key="item">
      <div class="pageRecommend__card--header">
        <strong>融資貸款</strong>
      </div>
      <div class="pageRecommend__card--body">
        <div class="company">
          <div class="w-full">
            <strong>臺灣中小企業銀行</strong>
          </div>
          <div class="w-full company__btns">
            <button class="company__btns--mainColor">即將受理</button>
            <button class="company__btns--subColor">顯示地區名</button>
            <button class="company__btns--subColor">顯示對象名</button>
          </div>
        </div>

        <div class="title">
          <strong>經濟部小型企業創新研發計畫(SBIR)</strong>
        </div>

        <div class="introduce">
          <p>顯示計畫摘要文字</p>
        </div>

        <div class="viewMore">
          <a href="#">＋了解更多</a>
        </div>
      </div>
    </div>

    <div class="pageRecommend__btn">
      <button @click="$router.push('/fundsplan/index')">返回</button>
    </div>
  </div>
</template>

<script>
import Title from "@/components/Title";

export default {
  components: { Title },
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

        &__btns {
          display: flex;
          align-items: center;
          justify-content: flex-end;

          button {
            margin-right: 8px;
            color: white;
            border: none;
            padding: 6px 16px;
            border-radius: 8px;
            cursor: pointer;

            &:hover {
              opacity: 0.8;
            }
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
}
</style>