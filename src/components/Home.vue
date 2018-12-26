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
      <el-aside width="200px">
        <el-menu
          :default-active="$route.path.slice(1)"
          class="el-menu-vertical-demo"
          background-color="#545c64"
          text-color="#fff"
          active-text-color="#ffd04b"
          unique-opened
          router
        >
          <el-submenu :index="menu.path" v-for="menu in menuList" :key="menu.id">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>{{menu.authName}}</span>
            </template>
            <!-- 菜单项 -->
            <el-menu-item :index="item.path" v-for="item in menu.children" :key="item.id">
              <i class="el-icon-menu"></i>
              <span slot="title">{{item.authName}}</span>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-main>
        <!-- home的子路由的出口 -->
        <router-view/>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  data() {
    return {
      menuList: []
    }
  },
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
    },
    async getMenuList() {
      let res = await this.axios.get('menus')
      let {
        meta: { status },
        data
      } = res
      if (status === 200) {
        this.menuList = data
        // console.log(data)
        // console.log(this.$route.path)
      }
    }
  },
  created() {
    this.getMenuList()
  }
}
</script>

<style lang = "less" scoped>
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
    .el-menu {
      height: 100%;
      width: 200px;
    }
  }
  .el-main {
    background-color: #d4dfe4;
  }
}
</style>
