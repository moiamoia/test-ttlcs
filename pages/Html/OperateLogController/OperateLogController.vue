<template>
    <section class='OperateLogController'>
        <!-- 操作界面-->
        <el-form :inline="true" :model="OperateLogControllerForm">
            <el-form-item>
                <el-input v-model="OperateLogControllerForm.name" placeholder="操作人"></el-input>
            </el-form-item>
            <el-form-item>
                <el-input v-model="OperateLogControllerForm.module" placeholder="模块"></el-input>
            </el-form-item>
            <el-form-item>
                <el-input v-model="OperateLogControllerForm.submodule" placeholder="子模块"></el-input>
            </el-form-item>
            <el-form-item>
                <el-input v-model="OperateLogControllerForm.operate" placeholder="操作名称"></el-input>
            </el-form-item>
            <el-form-item>
                <el-date-picker type="datetime" v-model="OperateLogControllerForm.start"
                                placeholder="开始时间"></el-date-picker>
            </el-form-item>
            <el-form-item>
                <el-date-picker type="datetime" v-model="OperateLogControllerForm.end"
                                placeholder="结束时间"></el-date-picker>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="getList">查询</el-button>
            </el-form-item>
        </el-form>
        <!-- 列表-->
        <el-table :data="OperateLogControllerList" style="width: 100%" border>
            <el-table-column prop="id" label="ID" width="70"></el-table-column>
            <el-table-column prop="operatorName" label="操作人" width="100"></el-table-column>
            <el-table-column prop="module" label="模块"></el-table-column>
            <el-table-column prop="submodule" label="子模块"></el-table-column>
            <el-table-column prop="operate" label="操作"></el-table-column>
            <el-table-column prop="respCode" label="结果">
                <template scope="scope">
                    <span v-if='scope.row.respCode === 0' class="success">成功</span>
                    <span v-else class="fail">失败</span>
                </template>
            </el-table-column>
            <el-table-column prop="operateTime" label="操作时间" width="200"></el-table-column>
            <el-table-column prop="operateIp" label="ip"></el-table-column>
        </el-table>
        <!-- 分页-->
        <el-pagination  @current-change="handleCurrentChange" :current-page.sync="currentPage"
                        layout="prev, pager, next, jumper" :total="total" style="float:right;margin:20px 10px 0;">
        </el-pagination>
    </section>
</template>

<script>
    import moment from 'moment'
    export default {
        data() {
            return {
                /*操作表单*/
                OperateLogControllerForm: {
                    name: '',
                    module: '',
                    submodule: '',
                    operate: '',
                    start: '',
                    end: '',
                },
                /*列表*/
                OperateLogControllerList: [],
                /*分页*/
                currentPage: 1,
                total: 0,
            }
        },
        methods: {
            /* 列表,查询*/
            getList() {
                this.$DB.OperateLog.list({
                    pageSize: '10',
                    pageNum: this.currentPage,
                    name: this.OperateLogControllerForm.name,
                    module: this.OperateLogControllerForm.module,
                    submodule: this.OperateLogControllerForm.submodule,
                    operate: this.OperateLogControllerForm.operate,
                    start: moment(this.OperateLogControllerForm.start).format('YYYY-MM-DD HH:mm:ss'),
                    end: moment(this.OperateLogControllerForm.end).format('YYYY-MM-DD HH:mm:ss'),
                }).then(result => {
                    /*分页栏*/
                    this.total = result.total;
                    /*列表*/
                    this.OperateLogControllerList = result.pageList.map(item => {
                        return Object.assign({}, item, {
                            operateTime: moment(item.operateTime).format('YYYY-MM-DD HH:mm:ss'),
                        });
                    });
                })
            },
            /*分页，当前第几页*/
            handleCurrentChange(val) {
                this.currentPage = val;
                this.getList();
            }
        },
        mounted() {
            /*列表*/
            this.getList();
        }
    }
</script>

