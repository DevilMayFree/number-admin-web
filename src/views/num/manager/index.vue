<template>
  <div style="padding:6px;">
    <el-card v-show="showSearch" style="margin-bottom:5px;">
      <el-form :model="queryParams" ref="queryForm" :inline="true" label-width="100px" style="margin-bottom:-20px;">
        <el-form-item label="查询" prop="keywords">
          <el-input v-model="queryParams.keywords" placeholder="请输入号码/编码前缀" clearable size="small"
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
        <el-form-item style="float:right;">
          <el-button type="primary" plain icon="el-icon-add" size="mini" @click="handleAddBatch">批量新增
          </el-button>
        </el-form-item>
        <el-form-item style="float:right;">
          <el-button type="primary" plain icon="el-icon-edit" size="mini" @click="handleEditBatch">批量编辑
          </el-button>
        </el-form-item>
        <el-form-item style="float:right;">
          <el-button type="primary" plain icon="el-icon-edit" size="mini" @click="handleCardEditBatch">卡片批量编辑
          </el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <el-card style="padding-bottom:100px;">
      <el-table v-loading="loading" :data="dataList" @selection-change="handleSelectionChange" border>
        <el-table-column type="selection" width="55" align="center"/>
        <el-table-column label="序号" type="index" width="100" align="center">
          <template slot-scope="scope">
            <span>{{ (queryParams.pageQuery.current - 1) * queryParams.pageQuery.size + scope.$index + 1 }}</span>
          </template>
        </el-table-column>
        <el-table-column label="号码" align="center" prop="number">
          <template slot-scope="scope">
            <el-link :underline="true" v-clipboard:copy="scope.row.number"
                     v-clipboard:success="clipboardSuccess" style="color:blue">
              <span> {{ scope.row.number }}</span>
            </el-link>
          </template>
        </el-table-column>

        <el-table-column label="团队" align="center" prop="label"/>
        <el-table-column label="编码" align="center" prop="code"/>
        <el-table-column label="客户过期时间" align="center" prop="expiryDate" width="130">
          <template slot-scope="scope">
            <span>{{ parseTime(scope.row.expiryDate, '{y}-{m}-{d}') }}</span>
          </template>
        </el-table-column>
        <el-table-column label="客户剩余天数" align="center" width="100" prop="remainingDays"/>
        <el-table-column label="卡片过期时间" align="center" prop="cardExpiryDate" width="130">
          <template slot-scope="scope">
            <span>{{ parseTime(scope.row.cardExpiryDate, '{y}-{m}-{d}') }}</span>
          </template>
        </el-table-column>
        <el-table-column label="卡片剩余天数" align="center" width="100" prop="cardRemainingDays"/>
        <el-table-column label="激活时间" align="center" prop="entryDate" width="130">
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
            <el-input v-model="form.remainingDays" placeholder="请输入客户有效期"/>
          </el-form-item>
          <el-form-item label="卡片有效期" prop="cardRemainingDays">
            <el-input v-model="form.cardRemainingDays" placeholder="请输入卡片有效期"/>
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
            <el-input v-model="renewForm.remainingDays" placeholder="请输入客户有效期"/>
          </el-form-item>
          <el-form-item label="卡片有效期" prop="cardRemainingDays">
            <el-input v-model="renewForm.cardRemainingDays" placeholder="请输入卡片有效期"/>
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
            <el-input class="num-list" v-model="addBatchForm.numText" type="textarea"
                      placeholder="请输入号码列表,一行一个号码,回车换行"/>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" @click="submitAddBatchForm" v-hasPermi="['num:manager:edit']">确 定
          </el-button>
          <el-button @click="addBatchCancel">取 消</el-button>
        </div>
      </el-dialog>

      <!-- 批量编辑对话框 -->
      <el-dialog title="批量编辑" :visible.sync="openEditBatch" width="500px" append-to-body>
        <el-form ref="editBatchForm" :model="editBatchForm" label-width="100px">
          <el-form-item label="客户续费天数" prop="remainingDays">
            <el-input v-model.number="editBatchForm.remainingDays"
                      placeholder="客户续费天数"/>
          </el-form-item>
          <el-form-item label="号码列表" prop="numList">
            <el-input class="num-list" v-model="editBatchForm.numText" type="textarea"
                      placeholder="请输入号码列表,一行一个号码,回车换行"/>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" @click="submitEditBatchForm" v-hasPermi="['num:manager:edit']">确 定
          </el-button>
          <el-button @click="editBatchCancel">取 消</el-button>
        </div>
      </el-dialog>

      <!-- 卡片批量编辑对话框 -->
      <el-dialog title="卡片批量编辑" :visible.sync="openCardEditBatch" width="500px" append-to-body>
        <el-form ref="editCardBatchForm" :model="editCardBatchForm" label-width="100px">
          <el-form-item label="卡片续费天数" prop="remainingDays">
            <el-input v-model.number="editCardBatchForm.remainingDays"
                      placeholder="卡片续费天数"/>
          </el-form-item>
          <el-form-item label="号码列表" prop="numList">
            <el-input class="num-list" v-model="editCardBatchForm.numText" type="textarea"
                      placeholder="请输入号码列表,一行一个号码,回车换行"/>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" @click="submitCardEditBatchForm" v-hasPermi="['num:manager:edit']">确 定
          </el-button>
          <el-button @click="editCardBatchCancel">取 消</el-button>
        </div>
      </el-dialog>

      <!-- 确定续费对话框 -->
      <el-dialog title="确定续费对话框" :visible.sync="openOverBatch" width="500px" append-to-body>
        <el-form ref="overBatchForm" :model="overBatchForm" label-width="100px">
          <el-form-item label="客户续费天数" prop="remainingDays">
            <el-input disabled v-model.number="overBatchForm.remainingDays"
                      placeholder="客户续费天数"/>
          </el-form-item>
          <el-form-item label="号码列表" prop="numList">
            <el-input disabled class="num-list" v-model="overBatchForm.numText" type="textarea"
                      placeholder="待确认号码，一行一个号码"/>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" @click="submitOverBatchForm" v-hasPermi="['num:manager:edit']">确定续费
          </el-button>
          <el-button v-clipboard:copy="overBatchForm.numText"
                     v-clipboard:success="overBatchCancelCopy">取消(复制全部)
          </el-button>
        </div>
      </el-dialog>

      <!-- 卡片确定续费对话框 -->
      <el-dialog title="卡片确定续费对话框" :visible.sync="openCardOverBatch" width="500px" append-to-body>
        <el-form ref="overCardBatchForm" :model="overCardBatchForm" label-width="100px">
          <el-form-item label="卡片续费天数" prop="remainingDays">
            <el-input disabled v-model.number="overCardBatchForm.remainingDays"
                      placeholder="卡片续费天数"/>
          </el-form-item>
          <el-form-item label="号码列表" prop="numList">
            <el-input disabled class="num-list" v-model="overCardBatchForm.numText" type="textarea"
                      placeholder="待确认号码，一行一个号码"/>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" @click="submitCardOverBatchForm" v-hasPermi="['num:manager:edit']">确定续费
          </el-button>
          <el-button v-clipboard:copy="overCardBatchForm.numText"
                     v-clipboard:success="overCardBatchCancelCopy">取消(复制全部)
          </el-button>
        </div>
      </el-dialog>

      <!--      结果复制框-->
      <el-dialog title="批量编辑结果" :visible.sync="openOverTips" width="500px" append-to-body>
        <el-form ref="overTipsForm" :model="overTipsForm" label-width="100px">
          <el-form-item label="号码列表" prop="numList">
            <el-input class="num-list" v-model="overTipsForm.numText" type="textarea"
                      placeholder="一行一个号码"/>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button v-clipboard:copy="overTipsForm.numText"
                     v-clipboard:success="overTipsCancelCopy">关闭(复制全部)
          </el-button>
        </div>
      </el-dialog>

      <!--      卡片结果复制框-->
      <el-dialog title="卡片批量编辑结果" :visible.sync="openCardOverTips" width="500px" append-to-body>
        <el-form ref="overCardTipsForm" :model="overCardTipsForm" label-width="100px">
          <el-form-item label="号码列表" prop="numList">
            <el-input class="num-list" v-model="overCardTipsForm.numText" type="textarea"
                      placeholder="一行一个号码"/>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button v-clipboard:copy="overCardTipsForm.numText"
                     v-clipboard:success="overCardTipsCancelCopy">关闭(复制全部)
          </el-button>
        </div>
      </el-dialog>

    </el-card>
  </div>
</template>

<script>
import {
  addBatch,
  addNumber,
  delNumber, doCardEditBatch, doEditBatch,
  editBatch, editCardBatch,
  getNumber,
  pageNumber,
  updateNumber,
  updateRenew,
  updateTeam
} from "@/api/num/manager";
import moment from "moment";
import {deepCopy} from "@/utils/ruoyi";
import {Notification} from 'element-ui'

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
      openEditBatch: false,
      openCardEditBatch: false,
      openOverBatch: false,
      openCardOverBatch: false,
      openOverTips: false,
      openCardOverTips: false,
      // 查询参数
      queryParams: {
        // 分页参数
        pageQuery: {
          current: 1,
          size: 50
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
        remainingDays: [],
        cardRemainingDays: [],
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
      editBatchForm: {},
      editCardBatchForm: {},
      editRawList: null,
      editCardRawList: null,
      overBatchForm: {},
      overCardBatchForm: {},
      overTipsForm: {},
      overCardTipsForm: {},
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
    this.getNotice();
    this.getList();
  },
  methods: {
    getNotice() {
      let queryExpiryDateNum = deepCopy(this.queryParams)
      queryExpiryDateNum.expiryDateNum = '10';

      let queryCardExpiryDateNum = deepCopy(this.queryParams)
      queryCardExpiryDateNum.cardExpiryDateNum = '10';

      let totalExpiryDateNum = 0;
      let totalCardExpiryDateNum = 0;

      const h = this.$createElement;
      pageNumber(queryExpiryDateNum).then(response => {
        totalExpiryDateNum = Number(response.data.total);

        pageNumber(queryCardExpiryDateNum).then(response => {
          totalCardExpiryDateNum = Number(response.data.total);

          const content1 = "客户即将过期:" + totalExpiryDateNum;
          const content2 = "卡片即将过期:" + totalCardExpiryDateNum;

          Notification.info({
            title: '过期提醒',
            message: h(
              "div",
              {
                style: "width: 250px;",
              },
              [
                h("div", [
                  h("span", null, content1),
                  h(
                    "a",
                    {
                      style: "color: #409EFF;cursor: pointer;",
                      on: {
                        click: this.goToExpiryDate,
                      },
                    },
                    "查看"
                  ),
                ]),
                h("div", [
                  h("span", null, content2),
                  h(
                    "a",
                    {
                      style: "color: #409EFF;cursor: pointer;",
                      on: {
                        click: this.goToCardExpiryDate,
                      },
                    },
                    "查看"
                  ),
                ]),
                h("div", [
                  h(
                    "a",
                    {
                      style: "color: #409EFF;cursor: pointer;",
                      on: {
                        click: this.goToAllExpiryDate,
                      },
                    },
                    "查看全部即将过期数据"
                  ),
                ]),
              ],
            ),
            showClose: true,
            duration: 0,
          });
        });
      });
    },
    goToExpiryDate() {
      this.resetForm("queryForm");
      this.queryParams.expiryDateNum = '10';
      this.getList();
    },
    goToCardExpiryDate() {
      this.resetForm("queryForm");
      this.queryParams.cardExpiryDateNum = '10';
      this.getList();
    },
    goToAllExpiryDate() {
      this.resetForm("queryForm");
      this.queryParams.expiryDateNum = '10';
      this.queryParams.cardExpiryDateNum = '10';
      this.getList();
    },
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
    editBatchCancel() {
      this.openEditBatch = false;
      this.resetEditBatch();

      this.getList();
    },
    editCardBatchCancel() {
      this.openCardEditBatch = false;
      this.resetCardEditBatch();

      this.getList();
    },
    overBatchCancel() {
      this.openOverBatch = false;
      this.resetOverBatch();

      this.editBatchCancel();
    },
    overCardBatchCancel() {
      this.openCardOverBatch = false;
      this.resetCardOverBatch();
      this.editCardBatchCancel();
    },
    overTipsCancel() {
      this.openOverTips = false;
      this.resetTipsBatch();
      this.overBatchCancel();
    },
    overCardTipsCancel() {
      this.openCardOverTips = false;
      this.resetCardTipsBatch();
      this.overCardBatchCancel();
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
    resetEditBatch() {
      this.editBatchForm = {
        checkOverDays: 'true',
        remainingDays: null,
        numText: null
      };
      this.resetForm("editBatchForm");
    },
    resetCardEditBatch() {
      this.editCardBatchForm = {
        checkOverDays: 'true',
        remainingDays: null,
        numText: null
      };
      this.resetForm("editCardBatchForm");
    },
    resetOverBatch() {
      this.overBatchForm = {
        remainingDays: null,
        numText: null
      };
      this.resetForm("overBatchForm");
    },
    resetCardOverBatch() {
      this.overCardBatchForm = {
        remainingDays: null,
        numText: null
      };
      this.resetForm("overCardBatchForm");
    },
    resetTipsBatch() {
      this.overTipsForm = {
        numText: null
      };
      this.resetForm("overTipsForm");
    },
    resetCardTipsBatch() {
      this.overCardTipsForm = {
        numText: null
      };
      this.resetForm("overCardTipsForm");
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
    clipboardSuccess() {
      this.$modal.msgSuccess("复制成功");
    },
    overBatchCancelCopy() {
      this.$modal.msgSuccess("复制成功");
      this.overBatchCancel();
    },
    overCardBatchCancelCopy() {
      this.$modal.msgSuccess("复制成功");
      this.overCardBatchCancel();
    },
    overTipsCancelCopy() {
      this.$modal.msgSuccess("复制成功");
      this.overTipsCancel();
    },
    overCardTipsCancelCopy() {
      this.$modal.msgSuccess("复制成功");
      this.overCardTipsCancel();
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
    handleAddBatch() {
      this.resetAddBatch();
      this.openAddBatch = true;
    },
    handleEditBatch() {
      this.resetEditBatch();
      this.openEditBatch = true;
    },
    handleCardEditBatch(){
      this.resetCardEditBatch();
      this.openCardEditBatch = true;
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
        if (this.form.remainingDays == null || this.form.remainingDays == 'null') {
          this.form.remainingDays = "";
        }
        if (this.form.cardRemainingDays == null || this.form.cardRemainingDays == 'null') {
          this.form.cardRemainingDays = "";
        }
        this.open = true;
        this.title = "修改号码";
      });
    },
    addDaysToCurrentDate(days) {
      // 获取当前日期
      const currentDate = moment();

      // 增加指定的天数
      const newDate = currentDate.add(days, 'days');

      // 格式化为所需格式
      const formattedDate = newDate.format('YYYY-MM-DD 00:00:00');
      return formattedDate;
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            const remainingDays = Number(this.form.remainingDays)
            const cardRemainingDays = Number(this.form.cardRemainingDays)
            this.form.expiryDate = this.addDaysToCurrentDate(remainingDays)
            this.form.cardExpiryDate = this.addDaysToCurrentDate(cardRemainingDays)

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

          addBatch({
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
    submitEditBatchForm() {
      this.$refs["editBatchForm"].validate(valid => {
        if (valid) {
          const remainingDays = this.editBatchForm.remainingDays;
          const text = this.editBatchForm.numText;
          const numList = this.textareaArr(text);
          this.editRawList = numList;

          editBatch({
            remainingDays: remainingDays,
            numList: numList
          }).then(response => {
            if (response && response.code == '0') {
              console.log('response:', response)
              const data = response.data;
              if (data.editStatus == 5) {
                this.resetOverBatch();
                this.overBatchForm.remainingDays = remainingDays;
                this.overBatchForm.numText = this.parseResponse(data);

                this.openOverBatch = true;
              }
              // else if (data.editStatus == 1) {
              //   this.$modal.msgSuccess("批量编辑成功");
              //   this.openEditBatch = false;
              //   this.getList();
              // }
            }
          });
        }
      })
    },
    submitCardEditBatchForm() {
      this.$refs["editCardBatchForm"].validate(valid => {
        if (valid) {
          const remainingDays = this.editCardBatchForm.remainingDays;
          const text = this.editCardBatchForm.numText;
          const numList = this.textareaArr(text);
          this.editCardRawList = numList;

          editCardBatch({
            remainingDays: remainingDays,
            numList: numList
          }).then(response => {
            if (response && response.code == '0') {
              console.log('editCardBatch response:', response)
              const data = response.data;
              if (data.editStatus == 5) {
                this.resetCardOverBatch();
                this.overCardBatchForm.remainingDays = remainingDays;
                this.overCardBatchForm.numText = this.parseResponse(data);

                this.openCardOverBatch = true;
              }
            }
          });
        }
      })
    },
    submitOverBatchForm() {
      this.$refs["overBatchForm"].validate(valid => {
        if (valid) {
          const remainingDays = this.overBatchForm.remainingDays;

          doEditBatch({
            remainingDays: remainingDays,
            numList: this.editRawList
          }).then(response => {
            if (response && response.code == '0') {
              this.$modal.msgSuccess("批量编辑成功");
              this.openOverBatch = false;
              this.openEditBatch = false;
              this.editRawList = null;

              this.overTipsForm.numText = this.parseTipsResponse(response.data);

              this.openOverTips = true;
              this.getList();
            }
          });
        }
      })
    },
    submitCardOverBatchForm() {
      this.$refs["overCardBatchForm"].validate(valid => {
        if (valid) {
          const remainingDays = this.overCardBatchForm.remainingDays;

          doCardEditBatch({
            remainingDays: remainingDays,
            numList: this.editCardRawList
          }).then(response => {
            if (response && response.code == '0') {
              this.$modal.msgSuccess("批量编辑成功");
              this.openCardOverBatch = false;
              this.openCardEditBatch = false;
              this.editCardRawList = null;

              this.overCardTipsForm.numText = this.parseTipsResponse(response.data);

              this.openCardOverTips = true;
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
    joinArray(array) {
      return array.join('\n');
    },
    parseResponse(data) {
      let numberText = '';
      if (data.canRenewList.length > 0) {
        let tempText = '';
        data.canRenewList.forEach(item => {
          tempText += item + ' 可续费\n';
        })
        numberText += tempText;
      }
      if (data.noOurList.length > 0) {
        let tempText = '';
        data.noOurList.forEach(item => {
          tempText += item + ' 不是我们\n';
        })
        numberText += tempText;
      }
      if (data.noNeedList.length > 0) {
        let tempText = '';
        data.noNeedList.forEach(item => {
          tempText += item.number + ' 无需续费，剩余' + item.days + '天\n';
        })
        numberText += tempText;
      }
      return numberText;
    },
    parseTipsResponse(data) {
      let numberText = '';
      if (data.renewSuccessList.length > 0) {
        let tempText = '';
        data.renewSuccessList.forEach(item => {
          tempText += item + ' 续费成功\n';
        })
        numberText += tempText;
      }
      if (data.noOurList.length > 0) {
        let tempText = '';
        data.noOurList.forEach(item => {
          tempText += item + ' 不是我们\n';
        })
        numberText += tempText;
      }
      if (data.noNeedList.length > 0) {
        let tempText = '';
        data.noNeedList.forEach(item => {
          tempText += item.number + ' 无需续费，剩余' + item.days + '天\n';
        })
        numberText += tempText;
      }

      numberText += '\n总计续费成功：'+data.renewSuccessList.length+'个\n';
      return numberText;
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
<style scoped>
.num-list {
  textarea {
    min-height: 15vw !important;
  }
}
</style>
