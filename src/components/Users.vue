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
      <el-button plain type="success">用户添加</el-button>
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
          <el-switch v-model="scope.row.mg_state" active-color="#13ce66" inactive-color="#ff4949"></el-switch>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button size="small" plain type="primary" icon="el-icon-edit" circle></el-button>
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
  </div>
</template>

<script>
import axios from 'axios'
export default {
  data() {
    return {
      userlist: [],
      query: '',
      currentPage: 1,
      pageSize: 2,
      total: 0
    }
  },
  methods: {
    // 获取用户列表数据
    getUserList() {
      axios({
        method: 'get',
        url: `http://localhost:8888/api/private/v1/users`,
        params: {
          query: this.query,
          pagenum: this.currentPage,
          pagesize: this.pageSize
        },
        // 进行token认证
        headers: { Authorization: localStorage.getItem('token') }
      }).then(res => {
        // console.log(res.data)
        if (res.data.meta.status === 200) {
          this.userlist = res.data.data.users
          this.total = res.data.data.total
        }
      })
    },
    handleEdit(index, row) {
      console.log(index, row)
    },
    handleDelete(index, row) {
      console.log(index, row)
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
          axios({
            method: 'delete',
            url: `http://localhost:8888/api/private/v1/users/${id}`,
            // 进行token认证
            headers: { Authorization: localStorage.getItem('token') }
          }).then(res => {
            // console.log(res.data)
            if (res.data.meta.status === 200) {
              this.$message.success('删除成功')
              console.log(this.userlist.length)
              if (this.userlist.length === 1) {
                // 如果当前页只有一条数据,删完这条数据后,渲染上一页
                this.currentPage--
              }
              this.getUserList()
            } else {
              this.$message.error('删除失败')
            }
          })
        })
        .catch(() => {
          this.$message.info('取消删除')
        })
    }
  },
  created() {
    this.getUserList()
  }
}
</script>

<style>
.el-breadcrumb {
  margin-top: 20px;
}
.el-input {
  width: 300px;
  margin-bottom: 5px;
}
</style>
