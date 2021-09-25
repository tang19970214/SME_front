<template>
  <div class="flex-column">
    <sticky :className="'sub-navbar'">
      <div class="filter-container">
        <permission-btn moduleName='feedback' size="mini" v-on:btn-event="onBtnClicked"></permission-btn>
      </div>
    </sticky>

    <div class="app-container flex-item">

      <div class="bg-white" style="height: 100%;">
        <el-table ref="mainTable" height="calc(100% - 52px)" :key='tableKey' :data="tableList" v-loading="listLoading" border fit highlight-current-row style="width: 100%;" @row-click="rowClick" @selection-change="handleSelectionChange">
          <el-table-column prop="status" label="狀態"></el-table-column>
          <el-table-column prop="createUserId" label="回饋帳號"></el-table-column>
          <el-table-column prop="typeName" label="使用者類別"></el-table-column>
          <el-table-column prop="summary" label="回饋概述"></el-table-column>
          <el-table-column label="回饋日期" width="160">
            <template slot-scope="scope">
              <span>{{dataFilter(scope.row.sysFeedBackDate)}}</span>
            </template>
          </el-table-column>

          <el-table-column align="center" :label="'功能'" width="230" class-name="small-padding">
            <template slot-scope="scope">
              <el-button type="primary" size="mini" @click="handleView(scope.row)">詳情</el-button>

            </template>
          </el-table-column>
        </el-table>
        <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="handleCurrentChange" />
      </div>

      <!-- dialog -->
      <el-dialog v-el-drag-dialog class="dialog-mini" width="600px" :title="'新增'" :visible.sync="dialogFormVisible" :close-on-click-modal="false" :close-on-press-escape="false">
        <el-form ref="dataForm" :model="temp" label-position="right" label-width="100px">
          <el-form-item size="small" :label="'請選擇您的身分'">
            <el-select v-model="temp.typeName" clearable placeholder="請選擇身分">
              <el-option v-for="item in identityList" :key="item.id" :label="item.name" :value="item.dtValue"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item size="small" :label="'意見回饋概述'">
            <el-input v-model="temp.summary" maxlength="30"></el-input>
          </el-form-item>
          <el-form-item size="small" :label="'意見回饋'">
            <el-input v-model="temp.sysFeedBack" maxlength="500"></el-input>
          </el-form-item>
        </el-form>

        <div slot="footer" class="h-full flex-items-c-justify-c">
          <el-button size="mini" type="danger" @click="dialogFormVisible = false" plain>確認</el-button>
          <el-button size="mini" type="info" @click="saveFeedback()" plain>回覆</el-button>
        </div>
      </el-dialog>

      <el-dialog v-el-drag-dialog class="dialog-mini" width="600px" :title="'詳情'" :visible.sync="dialogViewVisible" :close-on-click-modal="false" :close-on-press-escape="false">
        <el-form :model="tempView" label-position="right" label-width="100px">
          <el-form-item size="small" :label="'狀態'">
            <span>{{tempView.status}}</span>
          </el-form-item>
          <el-form-item size="small" :label="'回饋帳號'">
            <span>{{tempView.createUserId}}</span>
          </el-form-item>
          <el-form-item size="small" :label="'使用者類別'">
            <span>{{tempView.typeName}}</span>
          </el-form-item>
          <el-form-item size="small" :label="'問題概述'">
            <span>{{tempView.sysFeedBack}}</span>
          </el-form-item>
          <el-form-item size="small" :label="'詳情'">
            <span>{{tempView.summary}}</span>
          </el-form-item>
          <el-form-item size="small" :label="'回覆'">
            <el-input type="textarea" :rows="5" v-model="tempView.replayFeedBack"></el-input>
          </el-form-item>
        </el-form>

        <div slot="footer" class="h-full flex-items-c-justify-c">
          <el-button size="mini" type="danger" @click="dialogViewVisible = false" plain>確認</el-button>
          <el-button size="mini" type="info" @click="replayFeedBack(tempView)" plain :disabled="!tempView.replayFeedBack" v-if="tempView.status == '未回'">回覆</el-button>
        </div>
      </el-dialog>

      <!-- 篩選 -->
      <el-dialog v-el-drag-dialog class="dialog-mini" width="600px" title="篩選" :visible.sync="dialogFilter" :close-on-click-modal="false" :close-on-press-escape="false">
        <el-form :model="listQuery" label-position="right" label-width="100px">
          <el-form-item size="small" :label="'關鍵字'">
            <el-input type="text" v-model="listQuery.key"></el-input>
          </el-form-item>
          <el-form-item size="small" :label="'狀態'">
            <el-select v-model="listQuery.Status">
              <el-option label="未回" value="未回"></el-option>
              <el-option label="已回" value="已回"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item size="small" :label="'使用者類別'">
            <el-select v-model="temp.typeName" clearable placeholder="請選擇使用者類別">
              <el-option v-for="item in identityList" :key="item.id" :label="item.name" :value="item.dtValue"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item size="small" :label="'時間區間'">
            <el-date-picker v-model="datetime_feedback" type="daterange" range-separator="至" start-placeholder="開始時間" end-placeholder="結束時間" value-format="yyyy-MM-dd">
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
import moment from "moment";

import * as categorys from "@/api/categorys";
import * as applications from "@/api/applications";
import * as feedback from "@/api/feedback";
import waves from "@/directive/waves"; // 水波紋指令
import Sticky from "@/components/Sticky";
import permissionBtn from "@/components/PermissionBtn";
import Pagination from "@/components/Pagination";
import elDragDialog from "@/directive/el-dragDialog";

export default {
  components: { Sticky, permissionBtn, Pagination },
  directives: {
    waves,
    elDragDialog,
  },
  data() {
    return {
      tableList: [],
      multipleSelection: [],
      tableKey: 0,
      total: 0,
      listLoading: true,
      listQuery: {
        Status: "",
        TypeName: "",
        SysFeedBackStartDate: "",
        SysFeedBackEndDate: "",
        page: 1,
        limit: 20,
        key: undefined,
        orderby: undefined,
      },
      apps: [],
      /* 篩選 */
      dialogFilter: false,
      datetime_feedback: "",
      /* ---- */
      temp: {
        typeName: "",
        summary: "",
        sysFeedBack: "",
        sysFeedBackDate: "",
        status: "",
      },
      dialogFormVisible: false,

      identityList: [],
      dialogViewVisible: false,
      tempView: {},
    };
  },
  computed: {
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
    this.getIdentityList();
  },
  methods: {
    rowClick(row) {
      this.$refs.mainTable.clearSelection();
      this.$refs.mainTable.toggleRowSelection(row);
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    onBtnClicked(domId) {
      switch (domId) {
        case "btnAdd":
          this.handleCreate();
          break;
        case "btnFilter":
          this.dialogFilter = true;
          break;
        default:
          break;
      }
    },
    getList() {
      this.listLoading = true;
      feedback.getList(this.listQuery).then((res) => {
        this.tableList = res.data;
        this.total = res.count;
        this.listLoading = false;
      });
    },
    getIdentityList() {
      const listQuery = {
        page: 1,
        limit: 999,
        TypeId: "SYS_FEEDBACK",
      };
      categorys.getList(listQuery).then((res) => {
        this.identityList = res.data;
      });
    },
    /* 篩選 */
    filterSearch() {
      this.listQuery.SysFeedBackStartDate =
        this.datetime_feedback?.length > 0 ? this.datetime_feedback[0] : "";
      this.listQuery.SysFeedBackEndDate =
        this.datetime_feedback?.length > 0 ? this.datetime_feedback[1] : "";

      this.getList();
      this.dialogFilter = false;
    },
    /*  */
    handleCurrentChange(val) {
      this.listQuery.page = val.page;
      this.listQuery.limit = val.limit;
      this.getList();
    },
    resetTemp() {
      this.temp = {
        typeName: "",
        summary: "",
        sysFeedBack: "",
        sysFeedBackDate: "",
        status: "",
      };
    },
    handleCreate() {
      // 彈出添加框
      this.resetTemp();
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs["dataForm"].clearValidate();
      });
    },
    saveFeedback() {
      feedback.add(this.temp).then((res) => {
        if (res.code == 200) {
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
        this.getList();
        this.dialogFormVisible = false;
      });
    },

    /* 檢視 */
    handleView(row) {
      this.tempView = Object.assign({}, row);
      this.dialogViewVisible = true;
    },
    /* 回饋 */
    replayFeedBack(row) {
      const replayInfo = {
        id: row.id,
        replayFeedBack: row.replayFeedBack,
      };
      feedback.replayFeedBack(replayInfo).then((res) => {
        if (res.code == 200) {
          this.$notify({
            title: "成功",
            message: "已成功回覆",
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

        this.dialogViewVisible = false;
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