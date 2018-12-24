<template>
  <div class="users">
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 搜索 -->
    <div style="margin-top: 15px;">
      <el-input placeholder="请输入内容" v-model="query" class="input-with-select">
        <el-button slot="append" icon="el-icon-search" @click="search"></el-button>
      </el-input>
      <el-button plain type="success" @click="showAddDialog">用户添加</el-button>
    </div>
    <!-- 列表 -->
    <el-table :data="userlist" style="width: 100%">
      <el-table-column label="姓名" width="180">
        <template slot-scope="scope">
          <span>{{scope.row.username}}</span>
        </template>
      </el-table-column>
      <el-table-column label="邮箱" width="180">
        <template slot-scope="scope">
          <span>{{scope.row.email}}</span>
        </template>
      </el-table-column>
      <el-table-column label="电话" width="180">
        <template slot-scope="scope">
          <span>{{scope.row.mobile}}</span>
        </template>
      </el-table-column>
      <el-table-column label="状态" width="180">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.mg_state"
            @change="updataStatus(scope.row)"
            active-color="#13ce66"
            inactive-color="#ff4949"
          ></el-switch>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button
            size="small"
            plain
            type="primary"
            @click="showEditDialog(scope.row)"
            icon="el-icon-edit"
            circle
          ></el-button>
          <el-button
            size="small"
            plain
            type="danger"
            @click="deleteUser(scope.row.id)"
            icon="el-icon-delete"
            circle
          ></el-button>
          <el-button size="small" plain type="success" icon="el-icon-check">分配角色</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <div class="block">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="[2, 4, 6]"
        :page-size="2"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        background
      ></el-pagination>
    </div>
    <!-- 添加用户的对话框 -->
    <el-dialog title="添加用户" :visible.sync="addDialogVisible" width="40%">
      <!-- 添加用户的信息列表 -->
      <el-form :model="addForm" :rules="rules" label-width="80px" status-icon ref="addForm">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addForm.password" type="password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-input v-model="addForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改用户信息的对话框 -->
    <el-dialog title="修改用户" :visible.sync="editDialogVisible" width="40%">
      <!-- 修改用户的信息列表 -->
      <el-form :model="editForm" :rules="rules" label-width="80px" status-icon ref="editForm">
        <el-form-item label="用户名">
          <el-tag type="info">{{editForm.username}}</el-tag>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-input v-model="editForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editUser">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      userlist: [],
      query: '',
      currentPage: 1,
      pageSize: 2,
      total: 0,
      addDialogVisible: false,
      editDialogVisible: false,
      addForm: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      editForm: {
        username: '',
        email: '',
        mobile: '',
        id: ''
      },
      rules: {
        username: [
          { required: true, message: '用户名不能为空', trigger: 'blur' },
          { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '密码不能为空', trigger: 'blur' },
          { min: 5, max: 9, message: '长度在 5到 9 个字符', trigger: 'blur' }
        ],
        email: [{ type: 'email', message: '邮箱格式不正确', trigger: 'blur' }],
        mobile: [
          { pattern: /^1\d{10}$/, message: '手机格式不正确', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    // 获取用户列表数据
    async getUserList() {
      let res = await this.axios({
        method: 'get',
        url: `users`,
        params: {
          query: this.query,
          pagenum: this.currentPage,
          pagesize: this.pageSize
        }
      })
      let {
        meta: { status },
        data: { users, total }
      } = res
      if (status === 200) {
        this.userlist = users
        this.total = total
      }
    },
    // 每页显示数目改变时触发
    handleSizeChange(val) {
      // console.log(val)
      this.pageSize = val
      this.getUserList()
    },
    // 当前页发生改变时触发
    handleCurrentChange(val) {
      // console.log(val)
      this.currentPage = val
      this.getUserList()
    },
    // 查询
    search() {
      this.currentPage = 1
      this.getUserList()
    },
    // 删除
    deleteUser(id) {
      // console.log(id)
      this.$confirm('您确定要删除此条数据吗?', '温馨提示', {
        type: 'warning'
      })
        .then(() => {
          return this.axios({
            method: 'delete',
            url: `users/${id}`
          })
        })
        .then(res => {
          // console.log(res)
          let {
            meta: { status }
          } = res
          if (status === 200) {
            this.$message.success('删除成功')
            // console.log(this.userlist.length)
            if (this.userlist.length === 1) {
              // 如果当前页只有一条数据,删完这条数据后,渲染上一页
              this.currentPage--
            }
            this.getUserList()
          } else {
            this.$message.error('删除失败')
          }
        })
        .catch(() => {
          this.$message.info('取消删除')
        })
    },
    // 显示添加用户的对话框
    showAddDialog() {
      this.addDialogVisible = true
    },
    // 添加用户
    addUser() {
      this.$refs.addForm.validate(valid => {
        // console.log(valid)
        if (!valid) return
        this.axios({
          method: 'post',
          url: 'users',
          data: this.addForm
        }).then(res => {
          // console.log(res)
          let {
            meta: { status }
          } = res
          if (status === 201) {
            // 添加成功
            // 1.关闭对话框
            this.addDialogVisible = false
            // 2.重置表单项
            this.$refs.addForm.resetFields()
            // 3.重新渲染
            this.total++
            this.currentPage = Math.ceil(this.total / this.pageSize)
            console.log(this.currentPage)
            this.getUserList()
            this.$message.success('用户添加成功')
          } else {
            this.$message.error('用户名已存在')
          }
        })
      })
    },
    // 显示修改用户信息的对话框
    showEditDialog(user) {
      // console.log(user)
      // 发送Ajax得到对应用户信息，回显到对话框中
      this.editForm.email = user.email
      this.editForm.mobile = user.mobile
      this.editForm.username = user.username
      this.editForm.id = user.id
      this.editDialogVisible = true
    },
    // 修改用户信息
    editUser() {
      // console.log(this.editForm)
      //  1.进行表单校验
      this.$refs.editForm.validate(valid => {
        if (!valid) return
        //  2.发送ajax
        this.axios({
          method: 'put',
          url: `users/${this.editForm.id}`,
          data: this.editForm
        }).then(res => {
          // console.log(res)
          let {
            meta: { status, msg }
          } = res
          if (status === 200) {
            //  3.成功之后关闭对话框
            this.editDialogVisible = false
            //  4.重置表单
            this.$refs.editForm.resetFields()
            // 5.给出成功的提示
            this.$message.success('修改成功了哦')
            // 6.重新渲染
            this.getUserList()
          } else {
            this.$message.error(msg)
          }
        })
      })
    },
    // 更改用户状态
    async updataStatus(user) {
      // console.log(user)
      let res = await this.axios({
        method: 'put',
        url: `users/${user.id}/state/${user.mg_state}`
      })
      // console.log(res.data)
      if (res.meta.status === 200) {
        this.$message.success('状态修改成功')
      } else {
        this.$message.error(res.meta.msg)
      }
    }
  },
  // user页面打开时渲染
  created() {
    this.getUserList()
  }
}
</script>

<style lang="less" scoped>
.input-with-select {
  width: 300px;
  margin-bottom: 5px;
}
</style>
