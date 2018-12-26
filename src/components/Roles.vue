<template>
  <div class="roles">
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 添加用户按钮 -->
    <el-button type="success" plain @click="showAddDialog">添加角色</el-button>
    <!-- 列表 -->
    <el-table :data="rolesList">
      <el-table-column label type="expand">
        <template slot-scope="{row}">
          <span v-if="row.children.length === 0">暂无数据</span>
          <el-row class="l1" v-for="l1 in row.children" :key="l1.id">
            <!-- 显示1级 -->
            <el-col :span="4">
              <el-tag closable @close="delRight(row,l1.id)">{{l1.authName}}</el-tag>
              <i class="el-icon-arrow-right"></i>
            </el-col>
            <el-col :span="20">
              <el-row class="l2" v-for="l2 in l1.children" :key="l2.id">
                <!-- 显示二级分类 -->
                <el-col :span="4">
                  <el-tag type="success" closable @close="delRight(row,l2.id)">{{l2.authName}}</el-tag>
                  <i class="el-icon-arrow-right"></i>
                </el-col>
                <el-col :span="20">
                  <span v-for="l3 in l2.children" :key="l3.id">
                    <el-tag type="danger" closable @close="delRight(row,l3.id)">{{l3.authName}}</el-tag>
                  </span>
                </el-col>
              </el-row>
            </el-col>
          </el-row>
        </template>
      </el-table-column>
      <el-table-column label=" #" type="index"></el-table-column>
      <el-table-column label=" 角色名称" prop="roleName"></el-table-column>
      <el-table-column label=" 描述" prop="roleDesc"></el-table-column>
      <el-table-column label=" 操作">
        <template slot-scope="{row}">
          <el-button
            type="primary"
            @click="showEditDialog(row)"
            icon="el-icon-edit"
            size="mini"
            plain
          ></el-button>
          <el-button
            type="danger"
            icon="el-icon-delete"
            @click="showDeleteConfirm(row)"
            size="mini"
            plain
          ></el-button>
          <el-button
            type="success"
            icon="el-icon-check"
            size="mini"
            @click="showRoleDialog(row)"
            plain
          >权限分配</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 显示角色授权的树状图 -->
    <!-- .sync是增加关闭图标的关闭对话框的功能 -->
    <el-dialog title="角色授权" width="40%" :visible.sync="assignDialogVisible">
      <!--
        default-expanded-keys :默认展开
        default-checked-keys: 默认选中节点
        node-key: 设置以上两个属性,必须设置node-key ,属性值是节点数据中的一个字段名,其值唯一
      -->
      <el-tree
        :data="data"
        show-checkbox
        node-key="id"
        default-expand-all
        :props="defaultProps"
        ref="tree"
      ></el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="assignDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="assignRights">分配</el-button>
      </span>
    </el-dialog>
    <!-- 修改角色 -->
    <el-dialog title="修改角色" width="40%" :visible.sync="updateDialogVisible">
      <el-form :model="roleForm" :rules="rules" label-width="80px" ref="roleForm" status-icon>
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="roleForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述">
          <el-input v-model="roleForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="updateDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="updateRole">确认</el-button>
      </span>
    </el-dialog>
    <!-- 添加角色 -->
    <el-dialog title="添加角色" width="40%" :visible.sync="addDialogVisible">
      <el-form :model="roleForm" :rules="rules" label-width="80px" ref="roleForm" status-icon>
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="roleForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="roleForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addRole">确认</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      rolesList: [],
      data: [],
      defaultProps: {
        label: 'authName',
        children: 'children'
      },
      assignDialogVisible: false,
      updateDialogVisible: false,
      addDialogVisible: false,
      // 角色Id
      roleId: '',
      // 角色信息
      roleForm: {
        roleName: '',
        roleDesc: ''
      },
      // 校验规则
      rules: {
        roleName: [
          { required: true, message: '角色名称不能为空', trigger: 'change' }
        ]
      }
    }
  },
  methods: {
    // 获取元素的方法
    async getRolesList() {
      let res = await this.axios.get('roles')
      // console.log(res.data)
      let {
        meta: { status },
        data
      } = res
      if (status === 200) {
        // 获取成功
        this.rolesList = data
      }
    },
    async delRight(role, rightsId) {
      // role 当前角色所有数据
      let res = await this.axios.delete(`roles/${role.id}/rights/${rightsId}`)
      // console.log(res)
      // res 返回当前对象所拥有的所有角色信息
      let {
        meta: { status },
        data
      } = res
      if (status === 200) {
        this.$message.success('取消权限成功')
        role.children = data
      } else {
        this.$message.console.error('取消权限失败')
      }
    },
    async showRoleDialog(role) {
      // 显示授权的对话框
      this.assignDialogVisible = true
      // 发送ajax,获得树状数据结构
      let res = await this.axios.get('rights/tree')
      let {
        meta: { status },
        data
      } = res
      // console.log(res.data)
      if (status === 200) {
        this.data = data
      }
      // console.log(role)
      let ids = []
      // role是当前角色身上的所有信息,包括角色和权限
      role.children.forEach((ele1, index) => {
        ele1.children.forEach(ele2 => {
          ele2.children.forEach(ele3 => {
            ids.push(ele3.id)
          })
        })
      })
      // console.log(ids)
      this.$refs.tree.setCheckedKeys(ids)
      // 分配任务需要角色ID
      this.roleId = role.id
    },
    // 点击分配按钮进行授权操作
    async assignRights() {
      //  .getCheckedKeys方法获取所有被选中节点的key所组成的数组
      //  .getHalfCheckedKeys方法获取所有被半选中节点的key所组成的数组
      let getCheckedKeys = this.$refs.tree.getCheckedKeys()
      let getHalfCheckedKeys = this.$refs.tree.getHalfCheckedKeys()
      // 获取所有的选中节点的key
      let rids = getCheckedKeys.concat(getHalfCheckedKeys).join()
      //   注意: 参数要求传递rids为参数名                          {rides:rides} 对象中,变量和变量名一致时,写一个就行
      let res = await this.axios.post(`roles/${this.roleId}/rights`, { rids })
      // console.log(res)
      if (res.meta.status === 200) {
        this.$message.success('授权成功')
        this.assignDialogVisible = false
        this.getRolesList()
      } else {
        this.$message.error('授权失败')
      }
    },
    // 删除角色
    async showDeleteConfirm(role) {
      try {
        await this.$confirm('您确认要删除此角色吗?', '温馨提示', {
          type: 'warning'
        })
        let res = await this.axios.delete(`roles/${role.id}`)
        let {
          meta: { status }
        } = res
        if (status === 200) {
          // 删除成功
          this.$message.success('删除成功')
          // 重新渲染
          this.getRolesList()
        } else {
          this.$message.error('删除失败')
        }
      } catch (e) {
        this.$message.info('取消删除')
      }
    },
    async showEditDialog(role) {
      console.log(role)
      this.updateDialogVisible = true
      this.roleForm.roleDesc = role.roleDesc
      this.roleForm.roleName = role.roleName
      this.roleId = role.id
    },
    // 修改角色
    updateRole(role) {
      this.$refs.roleForm.validate(async valid => {
        if (!valid) return false
        let res = await this.axios.put(`roles/${this.roleId}`, this.roleForm)
        // console.log(res)
        if (res.meta.status === 200) {
          this.$message.success('修改角色成功')
          // 关闭修改角色的对话框
          this.updateDialogVisible = false
          //  重新渲染页面
          this.getRolesList()
        } else {
          this.$message.error('修改角色失败')
        }
      })
    },
    //  显示添加角色的对话框
    showAddDialog() {
      this.addDialogVisible = true
      this.roleForm.roleName = ''
      this.roleForm.roleDesc = ''
    },
    // 添加角色(添加前进行表单校验)
    addRole() {
      this.$refs.roleForm.validate(async valid => {
        if (!valid) return false

        let role = this.roleForm
        // console.log(role)
        let res = await this.axios.post('roles', role)
        // console.log(res)
        let {
          meta: { status }
        } = res
        if (status === 201) {
          this.$message.success('添加角色成功')
          // 关闭创建角色对话框
          this.addDialogVisible = false
          // 重置表单
          this.$refs.roleForm.resetFields()
          // 重新渲染
          this.getRolesList()
        }
      })
    }
  },
  created() {
    this.getRolesList()
  }
}
</script>

<style lang="less" scoped>
.el-tag {
  margin-right: 10px;
  margin-top: 10px;
}
</style>
