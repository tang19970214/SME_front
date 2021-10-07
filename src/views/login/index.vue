<template>
  <div class="loginPage">
    <div class="loginPage__block">
      <div class="loginPage__block--logo">
        <img src="@/assets/logo.png?imageView2/1/w/80/h/80" alt="LOGO">
        <strong>資金通</strong>
      </div>

      <div class="loginPage__block--introduce">
        <p>您可以使用google帳號登入或註冊</p>
      </div>

      <div class="loginPage__block--googleLogin">
        <g-signin-button :params="googleSignInParams" @success="onSignInSuccess">
          <!-- <button> -->
          <img src="@/assets/login/google-plus.svg" alt="" width="30px">
          Sign in with Google
          <!-- </button> -->
        </g-signin-button>
      </div>

      <div class="loginPage__block--cardGroup">
        <!-- 登入 -->
        <div class="loginCard loginCard__signIn">
          <div class="loginCard__signIn--title">Sign In 登入</div>

          <el-form :model="loginInfo" class="loginCard__form">
            <el-form-item prop="email">
              <el-input size="small" placeholder="請輸入電子郵件" v-model="loginInfo.username">
                <template slot="prepend">
                  <i class="el-icon-arrow-right"></i>
                  <strong>電子郵件</strong>
                </template>
              </el-input>
            </el-form-item>

            <el-form-item prop="password">
              <el-input size="small" placeholder="請輸入密碼" v-model="loginInfo.password" show-password @keyup.enter="handleLogin()">
                <template slot="prepend">
                  <i class="el-icon-arrow-right"></i>
                  <strong>輸入密碼</strong>
                </template>
              </el-input>
            </el-form-item>
          </el-form>

          <div class="loginCard__btn loginCard__signIn--btn">
            <button @click="handleLogin()">登入</button>
          </div>

          <div class="loginCard__operate loginCard__operate--white">
            <el-checkbox v-model="rememberMe" @change="rememberUser">記住帳密</el-checkbox>

            <a>忘記密碼</a>
          </div>
        </div>

        <!-- 註冊 -->
        <div class="loginCard loginCard__newMember">
          <div class="loginCard__newMember--title">New Member <span>註冊</span></div>

          <el-form :model="registerInfo" ref="ruleForm" :rules="rules" class="loginCard__form">
            <el-form-item prop="email">
              <el-input size="small" type="email" placeholder="請輸入電子郵件" v-model="registerInfo.email">
                <template slot="prepend">
                  <i class="el-icon-arrow-right"></i>
                  <strong>電子郵件</strong>
                </template>
              </el-input>
            </el-form-item>

            <el-form-item prop="password">
              <el-input size="small" placeholder="請輸入建立密碼" v-model="registerInfo.password" show-password>
                <template slot="prepend">
                  <i class="el-icon-arrow-right"></i>
                  <strong>建立密碼</strong>
                </template>
              </el-input>
            </el-form-item>
          </el-form>

          <div class="loginCard__operate loginCard__operate--black">
            <el-checkbox v-model="agreeTerms">註冊即同意<b>資金通會員服務條款</b></el-checkbox>
          </div>

          <div class="loginCard__btn loginCard__newMember--btn">
            <button :class="{'disBtn': !agreeTerms}" @click="register()" :disabled="!agreeTerms">建立帳號</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import * as users from "@/api/users";

export default {
  data() {
    let checkEmail = (rule, value, callback) => {
      const mail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/;
      if (!value) {
        return callback(new Error("請填寫註冊線上課程之電子信箱"));
      }
      setTimeout(() => {
        if (mail.test(value)) {
          callback();
        } else {
          callback(new Error("請輸入正確的信箱格式"));
        }
      }, 100);
    };
    return {
      loginInfo: {
        username: "",
        password: "",
      },
      rememberMe: false,

      registerInfo: {
        email: "",
        password: "",
        code: "string",
      },
      rules: {
        email: [{ required: true, validator: checkEmail, trigger: "blur" }],
        password: [{ required: true, message: "必填欄位", trigger: "blur" }],
      },
      agreeTerms: false,

      googleSignInParams: {
        client_id:
          "752935186531-t976aejd5qtanbo6dk17e1g3nna7igv3.apps.googleusercontent.com",
      },
    };
  },
  methods: {
    rememberUser(boolean) {
      if (boolean) {
        if (this.loginInfo.username == "" || this.loginInfo.password == "") {
          this.$notify({
            title: "警告",
            message: "請確實填寫帳號或密碼",
            type: "warning",
            duration: 2000,
          });
          this.rememberMe = false;
        } else {
          window.localStorage.setItem(
            "userInfo",
            JSON.stringify(this.loginInfo)
          );
        }
      } else {
        window.localStorage.removeItem("userInfo");
      }
    },

    handleLogin() {
      if (this.loginInfo.username !== "" || this.loginInfo.password !== "") {
        this.$store.dispatch("Login", this.loginInfo).then(() => {
          this.$notify({
            title: "成功",
            message: "登入成功！",
            type: "success",
            duration: 2000,
          });
          this.$router.push({
            path: "/",
          });
        });
      } else {
        this.$notify({
          title: "錯誤",
          message: "請確實輸入帳號或密碼",
          type: "error",
          duration: 2000,
        });
      }
    },
    register() {
      this.$refs["ruleForm"].validate((valid) => {
        if (valid) {
          users.userRegister(this.registerInfo).then((res) => {
            if (res.code == 200) {
              this.registerInfo = {
                email: "",
                password: "",
                code: "string",
              };
              this.$notify({
                title: "成功",
                message: "註冊成功！",
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
          });
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
  },
  mounted() {
    // eslint-disable-next-line
    if (!!window.localStorage.getItem("userInfo")) {
      this.rememberMe = true;
    }
  },
};
</script>

<style lang="scss" scoped>
$mainColor: #0092c3;
$supColor: #efdbc1;

.loginPage {
  width: 100%;
  height: 100vh;
  background-color: #ebebea;
  display: flex;
  align-items: center;
  justify-content: center;

  &__block {
    width: 90%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    @media (min-width: 768px) {
      width: 90%;
    }

    @media (min-width: 1280px) {
      width: 80%;
    }

    &--logo {
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: center;

      color: $mainColor;
      font-size: 48px;
      letter-spacing: 1.2rem;

      img {
        width: 40px;
        margin-right: 20px;
      }
    }

    &--introduce {
      width: 100%;
      text-align: center;
      font-size: 20px;
    }

    &--googleLogin {
      width: 300px;

      div {
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        background-color: #dd4b39;
        border: none;
        border-radius: 2px;
        font-size: 14px;
        cursor: pointer;
        transition: all 0.6s;

        &:hover {
          letter-spacing: 0.1rem;
        }

        img {
          margin-right: 8px;
        }
      }
    }

    &--cardGroup {
      margin-top: 32px;
      width: 100%;
      display: flex;
      flex-direction: column;

      @media (min-width: 768px) {
        flex-direction: row;
        justify-content: space-around;
      }

      .loginCard {
        width: 100%;
        border: 5px solid white;
        border-radius: 8px;
        padding: 32px 24px;
        margin-bottom: 24px;

        @media (min-width: 768px) {
          width: 45%;
          margin-bottom: 0;
        }

        &__signIn {
          background-color: $mainColor;

          &--title {
            width: 100%;
            font-size: 20px;
            color: white;
          }

          &--btn button {
            color: $mainColor;
            background-color: $supColor;
            letter-spacing: 1rem;
            transition: all 0.6s;

            &:hover {
              letter-spacing: 1.5rem;
            }
          }
        }

        &__newMember {
          background-color: $supColor;

          &--title {
            width: 100%;
            font-size: 20px;
            color: $mainColor;

            span {
              color: black;
            }
          }

          &--btn button {
            color: white;
            background-color: $mainColor;
            letter-spacing: 0.1rem;
            transition: all 0.6s;

            &:hover {
              letter-spacing: 0.5rem;
            }
          }
        }

        &__form {
          margin-top: 8px;

          i {
            background-color: #555;
            border-radius: 100%;
            color: white;
            margin-right: 8px;
            font-size: 8px;
          }

          strong {
            font-size: 12px;
            color: black;
          }

          .el-input {
            margin-top: 8px;

            ::v-deep &-group__prepend {
              padding: 0 8px;
              background-color: white;
            }
          }
        }

        &__btn button {
          margin-top: 8px;
          width: 100%;
          padding: 4px 0;
          border-radius: 4px;
          border: 1px solid white;
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1),
            0 4px 6px -2px rgba(0, 0, 0, 0.05);
          text-align: center;
          font-size: 14px;
          font-weight: bold;
          cursor: pointer;

          &.disBtn {
            cursor: not-allowed !important;
          }
        }

        &__operate {
          margin-top: 8px;
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: space-between;

          a {
            color: white;
            text-decoration: underline;
            font-size: 12px;
          }

          ::v-deep &--white .el-checkbox__label {
            color: white;
          }

          ::v-deep &--black .el-checkbox__label {
            color: black;
          }
        }
      }
    }
  }
}
</style>