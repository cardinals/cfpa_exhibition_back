new Vue({
    el: '#app',
    data: function() {
        return { visible: false,
            awa:"",
            //权限下拉框
            allPermissions: [],
            //搜索表单
            searchForm: {
                permissionname: "",
                createTimeBegin: "",
                createTimeEnd: ""
            },
            tableData: [],
            //后台返回全部资源列表
            allPermissionList:[],
            rowdata:'',
            //表高度变量
            tableheight :445,
            //显示加载中样
            loading: false,
            labelPosition: 'right',
            //多选值
            multipleSelection: [],
            //当前页
            currentPage: 1,
            //分页大小
            pageSize: 10,
            //总记录数
            total:10,
            //序号
            indexData:0,
            //删除的弹出框
            deleteVisible: false,
            //新建页面是否显示
            addFormVisible:false,
            addLoading:false,
            addFormRules:{
                permissionname: [{ required: true, message: "请输入权限名称", trigger: "blur" }],
                permissioninfo: [{ required: true, message: "请输入权限描述", trigger: "blur" }]
            },
            //新建数据
            addForm:{
                permissionname: "",
                permissioninfo: ""
            },
            //选中的值显示
            sels: [],
            //选中的序号
            selectIndex: -1,
            //修改界面是否显示
            editFormVisible: false,
            editLoading: false,
            editFormRules: {
                permissionname: [{ required: true, message: "请输入权限名称", trigger: "blur" }],
                permissioninfo: [{ required: true, message: "请输入权限描述", trigger: "blur" }]
            },
            //修改界面数据
            editForm: {
                permissionname: "",
                permissioninfo: ""
            }
        }
    },
    created: function () {
        this.getAllPermissions();
        this.searchClick();
    },
    methods:{
        //所有的权限列表
        getAllPermissions: function(){
            axios.get('/permission/getAll').then(function(res){
                this.allPermissions = res.data.result;
            }.bind(this),function(error){
                console.log(error);
            })
        },
        handleNodeClick(data) {
            console.log(data);
        },

        //日期控件格式化
        begindateChange(val) {
            this.searchForm.createTimeBegin = val;
        },
        enddateChange(val) {
            this.searchForm.createTimeEnd = val;
        },

        //表格中日期格式化
        dateFormat: function(row, column){
            var rowDate = row[column.property];
            if(rowDate == null || rowDate == ""){
                return '';
            }else{
                var date = new Date(rowDate);
                if(date == undefined){
                    return '';
                }
                var month = '' + (date.getMonth() + 1),
                    day = '' + date.getDate(),
                    year = date.getFullYear();

                if (month.length < 2) month = '0' + month;
                if (day.length < 2) day = '0' + day;

                return [year, month, day].join('-')
            }
        },

        //查询，初始化
        searchClick: function() {
            var _self = this;
            if(this.searchForm.createTimeBegin!="" && this.searchForm.createTimeEnd!="" && this.searchForm.createTimeBegin>this.searchForm.createTimeEnd){
                _self.$message({
                    message: "时间选择错误！",
                    type: "error"
                });
                return;
            }
            var params = {
                permissionname: this.searchForm.permissionname,
                createTimeBegin: this.searchForm.createTimeBegin,
                createTimeEnd: this.searchForm.createTimeEnd
            };

            axios.post('/permission/findByVO', params).then(function(res){
                this.tableData = res.data.result;
                this.total = res.data.result.length;
            }.bind(this),function(error){
                console.log(error)
            })
        },

        //表格勾选事件
        selectionChange: function(val) {
            for (var i = 0; i < val.length; i++) {
                var row = val[i];
            }
            this.multipleSelection = val;
            //this.sels = sels
            console.info(val);
        },

        //表格重新加载数据
        loadingData: function() {
            var _self = this;
            _self.loading = true;
            setTimeout(function() {
                console.info("加载数据成功");
                _self.loading = false;
            }, 300);
        },

        //新建：弹出Dialog
        addClick: function() {
            var _self = this;
            _self.addFormVisible = true;

        },

        //新建：保存
        addSubmit: function(val) {
            var _self=this;
            axios.get('/permission/getNum/' + this.addForm.permissionname).then(function(res){
                if(res.data.result != 0){
                    _self.$message({
                        message: "权限名已存在!",
                        type: "error"
                    });
                }else{
                    var params = {
                        permissionname: val.permissionname,
                        permissioninfo: val.permissioninfo
                    }
                    axios.post('/permission/insertByVO', params).then(function(res){
                        var addData = res.data.result;
                        addData.createTime = new Date();
                        _self.tableData.unshift(addData);
                        _self.total = _self.tableData.length;
                    }.bind(this),function(error){
                        console.log(error)
                    })
                    this.addFormVisible = false;
                    _self.loadingData();//重新加载数据
                }
            }.bind(this),function(error){
                console.log(error)
            })
        },

        //修改：弹出Dialog
        editClick: function() {
            var _self = this;
            var multipleSelection = this.multipleSelection;
            if (multipleSelection.length < 1) {
                _self.$message({
                    message: "请至少选中一条记录",
                    type: "error"
                });
                return;
            }
            else if(multipleSelection.length>1){
                _self.$message({
                    message:"只能选一条记录进行编辑",
                    type:"error"
                });
                return;
            }

            var permissionid = multipleSelection[0].permissionid;

            //获取选择的行号
            for(var k=0;k< _self.tableData.length;k++) {
                if(_self.tableData[k].permissionid == permissionid){
                    _self.selectIndex = k;
                }
            }

            //直接从table中取值放在form表单中
            this.editForm = Object.assign({}, _self.tableData[_self.selectIndex]);
            this.editFormVisible = true;
        },

        //修改：保存
        editSubmit: function(val) {
            var params = {
                permissionid: val.permissionid,
                permissionname: val.permissionname,
                permissioninfo: val.permissioninfo
            };
            axios.post('/permission/updateByVO', params).then(function(res){
                this.tableData[this.selectIndex].permissionname = val.permissionname;
                this.tableData[this.selectIndex].permissioninfo = val.permissioninfo;
                this.tableData[this.selectIndex].alterName = res.data.result.alterName;
                this.tableData[this.selectIndex].alterTime = new Date();
            }.bind(this),function(error){
                console.log(error)
            })
            this.editFormVisible = false;
        },

        //删除:批量删除
        removeSelection: function() {
            var _self = this;
            var multipleSelection = this.multipleSelection;
            if (multipleSelection.length < 1) {
                _self.$message({
                    message: "请至少选中一条记录",
                    type: "error"
                });
                return;
            }
            debugger;
            var ids = [];
            for (var i = 0; i < multipleSelection.length; i++) {
                var row = multipleSelection[i];
                ids.push(row.permissionid);
            }
            this.$confirm("确认删除吗？", "提示", {type: "warning"})
                .then(function() {
                    var params = {
                        ids: ids
                    }
                    axios.post('/permission/deleteByIds', params).then(function(res){
                        for(var d =0;d< ids.length;d++){
                            for(var k=0;k< _self.tableData.length;k++) {
                                if(_self.tableData[k].permissionid == ids[d]){
                                    _self.tableData.splice(k,1);
                                }
                            }
                        }
                        _self.$message({
                            message: "删除成功",
                            type: "success"
                        });
                        _self.total = _self.tableData.length;
                        _self.loadingData(); //重新加载数据
                    }.bind(this),function(error){
                        console.log(error)
                    })

                })
                .catch(function(e) {
                    if (e != "cancel") console.log("出现错误：" + e);
                });
        },
        //分页大小修改事件
        pageSizeChange: function(val) {
            console.log("每页 " + val + " 条");
            this.pageSize = val;
            var _self = this;
            _self.loadingData(); //重新加载数据
        },
        //当前页修改事件
        currentPageChange: function(val) {
            this.currentPage = val;
            console.log("当前页: " + val);
            var _self = this;
            _self.loadingData(); //重新加载数据
        },


        closeDialog:function(val){
            this.addFormVisible = false;
            val.permissionname = "";
            val.permissioninfo = "";
            this.$refs["addForm"].resetFields();
        }
    },

})