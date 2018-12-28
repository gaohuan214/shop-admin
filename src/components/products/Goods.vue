<template>
  <div class="goods">
    <el-button type="success" plain @click="$router.push('/add-good')">添加商品</el-button>
    <el-table :data="goodsForm" ref="goodsFrom">
      <el-table-column type="index" :index="indexMethod" prop></el-table-column>
      <el-table-column label="商品名称" prop="goods_name"></el-table-column>
      <el-table-column label="商品价格" prop="goods_price"></el-table-column>
      <el-table-column label="商品重量" prop="goods_weight"></el-table-column>
      <el-table-column label="创建时间">
        <!-- 提供一个格式化时间的方法formatTime -->
        <template slot-scope="{row}">{{row.add_time | formatTime}}</template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button type="primary" icon="el-icon-edit" size="mini"></el-button>
          <el-button type="danger" icon="el-icon-delete" size="mini"></el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="currentPage"
      :page-sizes="[10, 20, 30, 40]"
      :page-size="10"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
    ></el-pagination>
  </div>
</template>

<script>
export default {
  data() {
    return {
      goodsForm: [],
      query: '',
      pageSize: 10,
      currentPage: 1,
      total: 0,
      addDialogVisible: false,
      addForm: {}
    }
  },
  methods: {
    async getGoodsList() {
      let res = await this.axios.get('goods', {
        params: {
          query: this.query,
          pagenum: this.currentPage,
          pagesize: this.pageSize
        }
      })
      let {
        meta: { status },
        data: { goods, total }
      } = res
      // console.log(res)
      if (status === 200) {
        this.goodsForm = goods
        this.total = total
      }
    },
    // 当前页发生改变的时候
    handleCurrentChange(val) {
      // console.log(val)
      this.currentPage = val
      this.getGoodsList()
    },
    // 当页面展示数目发生变化时
    handleSizeChange(val) {
      this.pageSize = val
      this.getGoodsList()
    },
    indexMethod(index) {
      // console.log(index) index从0开始
      return index + 1 + (this.currentPage - 1) * this.pageSize
    }
  },
  created() {
    this.getGoodsList()
  }
}
</script>

<style>
</style>
