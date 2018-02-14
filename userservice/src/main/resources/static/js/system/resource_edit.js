new Vue({
    el: '#app',
    data: function() {
        return {
            visible: false,
            tableheight :445,//表高度变量
            //角色下拉框
            allRoles: [],
            //查询表单
            searchForm: {
                rolename:'',
                createTimeBegin: '',
                createTimeEnd: ''
            },
            //表数据
            tableData: [],
            //后台返回全部资源列表
            allResourceList:[],
            defaultKeys: ['17'],

            //删除成功后台返回数据
            delStatus: 'success',
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
            //资源列表是否显示
            resourceVisible:false,
            //删除的弹出框
            deleteVisible: false,
            //新建页面是否显示
            addFormVisible:false,
            addFormRules:{
                rolename: [{ required: true, message: "请输入角色名称", trigger: "blur" }],
                roleinfo: [{ required: true, message: "请输入角色描述", trigger: "blur" }]
            },
            //新建数据
            addForm:{
                rolename:"",
                roleinfo: "",
                resource:[]
            },
            //选中的序号
            selectIndex: -1,
            //修改界面是否显示
            editFormVisible: false,
            editFormRules: {
                rolename: [{ required: true, message: "请输入角色名称", trigger: "blur" }]
            },
            //修改界面数据
            editForm: {
                rolename:"",
                roleinfo: "",
                resource:[]
            },
            //树状选中状态
            defaultCheckKeys: [],

            //树结构配置
            defaultProps: {
                children: 'children',
                label: 'resourceinfo'
            },

            //角色对应资源
            resourceList:[],

            //新修改页面的复选树
            checkprops: {
                label: 'name',
                children: 'zones'
            },
            count: 1,

        }
    },
    created: function () {
        this.getAllRoles();
        this.searchClick();
    },
    methods:{
        //所有的角色列表
        getAllRoles: function(){
            axios.get('/role/getAll').then(function(res){
                this.allRoles = res.data.result;
            }.bind(this),function(error){
                console.log(error);
            })
        },
        getAllResources: function(){
            axios.get('/resource/getAll').then(function(res){
                this.allResourceList = res.data.result;
            }.bind(this),function (error) {
                console.log(error);
            })
        },

        //日期控件变化时格式化
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
                rolename: this.searchForm.rolename,
                createTimeBegin: this.searchForm.createTimeBegin,
                createTimeEnd: this.searchForm.createTimeEnd
            };

            axios.post('/role/findByVO', params).then(function(res){
                this.tableData = res.data.result;
                this.total = res.data.result.length;
            }.bind(this),function(error){
                console.log(error)
            })
        },

        //资源详情
        resourceDetails: function(id){
            var _self = this;
            _self.resourceVisible=true;
            axios.get('/resource/getResource/' + id).then(function(res){
                this.resourceList = res.data.result;
            }.bind(this),function(error){
                console.log(error)
            })

        },

        handleNodeClick(data) {
            console.log(data);
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
                console.info("加载数据成功");
                _self.loading = false;
            }, 300);
        },

        //新建：弹出Dialog
        addClick: function() {
            var _self = this;
            _self.addFormVisible = true;
            this.getAllResources();
        },
        //新建：提交
        addSubmit: function(val) {
            var _self=this;
            axios.get('/role/getNum/' + this.addForm.rolename).then(function(res){
                if(res.data.result != 0){
                    _self.$message({
                        message: "角色名已存在!",
                        type: "error"
                    });
                }else{
                    val.resource = this.$refs.tree.getCheckedNodes();
                    var params = {
                        rolename: val.rolename,
                        roleinfo: val.roleinfo,
                        resources: val.resource
                    }
                    axios.post('/role/insertByVO', params).then(function(res){
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

        //删除：批量删除
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
            var ids = [];
            for (var i = 0; i < multipleSelection.length; i++) {
                var row = multipleSelection[i];
                ids.push(row.roleid);
            }
            this.$confirm("确认删除吗？", "提示", {type: "warning"})
                .then(function() {
                    var params = {
                        ids: ids
                    }
                    axios.post('/role/deleteByIds', params).then(function(res){
                        for(var d =0;d< ids.length;d++){
                            for(var k=0;k< _self.tableData.length;k++) {
                                if(_self.tableData[k].roleid == ids[d]){
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

            var roleid = multipleSelection[0].roleid;

            axios.get('/resource/getChildren/' + roleid).then(function(res){
                this.defaultCheckKeys = res.data.result;
                //获取选择的行号
                for(var k=0;k< _self.tableData.length;k++) {
                    if(_self.tableData[k].roleid == roleid){
                        _self.selectIndex = k;
                    }
                }

                //直接从table中取值放在form表单中
                this.editForm = Object.assign({}, _self.tableData[_self.selectIndex]);
                this.getAllResources();
            }.bind(this),function(error){
                console.log(error)
            })
            this.editFormVisible = true;
        },

        //修改：保存按钮
        editSubmit: function(val) {
            val.resource = this.$refs.tree.getCheckedNodes();

            var params = {
                roleid: val.roleid,
                rolename: val.rolename,
                roleinfo: val.roleinfo,
                resources: val.resource
            };
            axios.post('/role/updateByVO', params).then(function(res){
                this.tableData[this.selectIndex].rolename = val.rolename;
                this.tableData[this.selectIndex].roleinfo = val.roleinfo;
                this.tableData[this.selectIndex].alterName = res.data.result.alterName;
                this.tableData[this.selectIndex].alterTime = new Date();
                this.tableData[this.selectIndex].resources = val.resource;
            }.bind(this),function(error){
                console.log(error)
            })
            this.editFormVisible = false;
        },

        closeDialog:function(val){
            this.addFormVisible = false;
            val.rolename = "";
            val.roleinfo = "";
            this.defaultCheckKeys = [];
            this.$refs["addForm"].resetFields();
        },
        closeresourceDialog:function(){
            this.resourceVisible=false;
        }
    },

})