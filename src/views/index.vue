<template>
  <div style="padding:10px;background-color:#f8f8f8;">

    <el-row :gutter="10">
      <el-col :xs="0" :sm="1" :md="3" :lg="4" :xl="6">
        <div class="grid-content bg-purple"></div>
      </el-col>
      <el-col :xs="24" :sm="22" :md="18" :lg="16" :xl="12">
        <div class="grid-content bg-purple-light">
          <div class="center-content">
            <el-card style="margin-bottom:5px;">
              <el-form :model="queryParams" ref="queryForm" :inline="true" label-width="100px"
                       style="margin-bottom:-20px;">
                <el-form-item label="号码查询" prop="keywords">
                  <el-input v-model="queryParams.keywords" placeholder="请输入号码" clearable size="medium"
                            @keyup.enter.native="handleQuery"/>
                </el-form-item>
                <el-form-item>
                  <el-button type="primary" icon="el-icon-search" size="medium" @click="handleQuery">搜索</el-button>
                  <el-button icon="el-icon-refresh" size="medium" @click="resetQuery">重置</el-button>
                </el-form-item>
              </el-form>
            </el-card>

            <el-card style="padding-bottom:100px;">
              <div class="grid-content content-card">
                <span style="font-size: 25vw;">{{ showData.label }}</span>
              </div>
            </el-card>
          </div>
        </div>
      </el-col>
      <el-col :xs="0" :sm="1" :md="3" :lg="4" :xl="6">
        <div class="grid-content bg-purple"></div>
      </el-col>
    </el-row>

  </div>
</template>

<script>
import {pageNumber} from "@/api/num/manager";

export default {
  name: 'Index',
  data() {
    return {
      // 查询参数
      queryParams: {
        keywords: null
      },
      showData: {
        label: null,
      }
    }
  },
  created() {
  },
  methods: {
    /** 搜索按钮操作 */
    handleQuery() {
      console.log('handler query')
      this.getData();
    },
    getData() {
      this.showData = {
        label: null,
      }
      if (this.queryParams.keywords == null || this.queryParams.keywords === "") {
        return;
      }
      pageNumber(this.queryParams).then(response => {
        this.showData = response.data.records[0];
      });
    },

    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.handleQuery();
    },
  }
}
</script>

<style lang="scss" scoped>
.el-col {
  border-radius: 4px;
}

.grid-content {
  border-radius: 4px;
  min-height: 36px;
}

.content-card {
  border: black 3px solid;
  min-height: 26rem;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}
</style>
