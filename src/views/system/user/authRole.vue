<template>
  <div class="app-container">
    <h4 class="form-header h4">基本信息</h4>
    <el-form ref="form" :model="form" label-width="80px">
      <el-row>
        <el-col :span="8" :offset="2">
          <el-form-item label="用户昵称" prop="nickname">
            <el-input v-model="form.nickname" disabled/>
          </el-form-item>
        </el-col>
        <el-col :span="8" :offset="2">
          <el-form-item label="登录账号" prop="username">
            <el-input v-model="form.username" disabled/>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>

    <h4 class="form-header h4">角色信息</h4>
    <el-table v-loading="loading" :row-key="getRowKey" @row-click="clickRow" ref="table"
              @selection-change="handleSelectionChange"
              :data="roles.slice((pageQuery.current-1)*pageQuery.size,pageQuery.current*pageQuery.size)">
      <el-table-column type="selection" :reserve-selection="true" width="55"></el-table-column>
      <el-table-column label="序号" type="index" width="50" align="center">
        <template slot-scope="scope">
          <span>{{ (pageQuery.current - 1) * pageQuery.size + scope.$index + 1 }}</span>
        </template>
      </el-table-column>
      <el-table-column label="角色名称" align="center" prop="name"/>
      <el-table-column label="角色编码" align="center" prop="code"/>
      <el-table-column label="创建时间" align="center" prop="gmtCreate" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.gmtCreate) }}</span>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0"
                :total="total"
                :page.sync="pageQuery.current"
                :limit.sync="pageQuery.size"/>

    <el-form label-width="100px">
      <el-form-item style="text-align: center;margin-left:-120px;margin-top:30px;">
        <el-button type="primary" @click="submitForm()">提交</el-button>
        <el-button @click="close()">返回</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import {getAuthRole, updateAuthRole} from "@/api/system/user";

export default {
  name: "AuthRole",
  data() {
    return {
      // 遮罩层
      loading: true,
      // 分页信息
      total: 0,
      // 分页参数
      pageQuery: {
        current: 1,
        size: 10
      },
      // 选中角色编号
      roleIds: [],
      // 角色信息
      roles: [],
      // 用户信息
      form: {}
    };
  },
  created() {
    const userId = this.$route.params && this.$route.params.userId;
    if (userId) {
      this.loading = true;
      getAuthRole(userId).then((response) => {
        this.form = response.data.user;
        this.roles = response.data.roles;
        this.total = this.roles.length;
        this.$nextTick(() => {
          this.roles.forEach((row) => {
            if (row.flag) {
              this.$refs.table.toggleRowSelection(row);
            }
          });
        });
        this.loading = false;
      });
    }
  },
  methods: {
    /** 单击选中行数据 */
    clickRow(row) {
      this.$refs.table.toggleRowSelection(row);
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.roleIds = selection.map((item) => item.id);
    },
    // 保存选中的数据编号
    getRowKey(row) {
      return row.id;
    },
    /** 提交按钮 */
    submitForm() {
      const userId = this.form.id;
      const roleIds = this.roleIds;
      updateAuthRole({userId: userId, roleIds: roleIds}).then((response) => {
        this.$modal.msgSuccess("授权成功");
        this.close();
      });
    },
    /** 关闭按钮 */
    close() {
      const obj = {path: "/system/user"};
      this.$tab.closeOpenPage(obj);
    },
  },
};
</script>
