<template>
  <div class="printPage">
    <!-- 基本資料 -->
    <div class="printPage__block profileWidth">
      <div class="printPage__block--title">
        <strong>基本資料</strong>
      </div>
      <div class="printPage__block--content">
        <div class="label">Email</div>
        <div class="value">{{profileList.email}}</div>
      </div>
      <div class="printPage__block--content">
        <div class="label">暱稱</div>
        <div class="value">{{profileList.nickName}}</div>
      </div>
      <div class="printPage__block--content">
        <div class="label">性別</div>
        <div class="value">{{profileList.sex === 1 ? '男' : '女'}}</div>
      </div>
      <div class="printPage__block--content">
        <div class="label">聯絡電話</div>
        <div class="value">{{profileList.phone1}}</div>
      </div>
      <div class="printPage__block--content">
        <div class="label">通訊地址</div>
        <div class="value">{{profileList.county}}{{profileList.district}}{{profileList.address}}</div>
      </div>
      <div class="printPage__block--content">
        <div class="label">是否已成立公司</div>
        <div class="value">{{profileList.hasCompany ? '是' : '否'}}</div>
      </div>
      <div class="printPage__block--content">
        <div class="label">創業階段</div>
        <div class="value">{{profileList.businessStageItems || "-"}}</div>
      </div>
      <div class="printPage__block--content">
        <div class="label">產業類別</div>
        <div class="value">{{profileList.industryTypeItems || "-"}}</div>
      </div>
      <div class="printPage__block--content">
        <div class="label">感興趣的資訊</div>
        <div class="value">{{profileList.interestItems || "-"}}</div>
      </div>
    </div>
    <!-- 公司發展階段 -->
    <div class="printPage__block developingWidth">
      <div class="printPage__block--title">
        <strong>公司發展階段</strong>
      </div>
      <div class="printPage__block--content">
        <div class="label">公司名稱</div>
        <div class="value">{{developingList.companyName}}</div>
      </div>
      <div class="printPage__block--content">
        <div class="label">統一編號</div>
        <div class="value">{{developingList.einno}}</div>
      </div>
      <div class="printPage__block--content">
        <div class="label">成立年度</div>
        <div class="value">{{developingList.setUpDate}}</div>
      </div>
      <div class="printPage__block--content">
        <div class="label">資本額</div>
        <div class="value">{{developingList.capital}}</div>
      </div>
      <div class="printPage__block--content">
        <div class="label">負責人姓名</div>
        <div class="value">{{developingList.principalName}}</div>
      </div>
      <div class="printPage__block--content">
        <div class="label">公司登記地址</div>
        <div class="value">{{developingList.county}} {{developingList.district}} {{developingList.address}}</div>
      </div>
      <div class="printPage__block--content">
        <div class="label">公司員工人數(不包含負責人)</div>
        <div class="value">{{developingList.staffCount}}</div>
      </div>
      <div class="printPage__block--content">
        <div class="label">是否已有管理階層</div>
        <div class="value">{{developingList.hasManagement ? '是' : '否'}}</div>
      </div>
      <div class="printPage__block--content">
        <div class="label">是否已有顯著獲利</div>
        <div class="value">{{developingList.hasProfit ? '是' : '否'}}</div>
      </div>
      <div class="printPage__block--content">
        <div class="label">是否擁有100萬以上的資產</div>
        <div class="value">{{developingList.hasMillionAssets ? '是' : '否'}}</div>
      </div>
      <div class="printPage__block--content">
        <div class="label">是否有大公司投資</div>
        <div class="value">{{developingList.hasInvestment ? '是' : '否'}}</div>
      </div>
      <div class="printPage__block--content">
        <div class="label">是否擁有專利權</div>
        <div class="value">{{developingList.hasPatent ? '是' : '否'}}</div>
      </div>
    </div>
    <!-- 營運狀況 -->
    <div class="printPage__block operationWidth">
      <div class="printPage__block--title">
        <strong>營運狀況</strong>
      </div>
      <div class="printPage__block--content">
        <div class="label">主要產品/服務</div>
        <div class="value">{{operationList.mainProduct}}</div>
      </div>
      <div class="printPage__block--content">
        <div class="label">營收模式</div>
        <div class="value">{{operationList.incomeModelITems}}</div>
      </div>
      <div class="printPage__block--content">
        <div class="label">市場評估</div>
        <div class="value">{{operationList.marketAssess}}</div>
      </div>
      <div class="printPage__block--content">
        <div class="label">目標市場/客戶</div>
        <div class="value">{{operationList.targetMarket}}</div>
      </div>
      <div class="printPage__block--content">
        <div class="label">營運狀況</div>
        <div class="newBlock" v-for="(item, idx) in operationList.companyStockItmes" :key="idx">
          <div class="newBlock__content">
            <div class="newLabel">年度：</div>
            <div class="value">{{item.year}}</div>
          </div>
          <div class="newBlock__content">
            <div class="newLabel">年度營業額：</div>
            <div class="value">{{item.businessAmount}}</div>
          </div>
          <div class="newBlock__content">
            <div class="newLabel">年度毛利率：</div>
            <div class="value">{{item.grossMarginRate}}</div>
          </div>
          <div class="newBlock__content">
            <div class="newLabel">年度淨利率：</div>
            <div class="value">{{item.profitMargin}}</div>
          </div>
          <div class="newBlock__content">
            <div class="newLabel">年度每股淨值：</div>
            <div class="value">{{item.pbr}}</div>
          </div>
          <div class="newBlock__content">
            <div class="newLabel">年度每股盈餘(EPS)：</div>
            <div class="value">{{item.eps}}</div>
          </div>
        </div>
      </div>
    </div>
    <!-- 經營團隊說明 -->
    <div class="printPage__block teamsWidth">
      <div class="printPage__block--title">
        <strong>經營團隊說明</strong>
      </div>
      <div class="printPage__block--content">
        <div class="label">過去是否有相關技術經驗</div>
        <div class="value">{{teamsList.hasTechnologyExperience ? '是' : '否'}}</div>
      </div>
      <div class="printPage__block--content">
        <div class="label">技術來源</div>
        <div class="value">{{teamsList.technologyFrom}}</div>
      </div>
      <div class="printPage__block--content">
        <div class="label">企業優勢說明</div>
        <div class="value">{{teamsList.technologyFrom}}</div>
      </div>
      <div class="printPage__block--content">
        <div class="label">團隊成員</div>
        <div class="newBlock" v-for="(item, idx) in teamsList.companyTeamMemberItems" :key="idx">
          <div class="newBlock__content">
            <div class="newLabel">姓名：</div>
            <div class="value">{{item.memberName}}</div>
          </div>
          <div class="newBlock__content">
            <div class="newLabel">經歷：</div>
            <div class="value">{{item.memberExperience}}</div>
          </div>
          <div class="newBlock__content">
            <div class="newLabel">專長：</div>
            <div class="value">{{item.memberExpertise}}</div>
          </div>
        </div>
      </div>
    </div>
    <!-- 股東結構說明 -->
    <div class="printPage__block shareHolderWidth">
      <div class="printPage__block--title">
        <strong>股東結構說明</strong>
      </div>
      <!-- <div class="printPage__block--content">
        <div class="label">股東姓名</div>
        <div class="value">{{shareHolderList}}</div>
      </div>
      <div class="printPage__block--content">
        <div class="label">團隊成員</div> -->
      <div class="newBlock" v-for="(item, idx) in shareHolderList" :key="idx">
        <div class="newBlock__content">
          <div class="newLabel">股東姓名：</div>
          <div class="value">{{item.name}}</div>
        </div>
        <div class="newBlock__content">
          <div class="newLabel">持股股數：</div>
          <div class="value">{{item.stockCount}}</div>
        </div>
        <div class="newBlock__content">
          <div class="newLabel">持股比例：</div>
          <div class="value">{{item.stockRate}}</div>
        </div>
        <div class="newBlock__content">
          <div class="newLabel">出資額度：</div>
          <div class="value">{{item.capital}}</div>
        </div>
      </div>
      <!-- </div> -->
    </div>
    <!-- 其他項目 -->
    <div class="printPage__block otherWidth">
      <div class="printPage__block--title">
        <strong>其他項目</strong>
      </div>
      <div class="printPage__block--content">
        <div class="label">是否有打算拓展海外市場</div>
        <div class="value">{{otherList.hasOverseasMarkets ? '是' : '否'}}</div>
      </div>
      <div class="printPage__block--content">
        <div class="label">是否有打算上市櫃</div>
        <div class="value">{{otherList.hasListed ? '是' : '否'}}</div>
      </div>
      <div class="printPage__block--content">
        <div class="label">是否有接觸過投資者</div>
        <div class="value">{{otherList.hasContactInvestors ? '是' : '否'}}</div>
      </div>
      <div class="printPage__block--content">
        <div class="label">獎項或政府補助計畫名稱</div>
        <div class="newBlock" v-for="(item, idx) in otherList.companyGovSubsidyPlanItems" :key="idx">
          <div class="newBlock__content">
            <div class="newLabel">獎項或政府補助計畫名稱：</div>
            <div class="value">{{item.name}}</div>
          </div>
          <div class="newBlock__content">
            <div class="newLabel">獲得獎項或政府補助計畫年度：</div>
            <div class="value">{{item.year}}</div>
          </div>
          <div class="newBlock__content">
            <div class="newLabel">獎項或政府補助計畫單位：</div>
            <div class="value">{{item.unit}}</div>
          </div>
          <div class="newBlock__content">
            <div class="newLabel">獲得獎項或政府補助計畫內容概述：</div>
            <div class="value">{{item.summary}}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import moment from "moment";

import * as company from "@/api/company";
export default {
  data() {
    return {
      profileList: {},
      developingList: {},
      operationList: {},
      teamsList: {},
      shareHolderList: [],
      otherList: {},
    };
  },
  methods: {
    getProfile() {
      company
        .getUserExts({ id: this.$store.state.user.userInfo.id })
        .then((res) => {
          this.profileList = res.result;
          this.profileList.businessStageItems =
            this.profileList.businessStageItems?.join(",");
          this.profileList.industryTypeItems =
            this.profileList.industryTypeItems?.join(",");
          this.profileList.interestItems =
            this.profileList.interestItems?.join(",");
        });
    },
    getDeveloping() {
      company
        .getCompanys({ id: this.$store.state.user.userInfo.id })
        .then((res) => {
          this.developingList = res.result;
          this.developingList.setUpDate = moment(
            this.developingList.setUpDate
          ).format("YYYY");
        });
    },
    getOperations() {
      company
        .getCompanyOperations({ id: this.$store.state.user.userInfo.id })
        .then((res) => {
          this.operationList = res.result;
          this.operationList.incomeModelITems =
            this.operationList.incomeModelITems?.join(",");
        });
    },
    getTeams() {
      company
        .getCompanyTeams({ id: this.$store.state.user.userInfo.id })
        .then((res) => {
          this.teamsList = res.result;
        });
    },
    getShareHolders() {
      company
        .getCompanyShareHolders({
          CompanyId: this.$store.state.user.userInfo.id,
        })
        .then((res) => {
          this.shareHolderList = res.data;
        });
    },
    getOthers() {
      company
        .getCompanyOtherss({ id: this.$store.state.user.userInfo.id })
        .then((res) => {
          this.otherList = res.result;
        });
    },
  },
  mounted() {
    // 基本資料
    this.getProfile();
    // 公司發展階段
    this.getDeveloping();
    // 營運狀況
    this.getOperations();
    // 經營團隊說明
    this.getTeams();
    // 股東結構說明
    this.getShareHolders();
    // 其他項目
    this.getOthers();
  },
};
</script>

<style lang="scss" scoped>
.printPage {
  height: 100%;

  &__block {
    width: 100%;

    &--title {
      width: 100%;
      padding: 16px 0 16px 50px;
      color: #0092c3;
      border-bottom: 4px solid #0092c3;
      font-size: 20px;
    }

    &--content {
      width: 100%;
      padding: 16px 0 16px 50px;
      display: flex;
      align-items: flex-start;

      .label {
        padding: 0 8px;
      }

      .value {
        font-weight: 700;
      }

      .newBlock {
        &__content {
          display: flex;
          align-items: center;
          margin-bottom: 8px;

          &:last-child {
            margin-bottom: 0;
          }

          .newLabel {
            font-weight: 500;
          }
        }
      }
    }
  }

  .profileWidth {
    .label {
      min-width: 150px;
    }
  }

  .developingWidth {
    .label {
      min-width: 230px;
    }
  }

  .operationWidth {
    .label {
      min-width: 135px;
    }
  }

  .shareHolderWidth {
    .label {
      min-width: 210px;
    }
    .newBlock {
      &__content {
        padding: 16px 0 16px 50px;
        display: flex;
        align-items: flex-start;
        margin-bottom: 8px;

        &:last-child {
          margin-bottom: 0;
        }

        .newLabel {
          min-width: 100px;
        }

        .value {
          font-weight: 700;
        }
      }
    }
  }

  .teamsWidth {
    .label {
      min-width: 210px;
    }
  }

  .otherWidth {
    .label {
      min-width: 210px;
    }
  }
}
</style>