<template>
  <div class="app-container">
    <el-row style="padding-top: 5%;padding-left: 33%">
      <div style="width: 500px;text-align: center;border-style: ridge">
        <div style=" padding-right: 7%;padding-bottom: 5%">
          <el-form :model="regForm" :rules="regRules" ref="regForm" label-width="100px"
                   class="demo-ruleForm">
            <el-form-item>
              <h1 style="text-align: center">用户注册</h1>
            </el-form-item>
            <el-form-item label="用户名" prop="username">
              <el-input v-model="regForm.username"></el-input>
            </el-form-item>
            <el-form-item label="邮箱号" prop="email">
              <el-input v-model="regForm.email"/>
            </el-form-item>
            <el-form-item label="验证码" prop="code">
              <el-input style="width: 68%" v-model="regForm.code"/>
              <el-button type="primary" plain :disabled="codeDisabled" @click="sendCode()">{{codeMsg}}</el-button>
            </el-form-item>
            <el-form-item label="密码" prop="password">
              <el-input type="password" v-model="regForm.password"></el-input>
            </el-form-item>
            <el-form-item style="text-align: center">
              <el-button @click="resetRegForm('regForm')">重置</el-button>
              <el-button type="primary" @click="register('regForm')">免费注册</el-button>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </el-row>
  </div>
</template>

<script>
  import {register, sendCode} from '@/api/api'

  export default {
    name: "Register",
    data() {
      return {
        codeDisabled: false,
        countdown: 60,
        codeMsg: '获取验证码',
        timer: null,
        regForm: {
          username: '',
          phone: '',
          email: '',
          password: '',
          code: ""
        },
        regRules: {
          username: [
            {required: true, message: '请输入活动名称', trigger: 'blur'}
          ],
          code: [
            {required: true, message: '请输入验证码', trigger: 'change'}
          ],
          phone: [
            {required: true, message: '请输入手机号', trigger: 'blur'},
            {min: 11, max: 11, message: '长度必须11位', trigger: 'blur'}
          ],
          email: [
            {required: true, message: '请输入邮箱', trigger: 'blur'},
            {type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change']}
          ],
          password: [
            {required: true, message: '请输入密码', trigger: 'blur'},
            {min: 6, max: 15, message: '长度在6到15之间', trigger: 'blur'}
          ]
        },
      }
    }, methods: {
      sendCode() {
        let email = this.regForm.email
        if (email === undefined || email === '') {
          this.$message({
            message: '请填写邮箱',
            type: 'warning'
          });
          return
        }

        if (!this.timer) {
          this.timer = setInterval(() => {
            if (this.countdown > 0 && this.countdown <= 60) {
              this.countdown--;
              if (this.countdown !== 0) {
                this.codeDisabled = true;
                this.codeMsg = "重新发送(" + this.countdown + ")"
              } else {
                clearInterval(this.timer)
                this.codeMsg = "获取验证码"
                this.countdown = 60
                this.timer = null
                this.codeDisabled = false
              }
            }
          }, 1000)
        }
        this.sendMailCode(email)
      },

      sendMailCode(email) {
        sendCode(email).then(res => {
          this.$message({
            message: '验证码发送成功',
            type: 'success'
          });
        }).catch(e => {
          this.$message.error(e.data.msg)
        })
      },
      resetRegForm(formName) {
        this.$refs[formName].resetFields()
      },
      register(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            register(this.regForm).then(res => {
              this.$message({
                message: '注册成功',
                type: 'success'
              })
              this.resetRegForm(formName)
              this.$router.push("/login")
            }).catch(e => {
              this.$message.error(e.data.msg)
            })
          } else {
            return false
          }
        })
      },
    }
  }
</script>

<style>
</style>
