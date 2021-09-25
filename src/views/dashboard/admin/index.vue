<template>
  <div class="dashboard-editor-container">

    <panel-group></panel-group>

    <el-row :gutter="20">

      <el-col :span="24">
        <el-card class="box-card">
          <el-tag type="danger">一些說明</el-tag>
          <p></p>
          開源版演示地址：<a href="http://demo.openauth.me:1802">http://demo.openauth.me:1802</a>
          <p></p>
          官方網址：<a href="http://openauth.me">http://openauth.me</a>
          <p></p>
          官方博客：<a href="http://www.cnblogs.com/yubaolee/">http://www.cnblogs.com/yubaolee/</a>
          <p></p>
          系統默認System賬號登錄，可以查看所有權限，如果用其他賬號（如：admin/test）可以查看相應的授權情況。 數據庫密碼明文存儲，不要問為什麼不加密，因為你要問這些賬號的密碼我也記不住啊O(∩_∩)O
          <p></p>
          鄭重提示：為了大家體驗的一致性，數據庫每5分鐘還原一次。
        </el-card>
      </el-col>
      <el-col :span="8">
        <div class="product standard">
          <div class="title">
            <h2> 標準版</h2>
          </div>
          <div class="content">
            <h2>500元</h2>
            <div class="tips">
              <div><i class="el-icon-check"></i>專屬QQ群</div>
              <div><i class="el-icon-check"></i>內部文檔</div>
              <div><i class="el-icon-check"></i>社區VIP1標識</div>
              <div><i class="el-icon-check"></i>專屬授權文件</div>
              <div><i class="el-icon-check"></i>OpenAuth.Pro源碼【不支持升級】</div>
            </div>
          </div>
          <div class="action"><a class="btn std" target="_blank" href="http://openauth.me/question/detail.html?id=a2be2d61-7fcb-4df8-8be2-9f296c22a89c">選擇標準版</a></div>
        </div>
      </el-col>
      <el-col :span="8">
        <div class="product prime">
          <div class="title">
            <h2> 高級版【薦】</h2>
          </div>
          <div class="content">
            <h2>800元</h2>
            <div class="tips">
              <div><i class="el-icon-check"></i>專屬QQ群</div>
              <div><i class="el-icon-check"></i>內部文檔</div>
              <div><i class="el-icon-check"></i>社區VIP2標識</div>
              <div><i class="el-icon-check"></i>專屬授權文件</div>
              <div class="color-prime"><i class="el-icon-check"></i>OpenAuth.Pro源碼</div>
              <div class="color-prime"><i class="el-icon-check"></i>最新的代碼生成工具</div>
              <div class="color-prime"><i class="el-icon-check"></i>企業版專屬文檔</div>
              <div class="color-prime"><i class="el-icon-check"></i>永久免費升級</div>
              <div class="color-prime"><i class="el-icon-check"></i>提供項目管理平台賬號</div>
              <div class="color-prime"><i class="el-icon-check"></i>為個人提供技術咨詢服務</div>
            </div>
          </div>
          <div class="action"><a class="btn premier" target="_blank" href="http://openauth.me/question/detail.html?id=a2be2d61-7fcb-4df8-8be2-9f296c22a89c">選擇高級版</a></div>
        </div>
      </el-col>
      <el-col :span="8">
        <div class="product enterprise">
          <div class="title">
            <h2>企業版</h2>
          </div>
          <div class="content">
            <h2>2000元</h2>
            <div class="tips">
              <div><i class="el-icon-check"></i>專屬QQ群</div>
              <div><i class="el-icon-check"></i>內部文檔</div>
              <div><i class="el-icon-check"></i>社區VIP2標識</div>
              <div><i class="el-icon-check"></i>專屬授權文件</div>
              <div class="color-prime"><i class="el-icon-check"></i>OpenAuth.Pro源碼</div>
              <div class="color-prime"><i class="el-icon-check"></i>最新的代碼生成工具</div>
              <div class="color-prime"><i class="el-icon-check"></i>企業版專屬文檔</div>
              <div class="color-prime"><i class="el-icon-check"></i>永久免費升級</div>
              <div class="color-prime"><i class="el-icon-check"></i>提供項目管理平台賬號</div>
              <div class="color-enterprise"><i class="el-icon-check"></i>為公司開發團隊提供技術咨詢服務</div>
              <div class="color-enterprise"><i class="el-icon-check"></i>擁有獨立的知識產權</div>
              <div class="color-enterprise"><i class="el-icon-check"></i>遠程技術支持</div>
              <div class="color-enterprise"><i class="el-icon-check"></i>無任何分發限制</div>
              <div class="color-enterprise"><i class="el-icon-check"></i>提供正規發票</div>
            </div>
          </div>
          <div class="action"><a class="btn enterprise" target="_blank" href="http://openauth.me/question/detail.html?id=a2be2d61-7fcb-4df8-8be2-9f296c22a89c">選擇企業版</a></div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>


<script>
import PanelGroup from "./components/PanelGroup";

export default {
  name: "dashboard-admin",
  components: {
    PanelGroup,
  },
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.dashboard-editor-container {
  padding: 20px;
  background-color: rgb(240, 242, 245);
  min-height: calc(100vh - 84px);

  .chart-wrapper {
    background: #fff;
    padding: 16px 16px 0;
    margin-bottom: 32px;
  }

  .component-item {
    min-height: 100px;
  }
}

.product {
  max-width: 350px;
  border: 1px solid #dfdfdf;
  padding: 0;
  border-radius: 8px;
  margin-bottom: 20px;
  background-color: white;

  .title {
    padding: 12px;
    text-align: center;
    background-color: #f4f4f4;
    border-radius: 8px 8px 0 0;
  }

  h2 {
    margin: 24px 0 12px;
  }

  .content {
    h2 {
      text-align: center;
      font-size: 30px;
    }

    .tips {
      padding: 0 35px 30px 30px;

      div {
        padding: 8px 0;
        font-size: 15px;

        .el-icon-check {
          width: 30px;
          font-size: 1.5em;
          color: #35affb;
          vertical-align: middle;
        }
      }

      .color-prime {
        color: #338ed6;
        font-weight: 650;

        .el-icon-check {
          color: gray;
        }
      }

      .color-enterprise {
        color: #f56c6c;
        font-weight: 800;

        .el-icon-check {
          color: #67c23a;
        }
      }
    }
  }
}

.action {
  text-align: center;
  padding-bottom: 24px;
  padding: 12px 18px;
  display: flex;
  background: #f4f4f4;

  .btn {
    flex: 1;
    margin: 6px;
    padding: 6px 12px;
    line-height: 26px;
    font-size: 16px;
    background: #fff;
    position: relative;
    cursor: pointer;
    display: inline-block;
    white-space: nowrap;
    border-radius: 4px;
    -ms-touch-action: manipulation;
    touch-action: manipulation;
    font-weight: 700;
    text-decoration: none;
    border: 2px solid #4893ff;
    background-color: transparent;
    color: #4893ff;
    transition: all 0.3s;
  }

  a.btn.std {
    color: #0dafff;
    border-color: #0dafff;
  }

  a.btn.premier {
    color: #d67735;
    border-color: #ffa669;
  }
}

.standard .title {
  background: #eaeaea;
  color: #666;
}

.prime {
  margin: 0 auto;
}

.prime .title {
  background: linear-gradient(#338ed6, #4f6eab);
  color: #fff;
}

.enterprise {
  margin-left: auto;
  margin-right: 0;
}

.enterprise .title {
  background: linear-gradient(#807979, #484a4e);
  color: #fff;
}
</style>
