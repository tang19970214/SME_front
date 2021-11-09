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

            <a @click="forgetPassword()">忘記密碼</a>
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
                <el-button :style="{'color': timer !==null ? 'gray' : 'black'}" slot="append" @click="sendCode(registerInfo.email)" :disabled="timer !== null">{{reciprocalTime == 30 ? "" : `${reciprocalTime} `}}傳送驗證碼</el-button>
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

            <el-form-item prop="code">
              <el-input size="small" placeholder="請輸入驗證碼" v-model="registerInfo.code">
                <template slot="prepend">
                  <i class="el-icon-arrow-right"></i>
                  <strong>驗證碼</strong>
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

    <!-- dialog -->
    <el-dialog title="忘記密碼" :visible.sync="dialogVisible" width="40%">
      <!-- <el-form :model="registerInfo" ref="ruleForm" :rules="rules" class="loginCard__form">
        <el-form-item prop="email">
          <el-input size="small" type="email" placeholder="請輸入電子郵件" v-model="registerInfo.email">
            <template slot="prepend">
              <i class="el-icon-arrow-right"></i>
              <strong>電子郵件</strong>
            </template>
            <el-button slot="append" @click="sendCode(registerInfo.email)">傳送驗證碼</el-button>
          </el-input>
        </el-form-item>
      </el-form> -->
      <label>請輸入您的電子信箱</label>
      <el-input size="small" v-model="yourEmail"></el-input>

      <span slot="footer">
        <el-button @click="dialogVisible = false" size="small">取消</el-button>
        <el-button type="primary" @click="setNewPassword()" size="small">確定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import * as users from "@/api/users";

export default {
  data() {
    let checkEmail = (rule, value, callback) => {
      const mail = /^([A-Za-z0-9_\-.])+@([A-Za-z0-9_\-.])+\.([A-Za-z]{2,4})$/;
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
    let checkPWD = (rule, value, callback) => {
      // 至少12碼、英文、大小寫、特殊符號混合
      if (value) {
        let reg1 = new RegExp(
          /^(?=.*[A-Z])(?=.*[a-z])(?=.*[!@#$%^&*?-_])[A-Za-z!@#$%^&*?-_]{12,}$/
        );
        if (value.search(reg1) !== -1) {
          return callback();
        } else {
          return callback(
            new Error("密碼格式錯誤，至少12碼、英文大小寫、特殊符號混合")
          );
        }
      } else {
        return callback(new Error("必填欄位"));
      }
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
        code: "",
      },
      rules: {
        email: [{ required: true, validator: checkEmail, trigger: "blur" }],
        password: [{ required: true, validator: checkPWD }],
        code: [{ required: true, message: "必填欄位", trigger: "blur" }],
      },
      agreeTerms: false,

      googleSignInParams: {
        client_id:
          "752935186531-t976aejd5qtanbo6dk17e1g3nna7igv3.apps.googleusercontent.com",
      },

      timer: null,
      reciprocalTime: 30,

      // dialog
      dialogVisible: false,
      yourEmail: "",
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
      // console.log(this.registerInfo);
      this.$refs["ruleForm"].validate((valid) => {
        if (valid) {
          users.userRegister(this.registerInfo).then((res) => {
            if (res.code == 200) {
              this.registerInfo = {
                email: "",
                password: "",
                code: "",
              };
              this.$notify({
                title: "成功",
                message: "註冊成功，請使用新的帳密進行登入！",
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
    // 忘記密碼
    forgetPassword() {
      this.yourEmail = this.loginInfo.username;
      this.dialogVisible = true;
    },
    // 傳送驗證碼
    sendCode(email) {
      users.EmailVerifySend({ email: email });
      this.timer = setInterval(this.countTimer, 1000);
    },
    countTimer() {
      if (this.reciprocalTime == 0) {
        clearInterval(this.timer);
        this.reciprocalTime = 30;
        this.timer = null;
      } else {
        this.reciprocalTime--;
      }
    },

    onSignInSuccess(googleUser) {
      const getIdToken = googleUser.Zb.id_token || googleUser.$b.id_token;
      // console.log(googleUser, getIdToken);

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

    setNewPassword() {
      users.ForgetPwd({ email: this.yourEmail }).then((res) => {
        if (res.code == 200) {
          this.$notify({
            title: "成功",
            message: "請至電子新信箱收信後再重新登入",
            type: "success",
            duration: 3000,
          });
        } else {
          this.$notify({
            title: "錯誤",
            message: res.message,
            type: "error",
            duration: 2000,
          });
        }
        this.dialogVisible = false;
      });
    },
  },
  mounted() {
    // eslint-disable-next-line
    if (!!window.localStorage.getItem("userInfo")) {
      this.rememberMe = true;
    }
  },
  beforeDestroy() {
    clearInterval(this.timer);
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