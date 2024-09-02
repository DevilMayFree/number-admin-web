<template>
  <!-- 授权用户 -->
  <el-dialog title="选择用户" :visible.sync="visible" width="800px" top="5vh" append-to-body>
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true">
      <el-form-item label="关键词" prop="keywords">
        <el-input
          v-model="queryParams.keywords"
          placeholder="请输入用户名称/昵称/手机号"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>
    <el-row>
      <el-table @row-click="clickRow" ref="table" :data="userList" @selection-change="handleSelectionChange"
                height="260px">
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column label="用户名称" prop="username" :show-overflow-tooltip="true"/>
        <el-table-column label="用户昵称" prop="nickname" :show-overflow-tooltip="true"/>
        <el-table-column label="邮箱" prop="email" :show-overflow-tooltip="true"/>
        <el-table-column label="手机" prop="phoneNumber" :show-overflow-tooltip="true"/>
        <el-table-column label="状态" align="center" prop="status">
          <template slot-scope="scope">
            <dict-tag :options="dict.type['sys:data:status']" :value="scope.row.status"/>
          </template>
        </el-table-column>
        <el-table-column label="创建时间" align="center" prop="gmtCreate" width="180">
          <template slot-scope="scope">
            <span>{{ parseTime(scope.row.gmtCreate) }}</span>
          </template>
        </el-table-column>
      </el-table>
      <pagination
        v-show="total>0"
        :total="total"
        :page.sync="queryParams.pageQuery.current"
        :limit.sync="queryParams.pageQuery.size"
        @pagination="getList"
      />
    </el-row>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="handleSelectUser">确 定</el-button>
      <el-button @click="visible = false">取 消</el-button>
    </div>
  </el-dialog>
</template>

<script>
import {authUserSelectAll} from "@/api/system/role";
import {unAuthUserPage} from "@/api/system/user";

export default {
  dicts: ['sys:data:status'],
  props: {
    // 角色编号
    roleId: {
      type: [Number, String]
    }
  },
  data() {
    return {
      // 遮罩层
      visible: false,
      // 选中数组值
      userIds: [],
      // 总条数
      total: 0,
      // 未授权用户数据
      userList: [],
      // 查询参数
      queryParams: {
        // 分页参数
        pageQuery: {
          current: 1,
          size: 10
        },
        roleId: undefined,
        keywords: undefined
      }
    };
  },
  methods: {
    // 显示弹框
    show() {
      this.queryParams.roleId = this.roleId;
      this.getList();
      this.visible = true;
    },
    clickRow(row) {
      this.$refs.table.toggleRowSelection(row);
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.userIds = selection.map(item => item.id);
    },
    // 查询表数据
    getList() {
      unAuthUserPage(this.queryParams).then(response => {
        this.userList = response.data.records;
        this.total = Number(response.data.total);
      });
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageQuery.current = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.handleQuery();
    },
    /** 选择授权用户操作 */
    handleSelectUser() {
      const roleId = this.queryParams.roleId;
      let authIds = []
      authIds.push(...this.userIds);
      if (authIds.length === 0) {
        this.$modal.msgError("请选择要分配的用户");
        return;
      }
      authUserSelectAll({userIds: authIds, roleId: roleId}).then(res => {
        if (res.code === '0') {
          this.$modal.msgSuccess("分配成功");
          this.visible = false;
          this.$emit("ok");
        } else {
          this.$modal.msgError(res.msg)
        }
      });
    }
  }
};
</script>
