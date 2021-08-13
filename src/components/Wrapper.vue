<template lang="zh">
    <div class="wrapper">
			<div class="container-fluid">
				<div class="row fill-h">
                    <!--左侧-->
					<div class="col-lg-3 fill-h">
						<div class="xpanel-wrapper xpanel-wrapper-Up">
							<div class="xpanel">
                                <!--账号余额-->
								<div class="fill-h" id="Account_Info">
                                    <img src="../assets/img/WrapperIMG/余额.png"><span>当前代金券余额: {{Account_Coupons_Remain}} 元</span><br/>
                                    <img src="../assets/img/WrapperIMG/支出.png"><span>本月开销: {{Account_Bill}} 元</span>
                                </div>
							</div>
						</div>
						<div class="xpanel-wrapper xpanel-wrapper-Down">
							<div class="xpanel">
                                <!--阿里云开销类型-->
								<div class="fill-h" id="Month_Bill"></div>
							</div>
						</div>
					</div>
                    <!--中间-->
					<div class="col-lg-6 fill-h">
						<div class="xpanel-wrapper xpanel-wrapper-1">
							<div class="xpanel">
                                <!--内网数据流量-->
								<div class="fill-h" id="Internet_IO">

                                </div>
							</div>
						</div>
					</div>
                    <!--右侧-->
					<div class="col-lg-3 fill-h">
						<div class="xpanel-wrapper xpanel-wrapper-3">
							<div class="xpanel">
								<div class="fill-h" id="Bill_Pie"></div>
							</div>
						</div>
						<div class="xpanel-wrapper xpanel-wrapper-3">
							<div class="xpanel">
								<div class="fill-h" id="Disk_Info"></div>
							</div>
						</div>
						<div class="xpanel-wrapper xpanel-wrapper-3">
							<div class="xpanel">
								<div class="fill-h" id="countyMap"></div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
</template>

<script>

export default {
data() {
    return {
        //余额
        Account_Coupons_Remain:0,
        //应结
        Account_Bill:0,
        info:[],
        //云盘读写带宽汇总
        BPS_Read_Write:[],
        //时间戳
        TimeStamp:[],
        //CPU占用率
        CPU:[],
        //云盘写入带宽
        BPSWrite:[],
        //云盘读取带宽
        BPSRead:[],
        //间隔时间内网发送数据流量/kbits
        IntranetTX:[],
        //间隔时间内网接收数据流量/kbits
        IntranetRX:[],
        //内网带宽
        IntranetBandwidth:[]
        // //间隔时间公网发送数据流量/kbits
        // InternetTX:[],
        // //间隔时间公网接收数据流量/kbits
        // InternetRX:[]
        }
    },
methods: {
    //获取实例数据
    DescribeInstanceMonitorData(){
        var that=this
        that.axios.get('http://localhost:1234/Ali?DescribeInstanceMonitorData').then(res=>{
              that.info=res.data.MonitorData.InstanceMonitorData
                 //处理数据
                 that.GetData()
                 //绘图
                 //that.DrawBPS()
                 //that.DrawCPU()
                 that.Draw_dynamic_Intranet()
        })
    },
    //处理数据
    GetData(){
        var that =this
        //处理info中的数据
        that.info.forEach((element)=>{
            //正则式筛选出分秒钟
            that.TimeStamp.push((/(?<=T).*?(?=Z)/).exec(element.TimeStamp))
            //that.CPU.push(element.CPU)
            that.BPSRead.push(element.BPSRead)
            that.BPSWrite.push(element.BPSWrite)
            //换算成Mb
            that.IntranetTX.push((element.IntranetTX/8000).toFixed(2))
            that.IntranetRX.push((element.IntranetRX/8000).toFixed(2))
            that.IntranetBandwidth.push(element.IntranetBandwidth)
        });
            (()=>{
                //小数化简
            that.BPSRead.forEach((element,index)=>{
                that.BPS_Read_Write.push([
                    parseFloat(element).toFixed(2),
                    parseFloat(that.BPSWrite[index]/128).toFixed(2)])
                })
            })()
    },
    //代金券详情
    QueryCashCoupons(){
        var that=this
        that.axios.get('http://localhost:1234/Ali?QueryCashCoupons').then(res=>{
            that.Account_Coupons_Remain=res.data.Data.CashCoupon[0].Balance
        })
//                 let Used=(res.data.Data.CashCoupon[0].NominalValue-res.data.Data.CashCoupon[0].Balance).toFixed(2)
//                 let Remain=res.data.Data.CashCoupon[0].Balance
//                 that.DrawCashCoupon(Used,Remain)

    },
    //查询账单总览
    QueryBillOverview(){
        var that=this
        that.axios.get('http://localhost:1234/Ali?QueryBillOverview').then(res=>{
             res=res.data.Data
            // 账单详情
            let BillInfo=[]
            //开销类型
            let BillTypes=[]
            //应付金额
            let PretaxAmount=[]
            // 账单详情
            BillInfo=[res.Items]
            //console.log(BillInfo)
            //总开销
            //let Total=0
            BillInfo.forEach(element=>{
                element.Item.forEach((element,index)=>{
                    if(BillTypes.indexOf(element.ProductDetail)==-1){
                        //处理账单类型
                        BillTypes.push(element.ProductDetail)
                        //没开销类型没重复，则将对应金额加入数组
                        PretaxAmount.push(element.PretaxAmount)
                        that.Account_Bill+=element.PretaxAmount
                        //Total+=element.PretaxAmount
                    }else{
                        //console.log(index)
                        //如果重复
                        PretaxAmount[index-1]+=element.PretaxAmount
                        that.Account_Bill+=element.PretaxAmount
                        //Total+=element.PretaxAmount
                    }
                })
            })
            //console.log(BillTypes,PretaxAmount)
            that.DrawQueryBillOverview(res.BillingCycle,BillTypes,PretaxAmount)   
        })
    },
    //云盘余量图
    DrawDiskRemain(){
        var that=this
        let chart=this.$echarts.init(document.getElementById("Disk_Info"))
        that.axios.get('http://localhost:1234/Ali?DescribeDisks')
        .then((res)=>{
            //let size=
            
            let percent= (res.data.Disks.Disk[3].Size/12).toFixed(0)+'%'
            console.log(res.data.Disks.Disk[3].Size)
            let option={
                title:{
                    text:'云盘使用情况',
                    textStyle:{
                        color:'#b3ccf8'
                    }
                },
                series: [
                    {
                    label:{
                        normal:{
                                    show:true,
                                    formatter:`${percent}`+'\n\n'+`${res.data.Disks.Disk[3].Size}`+'G / '+'12G',
                                    textStyle:{
                                        fontSize: 18,
                                        color:'#b3ccf8'
                                    },
                                    position: 'center',
                                    labelLine:{show:true}
                                },

                    },

                    name: '访问来源',
                    type: 'pie',
                    radius: ['60%', '75%'],//这里是控制环形内半径和外半径
                    avoidLabelOverlap: false,
                    hoverAnimation:false,//此处查了好久属性//控制鼠标放置在环上时候的交互
                    data: [{
                            value: 12,
                        }, 
                        {
                            value: res.data.Disks.Disk[3].Size,
                        }]
                    },
                ],
            }
            chart.setOption(option)
        })
    },

    //开销类型图
    DrawQueryBillOverview(BillingCycle,BillTypes,PretaxAmount){
        //柱状图
        let chartBar=this.$echarts.init(document.getElementById("Month_Bill"))
        let chartPie=this.$echarts.init(document.getElementById("Bill_Pie"))
        //柱状图option
        var optionBar={
            title:{
                text:'阿里云:当前各组开销情况',
                left:'center',
                textStyle:{
                    color:'#b3ccf8'
                },
            },
             grid: {
            left: '5%',
            containLabel: true
            },
            tooltip:{
                trigger:'axis',
                axisPointer:{
                    type:'shadow'
                }
                
            },
            //图例内容
            legend:{
                x:'left',
                y:'bottom',
                data:BillTypes,
                textStyle:{
                    color:'#b3ccf8'
                }
            },

            xAxis:[
                {
                type:'category',
                data:[BillingCycle]
                }
            ],
            yAxis:[{
                type:"value"
            }],
            series:[],
        };
        var optionPie={
              title: {
                text: '阿里云:开销详单',
                left: 'center',
                textStyle:{
                    color:'#b3ccf8'
                },
            },
            tooltip: {
                trigger: 'item'
            },
            legend: {
                orient: 'horizontal',
                left: 'bottom',
                textStyle:{
                    color:'#b3ccf8'
                },
            },
            series: [
                {
                    name: '访问来源',
                    type: 'pie',
                    radius: '70%',
                    data: [
                        // {value: 1048, name: '搜索引擎'},
                        // {value: 735, name: '直接访问'},
                        // {value: 580, name: '邮件营销'},
                        // {value: 484, name: '联盟广告'},
                        // {value: 300, name: '视频广告'}
                    ],
                    emphasis: {
                        itemStyle: {
                            shadowBlur: 10,
                            shadowOffsetX: 0,
                            shadowColor: 'rgba(0, 0, 0, 0.5)',
                            
                        }
                    }
                }
            ]
        }
        BillTypes.forEach(function(element,index){
            let objBar={
                name:element,
                width:15,
                stack: '算法组',
                type:'bar',
                emphasis:{
                    focus:'series'
                    },
                data:[PretaxAmount[index].toFixed(2)]
            }
            let objPie={
                name:element,
                value:PretaxAmount[index].toFixed(2)
            }
            optionPie.series[0].data.push(objPie)
            optionBar.series.push(objBar)
        });
        console.log(optionPie)
        chartBar.setOption(optionBar)
        chartPie.setOption(optionPie)
},

    //内网带宽图
    Draw_IntranetBandwidth(){
        let chart=this.$echarts.init(document.getElementById('IntranetBandwidth'))
        let option = {
            title:{
                text:'实例内网带宽'
            },
            tooltip: {
                trigger: 'axis',
                formatter: function (params) {
                    return params[0].value+' Kb/s'
                },
            },
            xAxis: {
                type: 'category',
                data:this.TimeStamp
            },
            yAxis: {
                type: 'value'
            },
            series: [{
                data:this.IntranetBandwidth,
                type: 'line'
            }]
        };
        chart.setOption(option)
    },
    //流量动态图
    Draw_dynamic_Intranet(){
      let mychart=this.$echarts.init(document.getElementById('Internet_IO'))
      //let arr=new Array(10)
      let option={
            title: {
                text: '内网数据流量情况',
                subtext:'单位: Mb',
                textStyle:{
                    color:'#b3ccf8'
                    }
                },
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'cross',
                    label: {
                        backgroundColor: '#283b56',
                    }
                },
            },
            legend: {
                data:['发送数据流量', '接受数据流量'],
                textStyle:{
                    color:'#b3ccf8'
                }
            },
            dataZoom: {
                show: false,
                start: 0,
                end: 100
            },
            xAxis: [
                {
                    type: 'category',
                    boundaryGap: true,
                    //data:this.TimeStamp
                    data:(()=>{
                    //var now =this.TimeStamp[index]
                    //console.log(now)
                    var res = [];
                    //X轴刻度数量=10
                    var len = 10;
                    var i=0
                    while (len--) {
                        res.push(this.TimeStamp[i])
                        i++
                    }
                    return res;
                })()
                },

            ],
            yAxis: [
                {
                    type: 'value',
                    scale: true,
                    min: 0,
                },
                {
                    type: 'value',
                    scale: true,
                    min: 0,
                }
            ],
            //数据
            series: [
                {
                    name: '发送数据流量',
                    type: 'bar',
                    xAxisIndex: 0,
                    yAxisIndex:1,
                    data:this.IntranetTX
                },
                {
                    name: '接受数据流量',
                    type: 'line',
                    data: this.IntranetRX
                }]
            }
          //起始下标
      //let index=10;
    // var timer=setInterval(()=>{
    //       var axisData = this.TimeStamp[index][0]
    //       index++
    //       //console.log(axisData)
    //       var data0 = option.series[0].data;
    //       var data1 = option.series[1].data;
    //       data0.shift();
    //       data0.push(this.IntranetTX[index]);
    //       data1.shift();
    //       data1.push(this.IntranetRX[index]);
    //       option.xAxis[0].data.shift();
    //       option.xAxis[0].data.push(axisData);
    //       //如果下标超过返回的时间戳数组长度
    //       if(index>=this.TimeStamp.length){
    //         //重置下标
    //         // index=0
    //         // console.log(index)
    //         window.clearInterval(timer)
    //         }
    //       mychart.setOption(option);
    //       }, 1200)

      mychart.setOption(option)
    },
    //CPU使用百分比
    DrawCPU(){
          let chart=this.$echarts.init(document.getElementById("CPU_Useage"))
          var option={
              title:{
                  text:'实例vCPU的使用比例',
                  subtext:'单位:百分比（%）',
                  textStyle:{
                        color:'#b3ccf8'
                    }
              },
              tooltip: {
                showDelay: 0,
                formatter: function (params) {
                    return params.value+'%'
                },
                axisPointer: {
                    show: true,
                    type: 'line',
                    lineStyle: {
                        type: 'dashed',
                        width: 1
                    }
                }
            },
              xAxis:{
                  type:'category',
                  data:this.TimeStamp,
              },
              yAxis:{
                  type:'value'
              },
              series:[{
                  data:this.CPU,
                  type:'line',
                  smooth:true
              }]
          }
          chart.setOption(option)
      },
      //云盘读写图
    // DrawBPS(){
    //     let chart=this.$echarts.init(document.getElementById("BPS_Chart"))
    //     let option={
    //             tooltip: {
    //             // trigger: 'axis',
    //             showDelay: 0,
    //             formatter: function (params) {
    //                 if (params.value.length > 1) {
    //                     return params.seriesName + '<br/>读取 '
    //                     + params.value[0] + 'Kb/s '+'<br/>写入 '
    //                     + params.value[1] + 'Kb/s ';
    //                 }
    //                 else {
    //                     return params.seriesName + ':<br/>'
    //                     + params.name + ' : '
    //                     + params.value + 'Kb/s ';
    //                 }
    //             },
    //             axisPointer: {
    //                 show: true,
    //                 type: 'cross',
    //                 lineStyle: {
    //                     type: 'dashed',
    //                     width: 1
    //                 }
    //             }
    //         },
    //         legend: {
    //             data: ['单次云盘读写'],
    //             left: 'center',
    //             bottom: 10
    //         },
    //         xAxis: [
    //             {
    //                 type: 'value',
    //                 name:'写入',
    //                 scale: true,
    //                 axisLabel: {
    //                     formatter: '{value} Kb/s'
    //                 },
    //                 splitLine: {
    //                     show: false
    //                 }
    //             }
    //         ],
    //         yAxis: [
    //             {
    //                 type: 'value',
    //                 name:'读取',
    //                 scale: true,
    //                 axisLabel: {
    //                     formatter: '{value} Kb/s'
    //                 },
    //                 splitLine: {
    //                     show: false
    //                 }
    //             }
    //         ],
    //         series: [
    //             {
    //                 name: '单次云盘读写',
    //                 type: 'scatter',
    //                 emphasis: {
    //                     focus: 'series'
    //                 },
    //                 data:this.BPS_Read_Write,
    //                 markArea: {
    //                     silent: true,
    //                     itemStyle: {
    //                         color: 'transparent',
    //                         borderWidth: 1,
    //                         borderType: 'dashed'
    //                     },
    //                 },
    //                 markPoint: {
    //                     data: [
    //                         {type: 'max', name: '最大写入值'},
    //                         {type: 'min', name: '最小写入值'}
    //                     ]
    //                 },
    //             }
    //         ]
    //       }
    //       chart.setOption(option)
    //     },
    //阿里云代金券状况
    DrawCashCoupon(Used,Remain){
            let chart=this.$echarts.init(document.getElementById("CashCoupon"))
            let option={
                title:{
                    text:"阿里云:代金券使用情况",
                    left:'center',
                    textStyle:{
                        color:'#b3ccf8'
                    }
                },
                tooltip: {
                trigger: 'item'
                },
                series: [
                    {
                        type: 'pie',
                        radius: '50%',
                        data: [
                            {value: Used, name: '已用金额'},
                            {value: Remain, name: '可用余额'}, 
                        ],
                        itemStyle:{
                            normal:{
                                //直接显示数据
                                label:{
                                    show:true,
                                    formatter:'{b}:{c}',
                                    textStyle:{
                                        color:'#b3ccf8'
                                    }
                                },
                                labelLine:{
                                    show:true
                                }
                            }
                        }
                    }
                ]
        }
        chart.setOption(option)
    },
    //块存储情况
    //云盘情况
    // DescribeDiskMonitorData(DiskId,StartTime,EndTime){
    //     var that=this
    //     const regexp=/\bhttps.*?%3D\b/gm
    //     var params = {
    //         "DiskId": DiskId,
    //         "StartTime": StartTime,
    //         "EndTime": EndTime
    //     }
    //     var requestOption = {
    //         method: 'GET'
    //     };
    //     //时间戳
    //     var TimeStamp=[]
    //     //读取延迟
    //     var LatencyRead=[]
    //     //写入延迟
    //     var LatencyWrite=[]
    //     client.request('DescribeDiskMonitorData', params, requestOption)
    //     .catch((error)=>{
    //         error.toString().replace(regexp,function(){
    //                 that.axios.get(arguments[0])
    //                 .then((res)=>{
    //                     res.data.MonitorData.DiskMonitorData.forEach(element=>{
    //                         TimeStamp.push(element.TimeStamp)
    //                         element.LatencyRead==undefined?LatencyRead.push(0):LatencyRead.push((element.LatencyRead/1000))
    //                         element.LatencyWrite==undefined?LatencyWrite.push(0):LatencyWrite.push((element.LatencyWrite/1000))
    //                     })
    //                 })
    //             })
    //         })
        //this.DrawDescribeDiskMonitorData(LatencyRead,TimeStamp)  
    //},
    //磁盘读取延时仪表盘
    DrawDescribeDiskMonitorData(LatencyRead,TimeStamp){
        let chart=this.$echarts.init(document.getElementById("DiskMonitorData"))
        let regexp=/(?<=T).*?(?=Z)/gm
        // let Timearr=[]
        // let LatencyReadarr=[]
        let length=TimeStamp.length
        setInterval(()=>{
            let option={
                title:{
                    text:'磁盘读取延时',
                    subtext:TimeStamp[length].match(regexp)
                },
                series: [{
                    name: '内网磁盘读取',
                    type: 'gauge',
                    progress: {
                        show: true
                    },
                    detail: {
                        valueAnimation: true,
                        formatter: '{value}',
                        textSryle:{
                            fontSize:5
                        }
                    },
                    data: [{
                        value:LatencyRead[length],
                    }],
                    //仪表盘最大值
                    max:3
                }]
            }
            length++
           //console.log(TimeStamp[length])
            chart.setOption(option)
        },3000)       
    },
    ListCustomerselfResourceRecordDetails(){
            var that=this
            var enterprise_project_name=['算法','测试']
            var consume_amount=[4004,45.62]
            //请求localhost调用API
            // that.axios.get('http://localhost:1234/api?res-records').then(function(res){
            //     res.data.monthly_records.forEach(element=>{
            //         //开销组去重
            //         if(enterprise_project_name.indexOf(element.enterprise_project_name)==-1){
            //             enterprise_project_name.push(element.enterprise_project_name)
            //             //开销
            //             consume_amount.push(element.consume_amount)
            //         }else{
            //             //如果开销组重复出现，开销叠加
            //             consume_amount[enterprise_project_name.indexOf(element.enterprise_project_name)]+=element.consume_amount
            //         }
            //     })
            // })
            enterprise_project_name.splice()
            that.DrawListCustomerselfResourceRecordDetails(enterprise_project_name,consume_amount)
            // console.log(enterprise_project_name)
            // console.log(consume_amount)
        },
        //绘制资源详单
        DrawListCustomerselfResourceRecordDetails(enterprise_project_name,consume_amount){
            console.log(enterprise_project_name,consume_amount)
            var chart=this.$echarts.init(document.getElementById('ListCustomerselfResourceRecordDetails'))
            setTimeout(()=>{
                    var options={
                        title:{
                            text:'华为云:各组当前开销'
                        },
                        xAxis: {
                            type: 'category',
                            data:enterprise_project_name
                        },
                        yAxis: {
                            type: 'value'
                        },
                        series: [{
                            data: consume_amount,
                            type: 'bar',
                            itemStyle:{
                                normal:{
                                    label:{
                                    show:true,
                                    position:'top',
                                    }
                                }
                            }
                        }],
            }
            chart.setOption(options)
            },1000)
        },
        //华为云代金券
        ListSubCustomerCoupons(){
            var Used=0
            var Remain=0
            var that=this
            that.axios.get('http://localhost:1234/HuaWei?coupons').then(function(res){
                console.log(res.data.user_coupons[0].face_value)
                Remain=res.data.user_coupons[0].balance
                Used=(res.data.user_coupons[0].face_value-Remain).toFixed(2)
                that.DrawListSubCustomerCoupons(Used,Remain)
            })
            //console.log(Total,Remain)
            
        },
        DrawListSubCustomerCoupons(Used,Remain){
            console.log(Used,Remain)
            var chart=this.$echarts.init(document.getElementById('ListSubCustomerCoupons'))
            setTimeout(()=>{
                let option={
                title:{
                    text:"华为云:代金券使用情况",
                    left:'center'
                },
                tooltip: {
                trigger: 'item'
                },
                series: [
                    {
                        type: 'pie',
                        radius: '50%',
                        data: [
                            {value: Used, name: '已用金额'},
                            {value: Remain, name: '可用余额'}, 
                        ],
                        itemStyle:{
                            normal:{
                                //直接显示数据
                                label:{
                                    show:true,
                                    formatter:'{b}:{c}'
                                },
                                labelLine:{
                                    show:true
                                }
                            }
                        }
                    }
                ]
                }
            chart.setOption(option)
            },1000)
        },
        //华为云子账号情况
        DrawTree(){
             var chart=this.$echarts.init(document.getElementById('Tree'))
             var option={
                title:{
                    text:'当前华为云账号构成'
                },
                series : [{
                    name:'树图',
                    type:'tree',
                    orient: 'vertical',  // vertical horizontal
                    rootLocation: {x: 100, y: '60%'}, // 根节点位置  {x: 'center',y: 10}
                    nodePadding: 20,
                    symbol: 'circle',
                    symbolSize: 40,
                    itemStyle: {
                        normal: {
                            label: {
                                show: true,
                                position: 'inside',
                                textStyle: 
                                    {
                                    color: '#cc9999',
                                    fontSize: 15,
                                    fontWeight:  'bolder'
                                    }
                    },
                    lineStyle: {
                        color: '#000',
                        width: 1,
                        type: 'broken' // 'curve'|'broken'|'solid'|'dotted'|'dashed'
                    }
                },
                emphasis: {
                    label: {
                        show: true
                    }
                }
            },
            data: [
                {
                    name: 'AD4 主账号',
                    value: 6,
                    symbolSize: [90, 70],
                    
                    itemStyle: {
                        normal: {
                            label: {
                                show: false
                            }
                        }
                    },
                    children: [
                        {
                            name: '算法组',
                            itemStyle: {
                                normal: {
                                    label: {
                                        show: false
                                    }
                                }
                            },
                            symbolSize: [60, 60],
                            },
                            {
                            name: '测试组',
                            symbolSize: [60, 60],
                            itemStyle: {
                                normal: {
                                    label: {
                                        show: false
                                        }    
                                    }
                                },
                            },
                        ]
                    }]
                }]
             }
             chart.setOption(option)
        }

},
    mounted() {
        //取样区间 10小时
        this.DescribeInstanceMonitorData()
        this.QueryCashCoupons()
        this.QueryBillOverview("2021-08")
        this.DrawDiskRemain()
        //this.DescribeDiskMonitorData("d-bp1g9rukkdasz8yr33lc","2021-08-07T11:00:00Z","2021-08-07T12:00:00Z")
        //this.ListCustomerselfResourceRecordDetails('2021-08')
        //this.ListSubCustomerCoupons()
        //this.DrawTree()
    },
}

</script>
<style>
@charset "utf-8";

/********** Global **********/
/*
 *常用背景色： #0b0f34 (6,64,102) (29,45,57) (7,33,58) (8,13,28) (15,43,36)
 */
html, body {
	width:100%;
	height:100%;
	min-height:635px;
	font-family:"microsoft yahei", arial, sans-serif;
	background-color:#0f1c30;
	background-repeat:no-repeat;
	background-position:center;
	background-size:100% 100%;
	overflow-x:hidden;
	overflow-y:auto;
}
body.bg01 {background-image:url("../assets/img/WrapperIMG/bg01.png");}
body.bg02 {background-image:url("../assets/img/WrapperIMG/bg02.png");}
body.bg03 {background-image:url("../assets/img/WrapperIMG/bg03.png");}
body.bg04 {background-image:url("../assets/img/WrapperIMG/bg04.png");}
.header {
	margin:0 auto;
	width:100%;
	height:65px;
	max-width:1920px;
	background:url("../assets/img/WrapperIMG/header.png") center no-repeat;
}
.header h3 {
	margin:0;
	padding:0;
	line-height:50px;
	text-align:center;
	font-size:24px;
	color:#5dc2fe;
}
.wrapper {position:absolute;top:80px;bottom:0;left:0;right:0;min-height:555px;}
.container-fluid {height:100%;min-height:100%;}
.row {margin-left:-7px;margin-right:-8px;}
.row>div {padding-left:7px;padding-right:8px;}
.xpanel-wrapper {padding-bottom:15px;box-sizing:border-box;}
.xpanel-wrapper-1 {height:100%;}
.xpanel-wrapper-Up {height:25%;}
.xpanel-wrapper-Down {height:75%;}
.xpanel-wrapper-3 {height:33.33333%;}
.xpanel {
	padding:15px;
	height:100%;
	min-height:170px;
	background:url("../assets/img/WrapperIMG/panel.png") center no-repeat;
	background-size:100% 100%;
	box-sizing:border-box;
}
img{
    height:50%;
    width:25%
}
span{

}

/* tool */
.fill-h {height:100%;min-height:100%;}
.no-margin {margin:0 !important;}
.no-padding {padding:0 !important;}

/* scrollbar */
::-webkit-scrollbar {width:0;height:0;}
::-webkit-scrollbar-track {background-color:transparent;}
::-webkit-scrollbar-thumb {border-radius:5px;background-color:rgba(0, 0, 0, 0.3);}
</style>