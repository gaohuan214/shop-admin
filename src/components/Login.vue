<template>
  <div class="login">
    <el-form ref="form" :model="form" :rules="rules" label-width="80px" status-icon>
      <img src="@/assets/avatar.jpg" alt>
      <el-form-item label="用户名" prop="username">
        <el-input v-model="form.username" placeholder="请输入用户名"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input v-model="form.password" placeholder="密码"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="login">登录</el-button>
        <el-button @click="reset">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      form: {
        username: '',
        password: ''
      },
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'change' },
          { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'change' }
        ],
        password: [
          { required: true, message: '请输入用户密码', trigger: 'change' },
          { min: 5, max: 9, message: '长度在 5 到 9 个字符', trigger: 'change' }
        ]
      }
    }
  },
  methods: {
    login() {
      console.log('submit!')
    },
    reset() {
      // resetFields 对整个表单进行重置,包括校验结果和图标
      this.$refs.form.resetFields()
    }
  }
}
</script>

<style lang = "less">
.login {
  height: 100%;
  background-color: #2d434c;
  overflow: hidden;
  .el-form {
    width: 400px;
    padding: 75px 40px 15px;
    background-color: #fff;
    margin: 200px auto;
    border-radius: 20px;
    position: relative;
    .el-button.el-button--default {
      margin-left: 80px;
    }
    img {
      position: absolute;
      left: 50%;
      top: -80px;
      transform: translateX(-50%);
      border-radius: 50%;
      border: 10px solid #fff;
    }
  }
}
</style>
