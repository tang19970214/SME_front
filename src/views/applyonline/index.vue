<template>
  <div class="pageApplyOnline">
    <Title title="線上申請" />

    <div class="pageApplyOnline__subTitle">
      <strong>請點選您要申請的方案～</strong>
    </div>

    <div class="pageApplyOnline__card" v-for="item in applyList" :key="item.id">
      <div class="pageApplyOnline__card--title">
        <span>{{item.title}}</span>
      </div>

      <div class="pageApplyOnline__card--block">
        <div class="left">
          <div class="left__content">
            <label>方案名稱</label>
            <p>{{item.projectName}}</p>
          </div>
          <div class="left__content">
            <label>主辦單位</label>
            <p>{{item.org}}</p>
          </div>
          <div class="left__content">
            <label>相關連結</label>
            <a :href="item.link" target="_blank">{{item.link}}</a>
          </div>
        </div>

        <div class="right">
          <button @click="checkUser(item.projectName)">點我申請</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Title from "@/components/Title";

import * as userExts from "@/api/userExts";

export default {
  components: { Title },
  data() {
    return {
      applyList: [
        {
          id: 1,
          title: "創投資金",
          projectName: "策略性投資人媒合申請",
          org: "全國創新創業總會",
          link: "https://www.smefund.com.tw/fund/strategic-investor",
          method: "",
        },
        {
          id: 2,
          title: "融資貸款",
          projectName: "台企銀融資方案",
          org: "台灣中小企業銀行",
          link: "https://beboss.wda.gov.tw/cp.aspx?n=33",
          method: "",
        },
      ],
    };
  },
  methods: {
    checkUser() {
      userExts
        .CheckAllColumns({ userId: this.$store.state.user.userInfo.id })
        .then((res) => {
          if (res.code === 200) {
            this.apply();
          }
        });
    },
    apply(PlanName) {
      userExts.SendPlan({ PlanName }).then((res) => {
        if (res.code === 200) {
          this.$message({
            title: "成功",
            message: "申請成功",
            type: "success",
            duration: 1000,
          });

          setTimeout(() => {
            // 開啟列印頁
            let routeUrl = this.$router.resolve({
              name: "print",
            });
            window.open(routeUrl.href, "_blank");
          }, 1000);
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.pageApplyOnline {
  width: 100%;
  min-height: 100%;
  padding: 16px;
  box-sizing: border-box;
  background-color: white;

  &__subTitle {
    width: 100%;
    color: #006587;
    margin-bottom: 32px;
  }

  &__card {
    width: 100%;
    padding: 16px;
    box-sizing: border-box;
    border-radius: 8px;
    border: 1px solid #ccc;
    margin-bottom: 16px;

    &--title {
      width: 100%;

      span {
        display: inline-block;
        background: #0092c3;
        border-radius: 8px;
        padding: 8px 20px;
        color: white;
        font-size: 20px;
        letter-spacing: 2px;
      }
    }

    &--block {
      width: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;

      @media (min-width: 768px) {
        flex-direction: row;
      }

      .left {
        width: 100%;
        padding-left: 20px;
        box-sizing: border-box;

        @media (min-width: 768px) {
          width: calc(100% - 120px);
        }

        &__content {
          display: flex;
          align-items: center;

          label {
            min-width: 80px;
            max-width: 80px;
            color: #0092c3;
          }

          a {
            margin: 8px 0;
            overflow-wrap: anywhere;

            &:hover {
              text-decoration: underline;
              color: #006587;
            }
          }
        }
      }

      .right {
        width: 100%;

        @media (min-width: 768px) {
          width: 120px;
        }

        button {
          width: 100%;
          background: #0092c3;
          padding: 8px 12px;
          box-sizing: border-box;
          border: none;
          border-radius: 8px;
          color: white;
          font-size: 18px;
          letter-spacing: 3px;
          cursor: pointer;
          transition: all 0.3s;

          &:hover {
            opacity: 0.9;
          }

          @media (min-width: 768px) {
            width: auto;
            padding: 16px 20px;
            font-size: 36px;
          }
        }
      }
    }
  }
}
</style>