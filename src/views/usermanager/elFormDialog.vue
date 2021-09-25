<template>
  <div>
    <!-- 列表各個操作 -->
    <el-dialog class="dialog-mini" width="50%" :title="listDialogTitle()" :visible.sync="listDialogForm" :close-on-click-modal="false" :close-on-press-escape="false" :show-close="false">

      <!-- 輔導顧問 -->
      <el-form ref="dataForm_coaching" :model="list_coaching" label-position="right" label-width="100px" v-if="chooseInfo.value == 'coaching'">
        <el-form-item size="small" :label="'所屬單位名稱'">{{userInfo.organizations}}</el-form-item>
        <el-form-item size="small" :label="'姓名'">{{userInfo.name}}</el-form-item>
        <el-form-item size="small" :label="'職稱'">
          <el-input v-model="list_coaching.title"></el-input>
        </el-form-item>
        <el-form-item size="small" :label="'顧問任職公司'">
          <el-input v-model="list_coaching.unit"></el-input>
        </el-form-item>
        <!-- <el-form-item size="small" :label="'性別'">
          <el-radio-group v-model="list_coaching.sex">
            <el-radio label="1">男</el-radio>
            <el-radio label="0">女</el-radio>
          </el-radio-group>
        </el-form-item> -->
        <el-form-item size="small" :label="'身分證字號'">
          <el-input v-model="list_coaching.uid"></el-input>
        </el-form-item>
        <el-form-item size="small" :label="'Email'">
          <el-input v-model="list_coaching.contactEmail"></el-input>
        </el-form-item>
        <el-form-item size="small" :label="'通訊地址'">
          <el-select class="filter-item w-full" v-model="list_coaching.county" placeholder="請選擇縣市">
            <el-option v-for="(item, idx) in countyData" :key="idx" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
          <el-select class="filter-item w-full" v-model="list_coaching.district" placeholder="請選擇區域" no-data-text="請先選擇縣市">
            <el-option v-for="(items, $index) in ChooseCounty(districtData, 'list_coaching')" :key="'DT_' + $index" :label="items.label" :value="items.value">
            </el-option>
          </el-select>
          <el-input v-model="list_coaching.address"></el-input>
        </el-form-item>
        <!-- <el-form-item size="small" :label="'通訊電話'">
          <el-input v-model="list_coaching.contactPhone1"></el-input>
        </el-form-item> -->
        <el-form-item size="small" :label="'聯絡電話'">
          <el-input v-model="list_coaching.contactPhone2"></el-input>
        </el-form-item>
        <el-form-item size="small" :label="'主要專長'">
          <el-select class="filter-item w-full" v-model="list_coaching.mainSpecialtyItems" placeholder="請選擇主要專長" multiple>
            <el-option v-for="item in mainExpertiseList" :key="item.id" :label="item.name" :value="item.dtValue">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item size="small" :label="'擅長產業類別'">
          <el-select class="filter-item w-full" v-model="list_coaching.industryTypeItem" placeholder="請選擇產業類別" multiple>
            <el-option v-for="item in  industryList" :key="item.id" :label="item.name" :value="item.dtValue">
            </el-option>
          </el-select>
          <el-input v-model="list_coaching.industryTypeOther" v-if="getCoachingOther()" placeholder="請輸入其他擅長產業類別"></el-input>
        </el-form-item>
        <el-form-item size="small" :label="'個人照片'">
          <!-- <el-upload class="avatar-uploader" action="" :show-file-list="false" accept=".png,.jpg,.jpeg,.svg,.pdf" :http-request="customUpload" :before-upload="beforeAvatarUpload">
            <div v-if="!!imgInfo.url">
              <img :src="imgInfo.url" class="avatar" />
            </div>
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload> -->

          <el-upload class="avatar-uploader" action="" :show-file-list="false" accept=".png,.jpg,.jpeg,.svg" :before-upload="beforeAvatarUpload">
            <div v-if="!!getImgs.filePath">
              <img :src="getImgs.filePath" :alt="getImgs.name" class="avatar" />
            </div>
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>

          <Cropper :cropperDialog="cropperDialog" :cropperImg="imgInfo" :autoCropWidth="800" :autoCropHeight="800" @setImgs="setImgs" @cancleCropper="cropperDialog = false" />

        </el-form-item>
        <el-form-item size="small" :label="'顧問簡介'">
          <ckeditor v-model="list_coaching.summary" :value="list_coaching.summary" :config="setConfig" />
        </el-form-item>
        <el-form-item size="small" :label="'備註'">
          <el-input type="textarea" :rows="5" v-model="list_coaching.remark"></el-input>
        </el-form-item>
      </el-form>

      <!-- 基本資料 -->
      <el-form ref="dataForm_basic" :model="list_basic" label-position="right" label-width="120px" v-if="chooseInfo.value == 'basic'">
        <el-form-item size="small" :label="'Email'">
          <el-input v-model="list_basic.email"></el-input>
        </el-form-item>
        <el-form-item size="small" :label="'暱稱'">
          <el-input v-model="list_basic.nickName"></el-input>
        </el-form-item>
        <el-form-item size="small" :label="'性別'">
          <el-radio-group v-model="list_basic.sex">
            <el-radio :label="1">男</el-radio>
            <el-radio :label="0">女</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item size="small" :label="'聯絡電話'">
          <el-input v-model="list_basic.phone1"></el-input>
          <el-input v-model="list_basic.phone2"></el-input>
        </el-form-item>
        <el-form-item size="small" :label="'通訊地址'">
          <el-select class="filter-item w-full" v-model="list_basic.county" placeholder="請選擇縣市">
            <el-option v-for="(item, idx) in countyData" :key="idx" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
          <el-select class="filter-item w-full" v-model="list_basic.district" placeholder="請選擇區域" no-data-text="請先選擇縣市">
            <el-option v-for="(items, $index) in ChooseCounty(districtData, 'list_basic')" :key="'DT_' + $index" :label="items.label" :value="items.value">
            </el-option>
          </el-select>
          <el-input v-model="list_basic.address"></el-input>
        </el-form-item>
        <el-form-item size="small" :label="'是否已成立公司'">
          <el-radio-group v-model="list_basic.hasCompany">
            <el-radio :label="true">是</el-radio>
            <el-radio :label="false">否</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item size="small" :label="'創業階段'">
          <el-select class="filter-item w-full" v-model="list_basic.businessStageItems" placeholder="請選擇創業階段" multiple>
            <el-option v-for="item in  businessList" :key="item.id" :label="item.name" :value="item.dtValue">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item size="small" :label="'產業類別'">
          <el-select class="filter-item w-full" v-model="list_basic.industryTypeItems" placeholder="請選擇產業類別" multiple>
            <el-option v-for="item in  industryList" :key="item.id" :label="item.name" :value="item.dtValue">
            </el-option>
          </el-select>
          <el-input v-model="list_basic.industryTypeOther" placeholder="請輸入其他產業類別" v-if="getBasicOther()"></el-input>
        </el-form-item>
      </el-form>

      <!-- 公司發展階段 -->
      <el-form ref="dataForm_developing" :model="list_developing" label-position="right" label-width="140px" v-if="chooseInfo.value == 'developing'">
        <el-form-item size="small" :label="'公司名稱'">
          <el-input v-model="list_developing.companyName"></el-input>
        </el-form-item>
        <el-form-item size="small" :label="'統一編號'">
          <el-input v-model="list_developing.einno"></el-input>
        </el-form-item>
        <el-form-item size="small" :label="'成立年度'">
          <el-date-picker v-model="list_developing.setUpDate" type="date" value-format="yyyy-MM-dd" placeholder="請選擇日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item size="small" :label="'資本額'">
          <el-input v-model.trim="list_developing.capital" @blur="inputMoney($event, 'list_developing', 'capital')" placeholder="請輸入資本額"></el-input>
        </el-form-item>
        <el-form-item size="small" :label="'負責人姓名'">
          <el-input v-model="list_developing.principalName"></el-input>
        </el-form-item>
        <el-form-item size="small" :label="'公司登記地址'">
          <el-select class="filter-item w-full" v-model="list_developing.county" placeholder="請選擇縣市">
            <el-option v-for="(item, idx) in countyData" :key="idx" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
          <el-select class="filter-item w-full" v-model="list_developing.district" placeholder="請選擇區域" no-data-text="請先選擇縣市">
            <el-option v-for="(items, $index) in ChooseCounty(districtData, 'list_developing')" :key="'DT_' + $index" :label="items.label" :value="items.value">
            </el-option>
          </el-select>
          <el-input v-model="list_developing.address"></el-input>
        </el-form-item>
        <el-form-item size="small" :label="'公司員工人數(不包含負責人)'">
          <el-input v-model="list_developing.staffCount"></el-input>
        </el-form-item>
        <el-form-item size="small" :label="'是否已有管理階層'">
          <el-radio-group v-model="list_developing.hasManagement">
            <el-radio :label="true">是</el-radio>
            <el-radio :label="false">否</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item size="small" :label="'是否已有顯著獲利'">
          <el-radio-group v-model="list_developing.hasProfit">
            <el-radio :label="true">是</el-radio>
            <el-radio :label="false">否</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item size="small" :label="'是否擁有100萬以上的資產'">
          <el-radio-group v-model="list_developing.hasMillionAssets">
            <el-radio :label="true">是</el-radio>
            <el-radio :label="false">否</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item size="small" :label="'是否有大公司投資'">
          <el-radio-group v-model="list_developing.hasInvestment">
            <el-radio :label="true">是</el-radio>
            <el-radio :label="false">否</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item size="small" :label="'是否擁有專利權'">
          <el-radio-group v-model="list_developing.hasPatent">
            <el-radio :label="true">是</el-radio>
            <el-radio :label="false">否</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>

      <!-- 營運狀況 -->
      <el-form ref="dataForm_operations" :model="list_operations" label-position="right" label-width="120px" v-if="chooseInfo.value == 'operations'">
        <el-form-item size="small" :label="'主要產品/服務'">
          <el-input v-model="list_operations.mainProduct"></el-input>
        </el-form-item>
        <el-form-item size="small" :label="'營收模式'">
          <el-select class="filter-item w-full" v-model="list_operations.incomeModelITems" placeholder="請選擇營收模式" multiple>
            <el-option v-for="item in  incomeModelITemsList" :key="item.id" :label="item.name" :value="item.dtValue">
            </el-option>
          </el-select>
          <el-input v-model="list_operations.incomeModelOther" placeholder="請輸入其他營收模式" v-if="getOperationsOther()"></el-input>
        </el-form-item>
        <el-form-item size="small" :label="'市場評估'">
          <el-radio-group v-model="list_operations.marketAssess">
            <el-radio :label="'潛在對手小於兩家(獨佔or寡占)'">潛在對手小於兩家(獨佔or寡占)</el-radio>
            <el-radio :label="'至少3家以上的潛在對手，如：'">至少3家以上的潛在對手，如：</el-radio>
          </el-radio-group>
          <el-input v-model="list_operations.marketAssessOther" v-if="list_operations.marketAssess == '至少3家以上的潛在對手，如：'" placeholder="請填寫"></el-input>
        </el-form-item>
        <el-form-item size="small" :label="'目標市場/客戶'">
          <el-input v-model="list_operations.targetMarket"></el-input>
        </el-form-item>

        <div class="flex-items-c-justify-c mt-16">
          <el-input v-model="operationsYear" placeholder="請輸入年份，例：101" size="small"></el-input>
          <el-button type="info" size="small" @click="addTabOperations()" plain :disabled="!operationsYear">
            新增
          </el-button>
        </div>
        <el-tabs v-model="tabsOperationsValue" type="border-card" closable @tab-remove="removeTabOperations" v-if="tabsOperationsList.length > 0">
          <el-tab-pane v-for="(items, idx) in tabsOperationsList" :key="idx" :label="items.title + '年'" :name="items.name">
            <!-- <el-form-item size="small" :label="items.title + '年'">
              <el-date-picker class="w-full" v-model="items.operationsYearList.year" type="year" placeholder="請選擇年份">
              </el-date-picker>
            </el-form-item> -->
            <el-form-item size="small" :label="'年度營業額'">
              <el-input v-model="items.operationsYearList.businessAmount"></el-input>
            </el-form-item>
            <el-form-item size="small" :label="'年度毛利率'">
              <el-input v-model="items.operationsYearList.grossMarginRate"></el-input>
            </el-form-item>
            <el-form-item size="small" :label="'年度淨利率'">
              <el-input v-model="items.operationsYearList.profitMargin"></el-input>
            </el-form-item>
            <el-form-item size="small" :label="'年度每股淨值'">
              <el-input v-model="items.operationsYearList.pbr"></el-input>
            </el-form-item>
            <el-form-item size="small" :label="'年度每股盈餘(EPS)'">
              <el-input v-model="items.operationsYearList.eps"></el-input>
            </el-form-item>
          </el-tab-pane>
        </el-tabs>
      </el-form>

      <!-- 經營團隊 -->
      <el-form ref="dataForm_teams" :model="list_teams" label-position="right" label-width="100px" v-if="chooseInfo.value == 'teams'">
        <el-form-item size="small" :label="'過去是否有相關技術經驗'">
          <el-radio-group v-model="list_teams.hasTechnologyExperience">
            <el-radio :label="true">是</el-radio>
            <el-radio :label="false">否</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item size="small" :label="'技術來源'">
          <el-input v-model="list_teams.technologyFrom"></el-input>
        </el-form-item>
        <el-form-item size="small" :label="'企業優勢說明'">
          <el-input v-model="list_teams.advantageDescription"></el-input>
        </el-form-item>

        <div class="flex-items-c-justify-c mt-16">
          <el-input v-model="teamsName" placeholder="請輸入團隊成員姓名" size="small"></el-input>
          <el-button type="info" size="small" @click="addTabTeams()" plain :disabled="!teamsName">
            新增
          </el-button>
        </div>

        <el-tabs v-model="tabsTeamsValue" type="border-card" closable @tab-remove="removeTabTeams" v-if="tabsTeamsList.length > 0">
          <el-tab-pane v-for="(items, idx) in tabsTeamsList" :key="idx" :label="items.title" :name="items.name">
            <!-- <el-form-item size="small" :label="'團隊成員' + items.title">
              <el-input v-model="items.companyTeamMemberItems.memberName"></el-input>
            </el-form-item> -->
            <el-form-item size="small" :label="'經歷'">
              <el-input v-model="items.companyTeamMemberItems.memberExperience"></el-input>
            </el-form-item>
            <el-form-item size="small" :label="'專長'">
              <el-input v-model="items.companyTeamMemberItems.memberExpertise"></el-input>
            </el-form-item>
          </el-tab-pane>
        </el-tabs>
      </el-form>

      <!-- 股東結構說明 -->
      <el-form ref="dataForm_shareHolders" label-position="right" label-width="80px" v-if="chooseInfo.value == 'shareHolders'">

        <div class="flex-items-c-justify-c mt-16">
          <el-input v-model="shareHoldersName" placeholder="請輸入股東姓名" size="small"></el-input>
          <el-button type="info" size="small" @click="addTabShareHolders()" plain :disabled="!shareHoldersName">
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
              <el-input v-model="items.shareHoldersItems.stockRate"></el-input>
            </el-form-item>
            <el-form-item size="small" :label="'出資額度'">
              <el-input v-model="items.shareHoldersItems.capital"></el-input>
            </el-form-item>
          </el-tab-pane>
        </el-tabs>

      </el-form>

      <!-- 其他項目 -->
      <el-form ref="dataForm_other" :model="list_other" label-position="right" label-width="120px" v-if="chooseInfo.value == 'other'">
        <el-form-item size="small" :label="'是否有打算拓展海外市場'">
          <el-radio-group v-model="list_other.hasOverseasMarkets">
            <el-radio :label="true">是</el-radio>
            <el-radio :label="false">否</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item size="small" :label="'是否有打算上市櫃'">
          <el-radio-group v-model="list_other.hasListed">
            <el-radio :label="true">是</el-radio>
            <el-radio :label="false">否</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item size="small" :label="'是否有接觸過投資者'">
          <el-radio-group v-model="list_other.hasContactInvestors">
            <el-radio :label="true">是</el-radio>
            <el-radio :label="false">否</el-radio>
          </el-radio-group>
        </el-form-item>

        <div class="flex-items-c-justify-c mt-16">
          <el-input v-model="otherName" placeholder="請輸入獎項或政府補助計畫名稱" size="small"></el-input>
          <el-button type="info" size="small" @click="addTabOther()" plain :disabled="!otherName">
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
            <!-- <el-form-item size="small" :label="'獎項或政府補助計畫名稱'">
              <el-input v-model="items.companyGovSubsidyPlanItems.name"></el-input>
            </el-form-item> -->
            <el-form-item size="small" :label="'獲得獎項或政府補助計畫內容概述'">
              <el-input v-model="items.companyGovSubsidyPlanItems.summary"></el-input>
            </el-form-item>
          </el-tab-pane>
        </el-tabs>

      </el-form>

      <div slot="footer">
        <el-button size="mini" @click="closeDialogForm()">取消</el-button>
        <el-button size="mini" type="primary" @click="handleAddOrUpdate()">確認</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import { cityAndCountiesLite, Counties } from "@/assets/taiwan";

import * as categorys from "@/api/categorys";
// import * as upload from "@/api/upload";
import * as company from "@/api/company";
import * as users from "@/api/users";

import Cropper from "@/components/cropperImage";

export default {
  props: {
    listDialogForm: {
      type: Boolean,
      required: true,
      default: false,
    },
    chooseInfo: {
      type: Object,
      required: true,
    },
  },
  components: { Cropper },
  data() {
    return {
      countyData: Counties,
      districtData: cityAndCountiesLite,

      setConfig: {
        readOnly: false,
        extraPlugins: "button, panelbutton, colorbutton",
      },

      businessList: [],
      industryList: [],
      mainExpertiseList: [],
      incomeModelITemsList: [],

      list_coaching: {
        title: "",
        sex: "1",
        uid: "",
        contactEmail: "",
        county: "",
        district: "",
        address: "",
        contactPhone1: "",
        contactPhone2: "",
        mainSpecialtyItems: [],
        industryTypeItem: [],
        industryTypeOther: "",
        photo: "",
        summary: "",
        unit: "",
      },
      list_basic: {
        email: "",
        sex: 1,
        nickName: "",
        phone1: "",
        phone2: "",
        county: "",
        district: "",
        address: "",
        hasCompany: 1,
        businessStageItems: [],
        industryTypeItems: [],
        industryTypeOther: "",
      },
      list_developing: {
        companyName: "",
        einno: "",
        setUpDate: "",
        capital: 0,
        principalName: "",
        county: "",
        district: "",
        address: "",
        staffCount: 0,
        hasManagement: true,
        hasProfit: true,
        hasMillionAssets: true,
        hasInvestment: true,
        hasPatent: true,
        companyStockItems: [
          {
            year: 0,
            businessAmount: 0,
            grossMarginRate: 0,
            profitMargin: 0,
            pbr: 0,
            eps: 0,
          },
        ],
      },
      list_operations: {
        mainProduct: "",
        incomeModelITems: [],
        incomeModelOther: "",
        marketAssess: "",
        marketAssessOther: "",
        targetMarket: "",
        companyStockItmes: [],
      },
      list_teams: {
        hasTechnologyExperience: true,
        technologyFrom: "",
        advantageDescription: "",
        companyTeamMemberItems: [],
      },
      list_shareHolders: [],
      list_other: {
        hasOverseasMarkets: true,
        hasListed: true,
        hasContactInvestors: true,
        companyGovSubsidyPlanItems: [],
      },

      userInfo: {},

      tabsOperationsValue: "1",
      operationsYear: "",
      tabsOperationsList: [],
      defaultOperationsName: 0,

      tabsTeamsValue: "1",
      teamsName: "",
      tabsTeamsList: [],
      defaultTeamsName: 0,

      tabsShareHoldersValue: "1",
      shareHoldersName: "",
      tabsShareHoldersList: [],
      defaultShareHoldersName: 0,

      tabsOtherValue: "1",
      otherName: "",
      tabsOtherList: [],
      defaultOtherName: 0,

      /* 上傳 */
      imgInfo: "",
      cropperDialog: false,
      getImgs: {},
    };
  },
  computed: {
    listDialogTitle() {
      return () => {
        switch (this.chooseInfo.value) {
          case "coaching":
            return "輔導顧問";
          case "basic":
            return "基本資料";
          case "developing":
            return "公司發展階段";
          case "operations":
            return "營運狀況";
          case "teams":
            return "經營團隊說明";
          case "shareHolders":
            return "股東結構說明";
          case "other":
            return "其他項目";
        }
      };
    },

    /* 判斷basic產業類別是否選到其他 */
    getBasicOther() {
      return () => {
        if (this.list_basic.industryTypeItems?.includes("其他")) {
          return true;
        } else {
          this.list_basic.industryTypeOther = "";
          return false;
        }
      };
    },
    /* 判斷operations營運狀況是否選到其他 */
    getOperationsOther() {
      return () => {
        if (this.list_operations.incomeModelITems?.includes("其他")) {
          return true;
        } else {
          this.list_operations.incomeModelOther = "";
          return false;
        }
      };
    },
    /* 判斷coaching輔導顧問是否選到其他 */
    getCoachingOther() {
      return () => {
        if (this.list_coaching.industryTypeItem?.includes("其他")) {
          return true;
        } else {
          this.list_coaching.industryTypeOther = "";
          return false;
        }
      };
    },

    ChooseCounty() {
      return (data, tempName) => {
        return data[this[tempName].county];
      };
    },
  },
  watch: {
    chooseInfo(newVal) {
      if (newVal.value) {
        this.getFormList(newVal);
      }
    },
  },
  methods: {
    getBusiness() {
      const listQuery = {
        page: 1,
        limit: 999,
        TypeId: "SYS_USER_BUSINESSSTAGE",
      };
      categorys.getList(listQuery).then((res) => {
        this.businessList = res.data;
      });
    },
    getIndustryType() {
      const listQuery = {
        page: 1,
        limit: 999,
        TypeId: "SYS_USER_INDUSTRYTYPE",
      };
      categorys.getList(listQuery).then((res) => {
        this.industryList = res.data;
      });
    },
    getMainExpertise() {
      const listQuery = {
        page: 1,
        limit: 999,
        TypeId: "SYS_USERSUP_MAINEXPERTISE",
      };
      categorys.getList(listQuery).then((res) => {
        this.mainExpertiseList = res.data;
      });
    },
    getIncomeModelItemsList() {
      const listQuery = {
        page: 1,
        limit: 999,
        TypeId: "SYS_USER_INCOMEMODEL",
      };
      categorys.getList(listQuery).then((res) => {
        this.incomeModelITemsList = res.data;
      });
    },

    closeDialogForm() {
      this.$emit("closeDialogForm");
    },

    /* 數字千位數 */
    inputMoney(el, listName, name) {
      this[listName][name] = this.getInputValue(el);
    },
    // 獲取輸入框的值
    getInputValue(el) {
      let inputVal = el.target.value || "";
      return this.comdify(this.delcommafy(inputVal));
    },
    // 金額添加千分位
    comdify(n) {
      if (!n) return n;
      let str = n.split(".");
      let re = /\d{1,3}(?=(\d{3})+$)/g;
      let n1 = str[0].replace(re, "$&,");
      return str.length > 1 && str[1] ? `${n1}.${str[1]}` : `${n1}`;
    },
    //去除千分位中的‘，’
    delcommafy(num) {
      if (!num) return num;
      num = num.toString();
      num = num.replace(/,/gi, "");
      return num;
    },
    valdateFn(rule, val, cb) {
      setTimeout(() => {
        if (val) {
          let inputVal = this.delcommafy(val);
          if (rule.test(inputVal)) {
            cb();
          } else {
            cb("只能是數字金額,最多兩位小數");
          }
        }
        cb();
      });
    },
    // 驗證金額數字可以為負數
    moneyValid(rule, val, cb) {
      this.valdateFn(/((^-?[1-9]\d*)|^-?0)(\.\d{0,2}){0,1}$/, val, cb);
    },
    // 驗證金額數字不可以為負數
    moneyNValid(rule, val, cb) {
      const MoneyTest = /((^[1-9]\d*)|^0)(\.\d{0,2}){0,1}$/;
      this.valdateFn(MoneyTest, val, cb);
    },

    /* operations 營運狀況tabs */
    addTabOperations() {
      this.tabsOperationsList.push({
        title: this.operationsYear,
        name: String(this.defaultOperationsName),
        operationsYearList: {
          year: this.operationsYear,
          businessAmount: 0,
          grossMarginRate: 0,
          profitMargin: 0,
          pbr: 0,
          eps: 0,
        },
      });

      this.operationsYear = "";
      this.tabsOperationsValue = String(this.defaultOperationsName);
      this.defaultOperationsName = this.defaultOperationsName + 1;
    },
    removeTabOperations(targetName) {
      this.tabsOperationsList = this.tabsOperationsList.filter(
        (res) => res.name !== String(targetName)
      );
      this.tabsOperationsValue = this.tabsOperationsList[0].name;
    },
    /* teams 經營團隊tabs */
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
    /* shareHolders 股東結構說明tabs */
    addTabShareHolders() {
      this.tabsShareHoldersList.push({
        title: this.shareHoldersName,
        name: String(this.defaultShareHoldersName),
        shareHoldersItems: {
          companyId: this.chooseInfo.id,
          name: this.shareHoldersName,
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
    /* other 其他項目tabs */
    addTabOther() {
      this.tabsOtherList.push({
        title: this.otherName,
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
    /*  */

    /* 上傳圖片 */
    setImgs(imgInfo) {
      this.getImgs = imgInfo;
    },
    beforeAvatarUpload(file) {
      const isLt4M = file.size / 1024 / 1024 < 2;
      if (!isLt4M) {
        this.$message.error("上傳圖片不能超過 2MB!");
        return false;
      }
      this.imgInfo = URL.createObjectURL(file);
      this.cropperDialog = true;
    },
    /* 上傳圖片 */
    // customUpload(file) {
    //   this.list_coaching.photo = "";
    //   let formData = new FormData();
    //   formData.append("files", file.file, file.file.name);
    //   upload.upload(formData).then((res) => {
    //     this.imgInfo = {
    //       name: res.result[0].fileName,
    //       url: process.env.VUE_APP_BASE_IMG_URL + res.result[0].filePath,
    //     };
    //   });
    // },
    // beforeAvatarUpload(file) {
    //   const isLt2M = file.size / 1024 / 1024 < 2;
    //   if (!isLt2M) {
    //     this.$message.error("上傳圖片不能超過 2MB!");
    //   }
    //   return isLt2M;
    // },

    /* 讀取 */
    getFormList(item) {
      // this.imgInfo = "";
      this.tabsOperationsList = [];
      this.tabsTeamsList = [];
      this.tabsShareHoldersList = [];
      this.tabsOtherList = [];

      /* 輔導顧問需取會員資料 */
      if (item.value == "coaching") {
        users.get({ id: item.id }).then((res) => {
          this.userInfo = res.result;
        });
      }
      /*  */

      if (item.value == "shareHolders") {
        const listQuery = {
          page: 1,
          limit: 99,
          CompanyId: item.id,
        };
        company.getCompanyShareHolders(listQuery).then((res) => {
          res.data.forEach((it, idx) => {
            this.tabsShareHoldersList.push({
              title: it.name,
              name: String(idx + 1),
              shareHoldersItems: it,
            });
          });
          this.defaultShareHoldersName = res.data.length + 1;
        });
      } else {
        company["get" + item.apiName]({ id: item.id }).then((res) => {
          if (res.result !== null) {
            /* 將arr值寫進各個tabs */
            if (item.value == "operations") {
              res.result.companyStockItmes.forEach((it, idx) => {
                console.log(it);
                this.tabsOperationsList.push({
                  title: it.year,
                  name: String(idx + 1),
                  operationsYearList: it,
                });
              });
              this.defaultOperationsName =
                res.result.companyStockItmes.length + 1;
            } else if (item.value == "teams") {
              res.result.companyTeamMemberItems.forEach((it, idx) => {
                this.tabsTeamsList.push({
                  title: it.memberName,
                  name: String(idx + 1),
                  companyTeamMemberItems: it,
                });
              });
              this.defaultTeamsName =
                res.result.companyTeamMemberItems.length + 1;
            } else if (item.value == "other") {
              res.result.companyGovSubsidyPlanItems.forEach((it, idx) => {
                this.tabsOtherList.push({
                  title: it.name,
                  name: String(idx + 1),
                  companyGovSubsidyPlanItems: it,
                });
              });
              this.defaultOtherName =
                res.result.companyGovSubsidyPlanItems.length + 1;
            } else if (item.value == "coaching") {
              this.getImgs.filePath = res.result.photo;
            }
            /*  */

            this["list_" + `${item.value}`] = Object.assign({}, res.result);
          }
        });
      }
    },

    /* 送出 */
    handleAddOrUpdate() {
      if (this.chooseInfo.value == "operations") {
        this.list_operations.companyStockItmes = this.tabsOperationsList.map(
          (i) => i.operationsYearList
        );
      } else if (this.chooseInfo.value == "teams") {
        this.list_teams.companyTeamMemberItems = this.tabsTeamsList.map(
          (i) => i.companyTeamMemberItems
        );
      } else if (this.chooseInfo.value == "shareHolders") {
        this.list_shareHolders = this.tabsShareHoldersList.map(
          (i) => i.shareHoldersItems
        );
      } else if (this.chooseInfo.value == "other") {
        this.list_other.companyGovSubsidyPlanItems = this.tabsOtherList.map(
          (i) => i.companyGovSubsidyPlanItems
        );
      } else if (this.chooseInfo.value == "coaching") {
        this.list_coaching.photo = this.getImgs.filePath;
      }

      /* 嵌入id */
      this["list_" + `${this.chooseInfo.value}`].id = this.chooseInfo.id;

      company["addOrUpdate" + this.chooseInfo.apiName](
        this["list_" + this.chooseInfo.value]
      ).then((res) => {
        if (res.code == 200) {
          this.$message({
            showClose: true,
            message: res.message,
            type: "success",
          });
          this.$emit("closeDialogForm");
        } else {
          this.$message({
            showClose: true,
            message: res.message,
            type: "error",
          });
        }
      });
    },
  },
  mounted() {
    this.getBusiness();
    this.getIndustryType();
    this.getMainExpertise();
    this.getIncomeModelItemsList();
  },
};
</script>

<style lang="scss">
.avatar {
  width: 148px;
  height: 148px;
  margin-top: 10px;

  &-uploader {
    width: 150px;
    height: 150px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #fff;
    border: 1px dashed #409eff;
    opacity: 1;
    filter: alpha(opacity=100);
    transition: 0.3s;

    &-icon::before {
      width: 150px;
      height: 150px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 28px;
      color: #d9d9d9;
    }

    &:hover {
      opacity: 0.5;
      filter: alpha(opacity=50);
      border-color: red;
    }
  }
}

.mt-16 {
  margin-top: 16px;
}
</style>