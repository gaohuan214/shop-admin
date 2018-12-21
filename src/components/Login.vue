<template>
  <div class="login">
  <el-form ref="form" :model="form" label-width="80px">
      <img src="@/assets/avatar.jpg" alt="">
      <el-form-item label="用户名">
        <el-input v-model="form.name" placeholder="请输入用户名"></el-input>
      </el-form-item>
      <el-form-item label="密码">
        <el-input v-model="form.password" placeholder="密码"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">登录</el-button>
        <el-button>重置</el-button>
      </el-form-item>
  </el-form>
</div>
</template>

<script>
export default {
  data() {
    return {
      form: {
        name: "",
        password: ""
      }
    };
  },
  methods: {
    onSubmit() {
      console.log("submit!");
    }
  }
};
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
