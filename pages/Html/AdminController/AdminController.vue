<template>
    <section class="AdminController">
        <!--操作按钮-->
        <el-button type="primary" @click="addAdmin" :disabled="addDisabled">添加管理员</el-button>
        <!--列表-->
        <el-table :data="AdminList" border style="width: 100%">
            <el-table-column prop="id" label="ID" width="70"></el-table-column>
            <el-table-column prop="name" label="姓名" width="80"></el-table-column>
            <el-table-column prop="phone" label="手机"></el-table-column>
            <el-table-column prop="email" label="邮箱"></el-table-column>
            <el-table-column prop="adminGroupName" label="所属管理组"></el-table-column>
            <el-table-column prop="createTime" label="添加时间"></el-table-column>
            <el-table-column prop="updateTime" label="更新时间"></el-table-column>
            <el-table-column prop="operates" label="操作">
                <template scope="scope">
                    <el-button type="info" @click="modify(scope.$index, scope.row)" size="small"
                               :disabled="modifyDisabled">编辑
                    </el-button>
                </template>
            </el-table-column>
        </el-table>
        <!--工具条，分页-->
        <el-pagination @current-change="handleCurrentChange"
                       :current-page.sync="currentPage"
                       layout="prev, pager, next, jumper" :total="total" style="float:right;margin:20px 10px 0;">
        </el-pagination>
        <!--新增界面-->
        <el-dialog title="添加管理员" :visible.sync="addAdminVisible" :close-on-click-modal="false" @close="closeAddAdmin">
            <el-form :model="addAdminForm" :rules="addAdminRules" ref="addAdminForm">
                <el-form-item label="姓名" prop="name" :label-width="formLabelWidth">
                    <el-input v-model="addAdminForm.name" auto-complete="off" placeholder="请输入姓名"></el-input>
                </el-form-item>
                <el-form-item label="手机" prop="phone" :label-width="formLabelWidth">
                    <el-input v-model="addAdminForm.phone" auto-complete="off" placeholder="请输入手机号码" :maxlength="11"></el-input>
                </el-form-item>
                <el-form-item label="邮箱" prop="email" :label-width="formLabelWidth">
                    <el-input v-model="addAdminForm.email" auto-complete="off" placeholder="请输入邮箱"></el-input>
                </el-form-item>
                <el-form-item label="所属管理组" prop="select" :label-width="formLabelWidth">
                    <el-select v-model="addAdminForm.select" placeholder="请选择管理组" >
                        <el-option v-for='(item,index) in options' :label="item.name" :value="item.id" :key='index'></el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="AdminReset">重置</el-button>
                <el-button type="success" @click="addAdminSub">立即提交</el-button>
            </div>
        </el-dialog>
        <!--编辑界面-->
        <el-dialog title="编辑管理员" :visible.sync="editAdminVisible" :close-on-click-modal="false" @close="closeEditAdmin">
            <el-form :model="editAdminForm" ref="editAdminForm">
                <el-form-item label="姓名" :label-width="formLabelWidth">
                    <el-input v-model="editAdminForm.name" auto-complete="off" placeholder="请输入姓名" :disabled="true"></el-input>
                </el-form-item>
                <el-form-item label="手机" :label-width="formLabelWidth">
                    <el-input v-model="editAdminForm.phone" auto-complete="off" placeholder="请输入手机号码" :maxlength="11" :disabled="true"></el-input>
                </el-form-item>
                <el-form-item label="邮箱" :label-width="formLabelWidth">
                    <el-input v-model="editAdminForm.email" auto-complete="off" placeholder="请输入邮箱" :disabled="true"></el-input>
                </el-form-item>
                <el-form-item label="所属管理组" prop="select" :label-width="formLabelWidth">
                    <el-select v-model="editAdminForm.select" placeholder="请选择管理组" >
                        <el-option v-for='item in options' :label="item.name" :value="item.id"
                                   :key="item.id"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="状态" :label-width="formLabelWidth">
                    <el-radio-group v-model="editAdminForm.radio">
                        <el-radio label="DELETED" style="margin-left:20px">删除</el-radio>
                        <el-radio label="NORMAL">正常</el-radio>
                    </el-radio-group>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="success" @click="editAdminSub">立即提交</el-button>
            </div>
        </el-dialog>
    </section>
</template>

<script>
    import moment from 'moment'

    export default {
        data() {
            let phoneValidate = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('请输入手机号码'));
                } else if (!/^1[345678]\d{9}$/.test(value)) {
                    callback(new Error('手机号码格式不正确'));
                } else {
                    callback();
                }
            };
            return {
                /*列表*/
                AdminList: [],

                /*新增页面*/
                addDisabled: true,
                addAdminVisible: false,
                addAdminForm: {
                    name: '',
                    phone: '',
                    email: '',
                    select: '',
                },
                addAdminRules: {
                    name: [{required: true, message: '请输入姓名', trigger: 'blur'}],
                    phone: [{validator: phoneValidate, trigger: 'blur'}],
                    email: [
                        {required: true, message: '请输入邮箱', trigger: 'blur'},
                        {type: 'email', message: '邮箱格式不正确', trigger: 'blur'}
                    ],
                    select: [
                        {required: true, message: '请选择所属管理组', trigger: 'blur,change', type: 'number'}
                    ],
                },

                /*新增界面的下拉框*/
                formLabelWidth: '120px',
                options: [],

                /*分页*/
                currentPage: 1,
                total: 0,

                /*编辑页面*/
                modifyDisabled: true,
                editAdminVisible: false,
                editAdminForm: {
                    id: '',
                    name: '',
                    phone: '',
                    email: '',
                    select: '',
                    radio: 'NORMAL',
                },
            }
        },
        methods: {
            /*获取列表信息*/
            getList() {
                this.$DB.Admin.list({
                    pageNum: this.currentPage,
                    pageSize: '10'
                }).then(result => {
                    /*权限判断，实现按钮是否可执行。*/
                    if (result.operates.includes("添加")) {
                        this.addDisabled = false;
                    }
                    if (result.operates.includes("修改")) {
                        this.modifyDisabled = false;
                    }
                    /*工具栏，分页*/
                    this.total = result.total;
                    /*列表展示，时间格式转换 */
                    this.AdminList = result.pageList.map(item => {
                        return Object.assign({}, item, {
                            createTime: moment(item.createTime).format('YYYY-MM-DD HH:mm:ss'),
                            updateTime: moment(item.updateTime).format('YYYY-MM-DD HH:mm:ss')
                        });
                    });
                });
            },
            /*重置*/
            AdminReset() {
                this.$refs.addAdminForm.resetFields();
            },
            /*显示新增管理员对话框页面*/
            addAdmin() {
                this.addAdminVisible = true;
                /*所属管理组列表*/
                this.$DB.AdminGroup.list({
                }).then(result => {
                    result.pageList.map(item =>{
                        let select = {
                            id: item.id,
                            name: item.name
                        };
                        this.options.push(select);
                    });
                });
            },
            /*新增*/
            addAdminSub() {
                this.$refs.addAdminForm.validate((valid) => {
                    if (valid) {
                        this.$DB.Admin.add({
                            name: this.addAdminForm.name,
                            phone: this.addAdminForm.phone,
                            email: this.addAdminForm.email,
                            adminGroupId: this.addAdminForm.select
                        }).then(result => {
                            this.getList();
                            this.addAdminVisible = false;
                            this.$message({
                                type: 'success',
                                message: '添加管理员成功'
                            });
                        });
                    }else{
                        this.$message({
                            type: 'error',
                            message: 'error submit!!'
                        });
                        return false;
                    }
                });
            },
            /*关闭新增对话框*/
            closeAddAdmin(){
                this.options = [];
                this.AdminReset();
            },
            /*关闭编辑对话框*/
            closeEditAdmin(){
                this.options = [];
            },
            /*显示编辑对话框*/
            modify(index,row) {
                this.editAdminVisible = true;
                this.editAdminForm = {
                    name: row.name,
                    email: row.email,
                    phone: row.phone,
                    select: row.adminGroupId,
                    id: row.id,
                    radio: 'NORMAL'
                };
                /*所属管理组列表*/
                this.$DB.AdminGroup.list({
                }).then(result => {
                    result.pageList.map(item =>{
                        let select = {
                            id: item.id,
                            name: item.name
                        };
                        this.options.push(select);
                    });
                });
            },
            /*编辑页面提交*/
            editAdminSub(){
                this.$DB.Admin.modify({
                    id: this.editAdminForm.id,
                    adminGroupId: this.editAdminForm.select,
                    status: this.editAdminForm.radio
                }).then(result => {
                    this.editAdminVisible = false;
                    this.$message({
                        type: 'success',
                        message: '修改成功'
                    });
                    this.getList();
                })
            },
            /*分页跳转到输入的页面*/
            handleCurrentChange(val) {
                this.currentPage = val;
                this.getList();
            },
        },
        mounted() {
            /*列表*/
            this.getList();
        },
    }
</script>


