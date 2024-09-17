<template>
  <div style="padding:6px;">
    <el-card style="margin-bottom:5px;">
      <el-form ref="queryForm" :inline="true" label-width="100px" style="margin-bottom:-20px;">
        <el-form-item style="float:left;">
          <el-button type="primary" plain icon="el-icon-plus" size="mini" @click="handleAddBatch"
                     v-hasPermi="['tg:vip:add']">批量新增
          </el-button>
        </el-form-item>

        <el-form-item style="float:left;">
          <el-button type="info" plain icon="el-icon-brush" size="mini" @click="handleTake">领取
          </el-button>
        </el-form-item>


        <el-form-item style="float:left;">
          <el-button type="warning" plain icon="el-icon-star" size="mini" @click="handleTakeLog">领取记录
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
        <el-table-column label="内容" align="center" prop="content">
          <template slot-scope="scope">
            <div class="no-copy">
              {{ scope.row.content }}
            </div>
          </template>
        </el-table-column>
        <el-table-column label="创建时间" align="center" prop="gmtCreate" width="160">
          <template slot-scope="scope">
            <span>{{ parseTime(scope.row.gmtCreate) }}</span>
          </template>
        </el-table-column>
      </el-table>

      <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageQuery.current"
                  :limit.sync="queryParams.pageQuery.size" @pagination="getList"/>

      <!-- 领取对话框 -->
      <el-dialog title="领取" :visible.sync="openTake" width="500px" append-to-body>
        <el-form ref="takeForm" :model="takeForm" label-width="100px" label-position="top">
          <el-form-item label="领取数量" prop="label">
            <el-input v-model.number="takeForm.count" placeholder="请输入领取数量"/>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="handleCount">获取ID</el-button>
          </el-form-item>
          <el-form-item label="内容列表" prop="contentList">
            <el-input class="num-list" v-model="takeForm.contentList" type="textarea"
                      placeholder="待领取内容"/>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button type="success" v-clipboard:copy="takeForm.contentList"
                     v-clipboard:success="clipboardSuccess">一键复制
          </el-button>
          <el-button type="primary" @click="submitTakeForm" v-hasPermi="['tg:vip:edit']"
                     v-clipboard:copy="takeForm.contentList"
                     v-clipboard:success="clipboardSuccess">
            确定领取
          </el-button>
          <el-button @click="takeCancel">取消</el-button>
        </div>
      </el-dialog>

      <!-- 批量新增对话框 -->
      <el-dialog title="批量新增" :visible.sync="openAddBatch" width="500px" append-to-body>
        <el-form ref="addBatchForm" :model="addBatchForm" label-width="100px" label-position="top">
          <el-form-item label="内容列表" prop="contentList">
            <el-input class="num-list" v-model="addBatchForm.contentList" type="textarea"
                      placeholder="请输入内容列表,一行一条,回车换行"/>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" @click="submitAddBatchForm" v-hasPermi="['tg:vip:edit']">确 定
          </el-button>
          <el-button @click="addBatchCancel">取 消</el-button>
        </div>
      </el-dialog>

      <!-- 领取记录对话框 -->
      <el-dialog title="领取记录" :visible.sync="openLogDialog" width="70%" append-to-body>
        <el-table v-loading="logLoading" :data="logList" border>
          <el-table-column label="序号" type="index" width="100" align="center">
            <template slot-scope="scope">
              <span>{{
                  (logQueryParams.pageQuery.current - 1) * logQueryParams.pageQuery.size + scope.$index + 1
                }}</span>
            </template>
          </el-table-column>
          <el-table-column label="内容" align="center" prop="content">
            <template slot-scope="scope">
              <el-link :underline="true" v-clipboard:copy="scope.row.content"
                       v-clipboard:success="clipboardSuccess" style="color:blue">
                <span> {{ scope.row.content }}</span>
              </el-link>
            </template>
          </el-table-column>
          <el-table-column label="领取时间" align="center" prop="takeTime" width="160">
            <template slot-scope="scope">
              <span>{{ parseTime(scope.row.takeTime) }}</span>
            </template>
          </el-table-column>
        </el-table>

        <pagination v-show="logTotal > 0" :total="logTotal" :page.sync="logQueryParams.pageQuery.current"
                    :limit.sync="logQueryParams.pageQuery.size" @pagination="getLogList"/>

      </el-dialog>


    </el-card>
  </div>
</template>

<script>
import {addBatch, getTakeContent, pageAppleVIP, pageAppleVIPLog, updateTake,} from "@/api/apple/vip";

export default {
  name: "TGVIP",
  data() {
    return {
      // 遮罩层
      loading: true,
      logLoading: true,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 总条数
      total: 0,
      logTotal: 0,
      // 表格数据
      dataList: [],
      logList: [],
      // 弹出层标题
      title: "",
      openAddBatch: false,
      openTake: false,
      openLogDialog: false,
      labelPosition: "top",
      // 查询参数
      queryParams: {
        // 分页参数
        pageQuery: {
          current: 1,
          size: 50
        }
      },
      logQueryParams: {
        // 分页参数
        pageQuery: {
          current: 1,
          size: 50
        }
      },
      // 表单参数
      takeForm: {
        ids: [],
        count: null,
        contentList: null,
      },
      addBatchForm: {
        contentList: null
      },
      // 表单校验
      rules: {
        content: [{
          required: true,
          message: "内容不能为空",
          trigger: "blur"
        }, {
          min: 1,
          max: 500,
          message: '内容不能输入超过500个字符'
        }],
      },
    };
  },
  created() {
    this.getList();
    this.getLogList();
  },
  methods: {
    /** 查询号码列表 */
    getList() {
      this.loading = true;
      pageAppleVIP(this.queryParams).then(response => {
        this.dataList = response.data.records;
        this.total = Number(response.data.total);
        this.loading = false;
      });
    },
    getLogList() {
      this.logLoading = true;
      pageAppleVIPLog(this.logQueryParams).then(response => {
        this.logList = response.data.records;
        this.logTotal = Number(response.data.total);
        this.logLoading = false;
      });
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.id)
      this.single = selection.length !== 1
      this.multiple = !selection.length
    },
    handleAddBatch() {
      this.resetAddBatch();
      this.openAddBatch = true;
      this.title = "添加Tg会员";
    },
    resetAddBatch() {
      this.addBatchForm = {
        contentList: null
      };
      this.resetForm("addBatchForm");
    },
    resetTake() {
      this.takeForm = {
        ids: [],
        count: null,
        contentList: null
      };
      this.resetForm("takeForm");
    },
    handleTake() {
      this.resetTake();
      this.openTake = true;
    },
    handleTakeLog() {
      this.getLogList();
      this.openLogDialog = true;
    },
    addBatchCancel() {
      this.openAddBatch = false;
      this.resetAddBatch();
    },
    takeCancel() {
      const ids = this.takeForm.ids;
      if (ids && ids.length > 0) {
        updateTake({
          ids: ids,
          status: 0
        }).then(response => {
          console.log('cancel res:', response)
          if (response && response.code == '0') {
            this.takeClose();
            this.getList();
          }
        })
      }
    },
    takeClose() {
      this.openTake = false;
      this.resetTake();
    },
    submitAddBatchForm() {
      this.$refs["addBatchForm"].validate(valid => {
        if (valid) {
          const text = this.addBatchForm.contentList;
          const contentList = this.textareaArr(text);

          addBatch({
            contentList: contentList
          }).then(response => {
            if (response && response.code == '0') {
              this.$modal.msgSuccess("批量新增成功");
              this.openAddBatch = false;
              this.getList();
            }
          });
        }
      })
    },
    handleCount() {
      const count = this.takeForm.count;
      if (this.isNumber(count) === false) {
        this.$modal.msgWarning("请输入数字");
        return;
      }
      getTakeContent({
        count: count
      }).then(response => {
        if (response && response.code == '0') {
          const list = response.data;
          let ids = [];
          let contentList = '';
          list.forEach(item => {
            ids.push(item.id);
            contentList += item.content + '\r\n';
          })
          this.takeForm.ids = ids;
          this.takeForm.contentList = contentList;
        }
      });
    },
    isNumber(value) {
      return typeof value === 'number' && !isNaN(value);
    },
    clipboardSuccess() {
      this.$modal.msgSuccess("复制成功");
    },
    submitTakeForm() {
      this.$refs["takeForm"].validate(valid => {
        if (valid) {
          const ids = this.takeForm.ids;
          console.log('ids:', ids)
          if (ids.length > 0) {
            updateTake({
              ids: ids,
              status: 2
            }).then(async response => {
              if (response && response.code == '0') {
                this.$modal.msgSuccess("领取成功")
                this.takeClose();
                this.getList();
              }
            })
          }
        }
      })
    },
    textareaArr(str) {
      if (typeof str == "string") {
        return str.split(/[(\r\n)\r\n]+/);
      } else {
        return []
      }
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
