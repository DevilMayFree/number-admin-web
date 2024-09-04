<template>
  <div style="padding:6px;">
    <el-card v-show="showSearch" style="margin-bottom:5px;">
      <el-form :model="queryParams" ref="queryForm" :inline="true" label-width="100px" style="margin-bottom:-20px;">
        <el-form-item label="号码查询" prop="keywords">
          <el-input v-model="queryParams.keywords" placeholder="请输入号码" clearable size="small"
                    @keyup.enter.native="handleQuery"/>
        </el-form-item>
        <el-form-item label="客户即将过期" prop="expiryDateNum">
          <el-input v-model="queryParams.expiryDateNum" placeholder="请输入天数" clearable size="small"
                    @keyup.enter.native="handleQuery"/>
        </el-form-item>
        <el-form-item label="卡片即将过期" prop="cardExpiryDateNum">
          <el-input v-model="queryParams.cardExpiryDateNum" placeholder="请输入天数" clearable size="small"
                    @keyup.enter.native="handleQuery"/>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
          <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
        </el-form-item>
        <el-form-item style="float:left;">
          <el-button type="primary" plain icon="el-icon-plus" size="mini" @click="handleAdd"
                     v-hasPermi="['num:manager:add']">新增
          </el-button>
        </el-form-item>
        <el-form-item style="float:right;">
          <el-button type="warning" plain icon="el-icon-download" size="mini" @click="handleExport"
                     v-hasPermi="['num:manager:export']">导出
          </el-button>
        </el-form-item>

        <el-form-item style="float:right;">
          <el-button type="info" plain icon="el-icon-brush" size="mini" @click="handleRenew">批量续费
          </el-button>
        </el-form-item>

        <el-form-item style="float:right;">
          <el-button type="primary" plain icon="el-icon-collection" size="mini" @click="handleTeam">分配团队
          </el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <el-card style="padding-bottom:100px;">
      <el-table v-loading="loading" :data="dataList" @selection-change="handleSelectionChange" border>
        <el-table-column type="selection" width="55" align="center"/>
        <el-table-column label="序号" type="index" width="50" align="center">
          <template slot-scope="scope">
            <span>{{ (queryParams.pageQuery.current - 1) * queryParams.pageQuery.size + scope.$index + 1 }}</span>
          </template>
        </el-table-column>
        <el-table-column label="号码" align="center" prop="number"/>
        <el-table-column label="团队" align="center" prop="label"/>
        <el-table-column label="编码" align="center" prop="code"/>
        <el-table-column label="客户过期时间" align="center" prop="expiryDate" width="180">
          <template slot-scope="scope">
            <span>{{ parseTime(scope.row.expiryDate, '{y}-{m}-{d}') }}</span>
          </template>
        </el-table-column>
        <el-table-column label="客户剩余天数" align="center" prop="remainingDays"/>
        <el-table-column label="卡片过期时间" align="center" prop="cardExpiryDate" width="180">
          <template slot-scope="scope">
            <span>{{ parseTime(scope.row.cardExpiryDate, '{y}-{m}-{d}') }}</span>
          </template>
        </el-table-column>
        <el-table-column label="卡片剩余天数" align="center" prop="cardRemainingDays"/>
        <el-table-column label="激活时间" align="center" prop="entryDate" width="180">
          <template slot-scope="scope">
            <span>{{ parseTime(scope.row.entryDate, '{y}-{m}-{d}') }}</span>
          </template>
        </el-table-column>
        <el-table-column label="备注" align="center" prop="remark"/>
        <!--        <el-table-column label="创建时间" align="center" prop="gmtCreate" width="180">
                  <template slot-scope="scope">
                    <span>{{ parseTime(scope.row.gmtCreate) }}</span>
                  </template>
                </el-table-column>-->
        <el-table-column label="操作" align="center" class-name="small-padding fixed-width" width="150">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="text"
              icon="el-icon-edit"
              @click="handleUpdate(scope.row)"
              v-hasPermi="['num:manager:edit']"
            >修改
            </el-button>
            <el-button
              size="mini"
              type="text"
              icon="el-icon-delete"
              @click="handleDelete(scope.row)"
              v-hasPermi="['num:manager:del']"
            >删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageQuery.current"
                  :limit.sync="queryParams.pageQuery.size" @pagination="getList"/>

      <!-- 添加或修改号码对话框 -->
      <el-dialog title="号码" :visible.sync="open" width="500px" append-to-body>
        <el-form ref="form" :model="form" :rules="rules" label-width="100px">
          <el-form-item label="号码" prop="number">
            <el-input v-model="form.number" placeholder="请输入号码"/>
          </el-form-item>
          <el-form-item label="团队" prop="label">
            <el-input v-model="form.label" placeholder="请输入团队"/>
          </el-form-item>
          <el-form-item label="编码" prop="code">
            <el-input v-model="form.code" placeholder="请输入编码"/>
          </el-form-item>
          <el-form-item label="客户有效期" prop="remainingDays">
            <el-input v-model.number="form.remainingDays" placeholder="请输入客户有效期"/>
          </el-form-item>
          <el-form-item label="卡片有效期" prop="cardRemainingDays">
            <el-input v-model.number="form.cardRemainingDays" placeholder="请输入卡片有效期"/>
          </el-form-item>
          <el-form-item label="备注" prop="remark">
            <el-input v-model="form.remark" type="textarea" placeholder="请输入内容"/>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" @click="submitForm" v-hasPermi="['num:manager:edit']"
                     v-show="form.id">修 改
          </el-button>
          <el-button type="primary" @click="submitForm" v-hasPermi="['num:manager:add']"
                     v-show="!form.id">新 增
          </el-button>
          <el-button @click="cancel">取 消</el-button>
        </div>
      </el-dialog>

      <!-- 分配团队对话框 -->
      <el-dialog title="分配团队" :visible.sync="openTeam" width="500px" append-to-body>
        <el-form ref="teamForm" :model="teamForm" :rules="teamRules" label-width="100px">
          <el-form-item label="团队" prop="label">
            <el-input v-model="teamForm.label" placeholder="请输入团队"/>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" @click="submitTeamForm" v-hasPermi="['num:manager:edit']">
            确 定
          </el-button>
          <el-button @click="teamCancel">取 消</el-button>
        </div>
      </el-dialog>

      <!-- 批量续费对话框 -->
      <el-dialog title="批量续费" :visible.sync="openRenew" width="500px" append-to-body>
        <el-form ref="renewForm" :model="renewForm" :rules="renewRules" label-width="100px">
          <el-form-item label="客户有效期" prop="remainingDays">
            <el-input v-model.number="renewForm.remainingDays" placeholder="请输入客户有效期"/>
          </el-form-item>
          <el-form-item label="卡片有效期" prop="cardRemainingDays">
            <el-input v-model.number="renewForm.cardRemainingDays" placeholder="请输入卡片有效期"/>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" @click="submitRenewForm" v-hasPermi="['num:manager:edit']">确 定
          </el-button>
          <el-button @click="renewCancel">取 消</el-button>
        </div>
      </el-dialog>

      <!-- 批量录入对话框 -->
      <el-dialog title="批量录入" :visible.sync="openAddBatch" width="500px" append-to-body>
        <el-form ref="addBatchForm" :model="addBatchForm" label-width="100px">
          <el-form-item label="第一个编码" prop="firstCode">
            <el-input v-model.number="addBatchForm.firstCode"
                      placeholder="请输入第一个编码,例如这批次从E213开始，填E213"/>
          </el-form-item>
          <el-form-item label="号码列表" prop="numList">
            <el-input v-model.number="addBatchForm.numText" placeholder="请输入号码列表,一行一个号码,回车换行"/>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" @click="submitAddBatchForm" v-hasPermi="['num:manager:edit']">确 定
          </el-button>
          <el-button @click="addBatchCancel">取 消</el-button>
        </div>
      </el-dialog>


    </el-card>
  </div>
</template>

<script>
import {addNumber, delNumber, getNumber, pageNumber, updateNumber, updateRenew, updateTeam} from "@/api/num/manager";

export default {
  name: "Number",
  data() {
    return {
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 表格数据
      dataList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      openTeam: false,
      openRenew: false,
      openAddBatch: false,
      // 查询参数
      queryParams: {
        // 分页参数
        pageQuery: {
          current: 1,
          size: 20
        },
        keywords: null,
        expiryDateNum: null,
        cardExpiryDateNum: null
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        number: [{
          required: true,
          message: "号码不能为空",
          trigger: "blur"
        }, {
          min: 1,
          max: 64,
          message: '号码不能少于1个字符和超过64字符',
        },
        ],
        label: [{
          required: false,
          min: 0,
          max: 500,
          message: '团队不能输入超过500个字符',
          trigger: 'blur',
        }],
        code: [{
          required: true,
          message: "编码不能为空",
          trigger: "blur"
        }, {
          min: 1,
          max: 64,
          message: '编码不能少于1个字符和超过64字符',
        },
        ],
        remainingDays: [{
          required: true,
          message: '客户有效期不能为空',
          trigger: 'blur',
        }, {
          type: 'number',
          min: 0,
          max: 2147483647,
          message: '客户有效期不能超过int最大值(0——2^31-1)',
          trigger: 'blur',
        }],
        cardRemainingDays: [{
          required: true,
          message: '卡片有效期不能为空',
          trigger: 'blur',
        }, {
          type: 'number',
          min: 0,
          max: 2147483647,
          message: '卡片有效期不能超过int最大值(0——2^31-1)',
          trigger: 'blur',
        }],
        remark: [{
          required: false,
          min: 0,
          max: 500,
          message: '备注不能输入超过500个字符',
          trigger: 'blur',
        }]
      },
      teamForm: {},
      renewForm: {},
      addBatchForm: {},
      teamRules: {
        label: [{
          required: false,
          min: 0,
          max: 500,
          message: '团队不能输入超过500个字符',
          trigger: 'blur',
        }],
      },
      renewRules: {
        remainingDays: [],
        cardRemainingDays: [],
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询号码列表 */
    getList() {
      this.loading = true;
      pageNumber(this.queryParams).then(response => {
        this.dataList = response.data.records;
        this.total = Number(response.data.total);
        this.loading = false;
      });
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    teamCancel() {
      this.openTeam = false;
      this.resetTeam();
    },
    renewCancel() {
      this.openRenew = false;
      this.resetRenew();
    },
    addBatchCancel() {
      this.openAddBatch = false;
      this.resetAddBatch();
    },
    // 表单重置
    reset() {
      this.form = {
        id: null,
        number: null,
        label: null,
        code: null,
        remainingDays: null,
        cardRemainingDays: null,
        remark: null
      };
      this.resetForm("form");
    },
    resetTeam() {
      this.teamForm = {
        ids: [],
        label: null,
      };
      this.resetForm("teamForm");
    },
    resetRenew() {
      this.renewForm = {
        ids: [],
        remainingDays: null,
        cardRemainingDays: null,
      };
      this.resetForm("renewForm");
    },
    resetAddBatch() {
      this.addBatchForm = {
        firstCode: null,
        numText: null
      };
      this.resetForm("addBatchForm");
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
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.id)
      this.single = selection.length !== 1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加号码";
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('api/num/manager/export', {
        ...this.queryParams
      }, `export_${new Date().getTime()}.xlsx`)
    },
    handleTeam() {
      if (this.ids != null && this.ids.length > 0) {
        this.resetTeam();
        this.openTeam = true;
      } else {
        this.$modal.msgWarning("至少选择一个号码");
      }
    },
    handleRenew() {
      if (this.ids != null && this.ids.length > 0) {
        this.resetRenew();
        this.openRenew = true;
      } else {
        this.$modal.msgWarning("至少选择一个号码");
      }
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const numberId = row.id || this.ids
      getNumber(numberId).then(response => {
        this.form = response.data;
        this.form.remainingDays = Number(this.form.remainingDays)
        this.form.cardRemainingDays = Number(this.form.cardRemainingDays)
        this.open = true;
        this.title = "修改号码";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updateNumber(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addNumber(this.form).then(response => {
              this.$modal.msgSuccess("新增成功");
              this.open = false;
              this.getList();
            });
          }
        }
      });
    },
    submitTeamForm() {
      this.$refs["teamForm"].validate(valid => {
        if (valid) {
          this.teamForm.ids = this.ids;
          updateTeam(this.teamForm).then(response => {
            this.$modal.msgSuccess("分配团队成功");
            this.openTeam = false;
            this.getList();
          });
        }
      })
    },
    submitRenewForm() {
      this.$refs["renewForm"].validate(valid => {
        if (valid) {
          this.renewForm.ids = this.ids;
          updateRenew(this.renewForm).then(response => {
            this.$modal.msgSuccess("批量续费成功");
            this.openRenew = false;
            this.getList();
          });
        }
      })
    },
    submitAddBatchForm() {
      this.$refs["addBatchForm"].validate(valid => {
        if (valid) {
          const firstCode = this.addBatchForm.firstCode;
          const text = this.addBatchForm.numText;
          const numList = this.textareaArr(text);

          updateRenew({
            firstCode: firstCode,
            numList: numList
          }).then(response => {
            if (response && response.code == '0') {
              this.$modal.msgSuccess("批量录入成功");
              this.openAddBatch = false;
              this.getList();
            }
          });
        }
      })
    },
    textareaArr(str) {
      if (typeof str == "string") {
        return str.split(/[(\r\n)\r\n]+/);
      } else {
        return []
      }
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      let delIds = []
      if (row.id) {
        delIds.push(row.id);
      } else {
        delIds.push(...this.ids);
      }
      this.$modal.confirm('确认删除?').then(function () {
        return delNumber(delIds);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {
      });

    }
  }
};
</script>
