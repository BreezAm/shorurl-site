<template>
  <div class="app-container">

    <div style="padding-bottom: 15px">
      <el-button @click="handleAdd('新增')" type="success">新增</el-button>
    </div>
    <el-table
      :data="groupList"
      border
      stripe
      style="width: 100%;">
      <el-table-column
        align="center"
        label="序号"
        type="index"
        width="50">
      </el-table-column>
      <el-table-column
        align="center"
        prop="name"
        label="名称">
      </el-table-column>
      <el-table-column
        align="center"
        prop="createTime"
        label="创建日期">
      </el-table-column>
      <el-table-column
        align="center"
        prop="updateTime"
        label="更新日期">
      </el-table-column>
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <el-button
            type="success"
            size="mini"
            @click="handleEdit(scope.$index, scope.row)">编辑
          </el-button>
          <el-button
            size="mini"
            type="danger"
            @click="handleDelete(scope.$index, scope.row.id)">删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!--新增分组-->
    <el-dialog
      :before-close="handleClose"
      :title="optionText"
      :visible.sync="dialogVisible"
      width="30%">
      <el-form :model="groupForm" :rules="groupRules" ref="groupForm" label-width="100px" class="demo-ruleForm">
        <el-form-item label="组名称" prop="name">
          <el-input v-model="groupForm.name"></el-input>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
    <el-button @click="resetForm('groupForm')">取 消</el-button>
    <el-button type="primary" @click="submitForm('groupForm')">确 定</el-button>
  </span>
    </el-dialog>
  </div>
</template>

<script>
  import {groupList, addGroup, deleteGroup, updateGroup} from '@/api/api'

  export default {
    name: 'Group',
    data() {
      return {
        dialogVisible: false,
        groupList: [],
        optionText: '新增',
        groupId: '',
        groupForm: {
          name: ''
        },
        groupRules: {
          name: [
            {required: true, message: '组名称不能为空', trigger: 'trigger'}
          ]
        }

      }
    },
    created() {
      this.initGroupList()
    },
    methods: {
      handleAdd(text) {
        this.dialogVisible = true
        this.groupForm.name = ''
        this.optionText = text
      },
      handleEdit(index, row) {
        this.dialogVisible = true
        this.optionText = '修改'
        this.groupId = row.id
        this.groupForm.name = row.name
      },
      saveGroupUpdate(data) {
        console.log(data)
        updateGroup(data).then(res => {
          this.$message({
            message: '修改成功',
            type: 'success'
          })
          this.dialogVisible = false
          this.groupForm.name = ''
          this.initGroupList()
        }).catch(e => {
          this.$message.error(e.data.msg)
        })
      },
      saveGroupAdd() {
        addGroup(this.groupForm).then(res => {
          this.$message({
            message: '新建成功',
            type: 'success'
          })
          this.initGroupList()
          this.groupForm.name = ''
          this.dialogVisible = false
        }).catch(e => {
          this.$message.error(e.data.msg)
        })

      },
      handleDelete(index, id) {
        this.$confirm('除该分组,将删除组下所有短链接， 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          deleteGroup(id).then(res => {
            this.$message({
              message: '删除成功',
              type: 'success'
            })
            this.initGroupList()
          }).catch(e => {
            this.$message.error(e.data.msg)
          })
        })
      },
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            if (this.optionText === '新增') {
              this.saveGroupAdd()
            } else {
              this.saveGroupUpdate({id: this.groupId, name: this.groupForm.name})
            }
          } else {
            return false
          }
        })
      },
      resetForm(formName) {
        this.dialogVisible = false
        this.$refs[formName].resetFields()
      },
      handleClose(done) {
        this.resetForm('groupForm')
        done();
      },
      initGroupList() {
        groupList().then(res => {
          this.groupList = res.data
        })
      }
    }
  }
</script>

<style>

</style>
