<template>
  <el-container>
    <el-header>
      <div class="logo"></div>
      <div class="tilte">电商后台管理系统</div>
      <div class="logout">
        <span>欢迎光临</span>
        <a href="javascript:;" @click="logout">退出</a>
      </div>
    </el-header>
    <el-container>
      <el-aside width="200px">Aside</el-aside>
      <el-main>Main</el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  methods: {
    logout() {
      this.$confirm('您确认要退出登录吗?', '温馨提示', {
        type: 'warning'
      })
        .then(() => {
          this.$message.success('退出成功')
          // 要清除token
          localStorage.removeItem('token')
          // 跳转路由
          this.$router.push('/')
        })
        .catch(() => {
          this.$message.info('取消退出')
        })
    }
  }
}
</script>

<style lang = "less">
.el-container {
  width: 100%;
  height: 100%;
  .el-header {
    background-color: #b3c1cd;
    display: flex;
    line-height: 60px;
    .logo {
      width: 180px;
      background: url('~@/assets/logo.png') no-repeat center;
      background-size: contain;
    }
    .tilte {
      flex: 1;
      font-size: 25px;
      color: #fff;
      text-align: center;
      font-weight: 700;
    }
    .logout {
      width: 200px;
      text-align: center;
      a {
        color: orangered;
      }
    }
  }
  .el-aside {
    background-color: blue;
  }
  .el-main {
    background-color: red;
  }
}
</style>
