<template>
  <el-menu class="navbar" mode="horizontal">
    <div class="logo">
      <span class="logo__bg">
        <a href="http://sme.yummydesign.com.tw/" target="_blank"><img class="user-avatar" :src="logo" />資金通</a>
      </span>
    </div>

    <hamburger class="hamburger-container" :toggleClick="toggleSideBar" :isActive="sidebar.opened"></hamburger>

    <div class="avatar-container">
      <div class="avatar-wrapper flex-items-c-justify-c">
        歡迎您，{{ name }}
        <g-signin-button class="googleBtn mx-8" :params="googleSignInParams" @success="handleGoogleBind">
          <span>綁定Google</span>
        </g-signin-button>
        <button class="avatar-wrapper-btn" @click="logout()">登出</button>
      </div>
    </div>
  </el-menu>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import Hamburger from "@/components/Hamburger";
import logo from "@/assets/logo.png?imageView2/1/w/80/h/80";

import * as login from "@/api/login";

export default {
  data: function () {
    return {
      logo: logo,
      // theme: 1,
      googleSignInParams: {
        client_id: "752935186531-t976aejd5qtanbo6dk17e1g3nna7igv3.apps.googleusercontent.com",
      },
    };
  },
  components: {
    Hamburger,
  },
  computed: {
    ...mapGetters(["sidebar", "isIdentityAuth", "name", "themeStatus"]),
  },
  // watch: {
  //   theme() {
  //     this.toggleClass(document.body, "custom-theme");
  //   },
  // },
  mounted() {
    // this.theme = Number(this.themeStatus);
    // this.toggleClass(document.body, "custom-theme");
  },
  methods: {
    ...mapActions(["signOutOidc", "saveTheme"]),
    // toggleClass(element, className) {
    //   if (!element || !className) {
    //     return;
    //   }
    //   let classString = element.className;
    //   const nameIndex = classString.indexOf(className);
    //   if (nameIndex === -1) {
    //     classString += "" + className;
    //   } else {
    //     classString =
    //       classString.substr(0, nameIndex) +
    //       classString.substr(nameIndex + className.length);
    //   }
    //   element.className = this.theme === 1 ? classString : "";
    //   this.saveTheme(this.theme);
    // },
    toggleSideBar() {
      this.$store.dispatch("ToggleSideBar");
    },
    logout() {
      if (this.isIdentityAuth) {
        this.signOutOidc();
      } else {
        this.$store.dispatch("LogOut").then(() => {
          location.reload(); // 為了重新實例化vue-router對象 避免bug
        });
      }
    },
    // handleGoProfile() {
    //   this.$router.push("/profile");
    // },
    handleGoogleBind(googleUser) {
      const getIdToken = googleUser.Zb.id_token || googleUser.$b.id_token;
      login.GoogleBind({ token_id: getIdToken }).then((res) => {
        if (res.code == 200) {
          this.$notify({
            title: "成功",
            message: "綁定成功",
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
        // console.log(res);
      });
    },
    // onSignInError(error) {
    //   console.log("OH NOES", error);
    // },
    // handleCommand(name) {
    //   if (!name) return;
    //   this[name]();
    // },

    /* 意見回饋 */
    // handleCreate() {
    //   this.$emit("handleCreate");
    // },
  },
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.mx-8 {
  margin-left: 8px;
  margin-right: 8px;
}

.googleBtn {
  background: #0161a5;
  padding: 0 8px;
  font-size: 12px;
  height: 21px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  cursor: pointer;
  transition: all 0.5s;

  &:hover {
    background: #0076c8;
  }
}
</style>
