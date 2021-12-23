<template>
  <div class="app-container">
    <el-tabs type="border-card">
      <el-tab-pane label="账号信息">
        <el-row :gutter="20" style="padding-left: 20px">
          <el-avatar :src="userInfo.avatar"></el-avatar>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="2">
            <div class="grid-content bg-purple">
              用户名
            </div>
          </el-col>
          <el-col :span="2">
            <div class="grid-content bg-purple">
              <el-tag type="info">{{userInfo.username}}</el-tag>
            </div>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="2">
            <div class="grid-content bg-purple">
              绑定邮箱
            </div>
          </el-col>
          <el-col :span="2">
            <div class="grid-content bg-purple">
              <el-tag type="success">{{userInfo.email}}</el-tag>
            </div>
          </el-col>
        </el-row>
      </el-tab-pane>
      <el-tab-pane label="修改密码">
        <el-form :model="passForm" status-icon :rules="rules" ref="passForm" label-width="100px" class="demo-passForm">
          <el-form-item label="原密码" prop="oldPass">
            <el-input type="password" v-model="passForm.oldPass" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="新密码" prop="newPass">
            <el-input type="password" v-model="passForm.newPass" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="确认密码" prop="checkPass">
            <el-input type="password" v-model="passForm.checkPass" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submitForm('passForm')">确认修改</el-button>
            <el-button @click="resetForm('passForm')">重置</el-button>
          </el-form-item>
        </el-form>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
  import { getUserInfo, updatePass } from '@/api/api'

  export default {
    name: 'Setting',
    data() {
      return {
        userInfo: {},
        passForm: {
          oldPass: '',
          newPass: '',
          checkPass: ''
        },
        rules: {
          oldPass: [
            { required: true, message: '请输入原密码', trigger: 'blur' },
            { min: 6, max: 15, message: '长度在6到15之间', trigger: 'blur' }
          ],
          newPass: [
            { required: true, message: '请输入新密码', trigger: 'blur' },
            { min: 6, max: 15, message: '长度在6到15之间', trigger: 'blur' }

          ],
          checkPass: [
            { required: true, message: '请确认新密码', trigger: 'blur' },
            { min: 6, max: 15, message: '长度在6到15之间', trigger: 'blur' }
          ]
        }
      }
    },
    created() {
      this.getUser()
    },
    methods: {
      getUser() {
        getUserInfo().then(res => {
          this.userInfo = res.data
        })
      },
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            let { newPass, checkPass } = this.passForm
            //验证两次密码输入是否相同
            if (newPass !== checkPass) {
              this.$message({
                message: '两次输入密码不相同',
                type: 'warning'
              })
              return
            }
            updatePass(this.passForm).then(res => {
              this.$message({
                message: '密码修改成功',
                type: 'success'
              })
              //修改成功，重新登录
              this.logout()

            }).catch(err => {
              this.$message.error(err.data.msg)
            })

          } else {

            return false
          }
        })
      },
      async logout() {
        await this.$store.dispatch('user/logout')
        this.$router.push(`/login?redirect=${this.$route.fullPath}`)
      },
      resetForm(formName) {
        this.$refs[formName].resetFields()
      }
    }
  }
</script>

<style>
  .el-row {
    padding-top: 25px;
  }
</style>
