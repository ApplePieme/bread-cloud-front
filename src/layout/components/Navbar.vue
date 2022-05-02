<template>
  <div class="navbar">
    <hamburger :is-active="sidebar.opened" class="hamburger-container" @toggleClick="toggleSideBar" />

    <breadcrumb class="breadcrumb-container" />

    <div class="right-menu">
      <div style="heigh:100px;float:left;margin-right:30px;">
        <el-button type="primary" size="mini" round @click.native="dialogUploadVisible = true">上传文件</el-button>
        <el-button type="primary" size="mini" round>新建目录</el-button>
      </div>
      <el-dropdown class="avatar-container" trigger="click">
        
        <div class="avatar-wrapper">
          <img :src="avatar" class="user-avatar">
          <i class="el-icon-caret-bottom" />
        </div>
        <el-dropdown-menu slot="dropdown" class="user-dropdown">
          <el-dropdown-item @click.native="getUserInfo">
            个人信息
          </el-dropdown-item>
          <el-dropdown-item @click.native="openModifiedPasswordDialog">
            修改密码
          </el-dropdown-item>
          <el-dropdown-item @click.native="logout">
            退出
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>

    <el-dialog
      title="上传文件"
      :visible.sync="dialogUploadVisible"
      width="25%"
      align="center">
      <el-upload
        class="upload-demo"
        drag
        action="https://jsonplaceholder.typicode.com/posts/"
        multiple>
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
      </el-upload>
    </el-dialog>

    <el-dialog title="个人信息" :visible.sync="dialogInfoVisible" width=500px>
      <div align=center style="margin-bottom: 30px;">
        <el-upload
          class="avatar-uploader"
          action="https://jsonplaceholder.typicode.com/posts/"
          :show-file-list="false"
          :on-success="handleAvatarSuccess">
          <img v-if="userInfo.avatar" :src="userInfo.avatar" class="avatar">
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
      </div>
      <el-form :model="userInfo" label-width="80px" :rules="infoRules" ref="userInfo">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="userInfo.username" autocomplete="off" style="width: 260px;" :disabled="true" ref="username"></el-input>
        </el-form-item>
        <el-form-item label="昵称" prop="nickname">
          <el-input v-model="userInfo.nickname" autocomplete="off"  style="width: 260px;" ref="nickname"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="phone">
          <el-input v-model="userInfo.phone" autocomplete="off"  style="width: 260px;" ref="phone"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogInfoVisible = false">取 消</el-button>
        <el-button type="primary" @click="handlerModifiedUserInfo">保 存</el-button>
      </div>
    </el-dialog>

    <el-dialog title="修改密码" :visible.sync="dialogPasswordVisible" width=500px :before-close="clearPasswordForm">
      <el-form :model="modifiedPasswordFormShow" label-width="80px" :rules="passwordRules" ref="modifiedPasswordFormShow">
        <el-form-item label="原密码" prop="srcPassword">
          <el-input v-model="modifiedPasswordFormShow.srcPassword" autocomplete="off" style="width: 300px;" ref="srcPassword" :type="srcPasswordType"></el-input>
          <span class="show-pwd" @click="showSrcPwd">
            <svg-icon :icon-class="srcPasswordType === 'password' ? 'eye' : 'eye-open'" />
          </span>
        </el-form-item>
        <el-form-item label="新密码" prop="newPassword">
          <el-input v-model="modifiedPasswordFormShow.newPassword" autocomplete="off"  style="width: 300px;" ref="newPassword" :type="newPasswordType"></el-input>
          <span class="show-pwd" @click="showNewPwd">
            <svg-icon :icon-class="newPasswordType === 'password' ? 'eye' : 'eye-open'" />
          </span>
        </el-form-item>
        <el-form-item label="确认密码" prop="confirmPassword">
          <el-input v-model="modifiedPasswordFormShow.confirmPassword" autocomplete="off"  style="width: 300px;" ref="confirmPassword" :type="confirmPasswordType"></el-input>
          <span class="show-pwd" @click="showConPwd">
            <svg-icon :icon-class="confirmPasswordType === 'password' ? 'eye' : 'eye-open'" />
          </span>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="clearPasswordForm">取 消</el-button>
        <el-button type="primary" @click="handlerModifiedPassword">保 存</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Breadcrumb from '@/components/Breadcrumb'
import Hamburger from '@/components/Hamburger'
import { validPhone } from '@/utils/validate'
import { getInfo, modifiedInfo, modifiedPassword, getRsa } from '@/api/user'
import JSEncrypt from 'jsencrypt'

export default {
  data() {
    const validatePhone = (rule, value, callback) => {
      if (!validPhone(value)) {
        callback(new Error('请输入正确的手机号'))
      } else {
        callback()
      }
    }
    const validateUsername = (rule, value, callback) => {
      if (value.trim().length === 0) {
        callback(new Error('请输入昵称'))
      } else {
        callback()
      }
    }
    const validatePassword = (rule, value, callback) => {
      if (value.length < 8) {
        callback(new Error('请输入8位以上的密码'))
      } else {
        callback()
      }
    }
    const validateConfirmPassword = (rule, value, callback) => {
      if (value.length < 8) {
        callback(new Error('请输入8位以上的密码'))
      } else if (value != this.modifiedPasswordFormShow.newPassword) {
        callback(new Error('两次输入的密码不一致'))
      } else {
        callback()
      }
    }
    return {
      dialogUploadVisible: false,
      dialogInfoVisible: false,
      dialogPasswordVisible: false,
      userInfo: {
        username: '',
        nickname: '',
        phone: '',
        avatar: ''
      },
      infoRules: {
        nickname: [{ required: true, trigger: 'blur', validator: validateUsername }],
        phone: [{ required: true, trigger: 'blur', validator: validatePhone }]
      },
      modifiedPasswordFormShow: {
        srcPassword: '',
        newPassword: '',
        confirmPassword: ''
      },
      passwordRules: {
        srcPassword: [{ required: true, trigger: 'blur', validator: validatePassword }],
        newPassword: [{ required: true, trigger: 'blur', validator: validatePassword }],
        confirmPassword: [{ required: true, trigger: 'blur', validator: validateConfirmPassword }],
      },
      modifiedPasswordForm: {
        srcPassword: '',
        newPassword: ''
      },
      rsa: '',
      srcPasswordType: 'password',
      newPasswordType: 'password',
      confirmPasswordType: 'password'
    }
  },
  components: {
    Breadcrumb,
    Hamburger
  },
  computed: {
    ...mapGetters([
      'sidebar',
      'avatar',
      'token'
    ])
  },
  methods: {
    clearPasswordForm() {
      this.$refs.modifiedPasswordFormShow.resetFields()
      this.dialogPasswordVisible = false
    },
    showSrcPwd() {
      if (this.srcPasswordType === 'password') {
        this.srcPasswordType = ''
      } else {
        this.srcPasswordType = 'password'
      }
      this.$nextTick(() => {
        this.$refs.srcPassword.focus()
      })
    },
    showNewPwd() {
      if (this.newPasswordType === 'password') {
        this.newPasswordType = ''
      } else {
        this.newPasswordType = 'password'
      }
      this.$nextTick(() => {
        this.$refs.newPassword.focus()
      })
    },
    showConPwd() {
      if (this.confirmPasswordType === 'password') {
        this.confirmPasswordType = ''
      } else {
        this.confirmPasswordType = 'password'
      }
      this.$nextTick(() => {
        this.$refs.confirmPassword.focus()
      })
    },
    handlerModifiedUserInfo() {
      this.$refs.userInfo.validate(valid => {
        if (valid) {
          modifiedInfo(this.userInfo).then(() => {
            this.$store.dispatch('user/getInfo')
            this.dialogInfoVisible = false
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    handleAvatarSuccess() {
      
    },
    openModifiedPasswordDialog() {
      getRsa().then(res => {
        this.rsa = res.data.rsa
      })
      this.dialogPasswordVisible = true
    },
    handlerModifiedPassword() {
      let encryptor = new JSEncrypt()
      encryptor.setPublicKey(this.rsa)
      this.modifiedPasswordForm.srcPassword = encryptor.encrypt(this.modifiedPasswordFormShow.srcPassword)
      this.modifiedPasswordForm.newPassword = encryptor.encrypt(this.modifiedPasswordFormShow.newPassword)
      this.$refs.modifiedPasswordFormShow.validate(valid => {
        if (valid) {
          modifiedPassword(this.modifiedPasswordForm).then(() => {
            this.dialogPasswordVisible = false
            this.logout()
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    getUserInfo() {
      getInfo(this.token).then(res => {
        this.userInfo.username = res.data.user.username
        this.userInfo.nickname = res.data.user.nickname
        this.userInfo.phone = res.data.user.phone
      })
      this.userInfo.avatar = this.avatar
      this.dialogInfoVisible = true
    },
    toggleSideBar() {
      this.$store.dispatch('app/toggleSideBar')
    },
    async logout() {
      await this.$store.dispatch('user/logout')
      this.$router.push(`/login?redirect=${this.$route.fullPath}`)
    }
  }
}
</script>

<style lang="scss" scoped>
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409EFF;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 120px;
  height: 120px;
  display: block;
  border-radius: 10px;
}

.navbar {
  height: 50px;
  overflow: hidden;
  position: relative;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0,21,41,.08);

  .hamburger-container {
    line-height: 46px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background .3s;
    -webkit-tap-highlight-color:transparent;

    &:hover {
      background: rgba(0, 0, 0, .025)
    }
  }

  .breadcrumb-container {
    float: left;
  }

  .right-menu {
    float: right;
    height: 100%;
    line-height: 50px;

    &:focus {
      outline: none;
    }

    .right-menu-item {
      display: inline-block;
      padding: 0 8px;
      height: 100%;
      font-size: 18px;
      color: #5a5e66;
      vertical-align: text-bottom;

      &.hover-effect {
        cursor: pointer;
        transition: background .3s;

        &:hover {
          background: rgba(0, 0, 0, .025)
        }
      }
    }

    .avatar-container {
      margin-right: 30px;

      .avatar-wrapper {
        margin-top: 5px;
        position: relative;

        .user-avatar {
          cursor: pointer;
          width: 40px;
          height: 40px;
          border-radius: 10px;
        }

        .el-icon-caret-bottom {
          cursor: pointer;
          position: absolute;
          right: -20px;
          top: 25px;
          font-size: 12px;
        }
      }
    }
  }
}
.show-pwd {
    position: absolute;
    right: 100px;
    top: 0px;
    font-size: 16px;
    color: #000;
    cursor: pointer;
    user-select: none;
  }
</style>
