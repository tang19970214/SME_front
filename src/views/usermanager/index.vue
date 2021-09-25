<template>
  <div class="flex-column">
    <sticky :className="'sub-navbar'">
      <div class="filter-container">
        <!-- <el-input @keyup.enter.native="handleFilter" prefix-icon="el-icon-search" size="small" style="width: 200px; margin-bottom: 0;" class="filter-item" :placeholder="'關鍵字'" v-model="listQuery.key">
        </el-input> -->

        <permission-btn moduleName="usermanager" size="mini" v-on:btn-event="onBtnClicked"></permission-btn>

        <el-checkbox size="mini" style="margin-left: 15px" @change="tableKey = tableKey + 1" v-model="showDescription">Id/描述</el-checkbox>
      </div>
    </sticky>

    <div class="app-container flex-item">
      <el-row :gutter="4" class="fh">
        <el-col :span="6" class="fh ls-border">
          <el-card shadow="never" class="body-small fh" style="overflow: auto">
            <div slot="header" class="clearfix" v-if="isMaxRole">
              <el-button type="text" style="padding: 0 11px" @click="getAllUsers">全部用戶>></el-button>
            </div>

            <el-tree :data="orgsTree" :expand-on-click-node="false" default-expand-all :props="defaultProps" @node-click="handleNodeClick"></el-tree>
          </el-card>
        </el-col>

        <el-col :span="18" class="fh">
          <div class="bg-white fh">
            <el-table ref="mainTable" :key="tableKey" :data="list" v-loading="listLoading" border fit highlight-current-row style="width: 100%" height="calc(100% - 52px)" @row-click="rowClick" @selection-change="handleSelectionChange">
              <el-table-column align="center" type="selection" width="55">
              </el-table-column>

              <el-table-column :label="'Id'" v-if="showDescription" width="180px">
                <template slot-scope="scope">
                  <span>{{ scope.row.id }}</span>
                </template>
              </el-table-column>

              <el-table-column width="150px" :label="'帳號'">
                <template slot-scope="scope">
                  <span class="link-type" @click="handleUpdate(scope.row)">{{
                    scope.row.account
                  }}</span>
                </template>
              </el-table-column>

              <el-table-column width="150px" :label="'姓名'">
                <template slot-scope="scope">
                  <span>{{ scope.row.name }}</span>
                </template>
              </el-table-column>

              <el-table-column width="120px" :label="'職稱'">
                <template slot-scope="scope">
                  <span>{{ scope.row.userTitle }}</span>
                </template>
              </el-table-column>

              <el-table-column width="200px" :label="'主要專長'">
                <template slot-scope="scope">
                  <span>{{ scope.row.mainSpecialty }}</span>
                </template>
              </el-table-column>

              <el-table-column width="150px" :label="'角色'">
                <template slot-scope="scope">
                  <span>{{ scope.row.roles }}</span>
                </template>
              </el-table-column>

              <el-table-column width="150px" :label="'單位'">
                <template slot-scope="scope">
                  <span>{{ scope.row.organizations }}</span>
                </template>
              </el-table-column>

              <el-table-column width="150px" :label="'綁定帳號'">
                <template slot-scope="scope">
                  <span>{{scope.row.googleMail}}</span>
                </template>
              </el-table-column>

              <el-table-column class-name="status-col" :label="'狀態'" width="80">
                <template slot-scope="scope">
                  <span :class="scope.row.status | statusFilter">{{
                    statusOptions.find((u) => u.key == scope.row.status)
                      .display_name
                  }}</span>
                </template>
              </el-table-column>

              <el-table-column :label="'操作'" class-name="small-padding" min-width="850">
                <template slot-scope="scope">
                  <el-button type="primary" size="mini" @click="handleUpdate(scope.row)">編輯</el-button>
                  <el-button size="mini" type="danger" v-if="hasButton('btnStop') && scope.row.status == 1" @click="handleModifyStatus(scope.row, 0)">停用</el-button>
                  <el-button type="info" size="mini" v-if="
                      hasButton('btnUserSup') &&
                      setCoachingAuth(scope.row.roles)
                    " @click="openUserDialog('coaching', scope.row.id)">輔導顧問</el-button>
                  <el-button type="info" size="mini" v-if="
                      hasButton('btnBasic') && setBasicAuth(scope.row.roles)
                    " @click="openUserDialog('basic', scope.row.id)">基本資料</el-button>
                  <el-button type="info" size="mini" v-if="
                      hasButton('btnCompany') && setBasicAuth(scope.row.roles)
                    " @click="openUserDialog('developing', scope.row.id)">公司發展階段</el-button>
                  <el-button type="info" size="mini" v-if="
                      hasButton('btnCompanyOperation') &&
                      setBasicAuth(scope.row.roles)
                    " @click="openUserDialog('operations', scope.row.id)">營運狀況</el-button>
                  <el-button type="info" size="mini" v-if="
                      hasButton('btnTeams') && setBasicAuth(scope.row.roles)
                    " @click="openUserDialog('teams', scope.row.id)">經營團隊說明</el-button>
                  <el-button type="info" size="mini" v-if="
                      hasButton('btnShareHolder') &&
                      setBasicAuth(scope.row.roles)
                    " @click="openUserDialog('shareHolders', scope.row.id)">股東結構說明</el-button>
                  <el-button type="info" size="mini" v-if="
                      hasButton('btnOther') && setBasicAuth(scope.row.roles)
                    " @click="openUserDialog('other', scope.row.id)">其他項目</el-button>
                </template>
              </el-table-column>
            </el-table>
            <pagination v-show="total > 0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="handleCurrentChange" />
          </div>
        </el-col>
      </el-row>

      <el-dialog class="dialog-mini" width="500px" v-el-drag-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" :close-on-click-modal="false" :close-on-press-escape="false">
        <el-form :rules="rules" ref="dataForm" :model="temp" label-position="right" label-width="100px">
          <el-form-item size="small" :label="'Id'" prop="id" v-show="dialogStatus == 'update'">
            <el-input v-model="temp.id" :disabled="true" size="small" placeholder="系統自動處理"></el-input>
          </el-form-item>
          <el-form-item size="small" :label="'帳號'" prop="account">
            <el-input v-model="temp.account"></el-input>
          </el-form-item>
          <el-form-item size="small" :label="'姓名'" prop="name">
            <el-input v-model="temp.name"></el-input>
          </el-form-item>
          <el-form-item size="small" :label="'密碼'" prop="password">
            <el-input v-model="temp.password" :placeholder="
                dialogStatus == 'update'
                  ? '如果為空則不修改密碼'
                  : '如果為空則默認與帳號相同'
              "></el-input>
          </el-form-item>
          <el-form-item size="small" :label="'角色'">
            <treeselect :options="roleOptions" :default-expand-level="3" :multiple="true" :flat="true" :open-on-click="true" :open-on-focus="true" :clear-on-select="true" v-model="selectRoleIds"></treeselect>
          </el-form-item>
          <el-form-item size="small" :label="'狀態'">
            <el-select class="filter-item w-full" v-model="temp.status" placeholder="Please select">
              <el-option v-for="item in statusOptions" :key="item.key" :label="item.display_name" :value="item.key">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item size="small" :label="'所屬機構'">
            <treeselect v-if="dialogFormVisible" :options="orgsTree" :default-expand-level="3" :multiple="true" :flat="true" :open-on-click="true" :open-on-focus="true" :clear-on-select="true" v-model="selectOrgs"></treeselect>
          </el-form-item>
          <el-form-item size="small" :label="'email'" v-if="findManager(temp.roleIds)">
            <el-input v-model="temp.email"></el-input>
          </el-form-item>
        </el-form>

        <div slot="footer">
          <el-button size="mini" @click="dialogFormVisible = false">取消</el-button>
          <el-button size="mini" v-if="dialogStatus == 'create'" type="primary" @click="createData">確認</el-button>
          <el-button size="mini" v-else type="primary" @click="updateData">確認</el-button>
        </div>
      </el-dialog>

      <el-dialog width="516px" class="dialog-mini body-small" v-el-drag-dialog :title="'分配角色'" :visible.sync="dialogRoleVisible" :close-on-click-modal="false" :close-on-press-escape="false">
        <el-form ref="rolesForm" size="small" v-if="dialogRoleVisible" label-position="left">
          <el-form-item>
            <select-roles :roles="selectRoles" :isUnLoadGroupList="true" :userNames="selectRoleNames" v-on:roles-change="rolesChange"></select-roles>
          </el-form-item>
        </el-form>
        <div slot="footer">
          <el-button size="mini" @click="dialogRoleVisible = false">取消</el-button>
          <el-button size="mini" type="primary" @click="acceRole">確認</el-button>
        </div>
      </el-dialog>

      <!-- 匯出 -->
      <el-dialog class="dialog-mini" width="500px" v-el-drag-dialog :title="'匯出'" :visible.sync="dialogExport" :close-on-click-modal="false" :close-on-press-escape="false">
        <el-tabs v-model="expoerActiveName" @tab-click="handleClick">
          <!-- 帳號資料匯出 -->
          <el-tab-pane label="帳號資料匯出" name="帳號資料匯出">
            <el-form :model="tempExport" label-width="80px">
              <el-form-item label="角色">
                <el-select class="w-full" v-model="tempExport.roleId" placeholder="請選擇角色">
                  <el-option v-for="item in roleOptions" :key="item.id" :label="item.name" :value="item.id"></el-option>
                </el-select>
              </el-form-item>

              <el-form-item label="關鍵字">
                <el-input placeholder="關鍵字(姓名)" v-model="tempExport.key"></el-input>
              </el-form-item>
            </el-form>
          </el-tab-pane>

          <!-- 顧問資料匯出 -->
          <el-tab-pane label="顧問資料匯出" name="顧問資料匯出">
            <el-form :model="tempExport" label-width="80px">
              <el-form-item label="關鍵字">
                <el-input placeholder="關鍵字(姓名)" v-model="tempExport.key"></el-input>
              </el-form-item>

              <el-form-item label="縣市區域">
                <el-select class="w-full" v-model="tempExport.County" placeholder="請選擇縣市區域">
                  <el-option v-for="(item, idx) in countyData" :key="idx" :label="item.label" :value="item.value">
                  </el-option>
                </el-select>
                <el-select class="w-full" v-model="tempExport.District" placeholder="請選擇區域" no-data-text="請先選擇縣市" :disabled="dialogStatus == 'view'">
                  <el-option v-for="(items, $index) in ChooseCounty(districtData)" :key="'DT_' + $index" :label="items.label" :value="items.value">
                  </el-option>
                </el-select>
              </el-form-item>

              <el-form-item label="主要專長">
                <el-select class="w-full" v-model="tempExport.MainSpecialtyItems" placeholder="請選擇主要專長" multiple collapse-tags>
                  <el-option v-for="item in mainExpertiseList" :key="item.id" :label="item.name" :value="item.dtValue"></el-option>
                </el-select>
              </el-form-item>

              <el-form-item label="產業類別">
                <el-select class="w-full" v-model="tempExport.IndustryTypeItem" placeholder="請選擇產業類別" multiple collapse-tags>
                  <el-option v-for="item in industryList" :key="item.id" :label="item.name" :value="item.dtValue">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-form>
          </el-tab-pane>

          <!-- 一般會員資料匯出 -->
          <el-tab-pane label="一般會員資料匯出" name="一般會員資料匯出">
            <el-form :model="tempExport" label-width="90px">
              <el-form-item label="關鍵字">
                <el-input placeholder="關鍵字(姓名)" v-model="tempExport.key"></el-input>
              </el-form-item>

              <el-form-item label="是否成立公司">
                <el-radio-group v-model="tempExport.HasCompany">
                  <el-radio :label="true">是</el-radio>
                  <el-radio :label="false">否</el-radio>
                </el-radio-group>
              </el-form-item>

              <el-form-item label="所在縣市區域">
                <el-select class="w-full" v-model="tempExport.County" placeholder="請選擇縣市區域">
                  <el-option v-for="(item, idx) in countyData" :key="idx" :label="item.label" :value="item.value">
                  </el-option>
                </el-select>
                <el-select class="w-full" v-model="tempExport.District" placeholder="請選擇區域" no-data-text="請先選擇縣市" :disabled="dialogStatus == 'view'">
                  <el-option v-for="(items, $index) in ChooseCounty(districtData)" :key="'DT_' + $index" :label="items.label" :value="items.value">
                  </el-option>
                </el-select>
              </el-form-item>

              <el-form-item label="創業階段">
                <el-select class="w-full" v-model="tempExport.IndustryTypeItem" placeholder="請選擇創業階段" multiple collapse-tags>
                  <el-option v-for="item in businessList" :key="item.id" :label="item.name" :value="item.dtValue"></el-option>
                </el-select>
              </el-form-item>

              <el-form-item label="產業類別">
                <el-select class="w-full" v-model="tempExport.BusinessStageItems" placeholder="請選擇產業類別" multiple collapse-tags>
                  <el-option v-for="item in industryList" :key="item.id" :label="item.name" :value="item.dtValue">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-form>
          </el-tab-pane>
        </el-tabs>

        <div slot="footer">
          <el-button size="mini" type="danger" @click="dialogExport = false" plain>取消</el-button>
          <el-button size="mini" type="primary" @click="exportData()" plain>匯出</el-button>
        </div>
      </el-dialog>

      <!-- 篩選 -->
      <el-dialog class="dialog-mini" width="500px" v-el-drag-dialog :title="'篩選'" :visible.sync="dialogFilter" :close-on-click-modal="false" :close-on-press-escape="false">
        <el-form :model="listQuery" label-width="80px">
          <el-form-item label="關鍵字">
            <el-input placeholder="關鍵字(姓名)" v-model="listQuery.key"></el-input>
          </el-form-item>

          <el-form-item label="角色">
            <el-select class="w-full" v-model="listQuery.roleId" placeholder="請選擇角色" clearable>
              <el-option v-for="item in roleOptions" :key="item.id" :label="item.name" :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="縣市區域">
            <el-select class="w-full" v-model="listQuery.County" placeholder="請選擇縣市區域" clearable>
              <el-option v-for="(item, idx) in countyData" :key="idx" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
            <el-select class="w-full" v-model="listQuery.District" placeholder="請選擇區域" no-data-text="請先選擇縣市" :disabled="dialogStatus == 'view'" clearable>
              <el-option v-for="(items, $index) in ChooseCounty(districtData)" :key="'DT_' + $index" :label="items.label" :value="items.value">
              </el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="主要專長">
            <el-select class="w-full" v-model="listQuery.MainSpecialtyItems" placeholder="請選擇主要專長" multiple clearable>
              <el-option v-for="item in mainExpertiseList" :key="item.id" :label="item.name" :value="item.dtValue"></el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="產業類別">
            <el-select class="w-full" v-model="listQuery.IndustryTypeItems" placeholder="請選擇產業類別" multiple clearable>
              <el-option v-for="item in industryList" :key="item.id" :label="item.name" :value="item.dtValue">
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>

        <div slot="footer">
          <el-button size="mini" type="danger" @click="dialogFilter = false" plain>取消</el-button>
          <el-button size="mini" type="primary" @click="filterList()" plain>確認</el-button>
        </div>
      </el-dialog>

      <el-form-dialog :listDialogForm="listDialogForm" :chooseInfo="chooseInfo" @closeDialogForm="closeDialogForm"></el-form-dialog>
    </div>
  </div>
</template>

<script>
import pbMixins from "@/mixins/permissionBtn.js";

import axios from "axios";

import { listToTreeSelect } from "@/utils";

import { Counties, cityAndCountiesLite } from "@/assets/taiwan";

import * as categorys from "@/api/categorys";
import * as accsssObjs from "@/api/accessObjs";
import * as users from "@/api/users";
import * as apiRoles from "@/api/roles";
import * as login from "@/api/login";

import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
import waves from "@/directive/waves"; // 水波紋指令
import Sticky from "@/components/Sticky";
import permissionBtn from "@/components/PermissionBtn";
import SelectRoles from "@/components/SelectRoles";
import Pagination from "@/components/Pagination";
import elDragDialog from "@/directive/el-dragDialog";
import elFormDialog from "./elFormDialog";

export default {
  name: "user",
  mixins: [pbMixins],
  components: {
    Sticky,
    permissionBtn,
    Treeselect,
    SelectRoles,
    Pagination,
    elFormDialog,
  },
  directives: {
    waves,
    elDragDialog,
  },
  data() {
    return {
      countyData: Counties,
      districtData: cityAndCountiesLite,

      isMaxRole: false,

      defaultProps: {
        // tree配置項
        children: "children",
        label: "label",
      },
      multipleSelection: [], // 列表checkbox選中的值
      tableKey: 0,

      list: null,
      mainExpertiseList: [],
      industryList: [],
      businessList: [],

      total: 0,
      listLoading: true,
      listQuery: {
        orgId: "",
        roleId: "",
        CreateStartDate: "",
        CreateEndDate: "",
        HasCompany: "",
        County: "",
        District: "",
        BusinessStageItems: [],
        IndustryTypeItems: [],
        page: 1,
        limit: 20,
        orderby: "",
        key: undefined,
      },
      apps: [],
      statusOptions: [
        {
          key: 0,
          display_name: "停用",
        },
        {
          key: 1,
          display_name: "正常",
        },
      ],
      roleOptions: [],
      showDescription: false,
      orgs: [], // 用戶可訪問到的組織列表
      orgsTree: [], // 用戶可訪問到的所有機構組成的樹
      selectRoles: [], // 用戶分配的角色
      selectRoleNames: "",
      temp: {
        id: undefined,
        account: "",
        name: "",
        password: "",
        roleIds: "",
        status: 1,
        organizationIds: "",
        email: "",
      },
      dialogFormVisible: false,
      dialogStatus: "",
      textMap: {
        update: "編輯",
        create: "添加",
      },
      dialogRoleVisible: false, // 分配角色對話框
      rules: {
        account: [
          {
            required: true,
            message: "帳號不能為空",
            trigger: "blur",
          },
        ],
        name: [
          {
            required: true,
            message: "姓名不能為空",
            trigger: "blur",
          },
        ],
      },
      downloadLoading: false,

      /* 列表各個操作 */
      listDialogForm: false,
      chooseInfo: {},

      /* 匯出 */
      dialogExport: false,
      expoerActiveName: "帳號資料匯出",
      tempExport: {
        Type: "",
        roleId: "",
        key: "",
        CreateStartDate: "",
        CreateEndDate: "",
        County: "",
        District: "",
        HasCompany: "",
        MainSpecialtyItems: [],
        IndustryTypeItem: [],
        BusinessStageItems: [],
      },

      /* 篩選 */
      dialogFilter: false,
    };
  },
  computed: {
    selectOrgs: {
      get: function () {
        if (this.dialogStatus === "update") {
          return (
            this.temp.organizationIds && this.temp.organizationIds.split(",")
          );
        } else {
          return [];
        }
      },
      set: function (v) {
        var _this = this;
        _this.temp.organizationIds = (v.length > 0 && v.join(",")) || "";
      },
    },
    selectRoleIds: {
      get: function () {
        if (this.dialogStatus === "update") {
          return (this.temp.roleIds && this.temp.roleIds.split(",")) || [];
        } else {
          return [];
        }
      },
      set: function (v) {
        var _this = this;
        _this.temp.roleIds = (v.length > 0 && v.join(",")) || "";
      },
    },
    setBasicAuth() {
      return (roles) => {
        const getRoles = roles.split(",");
        return getRoles.filter((i) => i == "一般會員").length > 0
          ? true
          : false;
      };
    },
    setCoachingAuth() {
      return (roles) => {
        const getRoles = roles.split(",");
        return getRoles.filter((i) => i == "輔導顧問").length > 0
          ? true
          : false;
      };
    },
    ChooseCounty() {
      return (data) => {
        return data[this.listQuery.County];
      };
    },
    findManager() {
      return (roleIds) => {
        const getRoleIds = roleIds?.split(",");
        return getRoleIds?.includes("172800417542214") ? true : false;
      };
    },
  },
  filters: {
    statusFilter(status) {
      let res = "color-success";
      switch (status) {
        case 0:
          res = "color-danger";
          break;
        default:
          break;
      }
      return res;
    },
  },
  created() {
    this.getList();
    this.getMainExpertise();
    this.getIndustryType();
    this.getBusiness();
  },
  mounted() {
    var _this = this; // 記錄vuecomponent
    // 取得角色權限
    login.getRoles().then((res) => {
      // console.log("orgstree", res.result);
      const rolesList = res.result;
      const getMaxRole = rolesList?.filter(
        (item) => item.id == "172800417542214"
      );
      if (getMaxRole.length > 0) {
        this.isMaxRole = true;
      }
    });

    _this.getRoleList();
    login.getOrgAndSubOrgs().then((response) => {
      _this.orgs = response.result.map(function (item) {
        return {
          id: item.id,
          label: item.name,
          parentId: item.parentId || null,
        };
      });
      var orgstmp = JSON.parse(JSON.stringify(_this.orgs));
      _this.orgsTree = listToTreeSelect(orgstmp);
    });
  },
  methods: {
    rowClick(row) {
      this.$refs.mainTable.clearSelection();
      this.$refs.mainTable.toggleRowSelection(row);
    },
    handleNodeClick(data) {
      this.listQuery.orgId = data.id;
      this.getList();
    },
    getAllUsers() {
      this.listQuery.orgId = "";
      this.getList();
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },

    onBtnClicked: function (domId) {
      console.log("you click:" + domId);
      switch (domId) {
        case "btnAdd":
          this.handleCreate();
          break;
        case "btnEdit":
          if (this.multipleSelection.length !== 1) {
            this.$message({
              message: "只能選中一個進行編輯",
              type: "error",
            });
            return;
          }
          this.handleUpdate(this.multipleSelection[0]);
          break;
        case "btnDel":
          if (this.multipleSelection.length < 1) {
            this.$message({
              message: "至少刪除一個",
              type: "error",
            });
            return;
          }
          this.handleDelete(this.multipleSelection);
          break;
        case "btnAccessRole":
          if (this.multipleSelection.length !== 1) {
            this.$message({
              message: "只能選中一個進行編輯",
              type: "error",
            });
            return;
          }
          this.handleAccessRole(this.multipleSelection[0]);
          break;
        case "btnRefresh":
          this.getList();
          break;
        case "btnExportUserInfo":
          this.resetTempExport();
          this.dialogExport = true;
          break;
        case "btnFilter":
          // eslint-disable-next-line
          if (
            typeof this.listQuery.MainSpecialtyItems == "string" &&
            !!this.listQuery.MainSpecialtyItems
          ) {
            this.listQuery.MainSpecialtyItems =
              this.listQuery.MainSpecialtyItems.split(",");
          }
          // this.listQuery.MainSpecialtyItems = !!this.listQuery
          //   .MainSpecialtyItems
          //   ? this.listQuery.MainSpecialtyItems.split(",")
          //   : [];

          // eslint-disable-next-line
          if (
            typeof this.listQuery.IndustryTypeItems == "string" &&
            !!this.listQuery.IndustryTypeItems
          ) {
            this.listQuery.IndustryTypeItems =
              this.listQuery.IndustryTypeItems.split(",");
          }
          // this.listQuery.IndustryTypeItems = !!this.listQuery.IndustryTypeItems
          //   ? this.listQuery.IndustryTypeItems.split(",")
          //   : [];

          this.dialogFilter = true;
          break;
        default:
          break;
      }
    },

    getList() {
      this.listLoading = true;
      users.getList(this.listQuery).then((response) => {
        this.list = response.data;
        this.total = response.count;
        this.listLoading = false;
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

    handleFilter() {
      this.listQuery.page = 1;
      this.getList();
    },
    handleSizeChange(val) {
      this.listQuery.limit = val;
      this.getList();
    },
    handleCurrentChange(val) {
      this.listQuery.page = val.page;
      this.listQuery.limit = val.limit;
      this.getList();
    },
    handleModifyStatus(row, status) {
      // 模擬修改狀態
      row.status = status;

      users.update(row).then((res) => {
        if (res.code === 200) {
          this.$message({
            message: "操作成功",
            type: "success",
          });
        } else {
          this.$message({
            message: res.message,
            type: "error",
          });
        }
      });
    },

    resetTemp() {
      this.temp = {
        id: undefined,
        account: "",
        password: "",
        roleIds: "",
        name: "",
        status: 1,
        organizationIds: "",
        email: "",
      };
    },
    resetTempExport() {
      this.tempExport = {
        Type: "",
        roleId: "",
        key: "",
        CreateStartDate: "",
        CreateEndDate: "",
        County: "",
        District: "",
        HasCompany: "",
        MainSpecialtyItems: [],
        IndustryTypeItem: [],
        BusinessStageItems: [],
      };
    },

    handleCreate() {
      // 彈出添加框
      this.resetTemp();
      this.dialogStatus = "create";
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs["dataForm"].clearValidate();
      });
    },
    createData() {
      // 保存提交
      this.$refs["dataForm"].validate((valid) => {
        if (valid) {
          if (this.temp.password == "") {
            this.temp.password = this.temp.account;
          }
          users.add(this.temp).then((response) => {
            this.temp.id = response.result;
            this.list.unshift(this.temp);
            this.dialogFormVisible = false;
            this.$notify({
              title: "成功",
              message: "創建成功",
              type: "success",
              duration: 2000,
            });

            // 若角色有一般會員，則開啟'基本資料'
            const getRoleIds = this.temp.roleIds?.split(",");
            if (getRoleIds.includes("172800227819589")) {
              // 打開dialog
              this.openUserDialog("basic", this.temp.id);
            }
          });
        }
      });
    },
    handleUpdate(row) {
      users.get({ id: row.id }).then((res) => {
        this.temp = Object.assign({}, res.result); // copy obj
        // 彈出編輯框
        this.dialogStatus = "update";
        this.dialogFormVisible = true;
        this.$nextTick(() => {
          this.$refs["dataForm"].clearValidate();
        });
      });
    },
    updateData() {
      // 更新提交
      this.$refs["dataForm"].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.temp);
          if (tempData.password == "") {
            delete tempData.password;
          }
          users.update(tempData).then(() => {
            for (const v of this.list) {
              if (v.id === this.temp.id) {
                const index = this.list.indexOf(v);
                this.list.splice(index, 1, this.temp);
                break;
              }
            }
            this.dialogFormVisible = false;
            this.getList();
            this.$notify({
              title: "成功",
              message: "更新成功",
              type: "success",
              duration: 2000,
            });
          });
        }
      });
    },
    handleDelete(rows) {
      // 多行刪除
      users.del(rows.map((u) => u.id)).then(() => {
        this.$notify({
          title: "成功",
          message: "刪除成功",
          type: "success",
          duration: 2000,
        });
        rows.forEach((row) => {
          const index = this.list.indexOf(row);
          this.list.splice(index, 1);
        });
      });
    },
    handleAccessRole(row) {
      // 分配角色
      const _this = this;
      this.temp = Object.assign({}, row); // copy obj
      apiRoles.loadForUser(this.temp.id).then((response) => {
        _this.dialogRoleStatus = "update";
        _this.dialogRoleVisible = true;
        _this.selectRoles = response.result;
        _this.getRoleList();
        _this.$nextTick(() => {
          _this.$refs["rolesForm"].clearValidate();
        });
      });
    },

    /* 匯出 */
    handleClick() {
      this.resetTempExport();
    },
    exportData() {
      this.$confirm("確定要匯出" + this.tempExport.Type + "嗎？", "提示", {
        confirmButtonText: "確定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        this.tempExport.Type = this.expoerActiveName;

        let config = {
          headers: {
            "Content-Type": "application/json",
            "X-token": this.$store.getters.token,
          },
          responseType: "blob", // 回應類型為 blob
        };

        const data = this.tempExport;

        const url =
          "http://sme.yummydesign.com.tw/sys/api/Users/ExportUserByAdmin?Type=" +
          data.Type +
          "&roleId=" +
          data.roleId +
          "&key=" +
          data.key +
          "&CreateStartDate=" +
          data.CreateStartDate +
          "&CreateEndDate=" +
          data.CreateEndDate +
          "&County=" +
          data.County +
          "&District=" +
          data.District +
          "&MainSpecialtyItems=" +
          data.MainSpecialtyItems +
          "&IndustryTypeItem=" +
          data.IndustryTypeItem +
          "&HasCompany=" +
          data.HasCompany +
          "&BusinessStageItems" +
          data.BusinessStageItems;

        axios.get(url, config).then((res) => {
          let blob = new Blob([res.data], {
            type: "application/" + res.headers["content-type"],
          });
          let downloadElement = document.createElement("a");
          let href = window.URL.createObjectURL(blob); // 創建下載的鏈接
          downloadElement.href = href;
          downloadElement.download = `${this.tempExport.Type}.xlsx`; // 下載後文件名
          document.body.appendChild(downloadElement);
          downloadElement.click(); // 點擊下載
          document.body.removeChild(downloadElement); // 下載完成移除元素
          window.URL.revokeObjectURL(href); // 釋放掉 blob 對象
        });

        this.dialogExport = false;
      });
    },

    // 獲取角色
    getRoleList() {
      apiRoles.loadRoleByRule({}).then((response) => {
        this.roleOptions = response.result.map((it, key) => {
          it.label = it.name;
          it.$treeNodeId = key + 1;
          return it;
        });
        this.selectRoleNames = [...response.result]
          .filter((x) => this.selectRoles.indexOf(x.id) > -1)
          .map((item) => item.name || item.account)
          .join(",");
      });
    },
    rolesChange(type, val) {
      if (type === "Texts") {
        this.selectRoleNames = val;
        return;
      }
      this.selectRoles = val;
    },
    acceRole() {
      accsssObjs
        .assign({
          type: "UserRole",
          firstId: this.temp.id,
          secIds: this.selectRoles,
        })
        .then(() => {
          this.dialogRoleVisible = false;
          this.$notify({
            title: "成功",
            message: "更新成功",
            type: "success",
            duration: 2000,
          });
        });
    },

    /* 列表各個操作 */
    openUserDialog(value, id) {
      let chooseVal = "";
      switch (value) {
        case "coaching":
          chooseVal = "UserSupExts";
          break;
        case "basic":
          chooseVal = "UserExts";
          break;
        case "developing":
          chooseVal = "Companys";
          break;
        case "operations":
          chooseVal = "CompanyOperations";
          break;
        case "teams":
          chooseVal = "CompanyTeams";
          break;
        case "shareHolders":
          chooseVal = "CompanyShareHolders";
          break;
        case "other":
          chooseVal = "CompanyOtherss";
          break;
      }
      this.chooseInfo = {
        id: id,
        value: value,
        apiName: chooseVal,
      };

      this.listDialogForm = true;
    },
    closeDialogForm() {
      this.listDialogForm = false;
      this.chooseInfo = {};
    },

    /* 篩選 */
    filterList() {
      this.listQuery.MainSpecialtyItems =
        this.listQuery.MainSpecialtyItems.length > 0
          ? this.listQuery.MainSpecialtyItems.join(",")
          : "";
      this.listQuery.IndustryTypeItems =
        this.listQuery.IndustryTypeItems.length > 0
          ? this.listQuery.IndustryTypeItems.join(",")
          : "";
      this.getList();
      this.dialogFilter = false;
    },
  },
};
</script>

<style>
.clearfix:before,
.clearfix:after {
  display: table;
  content: "";
}

.clearfix:after {
  clear: both;
}

.el-card__header {
  padding: 12px 20px;
}

.body-small.dialog-mini .el-dialog__body .el-form {
  padding-right: 0px;
  padding-top: 0px;
}
</style>
