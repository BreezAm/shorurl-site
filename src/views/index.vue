<template>
  <div class="app-container">
    <el-row>
      <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal" @select="handleSelect">
        <el-menu-item style="border-bottom: none;text-decoration: none" index="1">帮助文档</el-menu-item>
        <el-menu-item style="border-bottom: none;text-decoration: none" index="2"><a href="http://url.breez.work"
                                                                                     target="_blank">开放API</a>
        </el-menu-item>
        <el-menu-item style="float: right;border-bottom: none;text-decoration: none" index="3">
          <el-button @click="toUse()" type="primary">{{operation}}</el-button>
        </el-menu-item>
      </el-menu>
    </el-row>
    <el-row style="padding-top: 15%;padding-right: 20%;padding-left: 20%">
      <el-col :span="20">
        <el-input
          style="height: 50px;float: left"
          placeholder="请输入你要跳转的链接"
          v-model="longLink"
          clearable>
        </el-input>
      </el-col>
      <el-col :span="4">
        <el-button :disabled="isDisableGen" @click="produceURL()" style="float: right" type="primary">{{genMsg}}</el-button>
      </el-col>
    </el-row>
    <el-row style="padding-top: 30px;padding-right: 20%;padding-left: 20%">
      <div style="text-align: center;border-style: inset" v-if="shortInfo.url!==undefined">
        <div style="padding-top: 10px;padding-bottom: 7px">
          <label>短链：</label><label>
          <el-link type="success">{{shortInfo.url}}</el-link>
        </label>
          <label
            v-clipboard:copy="shortInfo.url"
            v-clipboard:success="onCopy"
            v-clipboard:error="onError" style="padding-left: 15px;color: #f5794f">复制</label>
        </div>

        <el-image
          style="width: 100px; height: 100px"
          :src="shortInfo.qr"
          fit="fit"></el-image>
      </div>

    </el-row>
  </div>
</template>

<script>
  import {getToken} from '@/utils/auth'
  import {getTempShortInfo} from "@/api/api";

  export default {
    name: "Index",
    data() {
      return {
        countdown: 10,
        genMsg: '生成短链接',
        timer: null,
        isDisableGen: false,
        operation: '免费使用',
        hasToken: getToken(),
        activeIndex: '1',
        longLink: '',
        shortInfo: {
          url: undefined,
          qr: undefined,
          expireTime: undefined
        },

      }
    },
    created() {
      if (this.hasToken) {
        this.operation = '进入控制台'
      }
    },
    methods: {
      handleConfirmUrl(rule, value, callback) {
        if (value) {
          let z_reg = /(http|ftp|https):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&:/~\+#]*[\w\-\@?^=%&/~\+#])?/
          if (z_reg.test(value)) {
            callback()
          } else {
            callback('请输入正确的格式')
          }
        }
      },
      toUse() {
        this.$router.push('/login')
      },
      produceURL() {
        if (this.longLink === undefined || this.longLink === '') {
          this.$message({
            message: '请输入您的链接',
            type: 'warning'
          });
          return
        }
        //网址正则校验格式
        const reg = /(http|ftp|https):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&:/~\+#]*[\w\-\@?^=%&/~\+#])?/;
        if (!reg.test(this.longLink)) {
          this.$message({
            message: "请检查您输入的格式",
            type: "warning",
            offset: 60,
          });
          return
        }
        if (!this.timer) {
          this.timer = setInterval(() => {
            if (this.countdown > 0 && this.countdown <= 10) {
              this.countdown--;
              if (this.countdown !== 0) {
                this.isDisableGen = true;
                this.genMsg = "重新生成(" + this.countdown + ")"
              } else {
                clearInterval(this.timer)
                this.genMsg = "生成短链接"
                this.countdown = 10
                this.timer = null
                this.isDisableGen = false
              }
            }
          }, 1000)
        }

        getTempShortInfo({url: this.longLink}).then(res => {
          this.shortInfo = res.data
          this.$message({
            message: '生成成功',
            type: 'success'
          });
        }).catch(e => {
          this.$message.error('生成失败');
        })
      },

      handleSelect() {

      },
      onCopy(e) { // 复制成功
        this.$message({
          message: '复制成功！',
          type: 'success'
        })
      },
      onError(e) {// 复制失败
        this.$message({
          message: '复制失败！',
          type: 'error'
        })
      }
    },

  }
</script>

<style scoped>

</style>
