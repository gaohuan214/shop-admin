<template>
  <div class="login">
    <el-form ref="form" :model="form" :rules="rules" label-width="80px" status-icon>
      <img src="@/assets/avatar.jpg" alt>
      <el-form-item label="用户名" prop="username">
        <el-input v-model="form.username" placeholder="请输入用户名"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input
          v-model="form.password"
          @keyup.enter.native="login"
          placeholder="密码"
          type="password"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="login">登录</el-button>
        <el-button @click="reset">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
// 导入axios
import axios from 'axios'
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
      // 参数1: 校验结果(布尔值)   参数2: 未通过校验的字段
      this.$refs.form.validate((valid, aa) => {
        // console.log(valid, aa)
        if (valid) {
          // 发送ajax,后台验证
          axios({
            method: 'post',
            url: 'http://localhost:8888/api/private/v1/login',
            data: this.form
          }).then(res => {
            console.log(res.data)
            if (res.data.meta.status === 200) {
              // 登录成功
              // $message
              this.$message.success('登录成功')
              // 设置token
              localStorage.setItem('token', res.data.data.token)
              // 路由跳转(编程式导航)
              this.$router.push('/home')
            } else {
              this.$message({
                type: 'error',
                message: '用户名或密码错误',
                duration: 1000
              })
            }
          })
        }
      })
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
