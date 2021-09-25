<template>
  <div class="flex-column">
    <sticky :className="'sub-navbar'">
      <div class="filter-container">
        <permission-btn moduleName="planss" size="mini" v-on:btn-event="onBtnClicked"></permission-btn>
      </div>
    </sticky>

    <div class="app-container flex-item">
      <div class="bg-white" style="height: 100%">
        <el-table ref="mainTable" height="calc(100% - 52px)" :key="tableKey" :data="tableList" v-loading="listLoading" border fit highlight-current-row style="width: 100%">
          <el-table-column prop="schemeType" label="方案類型" min-width="150"></el-table-column>
          <el-table-column prop="mainOrg" label="主辦單位"></el-table-column>
          <el-table-column prop="projectName" label="計畫名稱"></el-table-column>
          <el-table-column prop="projectPurpose" label="計畫摘要"></el-table-column>
          <el-table-column prop="area" label="地區"></el-table-column>
          <el-table-column prop="userType" label="對象"></el-table-column>
          <el-table-column prop="acceptanceDate" label="受理時間" width="160"></el-table-column>

          <el-table-column align="center" :label="'功能'" width="230" class-name="small-padding">
            <template slot-scope="scope">
              <el-button v-if="hasButton('btnEdit')" type="primary" size="mini" @click="handleEdit(scope.row)">編輯</el-button>
              <el-button v-if="hasButton('btnDel')" type="danger" size="mini" @click="handleDel(scope.row)">刪除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <pagination v-show="total > 0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="handleCurrentChange" />
      </div>

      <!-- dialog -->
      <el-dialog v-el-drag-dialog class="dialog-mini" width="600px" :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" :close-on-click-modal="false" :close-on-press-escape="false">
        <el-form ref="dataForm" :model="temp" label-position="right" label-width="120px">
          <el-divider content-position="left">篩選</el-divider>
          <el-form-item size="small" :label="'方案類型'">
            <el-select v-model="temp.q1" clearable placeholder="請選擇方案類型">
              <el-option label="融資貸款" value="融資貸款"></el-option>
              <el-option label="政府補助" value="政府補助"></el-option>
              <el-option label="創投資金" value="創投資金"></el-option>
              <el-option label="競賽獎金" value="競賽獎金"></el-option>
              <el-option label="其他" value="其他"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item size="small" :label="'是否已成立公司行號'">
            <el-select v-model="temp.q2" clearable placeholder="請選擇是否已成立公司行號">
              <el-option label="不限" value="不限"></el-option>
              <el-option label="是" value="是"></el-option>
              <el-option label="否" value="否"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item size="small" :label="'登記日期'">
            <el-select v-model="temp.q3" clearable placeholder="請選擇登記日期">
              <el-option label="不限" value="不限"></el-option>
              <el-option label="需滿" value="需滿"></el-option>
              <el-option label="需未滿" value="需未滿"></el-option>
            </el-select>

            <div class="flex-items-center" v-if="temp.q3 == '需滿' || temp.q3 == '需未滿'">
              <el-input v-model="temp.q3Val"></el-input>
              <span>年</span>
            </div>
          </el-form-item>
          <el-form-item size="small" :label="'登記區域'">
            <el-select v-model="temp.q4" multiple clearable placeholder="請選擇登記區域">
              <el-option label="不限" value="不限"></el-option>
              <el-option v-for="(item, idx) in countyData" :key="idx" :label="item.label" :value="item.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item size="small" :label="'登記資本額'">
            <el-select v-model="temp.q5" multiple clearable placeholder="請選擇登記資本額">
              <el-option label="不限" value="不限"></el-option>
              <el-option label="需大於" value="需大於"></el-option>
              <el-option label="需小於" value="需小於"></el-option>
            </el-select>

            <el-input v-model="temp.q5Val" v-if="temp.q5 == '需大於' || temp.q5 == '需小於'"></el-input>
          </el-form-item>
          <el-form-item size="small" :label="'資金需求範圍'">
            <el-select v-model="temp.q6" multiple clearable placeholder="請選擇資金需求範圍">
              <el-option label="不限" value="不限"></el-option>
              <el-option label="50萬以下" value="50萬以下"></el-option>
              <el-option label="50-100萬" value="50-100萬"></el-option>
              <el-option label="100-300萬" value="100-300萬"></el-option>
              <el-option label="300-500萬" value="300-500萬"></el-option>
              <el-option label="500-1000萬" value="500-1000萬"></el-option>
              <el-option label="1000萬以上" value="1000萬以上"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item size="small" :label="'資金用途'">
            <el-select v-model="temp.q7" multiple clearable placeholder="請選擇資金用途">
              <el-option label="不限" value="不限"></el-option>
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
          <el-form-item size="small" :label="'產業類別'">
            <el-select v-model="temp.q8" multiple clearable placeholder="請選擇產業類別">
              <el-option label="不限" value="不限"></el-option>
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

          <el-divider content-position="left">模塊</el-divider>
          <el-form-item size="small" :label="'方案類型'">
            <el-select v-model="temp.schemeType" clearable placeholder="請選擇方案類型">
              <el-option label="融資貸款" value="融資貸款"></el-option>
              <el-option label="政府補助" value="政府補助"></el-option>
              <el-option label="創投資金" value="創投資金"></el-option>
              <el-option label="競賽獎金" value="競賽獎金"></el-option>
              <el-option label="其他" value="其他"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item size="small" :label="'主辦單位'">
            <el-input type="text" v-model="temp.mainOrg"></el-input>
          </el-form-item>
          <el-form-item size="small" :label="'計畫名稱'">
            <el-input type="text" v-model="temp.projectName"></el-input>
          </el-form-item>
          <el-form-item size="small" :label="'計畫宗旨'">
            <el-input type="text" v-model="temp.projectPurpose"></el-input>
          </el-form-item>
          <el-form-item size="small" :label="'計畫摘要'">
            <el-input type="text" v-model="temp.summary"></el-input>
          </el-form-item>
          <el-form-item size="small" :label="'對象'">
            <el-select v-model="temp.userType" multiple clearable placeholder="請選擇對象">
              <el-option label="一般企業" value="一般企業"></el-option>
              <el-option label="學生" value="學生"></el-option>
              <el-option label="原住民" value="原住民"></el-option>
              <el-option label="客庄" value="客庄"></el-option>
              <el-option label="農民" value="農民"></el-option>
              <el-option label="退役軍人" value="退役軍人"></el-option>
              <el-option label="身心障礙" value="身心障礙"></el-option>
              <el-option label="文創業者" value="文創業者"></el-option>
              <el-option label="尚未登記公司者" value="尚未登記公司者"></el-option>
              <el-option label="其他" value="其他"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item size="small" :label="'地區'">
            <el-select v-model="temp.area" multiple clearable placeholder="請選擇地區">
              <el-option label="不限" value="不限"></el-option>
              <el-option v-for="(item, idx) in countyData" :key="idx" :label="item.label" :value="item.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item size="small" :label="'補助對象'">
            <el-input type="text" v-model="temp.subsidyObject"></el-input>
          </el-form-item>
          <el-form-item size="small" :label="'資金額度'">
            <el-input type="text" v-model="temp.amount"></el-input>
          </el-form-item>
          <el-form-item size="small" :label="'申請方式'">
            <!-- <el-input type="text" v-model="temp.applyMethod"></el-input> -->
            <ckeditor v-model="temp.applyMethod" :value="temp.applyMethod" :config="setConfig" />
          </el-form-item>
          <el-form-item size="small" :label="'備註'">
            <el-input type="text" v-model="temp.remark"></el-input>
          </el-form-item>
          <el-form-item size="small" :label="'受理時間'">
            <el-select v-model="temp.acceptanceDate" clearable placeholder="請選擇受理時間" @change="setAcceptanceDate">
              <el-option label="隨到隨審" value="隨到隨審"></el-option>
              <el-option label="受理時間:_年_月_日-_年_月_日" value="受理時間:_年_月_日-_年_月_日"></el-option>
            </el-select>

            <el-date-picker v-model="dateRange" v-if="temp.acceptanceDate == '受理時間:_年_月_日-_年_月_日'" type="daterange" range-separator="至" start-placeholder="開始日期" end-placeholder="結束日期" value-format="yyyy-MM-dd">
            </el-date-picker>
          </el-form-item>
          <el-form-item size="small" :label="'諮詢窗口'">
            <el-input type="text" v-model="temp.consultation"></el-input>
          </el-form-item>
          <el-form-item size="small" :label="'相關網站名稱'">
            <el-input type="text" v-model="temp.webName"></el-input>
          </el-form-item>
          <el-form-item size="small" :label="'相關網站連結'">
            <el-input type="text" v-model="temp.webLink"></el-input>
          </el-form-item>
        </el-form>

        <div slot="footer" class="h-full flex-items-c-justify-c">
          <el-button size="mini" type="danger" @click="dialogFormVisible = false" plain>取消</el-button>
          <el-button size="mini" type="info" @click="saveProgram()" plain v-if="dialogStatus == 'create'">新增</el-button>
          <el-button size="mini" type="info" @click="updateProgram()" plain v-else>確認</el-button>
        </div>
      </el-dialog>

      <!-- 篩選 -->
      <el-dialog v-el-drag-dialog class="dialog-mini" width="600px" title="篩選" :visible.sync="dialogFilter" :close-on-click-modal="false" :close-on-press-escape="false">
        <el-form :model="listQuery" label-position="right" label-width="100px">
          <el-form-item size="small" :label="'方案類型'">
            <el-select v-model="listQuery.SchemeType" clearable placeholder="請選擇方案類型">
              <el-option label="融資貸款" value="融資貸款"></el-option>
              <el-option label="政府補助" value="政府補助"></el-option>
              <el-option label="創投資金" value="創投資金"></el-option>
              <el-option label="競賽獎金" value="競賽獎金"></el-option>
              <el-option label="其他" value="其他"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item size="small" :label="'主辦單位'">
            <el-input v-model="listQuery.MainOrg"></el-input>
          </el-form-item>
          <el-form-item size="small" :label="'地區'">
            <el-select v-model="listQuery.Area" multiple clearable placeholder="請選擇地區">
              <el-option label="不限" value="不限"></el-option>
              <el-option v-for="(item, idx) in countyData" :key="idx" :label="item.label" :value="item.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item size="small" :label="'對象'">
            <el-select v-model="listQuery.UserType" multiple clearable placeholder="請選擇對象">
              <el-option label="一般企業" value="一般企業"></el-option>
              <el-option label="學生" value="學生"></el-option>
              <el-option label="原住民" value="原住民"></el-option>
              <el-option label="客庄" value="客庄"></el-option>
              <el-option label="農民" value="農民"></el-option>
              <el-option label="退役軍人" value="退役軍人"></el-option>
              <el-option label="身心障礙" value="身心障礙"></el-option>
              <el-option label="文創業者" value="文創業者"></el-option>
              <el-option label="尚未登記公司者" value="尚未登記公司者"></el-option>
              <el-option label="其他" value="其他"></el-option>
            </el-select>
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

import { Counties } from "@/assets/taiwan";
// import * as categorys from "@/api/categorys";
import * as planss from "@/api/planss";
import waves from "@/directive/waves"; // 水波紋指令
import Sticky from "@/components/Sticky";
import permissionBtn from "@/components/PermissionBtn";
import Pagination from "@/components/Pagination";
import elDragDialog from "@/directive/el-dragDialog";

export default {
  mixins: [pbMixins],
  components: { Sticky, permissionBtn, Pagination },
  directives: {
    waves,
    elDragDialog,
  },
  data() {
    return {
      countyData: Counties,

      tableList: [],
      tableKey: 0,
      total: 0,
      listLoading: true,
      listQuery: {
        SchemeType: "",
        MainOrg: "",
        UserType: "",
        Area: "",
        // Status: "",
        // TypeName: "",
        // SysProgramStartDate: "",
        // SysProgramEndDate: "",
        page: 1,
        limit: 20,
        key: undefined,
        orderby: undefined,
      },
      temp: {
        q1: "",
        q2: "",
        q3: "",
        q3Val: 0,
        q4: "",
        q5: "",
        q5Val: 0,
        q6: "",
        q7: "",
        q8: "",
        schemeType: "",
        mainOrg: "",
        projectName: "",
        projectPurpose: "",
        subsidyObject: "",
        amount: "",
        applyMethod: "",
        remark: "",
        userType: "",
        area: "",
        summary: "",
        acceptanceDate: "",
        consultation: "",
        webName: "",
        webLink: "",
      },
      dateRange: "",
      dialogStatus: "",
      textMap: {
        update: "編輯",
        create: "新增",
      },
      dialogFormVisible: false,

      /* 篩選 */
      dialogFilter: false,

      setConfig: {
        readOnly: false,
        extraPlugins: "button, panelbutton, colorbutton",
      },
    };
  },
  computed: {
    dataFilter() {
      return (datetime) => {
        return !!datetime ? moment(datetime).format("YYYY-MM-DD") : "無"; // eslint-disable-line
      };
    },
  },
  created() {
    this.getList();
  },
  methods: {
    onBtnClicked(domId) {
      switch (domId) {
        case "btnFilter":
          console.log(this.listQuery);
          // eslint-disable-next-line
          this.listQuery.Area = !!this.listQuery.Area
            ? this.listQuery.Area.split(",")
            : [];
          // eslint-disable-next-line
          this.listQuery.UserType = !!this.listQuery.UserType
            ? this.listQuery.UserType.split(",")
            : [];

          this.dialogFilter = true;
          break;
        case "btnAdd":
          this.handleCreate();
          break;
        default:
          break;
      }
    },
    getList() {
      this.listLoading = true;
      planss.getList(this.listQuery).then((res) => {
        this.tableList = res.data;
        this.total = res.count;
        this.listLoading = false;
      });
    },
    handleCurrentChange(val) {
      this.listQuery.page = val.page;
      this.listQuery.limit = val.limit;
      this.getList();
    },
    resetTemp() {
      this.temp = {
        q1: "",
        q2: "",
        q3: "",
        q3Val: 0,
        q4: "",
        q5: "",
        q5Val: 0,
        q6: "",
        q7: "",
        q8: "",
        schemeType: "",
        mainOrg: "",
        projectName: "",
        projectPurpose: "",
        subsidyObject: "",
        amount: "",
        applyMethod: "",
        remark: "",
        userType: "",
        acceptanceDate: "",
        consultation: "",
        webName: "",
        webLink: "",
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
    saveProgram() {
      //   console.log(this.dateRange);
      if (this.temp.acceptanceDate == "受理時間:_年_月_日-_年_月_日") {
        this.temp.acceptanceDate =
          "受理時間:" + this.dateRange[0] + "-" + this.dateRange[1];
      }
      // this.temp.q1 = this.temp.q1.join(" ");
      this.temp.q4 = this.temp.q4.join(",");
      this.temp.q5 = this.temp.q5.join(",");
      this.temp.q6 = this.temp.q6.join(",");
      this.temp.q7 = this.temp.q7.join(",");
      this.temp.q8 = this.temp.q8.join(",");
      this.temp.userType = this.temp.userType.join(",");
      this.temp.area = this.temp.area.join(",");
      // console.log(this.temp);
      planss.add(this.temp).then((res) => {
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

    setAcceptanceDate(val) {
      if (val !== "隨到隨審") {
        this.dateRange = [
          moment().format("YYYY-MM-DD"),
          moment().format("YYYY-MM-DD"),
        ];
      } else {
        this.dateRange = [];
      }
    },
    /* 編輯 */
    handleEdit(row) {
      // 彈出編輯框
      this.temp = Object.assign({}, row); // copy obj
      // this.temp.q1 = this.temp.q1.split(" ");
      this.temp.q4 = this.temp.q4.split(",");
      this.temp.q5 = this.temp.q5.split(",");
      this.temp.q6 = this.temp.q6.split(",");
      this.temp.q7 = this.temp.q7.split(",");
      this.temp.q8 = this.temp.q8.split(",");
      this.temp.userType = this.temp.userType.split(",");
      this.temp.area = this.temp.area?.split(",");

      this.dialogStatus = "update";
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs["dataForm"].clearValidate();
      });
    },
    updateProgram() {
      if (this.temp.acceptanceDate == "受理時間:_年_月_日-_年_月_日") {
        this.temp.acceptanceDate =
          "受理時間:" + this.dateRange[0] + "-" + this.dateRange[1];
      }
      // this.temp.q1 = this.temp.q1.join(" ");
      this.temp.q4 = this.temp.q4.join(",");
      this.temp.q5 = this.temp.q5.join(",");
      this.temp.q6 = this.temp.q6.join(",");
      this.temp.q7 = this.temp.q7.join(",");
      this.temp.q8 = this.temp.q8.join(",");
      this.temp.userType = this.temp.userType.join(",");
      this.temp.area = this.temp.area.join(",");

      planss.update(this.temp).then((res) => {
        if (res.code == 200) {
          this.$notify({
            title: "成功",
            message: "修改成功",
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
    handleDel(row) {
      this.$confirm("確定要刪除嗎？", "提示", {
        confirmButtonText: "確定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        planss.del([row.id]).then((res) => {
          if (res.code == 200) {
            this.getList();
            this.$message({
              type: "success",
              message: "删除成功!",
            });
          } else {
            this.$message({
              type: "error",
              message: res.message,
            });
          }
        });
      });
    },
    filterSearch() {
      this.listQuery.Area = this.listQuery.Area.join(",");
      this.listQuery.UserType = this.listQuery.UserType.join(",");
      this.getList();
      this.dialogFilter = false;
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