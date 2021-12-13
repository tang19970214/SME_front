<template>
  <div class="flex-column">
    <sticky :className="'sub-navbar'">
      <div class="filter-container">
        <el-input @keyup.enter.native="handleFilter" prefix-icon="el-icon-search" size="small" style="width: 200px; margin-bottom: 0;" class="filter-item" :placeholder="'關鍵字'" v-model="listQuery.key">
        </el-input>

        <permission-btn moduleName='orgmanager' size="mini" v-on:btn-event="onBtnClicked"></permission-btn>
        <el-checkbox size="mini" style='margin-left:15px;' @change='tableKey=tableKey+1' v-model="showDescription">Id/描述</el-checkbox>
      </div>
    </sticky>

    <div class="app-container flex-item">
      <el-row style="height: 100%;">
        <el-col :span="4" style="height: 100%;border: 1px solid #EBEEF5;">
          <el-card shadow="never" class="body-small" style="height: 100%;overflow:auto;">
            <div slot="header" class="clearfix">
              <el-button type="text" style="padding: 0 11px" @click="getAllOrgs">所有機構>></el-button>
            </div>

            <el-tree :data="orgsTree" :expand-on-click-node="false" default-expand-all :props="defaultProps" @node-click="handleNodeClick"></el-tree>
          </el-card>
        </el-col>

        <el-col :span="20" style="height: 100%;">
          <div class="bg-white" style="height: 100%;">
            <el-table ref="mainTable" :key='tableKey' :data="list" v-loading="listLoading" border fit highlight-current-row style="width: 100%;" height="calc(100% - 52px)" @row-click="rowClick" @selection-change="handleSelectionChange">
              <el-table-column type="selection" align="center" width="55">
              </el-table-column>

              <el-table-column :label="'Id'" v-if="showDescription" min-width="120px">
                <template slot-scope="scope">
                  <span>{{scope.row.id}}</span>
                </template>
              </el-table-column>

              <el-table-column width="80px" :label="'層級ID'">
                <template slot-scope="scope">
                  <span class="link-type" @click="handleUpdate(scope.row)">{{scope.row.cascadeId}}</span>
                </template>
              </el-table-column>

              <el-table-column min-width="80px" :label="'名稱'">
                <template slot-scope="scope">
                  <span>{{scope.row.name}}</span>
                </template>
              </el-table-column>

              <el-table-column min-width="150px" :label="'類別'">
                <template slot-scope="scope">
                  <span>{{scope.row.categoryItems}}</span>
                </template>
              </el-table-column>

              <el-table-column width="150px" :label="'上級部門'">
                <template slot-scope="scope">
                  <span>{{scope.row.parentName}}</span>
                </template>
              </el-table-column>

              <el-table-column class-name="status-col" :label="'狀態'" width="100">
                <template slot-scope="scope">
                  <span :class="scope.row.status | statusFilter">{{statusOptions.find(u =>u.key ==
                    scope.row.status).display_name}}</span>
                </template>
              </el-table-column>

              <el-table-column align="center" :label="'操作'" width="150" class-name="small-padding fixed-width">
                <template slot-scope="scope">
                  <el-button type="primary" size="mini" @click="handleUpdate(scope.row)">編輯</el-button>
                  <el-button v-if="scope.row.status==0" size="mini" type="danger" @click="handleModifyStatus(scope.row,1)">停用</el-button>
                </template>
              </el-table-column>
            </el-table>
            <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="handleCurrentChange" />
          </div>
        </el-col>
      </el-row>

      <!-- 添加用戶 -->
      <el-dialog v-el-drag-dialog class="dialog-mini" width="40%" :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" :close-on-click-modal="false" :close-on-press-escape="false">
        <el-form :rules="rules" ref="dataForm" :model="temp" label-position="right" label-width="100px">
          <el-form-item size="small" :label="'Id'" prop="id" v-show="dialogStatus=='update'">
            <span>{{temp.id}}</span>
          </el-form-item>
          <el-form-item size="small" :label="'層級ID'" v-show="dialogStatus=='update'">
            <span>{{temp.cascadeId}}</span>
          </el-form-item>
          <el-form-item size="small" :label="'單位名稱'" prop="name">
            <el-input v-model="temp.name" placeholder="請輸入單位名稱"></el-input>
          </el-form-item>
          <el-form-item size="small" :label="'類別'" prop="categoryItems">
            <el-select class="w-full" v-model="temp.categoryItems" multiple placeholder="請選擇類別">
              <el-option :label="'政府計畫'" :value="'政府計畫'"></el-option>
              <el-option :label="'創育中心'" :value="'創育中心'"></el-option>
              <el-option :label="'Coworking Space'" :value="'Coworking Space'"></el-option>
              <el-option :label="'加速器'" :value="'加速器'"></el-option>
              <el-option :label="'協會或社群'" :value="'協會或社群'"></el-option>
              <el-option :label="'園區或基地'" :value="'園區或基地'"></el-option>
              <el-option :label="'在地創育坊'" :value="'在地創育坊'"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item size="small" :label="'單位服務項目'" prop="serviceItems">
            <el-select class="w-full" v-model="temp.serviceItems" multiple placeholder="請選擇單位服務項目">
              <el-option :label="'提供輔導'" :value="'提供輔導'"></el-option>
              <el-option :label="'有舉辦活動/課程'" :value="'有舉辦活動/課程'"></el-option>
              <el-option :label="'場地租借'" :value="'場地租借'"></el-option>
              <el-option :label="'可獲得投資機會'" :value="'可獲得投資機會'"></el-option>
              <el-option :label="'可進駐'" :value="'可進駐'"></el-option>
              <el-option :label="'政府單位營運'" :value="'政府單位營運'"></el-option>
              <el-option :label="'在地交流'" :value="'在地交流'"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item size="small" :label="'單位聯絡人'" prop="contactName">
            <el-input v-model="temp.contactName" placeholder="請輸入單位聯絡人"></el-input>
          </el-form-item>
          <el-form-item size="small" :label="'Email'" prop="email">
            <el-input v-model="temp.email" placeholder="請輸入Email"></el-input>
          </el-form-item>
          <el-form-item size="small" :label="'聯絡電話'">
            <el-input v-model="temp.contactPhone1" placeholder="電話號碼" size="mini"></el-input>
            <el-input v-model="temp.contactPhone2" placeholder="電話號碼" size="mini"></el-input>
          </el-form-item>
          <el-form-item size="small" :label="'通訊地址'" prop="address">
            <el-select class="w-full" v-model="temp.county" placeholder="請選擇縣市" size="mini">
              <el-option v-for="(item, index) in countyData" :key="'CT_' + index" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
            <el-select class="w-full" v-model="temp.district" placeholder="請選擇鄉鎮區" no-data-text="請先選擇縣市" size="mini">
              <el-option v-for="(items, $index) in ChooseCounty(districtData)" :key="'DT_' + $index" :label="items.label" :value="items.value">
              </el-option>
            </el-select>
            <el-input v-model="temp.address" placeholder="請輸入地址" size="mini"></el-input>
          </el-form-item>
          <el-form-item size="small" :label="'單位圖片'">
            <el-upload class="avatar-uploader" action="" :show-file-list="false" accept=".png,.jpg,.jpeg,.svg" :before-upload="beforeAvatarUpload">
              <div v-if="!!getImgs.filePath">
                <img :src="getImgs.filePath" :alt="getImgs.name" class="avatar" />
              </div>
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
            <!-- <img v-if="getImgs.thumbnail" :src="getImgs.thumbnail" width="80px" /> -->

            <Cropper :cropperDialog="cropperDialog" :cropperImg="imgInfo" :autoCropWidth="1600" :autoCropHeight="800" @setImgs="setImgs" @cancleCropper="cropperDialog = false" />
          </el-form-item>
          <el-form-item size="small" :label="'單位簡介'" prop="summary">
            <ckeditor v-model="temp.summary" :value="temp.summary" :config="setConfig" />
          </el-form-item>
          <el-form-item size="small" :label="'相關網站'">
            <el-button type="info" @click="addDomain()" size="mini" plain>新增網站</el-button>
            <el-form-item v-for="(domain, index) in dynamicValidateForm" :key="index">
              <div class="flex-items-c-justify-c">
                <el-input v-model="domain.conactionWebItems1" :placeholder="'相關網站名稱' + (index + 1)" size="mini"></el-input>
                <el-input v-model="domain.conactionWebItems2" :placeholder="'相關網站連結' + (index + 1)" size="mini"></el-input>
                <el-button @click.prevent="removeDomain(domain)" size="mini">删除</el-button>
              </div>
            </el-form-item>

          </el-form-item>
          <el-form-item size="small" :label="'狀態'">
            <el-select class="filter-item" v-model="temp.status" placeholder="請選擇狀態">
              <el-option v-for="item in  statusOptions" :key="item.key" :label="item.display_name" :value="item.key">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item size="small" :label="'上級機構'">
            <treeselect ref="orgsTree" :options="mechOrgsTree" :default-expand-level="3" :multiple="false" :open-on-click="true" :open-on-focus="true" :clear-on-select="true" v-model="selectOrgs"></treeselect>
          </el-form-item>
        </el-form>
        <div slot="footer">
          <el-button size="mini" @click="dialogFormVisible = false">取消</el-button>
          <el-button size="mini" v-if="dialogStatus=='create'" type="primary" @click="createData()">確認</el-button>
          <el-button size="mini" v-else type="primary" @click="updateData()">確認</el-button>
        </div>
      </el-dialog>

      <!-- 匯出 -->
      <el-dialog class="dialog-mini" width="500px" v-el-drag-dialog :title="'匯出'" :visible.sync="dialogExport" :close-on-click-modal="false" :close-on-press-escape="false">
        <el-form :model="tempExport" label-width="90px">
          <el-form-item label="單位服務項目">
            <el-select class="w-full" v-model="tempExport.ServiceItems" placeholder="請選擇服務項目" multiple collapse-tags>
              <el-option :label="'提供輔導'" :value="'提供輔導'"></el-option>
              <el-option :label="'有舉辦活動/課程'" :value="'有舉辦活動/課程'"></el-option>
              <el-option :label="'場地租借'" :value="'場地租借'"></el-option>
              <el-option :label="'可獲得投資機會'" :value="'可獲得投資機會'"></el-option>
              <el-option :label="'可進駐'" :value="'可進駐'"></el-option>
              <el-option :label="'政府單位營運'" :value="'政府單位營運'"></el-option>
              <el-option :label="'在地交流'" :value="'在地交流'"></el-option>
            </el-select>
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

          <el-form-item label="類別">
            <el-select class="w-full" v-model="tempExport.CategoryItems" placeholder="請選擇類別" multiple collapse-tags>
              <el-option :label="'政府計畫'" :value="'政府計畫'"></el-option>
              <el-option :label="'創育中心'" :value="'創育中心'"></el-option>
              <el-option :label="'Coworking Space'" :value="'Coworking Space'"></el-option>
              <el-option :label="'加速器'" :value="'加速器'"></el-option>
              <el-option :label="'協會或社群'" :value="'協會或社群'"></el-option>
              <el-option :label="'園區或基地'" :value="'園區或基地'"></el-option>
              <el-option :label="'在地創育坊'" :value="'在地創育坊'"></el-option>
            </el-select>
          </el-form-item>
        </el-form>

        <div slot="footer">
          <el-button size="mini" type="danger" @click="dialogExport = false" plain>取消</el-button>
          <el-button size="mini" type="primary" @click="exportData()" plain>匯出</el-button>
        </div>
      </el-dialog>

      <!-- 添加角色用戶 -->
      <el-dialog class="dialog-mini user-dialog" v-el-drag-dialog :title="'分配用戶'" :visible.sync="roleUsers.dialogUserResource" :close-on-click-modal="false" :close-on-press-escape="false">
        <selectUsersCom ref="selectUser" v-if="roleUsers.dialogUserResource" :orgId="multipleSelection[0].id" :hiddenFooter="true" :loginKey="'loginUser'" :selectUsers.sync="roleUsers.rowIndex > -1 && roleUsers.list[roleUsers.rowIndex]">
        </selectUsersCom>
        <div style="text-align:right;" slot="footer">
          <el-button size="small" type="cancel" @click="roleUsers.dialogUserResource = false">取消</el-button>
          <el-button size="small" type="primary" @click="handleSaveUsers()">確定</el-button>
        </div>
      </el-dialog>
    </div>
  </div>

</template>

<script>
import axios from "axios";

import { cityAndCountiesLite, Counties } from "@/assets/taiwan";
import { listToTreeSelect } from "@/utils";
import * as orgs from "@/api/orgs";
import * as apiUsers from "@/api/users";
import * as login from "@/api/login";
// import * as upload from "@/api/upload";
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
import waves from "@/directive/waves"; // 水波紋指令
import Sticky from "@/components/Sticky";
import permissionBtn from "@/components/PermissionBtn";
import Pagination from "@/components/Pagination";
import elDragDialog from "@/directive/el-dragDialog";
import selectUsersCom from "@/components/SelectUsersCom";
import Cropper from "@/components/cropperImage";

export default {
  name: "org",
  components: {
    Sticky,
    permissionBtn,
    Treeselect,
    Pagination,
    selectUsersCom,
    Cropper,
  },
  directives: {
    waves,
    elDragDialog,
  },
  data() {
    return {
      countyData: Counties,
      districtData: cityAndCountiesLite,

      setConfig: {
        readOnly: false,
        extraPlugins: "button, panelbutton, colorbutton",
      },

      defaultProps: {
        // tree配置項
        children: "children",
        label: "label",
      },
      multipleSelection: [], // 列表checkbox選中的值
      tableKey: 0,
      list: null,
      subLists: [],
      total: 0,
      currentOrgId: "",
      listLoading: true,
      listQuery: {
        // 查詢條件
        page: 1,
        limit: 20,
        orgId: "",
        key: undefined,
      },
      apps: [],
      statusOptions: [
        {
          key: 0,
          display_name: "正常",
        },
        {
          key: 1,
          display_name: "停用",
        },
      ],
      showDescription: false,
      orgs: [], // 用戶可訪問到的組織列表
      orgsTree: [], // 用戶可訪問到的所有機構組成的樹

      /* 上傳 */
      imgInfo: {},
      cropperDialog: false,
      getImgs: {},
      /* */
      temp: {
        id: undefined,
        cascadeId: "",
        name: "",
        categoryItems: [],
        serviceItems: [],
        contactName: "",
        email: "",
        contactPhone1: "",
        contactPhone2: "",
        photo: "",
        county: "",
        district: "",
        address: "",
        summary: "",
        conactionWebItems: "",
        status: 0,
        parentName: "",
        parentId: null,
      },
      dynamicValidateForm: [],
      rules: {
        name: [
          {
            required: true,
            message: "名稱不能為空",
            trigger: "blur",
          },
        ],
        categoryItems: [
          {
            required: true,
            message: "請選擇類別",
            trigger: "change",
          },
        ],
        serviceItems: [
          {
            required: true,
            message: "請選擇單位服務項目",
            trigger: "change",
          },
        ],
        contactName: [
          {
            required: true,
            message: "單位聯絡人不能為空",
            trigger: "blur",
          },
        ],
        email: [
          {
            required: true,
            message: "email不能為空",
            trigger: "blur",
          },
        ],
        contactPhone2: [
          {
            required: true,
            message: "聯絡電話不能為空",
            trigger: "blur",
          },
        ],
        photo: [
          {
            required: true,
            message: "單位圖片不能為空",
            trigger: "blur",
          },
        ],
        address: [
          {
            required: true,
            message: "請輸入地址",
            trigger: "blur",
          },
        ],
        summary: [
          {
            required: true,
            message: "單位簡介不能為空",
            trigger: "blur",
          },
        ],
        conactionWebItems2: [
          {
            required: true,
            message: "相關網站不能為空",
            trigger: "blur",
          },
        ],
      },
      dialogFormVisible: false,
      chkRoot: false, // 根節點是否選中
      treeDisabled: true, // 樹選擇框時候可用
      dialogStatus: "",
      textMap: {
        update: "編輯",
        create: "添加",
      },
      downloadLoading: false,
      selectOrgs: "",
      roleUsers: {
        dialogUserResource: false,
        Texts: "",
        rowIndex: -1,
        selectUsers: [],
        list: [],
      },

      dialogExport: false,
      tempExport: {},
    };
  },
  watch: {
    selectOrgs() {
      if (
        this.selectOrgs === undefined ||
        this.selectOrgs === null ||
        this.selectOrgs === ""
      ) {
        // 如果是根節點
        this.temp.parentName = "根節點";
        this.temp.parentId = "";
        this.isRoot = true;
        return;
      }
      this.isRoot = false;
      this.temp.parentId = this.selectOrgs;
      var parentname = this.orgs.find((val) => {
        return this.selectOrgs === val.id;
      }).label;
      this.temp.parentName = parentname;
    },
  },
  computed: {
    ChooseCounty() {
      return (data) => {
        return data[this.temp.county];
      };
    },
    mechOrgsTree() {
      const arr = [
        {
          id: "",
          label: "根節點",
          parentId: null,
        },
      ];
      return arr.concat(this.orgsTree);
    },
    isRoot: {
      get() {
        return this.chkRoot;
      },
      set(v) {
        this.chkRoot = v;
        if (v) {
          this.temp.parentName = "根節點";
          this.temp.parentId = "";
        }
        this.treeDisabled = v;
      },
    },
  },
  filters: {
    statusFilter(status) {
      var res = "color-success";
      switch (status) {
        case 1:
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
  },
  mounted() {
    this.getOrgTree();
  },
  methods: {
    loadRoleUsers() {
      var _this = this;
      this.isLoading = true;
      apiUsers
        .LoadByOrg({
          page: 1,
          limit: 99999,
          orgId: _this.multipleSelection[0].id,
        })
        .then((response) => {
          this.roleUsers.dialogUserResource = true;
          _this.roleUsers.list[this.roleUsers.rowIndex] = response.data || [];
        });
    },
    handleSaveUsers() {
      this.$refs.selectUser.handleSaveUsers();
      const arr = this.roleUsers.list[this.roleUsers.rowIndex];
      const postData = {
        orgId: this.multipleSelection[0].id,
        userIds: (arr.length > 0 && arr.map((item) => item.id)) || [],
      };
      console.log(postData);
      orgs.AssignOrgUsers(postData).then((res) => {
        // this.$message.success("添加成功");
        if (res.code == 200) {
          this.$notify({
            title: "成功",
            message: "新增成功",
            type: "success",
            duration: 1500,
          });
          this.roleUsers.dialogUserResource = false;
        } else {
          this.$notify({
            title: "錯誤",
            message: res.message,
            type: "error",
            duration: 1500,
          });
        }
      });
    },
    rowClick(row) {
      this.$refs.mainTable.clearSelection();
      this.$refs.mainTable.toggleRowSelection(row);
    },
    handleNodeClick(data) {
      this.currentOrgId = data.id;
      this.getList();
      // this.getOrgTree();
    },
    getAllOrgs() {
      this.currentOrgId = "";
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
        case "btnAssignOrgUser":
          if (this.multipleSelection.length !== 1) {
            this.$message({
              message: "只能選中一個進行編輯",
              type: "error",
            });
            return;
          }
          this.roleUsers.rowIndex = this.list.findIndex(
            (item) => item.id === this.multipleSelection[0].id
          );
          this.loadRoleUsers();
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
        case "btnExportUserExts":
          this.resetTempExport();
          this.dialogExport = true;
          break;
        default:
          break;
      }
    },

    getList() {
      this.listLoading = true;
      login
        .getSubOrgs({
          orgId: this.currentOrgId,
          limit: this.listQuery.limit,
          page: this.listQuery.page,
        })
        .then((response) => {
          this.subLists = Object.assign([], response.data);
          this.total = response.count;
          this.listLoading = false;
          this.pageSubOrgs();
        });
    },
    pageSubOrgs() {
      this.list = this.subLists.slice(
        (this.listQuery.page - 1) * this.listQuery.limit,
        this.listQuery.page * this.listQuery.limit
      );
      this.roleUsers.selectUsers = this.list.map(() => {
        return { users: [], Texts: "" };
      });
    },
    getOrgTree() {
      var _this = this; // 記錄vuecomponent
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
        // console.log("orgsTree", _this.orgsTree);
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
      this.pageSubOrgs();
    },
    handleModifyStatus(row, status) {
      // 模擬修改狀態
      this.$message({
        message: "操作成功",
        type: "success",
      });
      row.status = status;
    },

    //
    resetTemp() {
      this.temp = {
        id: undefined,
        cascadeId: "",
        name: "",
        categoryItems: [],
        serviceItems: [],
        contactName: "",
        email: "",
        contactPhone1: "",
        contactPhone2: "",
        photo: "",
        county: "",
        district: "",
        address: "",
        summary: "",
        conactionWebItems: "",
        status: 0,
        parentName: "",
        parentId: null,
      };
    },
    resetTempExport() {
      this.tempExport = {
        ServiceItems: [],
        County: "",
        District: "",
        CategoryItems: [],
      };
    },
    //

    handleCreate() {
      this.imgInfo = "";
      // 彈出添加框
      this.resetTemp();
      this.dynamicValidateForm = [];
      this.dialogStatus = "create";
      this.dialogFormVisible = true;
      this.selectOrgs = "";
      this.$nextTick(() => {
        this.$refs["dataForm"].clearValidate();
      });
    },

    /* 上傳圖片 */
    setImgs(imgInfo) {
      this.getImgs = imgInfo;
    },
    beforeAvatarUpload(file) {
      const isLt4M = file.size / 1024 / 1024 < 4;
      if (!isLt4M) {
        this.$message.error("上傳圖片不能超過 4MB!");
        return false;
      }
      this.imgInfo = URL.createObjectURL(file);
      console.log(this.imgInfo);
      this.cropperDialog = true;
    },

    addDomain() {
      this.dynamicValidateForm.push({
        conactionWebItems1: "",
        conactionWebItems2: "",
      });
    },
    removeDomain(item) {
      let index = this.dynamicValidateForm.indexOf(item);
      if (index !== -1) {
        this.dynamicValidateForm.splice(index, 1);
      }
    },

    createData() {
      // 保存提交
      this.$refs["dataForm"].validate((valid) => {
        if (valid) {
          this.temp.conactionWebItems = JSON.stringify(
            this.dynamicValidateForm
          );
          this.temp.photo = this.getImgs.filePath;
          // console.log(this.temp);
          orgs.add(this.temp).then((response) => {
            console.log(response);
            // 需要回填數據庫生成的數據
            // this.temp.id = response.result.id;
            // this.temp.cascadeId = response.result.cascadeId;
            // this.list.unshift(this.temp);
            this.getList();
            this.dialogFormVisible = false;
            this.$notify({
              title: "成功",
              message: "創建成功",
              type: "success",
              duration: 2000,
            });
            this.dynamicValidateForm = [];
            this.getOrgTree();
          });
        }
      });
    },
    // 匯出
    exportData() {
      this.$confirm("確定要匯出嗎？", "提示", {
        confirmButtonText: "確定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        let config = {
          headers: {
            "Content-Type": "application/json",
            "X-token": this.$store.getters.token,
          },
          responseType: "blob", // 回應類型為 blob
        };

        const data = this.tempExport;
        console.log(data);

        const url =
          `${process.env.VUE_APP_BASE_API}OrgExts/Export?ServiceItems=` +
          data.ServiceItems +
          "&County=" +
          data.County +
          "&District=" +
          data.District +
          "&CategoryItems=" +
          data.CategoryItems;

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
    //
    handleUpdate(row) {
      this.imgInfo = "";
      // this.temp.photo = "";
      this.dynamicValidateForm = [];
      // 彈出編輯框
      orgs.get({ id: row.id }).then((res) => {
        this.temp = Object.assign({}, res.result); // copy obj
        this.dynamicValidateForm =
          JSON.parse(this.temp.conactionWebItems) || [];
        this.getImgs.filePath = this.temp.photo;
      });
      console.log(this.temp);
      this.dialogStatus = "update";
      this.dialogFormVisible = true;
      this.selectOrgs = this.temp.parentId;
      this.$nextTick(() => {
        this.$refs["dataForm"].clearValidate();
      });
    },
    updateData() {
      // 更新提交
      this.$refs["dataForm"].validate((valid) => {
        if (valid) {
          this.temp.conactionWebItems =
            JSON.stringify(this.dynamicValidateForm) || [];
          const tempData = Object.assign({}, this.temp);
          orgs.update(tempData).then(() => {
            this.dialogFormVisible = false;
            this.$notify({
              title: "成功",
              message: "更新成功",
              type: "success",
              duration: 2000,
            });

            this.getOrgTree();
            for (const v of this.list) {
              if (v.id === this.temp.id) {
                const index = this.list.indexOf(v);
                this.list.splice(index, 1, this.temp);
                break;
              }
            }
          });
        }
      });
    },
    handleDelete(rows) {
      // 多行刪除
      orgs.del(rows.map((u) => u.id)).then(() => {
        this.$notify({
          title: "成功",
          message: "刪除成功",
          type: "success",
          duration: 2000,
        });
        this.getOrgTree();
        rows.forEach((row) => {
          const index = this.list.indexOf(row);
          this.list.splice(index, 1);
        });
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.avatar {
  width: 200px;
  height: 100px;
  margin-top: 10px;

  &-uploader {
    width: 200px;
    height: 100px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #fff;
    border: 1px dashed #409eff;
    opacity: 1;
    filter: alpha(opacity=100);
    transition: 0.3s;

    &-icon {
      width: 200px;
      height: 100px;
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

.text {
  font-size: 14px;
}

.item {
  margin-bottom: 18px;
}

.clearfix:before,
.clearfix:after {
  display: table;
  content: "";
}

.clearfix:after {
  clear: both;
}

.el-select.filter-item.el-select--small {
  width: 100%;
}
/deep/ .user-dialog {
  .el-dialog {
    height: 70%;
    .el-icon-close {
      padding-top: 10px;
    }
    .el-dialog__body {
      height: calc(100% - 35px - 40px);
    }
    .el-dialog__headerbtn {
      top: 0;
    }
  }
}
</style>
