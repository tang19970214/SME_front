<template>
  <div class="flex-column">
    <sticky :className="'sub-navbar'">
      <div class="filter-container">
        <permission-btn moduleName="article" size="mini" v-on:btn-event="onBtnClicked"></permission-btn>
      </div>
    </sticky>

    <div class="app-container flex-item">
      <div class="bg-white" style="height: 100%">
        <el-table ref="mainTable" height="calc(100% - 52px)" :key="tableKey" :data="tableList" v-loading="listLoading" border fit highlight-current-row style="width: 100%" @row-click="rowClick" @selection-change="handleSelectionChange">
          <el-table-column label="狀態" width="120">
            <template slot-scope="scope">
              <span>{{ statusFilter(scope.row.status) }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="name" label="文章標題"></el-table-column>
          <el-table-column prop="contactName" label="作者"></el-table-column>
          <el-table-column label="更新日期" width="160">
            <template slot-scope="scope">
              <span>{{ dataFilter(scope.row.modifyDate) }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="browseCount" label="瀏覽次數" width="100"></el-table-column>

          <el-table-column align="center" :label="'功能'" width="230" class-name="small-padding">
            <template slot-scope="scope">
              <!-- 編輯 -->
              <el-button type="primary" size="mini" @click="handleUpdate(scope.row)" v-if="
                  hasButton('btnEdit') &&
                  (scope.row.status == 1 ||
                    scope.row.status == 2 ||
                    scope.row.status == 4)
                ">編輯</el-button>
              <!-- 檢視 -->
              <el-button type="success" size="mini" @click="handleView(scope.row)" v-if="
                  hasButton('btnView') &&
                  (scope.row.status == 2 ||
                    scope.row.status == 3 ||
                    scope.row.status == 5)
                ">檢視</el-button>
              <!-- 複製 -->
              <el-button type="info" size="mini" @click="handleCopy(scope.row)" v-if="hasButton('btnCopy') && scope.row.status == 5">複製</el-button>
              <!-- 取消送審 -->
              <el-button type="warning" size="mini" @click="handleChangeStatus(scope.row, 1)" v-if="hasButton('btnCancelSend') && scope.row.status == 3">取消送審</el-button>
              <!-- 下架 -->
              <el-button type="danger" size="mini" @click="handleChangeStatus(scope.row, 5)" v-if="hasButton('btnOffShelf') && scope.row.status == 4">下架</el-button>
              <!-- 刪除 -->
              <el-button type="danger" size="mini" @click="handleDelete(scope.row)" v-if="
                  hasButton('btnDelete') &&
                  (scope.row.status == 1 ||
                    scope.row.status == 2 ||
                    scope.row.status == 5)
                ">刪除</el-button>
              <!-- 審核 -->
              <el-button type="info" size="mini" @click="handleAudit(scope.row)" v-if="hasButton('btnAudit') && scope.row.status == 3">審核</el-button>
            </template>
          </el-table-column>
        </el-table>

        <pagination v-show="total > 0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="handleCurrentChange" />
      </div>

      <!-- dialog -->
      <el-dialog v-el-drag-dialog class="dialog-mini" width="600px" :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" :close-on-click-modal="false" :close-on-press-escape="false">
        <el-form :rules="rules" ref="dataForm" :model="temp" label-position="right" label-width="100px">
          <el-form-item size="small" :label="'文章狀態'">
            <span>{{ setStatusText() }}</span>
          </el-form-item>
          <el-form-item size="small" :label="'文章名稱'">
            <el-input type="text" v-model="temp.name" :disabled="dialogStatus == 'view' || dialogStatus == 'audit'"></el-input>
          </el-form-item>
          <el-form-item size="small" :label="'文章標籤'">
            <div class="flex-items-center">
              <el-select v-model="temp.articleTags" multiple placeholder="請選擇文章標籤" :disabled="dialogStatus == 'view' || dialogStatus == 'audit'">
                <el-option v-for="item in articleTagList" :key="item.id" :label="item.name" :value="item.dtValue">
                </el-option>
              </el-select>

              <el-button type="info" icon="el-icon-plus" @click="handelCreateAct()" :disabled="dialogStatus == 'view' || dialogStatus == 'audit'"></el-button>
            </div>
          </el-form-item>
          <el-form-item size="small" :label="'文章圖片'">
            <div class="flex-items-center">
              <el-upload class="avatar-uploader" action="" :show-file-list="false" accept=".png,.jpg,.jpeg,.svg" :before-upload="beforeAvatarUpload" :disabled="dialogStatus == 'view' || dialogStatus == 'audit'">
                <div v-if="!!getImgs.filePath">
                  <img :src="getImgs.filePath" :alt="getImgs.name" class="avatar" />
                </div>
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
              </el-upload>
              <!-- <img v-if="getImgs.thumbnail" :src="getImgs.thumbnail" width="80px" /> -->
              <el-upload class="avatar-thumbnail-uploader" action="" :show-file-list="false" accept=".png,.jpg,.jpeg,.svg" :before-upload="beforeAvatarUpload_thumbnail" :disabled="dialogStatus == 'view' || dialogStatus == 'audit'">
                <div v-if="!!getImgs_thumbnail.filePath">
                  <img :src="getImgs_thumbnail.filePath" :alt="getImgs_thumbnail.name" class="avatar-thumbnail" />
                </div>
                <i v-else class="el-icon-plus avatar-thumbnail-uploader-icon"></i>
              </el-upload>
            </div>

            <Cropper :fileType="fileType" :cropperDialog="cropperDialog" :cropperImg="imgInfo" :autoCropWidth="cropperOption.width" :autoCropHeight="cropperOption.height" @setImgs="setImgs" @setImgs_thumbnail="setImgs_thumbnail" @cancleCropper="cropperDialog = false" />
          </el-form-item>
          <el-form-item size="small" :label="'文章摘要'">
            <el-input type="textarea" :rows="4" v-model="temp.summary" maxlength="200" show-word-limit :disabled="dialogStatus == 'view' || dialogStatus == 'audit'"></el-input>
          </el-form-item>
          <el-form-item size="small" :label="'文章內容'">
            <ckeditor v-model="temp.contents" :value="temp.contents" :config="setConfig" :read-only="checkAuth" />
          </el-form-item>
          <el-form-item size="small" :label="'作者'">
            <el-input v-model="temp.contactName" maxlength="50" :disabled="dialogStatus == 'view' || dialogStatus == 'audit'"></el-input>
          </el-form-item>
          <el-form-item size="small" :label="'SEO TITLE'">
            <div class="flex-items-c-justify-c">
              <el-input v-model="temp.seoTitle" :disabled="dialogStatus == 'view' || dialogStatus == 'audit'"></el-input>
              <el-popover placement="bottom" width="200" trigger="click" content="Google搜尋時的標題，建議不超過10個字，若無填寫會自動帶入標題">
                <el-button type="text" slot="reference">
                  <i class="el-icon-question descriptionText"></i>
                </el-button>
              </el-popover>
            </div>
          </el-form-item>
          <el-form-item size="small" :label="'SEO Meta Description'">
            <div class="flex-items-c-justify-c">
              <el-input v-model="temp.seoDescript" :disabled="dialogStatus == 'view' || dialogStatus == 'audit'"></el-input>
              <el-popover placement="bottom" width="200" trigger="click" content="Google搜尋時的標題，建議不超過10個字，若無填寫會自動帶入標題">
                <el-button type="text" slot="reference">
                  <i class="el-icon-question descriptionText"></i>
                </el-button>
              </el-popover>
            </div>
          </el-form-item>
          <el-form-item size="small" :label="'審核意見'" prop="checkOpinion" :rules="
              temp.status == 3 ? rules.checkOpinion : [{ required: false }]
            ">
            <el-input type="textarea" :rows="5" v-model="temp.checkOpinion" :disabled="temp.status == 1 || dialogStatus == 'view'"></el-input>
          </el-form-item>
          <el-form-item size="small" :label="'上架時間'">
            <el-date-picker v-model="temp.publishDate" type="date" placeholder="請選擇上架時間" disabled>
            </el-date-picker>
          </el-form-item>
        </el-form>

        <div slot="footer">
          <el-button size="mini" type="success" @click="createData(1)" v-if="dialogStatus == 'create'">存成草稿</el-button>
          <el-button size="mini" type="success" @click="updateData(1)" v-if="
              dialogStatus == 'update' && (temp.status == 1 || temp.status == 2)
            ">存成草稿</el-button>
          <el-button size="mini" type="info" v-if="dialogStatus !== 'view' && temp.status !== 4" plain>預覽</el-button>
          <el-button size="mini" type="primary" @click="dialogFormVisible = false" v-if="dialogStatus == 'view'">確定</el-button>
          <el-button size="mini" type="primary" @click="createData(3)" v-if="dialogStatus == 'create'">送出審核</el-button>
          <el-button size="mini" type="primary" @click="updateData(3)" v-if="
              dialogStatus == 'update' && (temp.status == 1 || temp.status == 2)
            ">送出審核</el-button>
          <el-button size="mini" type="primary" @click="dialogFormVisible = false" v-if="dialogStatus == 'update' && temp.status == 4">確認</el-button>
          <el-button size="mini" type="info" @click="updateData(0)" v-if="dialogStatus == 'update' && temp.status == 4">送出修改</el-button>

          <el-button size="mini" type="danger" @click="updateData(2)" v-if="dialogStatus == 'audit' && temp.status == 3" plain>審核未通過</el-button>
          <el-button size="mini" type="primary" @click="updateData(4)" v-if="dialogStatus == 'audit' && temp.status == 3" plain>審核通過上架</el-button>
        </div>
      </el-dialog>

      <!-- 添加文章標籤 -->
      <el-dialog v-el-drag-dialog class="dialog-mini" width="500px" title="添加文章標籤" :visible.sync="articleDialog" :close-on-click-modal="false" :close-on-press-escape="false">
        <el-form :rules="rulesAct" ref="dataFormAct" :model="tempAct" label-position="right" label-width="100px">
          <el-form-item size="small" :label="'名稱'" prop="name">
            <el-input v-model="tempAct.name"></el-input>
          </el-form-item>

          <el-form-item size="small" :label="'描述'">
            <el-input v-model="tempAct.description"></el-input>
          </el-form-item>
        </el-form>

        <el-row>
          <el-col :span="24">
            <el-tag class="mr-5 mb-5" v-for="item in ownArticleTagList" :key="item.id" type="success" closable :disable-transitions="false" @close="handleDelTags(item)">
              {{ item.name }}
            </el-tag>
          </el-col>
        </el-row>

        <div slot="footer">
          <el-button size="mini" @click="articleDialog = false">取消</el-button>
          <el-button size="mini" type="primary" @click="createAct()">確認</el-button>
        </div>
      </el-dialog>

      <!-- 篩選 -->
      <el-dialog v-el-drag-dialog class="dialog-mini" width="600px" title="篩選" :visible.sync="dialogFilter" :close-on-click-modal="false" :close-on-press-escape="false">
        <el-form :model="listQuery" label-position="right" label-width="100px">
          <el-form-item size="small" :label="'關鍵字'">
            <el-input type="text" v-model="listQuery.key"></el-input>
          </el-form-item>
          <el-form-item size="small" :label="'狀態'">
            <el-checkbox-group v-model="listQuery.Status">
              <el-checkbox :label="1">草稿</el-checkbox>
              <el-checkbox :label="2">審核未通過</el-checkbox>
              <el-checkbox :label="3">審核中</el-checkbox>
              <el-checkbox :label="4">上架</el-checkbox>
              <el-checkbox :label="5">下架</el-checkbox>
            </el-checkbox-group>
          </el-form-item>
          <el-form-item size="small" :label="'作者'">
            <el-input type="text" v-model="listQuery.ContactName"></el-input>
          </el-form-item>
          <el-form-item size="small" :label="'標籤'">
            <el-select v-model="listQuery.Tags" multiple placeholder="請選擇文章標籤">
              <el-option v-for="item in articleTagList" :key="item.id" :label="item.name" :value="item.dtValue">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item size="small" :label="'更新時間'">
            <el-date-picker v-model="datetime_update" type="daterange" range-separator="至" start-placeholder="開始時間" end-placeholder="結束時間" value-format="yyyy-MM-dd">
            </el-date-picker>
          </el-form-item>
        </el-form>

        <div slot="footer">
          <el-button size="mini" type="primary" @click="filterSearch()">搜尋</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import pbMixins from "@/mixins/permissionBtn.js";

import moment from "moment";

import { cityAndCountiesLite, Counties } from "@/assets/taiwan";

import * as applications from "@/api/applications";
import * as article from "@/api/article";
import * as categorys from "@/api/categorys";
import waves from "@/directive/waves"; // 水波紋指令
import Sticky from "@/components/Sticky";
import permissionBtn from "@/components/PermissionBtn";
import Pagination from "@/components/Pagination";
import elDragDialog from "@/directive/el-dragDialog";
import Cropper from "@/components/cropperImage";

export default {
  mixins: [pbMixins],
  components: { Sticky, permissionBtn, Pagination, Cropper },
  directives: {
    waves,
    elDragDialog,
  },
  data() {
    return {
      countyData: Counties,
      districtData: cityAndCountiesLite,

      setConfig: {
        // readOnly: false,
        extraPlugins: "button, panelbutton, colorbutton",
      },

      tableList: [],
      articleTagList: [],
      ownArticleTagList: [],
      multipleSelection: [], // 列表checkbox選中的值
      tableKey: 0,
      total: 0,
      listLoading: true,
      listQuery: {
        Status: "",
        ContactName: "",
        Tags: "",
        ModifyStartDate: "",
        ModifyEndDate: "",
        page: 1,
        limit: 20,
        key: undefined,
        orderby: undefined,
      },
      apps: [],
      statusOptions: [
        { key: true, display_name: "停用" },
        { key: false, display_name: "正常" },
      ],
      showDescription: false,
      /* 篩選 */
      dialogFilter: false,
      datetime_update: "",
      /* ---- */

      temp: {
        orgId: "",
        /* 草稿-1, 審核未通過-2, 審核中-3, 上架-4, 下架-5 */
        status: 0,
        name: "",
        startDate: "",
        endDate: "",
        location: "",
        county: "",
        district: "",
        address: "",
        articleTags: [],
        photo: "",
        thumbPhoto: "",
        summary: "",
        contents: "",
        mainUnit: "",
        contactName: "",
        contactPhone: "",
        seoTitle: "",
        seoDescript: "",
        publishDate: "",
        checkOpinion: "",
        browseCount: 0,
      },
      /* 裁減dialog */
      fileType: "",
      cropperDialog: false,
      cropperOption: {
        width: 1080,
        height: 540,
      },
      getImgs: {},
      getImgs_thumbnail: {},
      /*  */

      imgInfo: {},
      dialogFormVisible: false,
      dialogStatus: "",
      textMap: {
        update: "編輯",
        create: "新增",
        view: "檢視",
        audit: "審核",
      },
      dialogPvVisible: false,
      pvData: [],
      rules: {
        checkOpinion: [
          { required: true, message: "審核意見不能為空", trigger: "blur" },
        ],
        publishDate: [
          { required: true, message: "請選擇上架日期", trigger: "change" },
        ],
      },
      downloadLoading: false,

      // 新增標籤
      articleDialog: false,
      tempAct: {},
      rulesAct: {
        name: [{ required: true, message: "名稱不能為空", trigger: "blur" }],
      },
    };
  },
  computed: {
    checkAuth() {
      return this.dialogStatus == "view" || this.dialogStatus == "audit"
        ? true
        : false;
    },
    ChooseCounty() {
      return (data) => {
        return data[this.temp.county];
      };
    },
    setStatusText() {
      return () => {
        switch (this.temp.status) {
          case 1:
            return "草稿";
          case 2:
            return "審核未通過";
          case 3:
            return "審核中";
          case 4:
            return "上架";
          case 5:
            return "下架";
        }
      };
    },
    statusFilter() {
      return (status) => {
        switch (status) {
          case 1:
            return "草稿";
          case 2:
            return "審核未通過";
          case 3:
            return "審核中";
          case 4:
            return "上架";
          case 5:
            return "下架";
        }
      };
    },
    dataFilter() {
      return (datetime) => {
        return moment(datetime).format("YYYY-MM-DD");
      };
    },
  },
  created() {
    this.getList();
    applications.getList().then((response) => {
      this.apps = response.data;
    });
  },
  mounted() {
    this.getActTags();
    this.getOwnActTags();
  },
  methods: {
    /* 取得文章標籤 */
    getActTags() {
      const listQuery = {
        page: 1,
        limit: 999,
        TypeId: "SYS_ART_TAG",
      };
      categorys.loadByTypeId(listQuery).then((res) => {
        this.articleTagList = res.data;
      });
    },
    /* 取得自己新增的文章標籤 */
    getOwnActTags() {
      const listQuery = {
        isSelect: false,
        page: 1,
        limit: 999,
        TypeId: "SYS_ART_TAG",
      };
      categorys.loadByTypeId(listQuery).then((res) => {
        this.ownArticleTagList = res.data;
      });
    },

    changeApp(value) {
      this.temp.appName = this.apps.find((e) => {
        // 把應用名稱加上
        return e.id === value;
      }).name;
    },
    rowClick(row) {
      this.$refs.mainTable.clearSelection();
      this.$refs.mainTable.toggleRowSelection(row);
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
        case "btnFilter":
          // eslint-disable-next-line
          this.listQuery.Status = !!this.listQuery.Status
            ? this.listQuery.Status.split(",").map((i) => Number(i))
            : [];
          // eslint-disable-next-line
          this.listQuery.Tags = !!this.listQuery.Tags
            ? this.listQuery.Tags.split(",")
            : [];
          this.datetime_update =
            [this.listQuery.ModifyStartDate, this.listQuery.ModifyEndDate] ||
            [];

          this.dialogFilter = true;
          break;
        default:
          break;
      }
    },
    /* 新增文章標籤 */
    handelCreateAct() {
      this.tempAct = {
        id: "",
        dtCode: "",
        name: "",
        dtValue: "",
        enable: true,
        sortNo: "",
        description: "",
        typeId: "",
        extendInfo: "",
      };
      this.articleDialog = true;
    },
    /* 刪除自建標籤 */
    handleDelTags(item) {
      categorys.del([item.id]).then((res) => {
        if (res.code == 200) {
          this.getActTags();
          this.getOwnActTags();
          this.$notify({
            title: "成功",
            message: "已刪除",
            type: "success",
            duration: 1500,
          });
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
    createAct() {
      this.tempAct.sortNo = this.articleTagList.length + 1;
      this.tempAct.dtValue = this.tempAct.name;
      this.tempAct.dtCode = this.tempAct.name;
      this.tempAct.typeId = "SYS_ART_TAG";

      this.$refs["dataFormAct"].validate((valid) => {
        if (valid) {
          categorys.add(this.tempAct).then((res) => {
            if (res.code === 200) {
              this.getActTags();
              this.getOwnActTags();
              this.$notify({
                title: "成功",
                message: "新增成功",
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
            this.articleDialog = false;
          });
        }
      });
    },

    getList() {
      this.listLoading = true;
      article.getList(this.listQuery).then((res) => {
        this.tableList = res.data;
        this.total = res.count;
        this.listLoading = false;
      });
    },
    /* 篩選 */
    filterSearch() {
      this.listQuery.Status = this.listQuery.Status.join(",");
      this.listQuery.Tags = this.listQuery.Tags.join(",");
      this.listQuery.ModifyStartDate = this.datetime_update
        ? this.datetime_update[0]
        : "";
      this.listQuery.ModifyEndDate = this.datetime_update
        ? this.datetime_update[1]
        : "";

      this.getList();
      this.dialogFilter = false;
    },
    /*  */
    setImgs(obj) {
      this.getImgs = obj;
      // this.temp.photo = url;
    },
    setImgs_thumbnail(obj) {
      this.getImgs_thumbnail = obj;
      // this.temp.thumbnail = url;
    },
    /* 裁剪 */
    beforeAvatarUpload(file) {
      const isLt4M = file.size / 1024 / 1024 < 4;
      if (!isLt4M) {
        this.$message.error("上傳圖片不能超過 4MB!");
        return false;
      }
      this.imgInfo = URL.createObjectURL(file);
      this.fileType = "";
      this.cropperOption = {
        width: 1080,
        height: 540,
      };
      this.cropperDialog = true;
    },
    beforeAvatarUpload_thumbnail(file) {
      const isLt2M = file.size / 1024 / 1024 < 4;
      if (!isLt2M) {
        this.$message.error("上傳圖片不能超過 4MB!");
        return false;
      }
      this.imgInfo = URL.createObjectURL(file);
      this.fileType = "thumbnail";
      this.cropperOption = {
        width: 900,
        height: 600,
      };
      this.cropperDialog = true;
    },
    /* */

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
    resetTemp() {
      this.temp = {
        status: 1,
        name: "",
        startDate: "",
        endDate: "",
        location: "",
        county: "",
        district: "",
        address: "",
        articleTags: [],
        photo: "",
        thumbPhoto: "",
        summary: "",
        contents: "",
        mainUnit: "",
        contactName: "",
        contactPhone: "",
        seoTitle: "",
        seoDescript: "",
        publishDate: "",
        checkOpinion: "",
        browseCount: 0,
      };
      this.getImgs.filePath = "";
      this.getImgs_thumbnail.filePath = "";
    },
    handleCreate() {
      this.imgInfo = "";
      // 彈出添加框
      this.resetTemp();
      this.dialogStatus = "create";
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs["dataForm"].clearValidate();
      });
    },
    createData(status) {
      this.temp.status = status;
      if (status == 3) {
        this.$confirm("是否要送出審核?", "提示", {
          confirmButtonText: "確定",
          cancelButtonText: "取消",
          type: "warning",
        }).then(() => {
          this.saveArticle();
        });
      } else {
        this.saveArticle();
      }
    },
    saveArticle() {
      // 保存提交
      this.temp.orgId = this.$store.state.user.defaultorg.id;
      this.temp.photo = this.getImgs.filePath;
      this.temp.thumbPhoto = this.getImgs_thumbnail.filePath;
      this.temp.seoTitle =
        this.temp.seoTitle == "" ? this.temp.name : this.temp.seoTitle;
      this.temp.seoDescript =
        this.temp.seoDescript == "" ? this.temp.summary : this.temp.seoDescript;
      // console.log(this.temp);
      article.add(this.temp).then((res) => {
        if (res.code == 200) {
          this.$message.success("新增成功");
        } else {
          this.$message.error(res.message);
        }
        this.getList();
        this.dialogFormVisible = false;
      });
    },

    /* 檢視 */
    handleView(row) {
      this.imgInfo = "";
      this.getImgs.filePath = row.photo;
      this.getImgs_thumbnail.filePath = row.thumbPhoto;
      this.temp = Object.assign({}, row);
      this.dialogStatus = "view";
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs["dataForm"].clearValidate();
      });
    },
    /* 審核 */
    handleAudit(row) {
      this.imgInfo = "";
      this.getImgs.filePath = row.photo;
      this.getImgs_thumbnail.filePath = row.thumbPhoto;
      this.temp = Object.assign({}, row);
      this.dialogStatus = "audit";
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs["dataForm"].clearValidate();
      });
    },
    /* 編輯 */
    handleUpdate(row) {
      this.imgInfo = "";
      this.getImgs.filePath = row.photo;
      this.getImgs_thumbnail.filePath = row.thumbPhoto;
      // 彈出編輯框
      this.temp = Object.assign({}, row); // copy obj
      console.log(this.temp);
      this.dialogStatus = "update";
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs["dataForm"].clearValidate();
      });
    },
    updateData(status) {
      let confirmTitle = "";

      switch (status) {
        case 0:
          confirmTitle = "確定要修改嗎？";
          break;
        case 1:
          confirmTitle = "確定要存成草稿嗎？";
          break;
        case 2:
          confirmTitle = "確定此活動未通過審核嗎？";
          break;
        case 3:
          confirmTitle = "確定要送出審核嗎？";
          break;
        case 4:
          confirmTitle = "確定此活動通過審核並上架嗎？";
          break;
      }

      this.$confirm(confirmTitle, "提示", {
        confirmButtonText: "確認",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        // 更新提交
        this.$refs["dataForm"].validate((valid) => {
          if (valid) {
            const tempData = Object.assign({}, this.temp);
            tempData.status = status == 0 ? 4 : status;
            article.update(tempData).then((res) => {
              if (res.code == 200) {
                this.$notify({
                  title: "成功",
                  message: "更新成功",
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
              this.getList();
              this.dialogFormVisible = false;
            });
          }
        });
      });
    },
    /* 複製 */
    handleCopy(row) {
      this.$confirm("確定要複製『" + row.name + "』嗎?", "提示", {
        confirmButtonText: "確定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        this.temp = Object.assign({}, row);

        this.temp.id = "";
        this.temp.name = this.temp.name + "（複製）";
        this.temp.status = 1;

        article.add(this.temp).then((res) => {
          if (res.code == 200) {
            this.$message.success("複製成功");
          } else {
            this.$message.error(res.message);
          }
          this.getList();
        });
      });
    },
    /* 改狀態 */
    handleChangeStatus(row, status) {
      let confirmTitle = "";
      let successMsg = "";

      if (status == 1) {
        confirmTitle = "確定要取消送審嗎?";
        successMsg = "已取消送審";
      } else if (status == 5) {
        confirmTitle = "確定要下架嗎？";
        successMsg = "已下架";
      }

      this.$confirm(confirmTitle, "提示", {
        confirmButtonText: "確定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        this.temp = Object.assign({}, row);
        this.temp.status = status;

        article.update(this.temp).then((res) => {
          if (res.code == 200) {
            this.$notify({
              title: "成功",
              message: successMsg,
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
          this.getList();
        });
      });
    },
    /* 刪除 */
    handleDelete(row) {
      this.$confirm("是否要刪除該文章?", "提示", {
        confirmButtonText: "確定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        // 多行刪除
        article.del([row.id]).then(() => {
          this.$notify({
            title: "成功",
            message: "刪除成功",
            type: "success",
            duration: 2000,
          });
          this.getList();
        });
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.dialog-mini .el-select {
  width: 100%;
}

.el-date-editor {
  width: 100% !important;
}

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

    &-icon::before {
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
.avatar-thumbnail {
  width: 120px;
  height: 80px;
  margin-top: 10px;

  &-uploader {
    margin-left: 16px;
    width: 120px;
    height: 80px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #fff;
    border: 1px dashed #409eff;
    opacity: 1;
    filter: alpha(opacity=100);
    transition: 0.3s;

    &-icon::before {
      width: 120px;
      height: 80px;
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

.descriptionText {
  font-size: 22px;
}

.el-checkbox {
  margin: 0 10px !important;

  &:first-child {
    margin-left: 10px !important;
  }

  &:last-child {
    margin-right: 10px !important;
  }
}
</style>