<template>
  <div class="app-container">
    <el-form :inline="true" :model="searchParams" class="demo-form-inline">
      <el-form-item label="短链标题">
        <el-input
          v-model="searchParams.title"
          placeholder="输入短链标题"
          clearable></el-input>
      </el-form-item>
      <el-form-item label="分组">
        <el-select v-model="searchParams.groupId" clearable placeholder="选择组">
          <el-option
            v-for="item in groups"
            :key="item.id"
            :label="item.name"
            :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button @click="getShortInfoList()" type="primary" icon="el-icon-search">搜索</el-button>
      </el-form-item>
    </el-form>
    <el-button @click="handleAdd('创建')" type="primary" style="float: right">创建短链</el-button>
    <el-table
      empty-text="没有任何数据"
      :data="urlList"
      style="width: 100%">
      <el-table-column
        type="selection"
        width="55">
      </el-table-column>
      <el-table-column
        label="短链名称"
        prop="title">
      </el-table-column>
      <el-table-column
        label="短链网址"
        prop="shortUrl">
        <template slot-scope="scope">
          <el-tooltip placement="top">
            <div slot="content">点击打开网站</div>
            <el-link class="buttonText" type="primary" :underline="false" :href="scope.row.shortUrl" target="_blank">
              {{scope.row.shortUrl}}
            </el-link>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column
        label="短链二维码"
        prop="name">
        <template slot-scope="scope">
          <el-tooltip placement="top">
            <div slot="content">点击查看</div>
            <el-image
              style="width: 50px; height: 50px"
              :src="scope.row.qrCode"
              :preview-src-list="[scope.row.qrCode]">
            </el-image>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column
        label="状态"
        prop="status">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.status===1" type="success">正常</el-tag>
          <el-tag v-if="scope.row.status===0" type="danger">异常</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="info"
            v-clipboard:copy="scope.row.shortUrl"
            v-clipboard:success="onCopy"
            v-clipboard:error="onError"
          >复制短链
          </el-button>
          <el-button
            size="mini"
            type="success"
            @click="handleEdit(scope.$index, scope.row,'编辑')">编辑
          </el-button>
          <el-button
            size="mini"
            type="danger"
            @click="handleDelete(scope.row.id)">删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <!--分页-->
    <el-pagination
      style="text-align: center;padding-top: 15px"
      background
      @current-change="handleCurrentChange"
      :current-page.sync="current"
      :page-size="limit"
      layout="total, prev, pager, next"
      :total="total">
    </el-pagination>

    <!--创建短链接对话框-->
    <el-dialog
      :before-close="handleClose"
      :title="operationText"
      :visible.sync="urlDialogVisible"
      width="50%">

      <el-form :model="shortUrlForm" :rules="rules" ref="shortUrlForm" label-width="100px" class="demo-ruleForm">
        <el-form-item label="标题" prop="title">
          <el-input v-model="shortUrlForm.title" placeholder="请输入一个标题"></el-input>
        </el-form-item>
        <el-form-item label="链接" prop="url">
          <el-input :disabled="urlDisabled" v-model="shortUrlForm.url" placeholder="请输入您需要跳转的链接"></el-input>
        </el-form-item>
        <el-form-item label="分组">
          <el-select v-model="shortUrlForm.groupId" clearable placeholder="请选择">
            <el-option
              v-for="item in groups"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="域名">
          <el-input value="breez.work" disabled></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
    <el-button @click="resetForm('shortUrlForm')">取 消</el-button>
    <el-button type="primary" @click="submitForm('shortUrlForm')">确 定</el-button>
  </span>
    </el-dialog>
  </div>
</template>

<script>
  import {addShortInfo,updateShortInfo, groupList, remove, shortInfoList} from '@/api/api'

  export default {
    name: 'Url',
    data() {
      return {
        urlDisabled: false,
        operationText: '创建',
        urlDialogVisible: false,
        urlList: [],
        groups: [],
        groupId: '',
        shortUrlForm: {
          id:'',
          title: '',
          url: '',
          groupId: ''
        },
        searchParams: {
          title: '',
          groupId: ''
        },
        current: 1,
        limit: 5,
        total: 0,
        rules: {
          title: [
            {required: true, message: '标题不能为空', trigger: 'blur'}
          ],
          url: [
            {required: true, message: '跳转链接不能为空', trigger: 'blur'}
          ]
        }
      }
    },
    created() {
      this.getShortInfoList()
      this.initGroupList()
    },
    methods: {
      handleCurrentChange(val) {
        this.getShortInfoList()
      },
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            if (this.operationText === '创建') {
              this.saveAdd()
            } else {
              this.saveUpdate()
            }
          } else {
            return false
          }
        })
      },
      //添加短网址信息
      saveAdd() {
        addShortInfo(this.shortUrlForm).then(res => {
          this.$message({
            message: '创建成功',
            type: 'success'
          })
          this.urlDialogVisible = false
          this.getShortInfoList()
         // this.shortUrlForm = {}
        })
      },
      //更新短网址信息
      saveUpdate() {
        updateShortInfo(this.shortUrlForm).then(res=>{
          this.$message({
            message: '更新成功',
            type: 'success'
          })
          this.urlDialogVisible = false
          this.getShortInfoList()
          ///this.shortUrlForm = {}
        })
      },
      handleAdd(name) {
        this.urlDialogVisible = true
        this.urlDisabled = false
        this.operationText = name
        this.shortUrlForm = {}
      },
      handleEdit(index, row, name) {
        this.urlDialogVisible = true
        this.operationText = name
        this.urlDisabled = true

        this.shortUrlForm.id=row.id
        this.shortUrlForm.title = row.title
        this.shortUrlForm.url = row.shortUrl
        this.shortUrlForm.groupId = row.groupId

      },
      handleDelete(id) {
        this.$confirm('确定删除该短链接?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          remove(id).then(res => {
            this.$message({
              type: 'success',
              message: '删除成功!'
            });
            this.getShortInfoList()
          }).catch(e => {
            this.$message.error(e.data.msg);
          })

        })
      },
      resetForm(formName) {
        this.urlDialogVisible = false
        this.$refs[formName].resetFields()
      },
      handleClose(done) {
        this.resetForm('shortUrlForm')
        done();
      },
      getShortInfoList() {
        shortInfoList(this.searchParams, this.current, this.limit).then(res => {
          this.urlList = res.data.records
          this.total = res.data.total
        })
      },

      initGroupList() {
        groupList().then(res => {
          this.groups = res.data
        })
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
    }
  }
</script>

<style scoped>

</style>
