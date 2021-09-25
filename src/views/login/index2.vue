<template>
  <div class="login-container">
    <div class="content">
      <img class="leftImg" src="~@/assets/login/left.png" alt="">
      <el-form class="login-form" autoComplete="on" :model="loginForm" :rules="loginRules" ref="loginForm" label-position="left">
        <h3 class="title">資金通</h3>
        <p class="tips"></p>
        <!-- <p class="tips">OpenAuth.Core企業版</p> -->
        <el-form-item prop="username">
          <span class="svg-container svg-container_login">
            <svg-icon icon-class="user" />
          </span>
          <el-input name="username" type="text" v-model="loginForm.username" autoComplete="on" placeholder="請輸入登錄帳號" />
        </el-form-item>
        <el-form-item prop="password">
          <span class="svg-container">
            <svg-icon icon-class="password"></svg-icon>
          </span>
          <el-input name="password" :type="pwdType" @keyup.enter.native="handleLogin" v-model="loginForm.password" autoComplete="on" placeholder="請輸入密碼"></el-input>
          <span class="show-pwd" @click="showPwd">
            <svg-icon :icon-class="pwdType === 'password' ? 'eye' : 'eye-open'" />
          </span>
        </el-form-item>
        <!-- <div class="tips" v-if="isIdentityAuth">
          <router-link to="/oidcRedirect">
            <el-badge is-dot>接口服務器啟用了Oauth認證，請點擊這裡登錄</el-badge>
          </router-link>
        </div> -->
        <el-form-item>
          <el-button v-waves type="primary" style="width:100%;background:#4452D5;font-size: 24px;height: 50px;" :loading="loading" @click.native.prevent="handleLogin">
            登 入
          </el-button>
        </el-form-item>

        <strong>Or</strong>

        <el-form-item>
          <g-signin-button class="flex-items-c-justify-c py-8 pointer" :params="googleSignInParams" @success="onSignInSuccess" @error="onSignInError">
            <svg id="Capa_1" enable-background="new 0 0 512 512" height="25" viewBox="0 0 512 512" width="25" xmlns="http://www.w3.org/2000/svg">
              <g>
                <path d="m420.7 450.7c-44.4 37.5-101.999 61.3-164.7 61.3-93.3 0-175.201-51.4-219.6-126.4l16.622-76.622 73.678-13.678c17.1 55.199 68.699 95.7 129.3 95.7 29.399 0 56.7-9.3 79.2-25.8l70.8 10.8z" fill="#59c36a" />
                <path d="m420.7 450.7-14.7-74.7-70.8-10.8c-22.5 16.5-49.801 25.8-79.2 25.8v121c62.701 0 120.3-23.8 164.7-61.3z" fill="#00a66c" />
                <g id="Connected_Home_1_">
                  <g>
                    <g>
                      <g>
                        <path d="m121 256c0 13.799 2.1 26.999 5.7 39.3l-90.3 90.3c-22.5-37.8-36.4-82.201-36.4-129.6 0-47.401 13.9-91.8 36.4-129.6l72.473 12.473 17.827 77.827c-3.6 12.299-5.7 25.499-5.7 39.3z" fill="#ffda2d" />
                      </g>
                    </g>
                  </g>
                </g>
                <path d="m512 256c0 77.999-36.099 147.9-91.3 194.7l-85.5-85.5c17.399-12.601 32.1-29.401 41.7-49.2h-120.9c-8.401 0-15-6.601-15-15v-90c0-8.401 6.599-15 15-15h236.8c7.2 0 13.5 5.099 14.7 12.299 3 15.601 4.5 31.8 4.5 47.701z" fill="#4086f4" />
                <path d="m376.901 316c-9.6 19.799-24.302 36.599-41.7 49.2l85.499 85.5c55.201-46.8 91.3-116.7 91.3-194.7 0-15.901-1.5-32.1-4.501-47.701-1.199-7.2-7.5-12.299-14.7-12.299h-236.799v120z" fill="#4175df" />
                <path d="m424.9 71.499c.3 4.2-1.5 8.101-4.2 11.1l-64.2 63.9c-5.099 5.4-13.499 6-19.499 1.5-23.702-17.699-51.602-26.999-81.001-26.999-60.601 0-112.2 40.499-129.3 95.7l-90.3-90.3c44.399-75 126.3-126.4 219.6-126.4 59.7 0 117.9 22 163.5 60.399 3.3 2.701 5.1 6.9 5.4 11.1z" fill="#ff641a" />
                <path d="m337 147.999c6 4.501 14.399 3.9 19.499-1.5l64.2-63.9c2.701-2.999 4.501-6.899 4.2-11.1s-2.1-8.399-5.4-11.1c-45.599-38.399-103.799-60.399-163.499-60.399v121c29.399 0 57.299 9.3 81 26.999z" fill="#f03800" />
              </g>
            </svg>
          </g-signin-button>

        </el-form-item>
        <!-- <p class="tips"> 默認System登錄後，你可以無法無天</p>
        <p class="tips">admin/admin登錄後，會少一點權限，資源管理/分類管理的字段會少一點</p>
        <p class="tips">test/test登錄後，權限會更少,資源管理/分類管理的字段也更少</p> -->
      </el-form>
    </div>

    <!-- <div class="tips">
        -----------------------------------------------------------------------------------------------
      </div> -->

    <!-- <div class="tips">
        默認System登錄後，你可以無法無天
      </div>
      <div class="tips">
        admin/admin登錄後，會少一點權限，資源管理/分類管理的字段會少一點
      </div>
      <div class="tips">
        test/test登錄後，權限會更少,資源管理/分類管理的字段也更少
      </div> -->
  </div>
</template>

<script>
import waves from "@/directive/waves"; // 水波紋指令
import { mapGetters } from "vuex";

export default {
  name: "login",
  directives: {
    waves,
  },
  data() {
    const validateUsername = (rule, value, callback) => {
      if (value.length <= 0) {
        callback(new Error("用戶名不能為空"));
      } else {
        callback();
      }
    };
    const validatePass = (rule, value, callback) => {
      if (value.length <= 0) {
        callback(new Error("密碼不能為空"));
      } else {
        callback();
      }
    };
    return {
      loginForm: {
        username: "",
        password: "",
      },
      loginRules: {
        username: [
          {
            required: true,
            trigger: "blur",
            validator: validateUsername,
          },
        ],
        password: [
          {
            required: true,
            trigger: "blur",
            validator: validatePass,
          },
        ],
      },
      loading: false,
      pwdType: "password",

      googleSignInParams: {
        client_id:
          "752935186531-t976aejd5qtanbo6dk17e1g3nna7igv3.apps.googleusercontent.com",
      },
    };
  },
  computed: {
    ...mapGetters(["isIdentityAuth"]),
  },
  methods: {
    showPwd() {
      if (this.pwdType === "password") {
        this.pwdType = "";
      } else {
        this.pwdType = "password";
      }
    },
    handleLogin() {
      this.$refs.loginForm.validate((valid) => {
        if (valid) {
          this.loading = true;
          this.$store
            .dispatch("Login", this.loginForm)
            .then(() => {
              this.loading = false;
              this.$notify({
                title: "成功",
                message: "登入成功！",
                type: "success",
                duration: 2000,
              });
              this.$router.push({
                path: "/",
              });
            })
            .catch(() => {
              this.loading = false;
            });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },

    onSignInSuccess(googleUser) {
      const getIdToken = googleUser.Xb?.id_token;

      this.$store.dispatch("GoogleLogin", getIdToken).then(() => {
        this.$notify({
          title: "成功",
          message: "登入成功！",
          type: "success",
          duration: 2000,
        });
        this.$router.push({ path: "/" });
      });
    },
    onSignInError(error) {
      console.log("OH NOES", error);
    },
  },
};
</script>

<style rel="stylesheet/scss" lang="scss">
$bg: #2d3a4b;
$light_gray: #eee;
$color_balck: #333;

/* reset element-ui css */
.login-container {
  .el-input {
    display: inline-block;
    height: 47px;
    width: 85%;
    input {
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      padding: 12px 5px 12px 15px;
      color: $color_balck;
      height: 47px;

      &:-webkit-autofill {
        transition: background-color 5000s ease-in-out 0s;
      }
    }
  }
  .el-form-item {
    margin-bottom: 35px;
    border-radius: 5px;
    color: #454545;
    .el-form-item__content {
      background: #fff;
      border: 1px solid rgba(223, 223, 223, 1);
    }
    &:last-child {
      padding-top: 20px;
      .el-form-item__content {
        border: none;
      }
    }
  }
}
</style>

<style rel="stylesheet/scss" lang="scss" scoped>
@media screen and (max-width: 1150px) {
  .leftImg {
    width: 450px !important;
  }
}
@media screen and (max-width: 1010px) {
  .leftImg {
    width: 380px !important;
  }
}
@media screen and (max-width: 940px) {
  .leftImg {
    display: block;
    width: 260px !important;
    margin: 0 auto !important;
  }
}
$dark_gray: #d1dfe8;

.login-container {
  height: 100%;
  background: url("~@/assets/login/bg.png") no-repeat;
  background-color: #ebebea;
  background-position: 0 0;
  background-size: 62% 100%;
  text-align: center;
  &:before {
    content: "";
    display: inline-block;
    height: 100%;
    vertical-align: middle;
  }
  .content {
    display: inline-block;
    vertical-align: middle;
    > img {
      width: 568px;
      margin-right: 150px;
      vertical-align: middle;
    }
    .login-form {
      display: inline-block;
      width: 400px;
      vertical-align: middle;
    }
  }

  .svg-container {
    color: $dark_gray;
    vertical-align: middle;
    width: 33px;
    display: inline-block;
    font-size: 22px;
    &_login {
      font-size: 31px;
    }
  }

  .title {
    font-size: 26px;
    font-weight: 400;
    color: #4452d5;
    margin: 0;
    text-align: left;
  }
  .tips {
    color: #959595;
    font-size: 14px;
    margin-top: 0;
    margin-bottom: 40px;
    text-align: left;
  }

  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
    font-size: 24px;
  }
}
</style>
