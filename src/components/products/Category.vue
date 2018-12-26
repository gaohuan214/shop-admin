<template>
  <div class="category">
    <el-button type="success" plain @click="showCategoryDialog">商品分类</el-button>
    <el-table :data="categoryForm">
      <el-table-tree-column
        file-icon="icon icon-file"
        folder-icon="icon icon-folder"
        prop="cat_name"
        label="分类名称"
        width="220"
        treeKey="cat_id"
        parentKey="cat_pid"
        levelKey="cat_level"
        :indentSize="20"
      ></el-table-tree-column>
      <el-table-column label="是否删除" width="180">
        <template slot-scope="scope">{{scope.row.cat_deleted === false ?'否':'是'}}</template>
      </el-table-column>
      <el-table-column prop="cat_level" label="排序" width="180"></el-table-column>
      <el-table-column label="操作" width="180">
        <template slot-scope="scope">
          <el-button type="primary" plain size="mini" icon="el-icon-edit" circle></el-button>
          <el-button type="danger" plain size="mini" icon="el-icon-delete" circle></el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <el-pagination
      layout="prev, pager, next"
      :total="total"
      background
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    ></el-pagination>
    <el-dialog title="添加分类" :visible.sync="addDialogVisible" width="40%">
      <el-form ref="addFrom" :model="addFrom" :rules="rules" label-width="80px">
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="addFrom.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级名称" prop="cat_pid">
          <!-- change-on-select :选择即改变
                clearable:清空选项
          -->
          <el-cascader
            :options="categoryList"
            v-model="addFrom.cat_pid"
            :props="props"
            change-on-select
            clearable
          ></el-cascader>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addCategory">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      categoryForm: [],
      addDialogVisible: false,
      addFrom: {
        cat_name: '',
        cat_pid: []
      },
      rules: {
        cat_name: [
          { required: true, message: '请输入分类名称', trigger: 'blur' }
        ]
      },
      categoryList: [],
      props: {
        value: 'cat_id',
        label: 'cat_name'
      },
      pageSize: 10,
      currentPage: 1,
      total: 0
    }
  },
  methods: {
    async getCatgoryList() {
      let res = await this.axios.get('categories', {
        params: {
          pagenum: this.currentPage,
          pagesize: this.pageSize,
          type: 3
        }
      })
      let {
        meta: { status },
        data: { total, result }
      } = res
      // console.log(res)
      if (status === 200) {
        this.categoryForm = result
        this.total = total
      } else {
        this.$message.error('获取分类列表失败')
      }
    },
    async showCategoryDialog() {
      this.addDialogVisible = true
      let res = await this.axios.get('categories?type=2')
      let {
        meta: { status },
        data
      } = res
      // console.log(res)
      if (status === 200) {
        this.categoryList = data
      } else {
        this.$message.error('获取分类列表失败')
      }
    },
    // 添加分类
    addCategory() {
      // 表单校验
      this.$refs.addFrom.validate(async valid => {
        if (!valid) return
        let { cat_name: catName, cat_pid: catPid } = this.addFrom
        // 添加所需参数:cat_pid 直系父级,最小的父级  cat_level:父级个数代表几级
        let res = await this.axios.post('categories', {
          cat_name: catName,
          cat_pid: catPid[catPid.length - 1] || 0,
          cat_level: catPid.length
        })
        // console.log(res)
        let {
          meta: { status }
        } = res
        if (status === 201) {
          this.$message.success('添加分类成功')
          this.$refs.addFrom.resetFields()
          this.addDialogVisible = false
          this.getCatgoryList()
        } else {
          this.$message.error('添加分类失败')
        }
      })
    },
    // 分页 分页数目发生改变时触发
    handleSizeChange(val) {
      this.pageSize = val
      this.getCatgoryList()
    },
    handleCurrentChange(val) {
      this.currentPage = val
      this.getCatgoryList()
    }
  },
  created() {
    this.getCatgoryList()
  }
}
</script>

<style>
</style>
