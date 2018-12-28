<template>
  <div class="addGood">
    <!-- active属性是一个number类型 ,从0开始
        finish-status 属性可以改变已经完成的步骤的状态
    -->
    <el-steps :active="active" finish-status="success">
      <el-step title="步骤 1" description="基本信息"></el-step>
      <el-step title="步骤 2" description="商品图片"></el-step>
      <el-step title="步骤 3" description="商品内容"></el-step>
    </el-steps>
    <!-- tab栏 -->
    <el-tabs tab-position="left" @tab-click="tabSwitch" :value="value">
      <el-tab-pane label="基本信息" name="1">
        <el-form :mode="addForm" label-width="80px">
          <el-form-item label="商品名称">
            <el-input v-model="addForm.goods_name"></el-input>
          </el-form-item>
          <el-form-item label="商品价格">
            <el-input v-model="addForm.goods_price"></el-input>
          </el-form-item>
          <el-form-item label="商品数量">
            <el-input v-model="addForm.goods_number"></el-input>
          </el-form-item>
          <el-form-item label="商品重量">
            <el-input v-model="addForm.goods_weight"></el-input>
          </el-form-item>
          <el-form-item label="商品分类">
            <el-cascader :options="options" :props="props" v-model=" addForm.goods_cat"></el-cascader>
          </el-form-item>
          <el-form-item label="是否促销">
            <el-radio v-model="addForm.is_promote" :label="true">是</el-radio>
            <el-radio v-model="addForm.is_promote" :label="false">否</el-radio>
          </el-form-item>
          <el-button type="primary" @click="next2">下一步</el-button>
        </el-form>
      </el-tab-pane>
      <el-tab-pane label="商品图片" name="2">
        <el-upload
          class="upload-demo"
          action="http://localhost:8888/api/private/v1/upload"
          :headers="hearders"
          :on-success="handleSuccess"
          list-type="picture"
        >
          <el-button size="small" type="primary">点击上传</el-button>
          <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
        </el-upload>
        <el-button type="primary" @click="next3">下一步</el-button>
      </el-tab-pane>
      <el-tab-pane label="商品内容" name="3">
        <quill-editor v-model="addForm.goods_introduce" ref="myQuillEditor"></quill-editor>
        <el-button type="primary" @click="addGoods">添加</el-button>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
export default {
  data() {
    return {
      active: 0,
      value: '1',
      addForm: {
        goods_name: '',
        goods_price: '',
        goods_number: '',
        goods_weight: '',
        goods_cat: [],
        pics: [],
        goods_introduce: '',
        is_promote: false
      },
      options: [],
      props: {
        value: 'cat_id',
        label: 'cat_name'
      },
      fileList: [],
      hearders: { Authorization: localStorage.getItem('token') },
      content: '',
      editorOption: {}
    }
  },
  methods: {
    tabSwitch(tab) {
      // 回调函数为被选中的tab实例
      // console.log(tab)
      this.active = +tab.index
    },
    async getCategoryList() {
      let res = await this.axios.get('categories?type=3')
      // console.log(res)
      let {
        meta: { status },
        data
      } = res
      if (status === 200) {
        this.options = data
      }
    },
    handleSuccess(res, file, fileList) {
      // console.log(res)
      // console.log(file)
      // console.log(fileList)
      if (res.meta.status === 200) {
        this.addForm.pics.push(res.data.tmp_path)
      }
    },
    next2() {
      this.active = 1
      this.value = '2'
    },
    next3() {
      this.active = 2
      this.value = '3'
    },
    async addGoods() {
      let res = await this.axios.post('goods', {
        ...this.addForm,
        goods_cat: this.addForm.goods_cat.join()
      })
      // console.log(res)
      let {
        meta: { status, message }
      } = res
      if (status === 201) {
        this.$router.push('/goods')
      } else {
        this.$message.error(message)
      }
    }
  },
  created() {
    this.getCategoryList()
  }
}
</script>

<style lang="less" scoped>
.quill-editor {
  /deep/ .ql-editor {
    height: 300px;
    background-color: #fff;
  }
}
</style>
