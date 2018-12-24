<template>
  <div class="rights">
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 权限列表 -->
    <el-table :data="rightsList">
      <el-table-column label="#" type="index"></el-table-column>
      <el-table-column label="权限名称" prop="authName"></el-table-column>
      <el-table-column label="路径" prop="path"></el-table-column>
      <el-table-column label="层级">
        <template slot-scope="{row}">
          <span v-if="+row.level === 0">一级</span>
          <span v-else-if="+row.level === 1">二级</span>
          <span v-else>三级</span>
        </template>
      </el-table-column>
      <!-- <el-table-column label="层级" prop="level"></el-table-column>
      <el-table-column label="层级" prop="level"></el-table-column>-->
    </el-table>
  </div>
</template>

<script>
export default {
  data() {
    return {
      rightsList: []
    }
  },
  methods: {
    async getRightsList() {
      let res = await this.axios.get('rights/list')
      console.log(res)
      let {
        meta: { status },
        data
      } = res
      if (status === 200) {
        // 获取完成
        this.rightsList = data
      }
    }
  },
  created() {
    this.getRightsList()
  }
}
</script>

<style>
</style>
