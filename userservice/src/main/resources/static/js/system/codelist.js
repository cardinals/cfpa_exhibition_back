new Vue({
    el: '#app',
    data: function() {
        return {
            visible: false,
            //搜索表单
            searchForm: {
                codetype: "",
                createTimeBegin: "",
                createTimeEnd: ""
            },
            tableData: [],
            //表高度变量
            tableheight :445,
            //显示加载中样
            loading: false,
            //多选值
            multipleSelection: [],
            //当前页
            currentPage: 1,
            //分页大小
            pageSize: 10,
            //总记录数
            total:10,
            //新建页面是否显示
            addFormVisible:false,
            addFormRules:{
                codetype: [{ required: true, message: "请输入代码集类型", trigger: "blur" }],
                codetypeName: [{ required: true, message: "请输入代码集类型名称", trigger: "blur" }]
            },
            //新建数据
            addForm:{
                permissionname: "",
                permissioninfo: ""
            },
            //选中的序号
            selectIndex: -1,
            //修改界面是否显示
            editFormVisible: false,
            editFormRules: {
                codetype: [{ required: true, message: "请输入代码集类型", trigger: "blur" }],
                codetypeName: [{ required: true, message: "请输入代码集类型名称", trigger: "blur" }]
            },
            //修改界面数据
            editForm: {
                codetype: "",
                codetypeName: ""
            }
        }
    },
    created: function () {
        this.searchClick();
    },
    methods:{
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

        codetypeCilck: function(val){
            window.location.href = this.$http.options.root + "/codelist/detail/" + val.codeid;
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
                codetype: this.searchForm.codetype,
                createTimeBegin: this.searchForm.createTimeBegin,
                createTimeEnd: this.searchForm.createTimeEnd
            };

            axios.post('/codelist/findByVO', params).then(function(res){
                this.tableData = res.data.result;
                this.total = res.data.result.length;
            }.bind(this),function(error){
                console.log(error)
            })
        },

        //表格勾选事件
        selectionChange: function(val) {
            this.multipleSelection = val;
        },

        //表格重新加载数据
        loadingData: function() {
            var _self = this;
            _self.loading = true;
            setTimeout(function() {
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
            axios.get('/codelist/getNum/' + this.addForm.codetype).then(function(res){
                if(res.data.result != 0){
                    _self.$message({
                        message: "代码集类型已存在!",
                        type: "error"
                    });
                }else{
                    var params = {
                        codetype: val.codetype.trim(),
                        codetypeName: val.codetypeName.trim()
                    }
                    axios.post('/codelist/insertByVO', params).then(function(res){
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

            var codeid = multipleSelection[0].codeid;

            //获取选择的行号
            for(var k=0;k< _self.tableData.length;k++) {
                if(_self.tableData[k].codeid == codeid){
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
                codeid: val.codeid,
                codetype: val.codetype.trim(),
                codetypeName: val.codetypeName.trim(),
                remark: val.remark,
                language: val.language
            };
            axios.post('/codelist/updateByVO', params).then(function(res){
                this.tableData[this.selectIndex].codetype = val.codetype;
                this.tableData[this.selectIndex].codetypeName = val.codetypeName;
                this.tableData[this.selectIndex].remark = val.remark;
                this.tableData[this.selectIndex].language = val.language;
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
                ids.push(row.codeid);
            }
            this.$confirm("确认删除吗？", "提示", {type: "warning"})
                .then(function() {
                    var params = {
                        ids: ids
                    }
                    axios.post('/codelist/deleteByIds', params).then(function(res){
                        for(var d =0;d< ids.length;d++){
                            for(var k=0;k< _self.tableData.length;k++) {
                                if(_self.tableData[k].codeid == ids[d]){
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