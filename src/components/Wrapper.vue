<template lang="zh">
    <div class="wrapper">
            <div class="content">
                     <!--左侧-->
                <div class="col col-l">
                    <div class="xpanel-wrapper xpanel-wrapper-40">
                        <div class="xpanel xpanel-l-t" id="BPS_Chart">
                           
                        </div>
                    </div>
                    <div class="xpanel-wrapper xpanel-wrapper-60">
                        <div class="xpanel xpanel-l-b" id="CPU_Useage">
                           
                        </div>
                    </div>
                </div>
                 <!--中间-->
                <div class="col col-c">
                    <div class="xpanel-wrapper xpanel-wrapper-75">
                        <div class="xpanel no-bg" id ="dynamic_Intranet">
                        </div>
                    </div>
                    <div class="xpanel-wrapper xpanel-wrapper-25">
                        <div class="xpanel xpanel-c-b" id="DiskMonitorData">
                            
                        </div>
                    </div>
                </div>
                 <!--右侧-->
                <div class="col col-r">
                    <div class="xpanel-wrapper xpanel-wrapper-25">
                        <div class="xpanel xpanel-r-t" id="IntranetBandwidth">
                        </div>
                    </div>
                    <div class="xpanel-wrapper xpanel-wrapper-30">
                        <div class="xpanel xpanel-r-m" id="CashCoupon">
                           
                        </div>
                    </div>
                    <div class="xpanel-wrapper xpanel-wrapper-45">
                        <div class="xpanel xpanel-r-b" id="Month_Bill">
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
        info:[],
        //云盘读写带宽汇总
        BPS_Read_Write:[],
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
    //处理数据
    GetData(){
        var that =this
        //处理info中的数据
        that.info.forEach((element)=>{
            //正则式筛选出分秒钟
            that.TimeStamp.push((/(?<=T).*?(?=Z)/).exec(element.TimeStamp))
            that.CPU.push(element.CPU)
            that.BPSRead.push(element.BPSRead)
            that.BPSWrite.push(element.BPSWrite)
            that.IntranetTX.push(element.IntranetTX)
            that.IntranetRX.push(element.IntranetRX)
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
        const Core = require('@alicloud/pop-core');
        var that=this
        const regexp=/\bhttps.*?%3D\b/gm
        var client = new Core({
        accessKeyId: 'LTAI5tRbdWtxBecM2uCLMAnq',
        accessKeySecret: 'jJOTr06fe6qGKoUG7qNLlKXnBo31zJ',
        endpoint: 'https://business.aliyuncs.com',
        apiVersion: '2017-12-14'
        });
        var params = {}
        var requestOption = {
            method: 'GET'
        };
        client.request('QueryCashCoupons', params, requestOption)
        .catch((error)=>{
            error.toString().replace(regexp,function(){
                    that.axios.get(arguments[0])
                    .then((res)=>{
                        let Used=(res.data.Data.CashCoupon[0].NominalValue-res.data.Data.CashCoupon[0].Balance).toFixed(2)
                        let Remain=res.data.Data.CashCoupon[0].Balance
                        that.DrawCashCoupon(Used,Remain)
                    })
                })
            })
    },
    //查询账单总览
    QueryBillOverview(BillingCycle){
        const Core = require('@alicloud/pop-core');
        var that=this
        const regexp=/\bhttps.*?%3D\b/gm
        var client = new Core({
            accessKeyId: 'LTAI5tRbdWtxBecM2uCLMAnq',
            accessKeySecret: 'jJOTr06fe6qGKoUG7qNLlKXnBo31zJ',
            endpoint: 'https://business.aliyuncs.com',
            apiVersion: '2017-12-14'
        });
        var params = {
            "BillingCycle": BillingCycle
        }
        var requestOption = {
            method: 'GET'
        };
        //不需要.then,反正都会报错
        client.request('QueryBillOverview', params, requestOption)
        .catch((error)=>{
            error.toString().replace(regexp,function(){
                that.axios.get(arguments[0]).then(res=>{
                    res=res.data.Data
                    // 用户名
                    //let AccountName=res.AccountName
                    // 账单详情
                    let BillInfo=[]
                    //开销类型
                    let BillTypes=[]
                    //应付金额
                    let PretaxAmount=[]
                    // 账单有效期
                    BillingCycle=res.BillingCycle
                    // 账单详情
                    BillInfo=[res.Items]
                    //console.log(BillInfo)
                    //总开销
                    let Total=0
                    BillInfo.forEach(element=>{
                        element.Item.forEach((element,index)=>{
                            if(BillTypes.indexOf(element.ProductDetail)==-1){
                                //处理账单类型
                                BillTypes.push(element.ProductDetail)
                                //没开销类型没重复，则将对应金额加入数组
                                PretaxAmount.push(element.PretaxAmount)
                                Total+=element.PretaxAmount
                            }else{
                                //console.log(index)
                                //如果重复
                                PretaxAmount[index-1]+=element.PretaxAmount
                                Total+=element.PretaxAmount
                            }
                        })
                    })
                    that.DrawBill(BillingCycle,BillTypes,PretaxAmount,Total.toFixed(2))   
                    //console.log(BillInfo)   
                  
                })

                 
                
            })
            
        })
        
    },
    //开销图
    DrawBill(BillingCycle,BillTypes,PretaxAmount,Total){
        let chart=this.$echarts.init(document.getElementById("Month_Bill"))
        var option={
            title:{
                text:'服务器月度开销状况',
                subtext:'账单有效期: '+BillingCycle+'\n'
                +'本月消费: '+Total,
                left:'center'
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
                data:BillTypes
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
            series:[
                {
                    name:BillTypes[0],
                    type:'bar',
                    barWidth:45,
                    stack:'服务器开销',
                    emphasis:{
                        focus:'series'
                    },
                    data:[PretaxAmount[0]]
                },
                {
                    name:BillTypes[1],
                    type:'bar',
                    stack:'服务器开销',
                    emphasis:{
                        focus:'series'
                    },
                    data:[PretaxAmount[1]]
                },
                {
                    name:BillTypes[2],
                    type:'bar',
                    stack:'服务器开销',
                    emphasis:{
                        focus:'series'
                    },
                    data:[PretaxAmount[2]]
                },
                {
                    name:BillTypes[3],
                    type:'bar',
                    stack:'服务器开销',
                    emphasis:{
                        focus:'series'
                    },
                    data:[PretaxAmount[3]]
                },
                {
                    name:BillTypes[4],
                    type:'bar',
                    stack:'服务器开销',
                    emphasis:{
                        focus:'series'
                    },
                    data:[PretaxAmount[4]]
                },
                {
                    name:BillTypes[5],
                    type:'bar',
                    stack:'服务器开销',
                    emphasis:{
                        focus:'series'
                    },
                    data:[PretaxAmount[5].toFixed(2)]
                },

            ]
        }
        chart.setOption(option)
},
    //获取实例数据
    DescribeEniMonitorData(StartTime,EndTime){
        var that=this
        const Core = require('@alicloud/pop-core');
        const regexp=/\bhttps.*?%3D\b/gm
        var client = new Core({
            //access info
            accessKeyId: 'LTAI5tRbdWtxBecM2uCLMAnq',
            accessKeySecret: 'jJOTr06fe6qGKoUG7qNLlKXnBo31zJ',
            endpoint: 'https://ecs-cn-hangzhou.aliyuncs.com',
            apiVersion: '2014-05-26'
            });
        var params = {
            //实例ID
            "InstanceId": "i-j6cg9rukkdaswo89jsou",
            "StartTime": StartTime,
            "EndTime": EndTime
            }
    //request type
    var requestOption = {
        method: 'GET',
    }
    client.request('DescribeInstanceMonitorData', params, requestOption)
    .catch((error)=>{
        error.toString().replace(regexp,function(){
             that.axios.get(arguments[0])
             .then((res)=>{
                 //给data里的info赋值
                 that.info=res.data.MonitorData.InstanceMonitorData
                 //console.log(that.info)
                 //处理数据
                 that.GetData()
                 //绘图
                 that.DrawBPS()
                 that.DrawCPU()
                 that.Draw_dynamic_Intranet()
                 that.Draw_IntranetBandwidth()
                 })
            .catch(error=>{
                console.log(error)
                })
            })
         })
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
      let a=this.IntranetTX
      let b=this.IntranetRX
      let maxIntranetTX=Math.max.apply(null,a)
      let maxIntranetRX=Math.max.apply(null,b)
      let mychart=this.$echarts.init(document.getElementById('dynamic_Intranet'))
      //let arr=new Array(10)
      let option={
        title: {
            text: '公网数据流量I/O图',
            subtext:'单位:Byte/s'
            },
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'cross',
                label: {
                    backgroundColor: '#283b56'
                }
            },
        },
        legend: {
            data:['发送数据流量', '接受数据流量']
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
                name: '发送数据流量',
                max: maxIntranetRX,
                min: 0,
                boundaryGap: [0.2, 0.2]
            },
            {
                type: 'value',
                scale: true,
                name: '接受数据流量',
                max: maxIntranetTX,
                min: 0,
                boundaryGap: [0.2, 0.2]
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
      let index=10;
    var timer=setInterval(()=>{
          var axisData = this.TimeStamp[index][0]
          index++
          //console.log(axisData)
          var data0 = option.series[0].data;
          var data1 = option.series[1].data;
          data0.shift();
          data0.push(this.IntranetTX[index]);
          data1.shift();
          data1.push(this.IntranetRX[index]);
          option.xAxis[0].data.shift();
          option.xAxis[0].data.push(axisData);
          //如果下标超过返回的时间戳数组长度
          if(index>=this.TimeStamp.length){
            //重置下标
            // index=0
            // console.log(index)
            window.clearInterval(timer)
            }
          mychart.setOption(option);
          }, 1200)

      mychart.setOption(option)

    },
    //CPU使用百分比
    DrawCPU(){
          let chart=this.$echarts.init(document.getElementById("CPU_Useage"))
          var option={
              title:{
                  text:'实例vCPU的使用比例',
                  subtext:'单位:百分比（%）'
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
    DrawBPS(){
        let chart=this.$echarts.init(document.getElementById("BPS_Chart"))
        let option={
                tooltip: {
                // trigger: 'axis',
                showDelay: 0,
                formatter: function (params) {
                    if (params.value.length > 1) {
                        return params.seriesName + '<br/>读取 '
                        + params.value[0] + 'Kb/s '+'<br/>写入 '
                        + params.value[1] + 'Kb/s ';
                    }
                    else {
                        return params.seriesName + ':<br/>'
                        + params.name + ' : '
                        + params.value + 'Kb/s ';
                    }
                },
                axisPointer: {
                    show: true,
                    type: 'cross',
                    lineStyle: {
                        type: 'dashed',
                        width: 1
                    }
                }
            },
            legend: {
                data: ['单次云盘读写'],
                left: 'center',
                bottom: 10
            },
            xAxis: [
                {
                    type: 'value',
                    name:'写入',
                    scale: true,
                    axisLabel: {
                        formatter: '{value} Kb/s'
                    },
                    splitLine: {
                        show: false
                    }
                }
            ],
            yAxis: [
                {
                    type: 'value',
                    name:'读取',
                    scale: true,
                    axisLabel: {
                        formatter: '{value} Kb/s'
                    },
                    splitLine: {
                        show: false
                    }
                }
            ],
            series: [
                {
                    name: '单次云盘读写',
                    type: 'scatter',
                    emphasis: {
                        focus: 'series'
                    },
                    data:this.BPS_Read_Write,
                    markArea: {
                        silent: true,
                        itemStyle: {
                            color: 'transparent',
                            borderWidth: 1,
                            borderType: 'dashed'
                        },
                    },
                    markPoint: {
                        data: [
                            {type: 'max', name: '最大写入值'},
                            {type: 'min', name: '最小写入值'}
                        ]
                    },
                }
            ]
          }
          chart.setOption(option)
        },
    //代金券状况
    DrawCashCoupon(Used,Remain){
            let chart=this.$echarts.init(document.getElementById("CashCoupon"))
            let option={
                title:{
                    text:"代金券使用情况",
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
    },
    //云盘情况
    DescribeDiskMonitorData(DiskId,StartTime,EndTime){
        const Core = require('@alicloud/pop-core');
        var that=this
        const regexp=/\bhttps.*?%3D\b/gm
        var client = new Core({
            accessKeyId: 'LTAI5tRbdWtxBecM2uCLMAnq',
            accessKeySecret: 'jJOTr06fe6qGKoUG7qNLlKXnBo31zJ',
            endpoint: 'https://ecs-cn-hangzhou.aliyuncs.com',
            apiVersion: '2014-05-26'
        });
        var params = {
            "DiskId": DiskId,
            "StartTime": StartTime,
            "EndTime": EndTime
        }
        var requestOption = {
            method: 'GET'
        };
        //时间戳
        var TimeStamp=[]
        //读取延迟
        var LatencyRead=[]
        //写入延迟
        var LatencyWrite=[]
        client.request('DescribeDiskMonitorData', params, requestOption)
        .catch((error)=>{
            error.toString().replace(regexp,function(){
                    that.axios.get(arguments[0])
                    .then((res)=>{
                        res.data.MonitorData.DiskMonitorData.forEach(element=>{
                            TimeStamp.push(element.TimeStamp)
                            element.LatencyRead==undefined?LatencyRead.push(0):LatencyRead.push((element.LatencyRead/1000))
                            element.LatencyWrite==undefined?LatencyWrite.push(0):LatencyWrite.push((element.LatencyWrite/1000))
                        })
                    })
                })
                  
            })
        this.DrawDescribeDiskMonitorData(LatencyRead,TimeStamp)  
    },
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

},
    mounted() {
        this.DescribeEniMonitorData("2021-08-06T14:00:00Z","2021-08-06T15:00:00Z")
        this.QueryCashCoupons()
        this.QueryBillOverview("2021-08")
        this.DescribeDiskMonitorData("d-bp1g9rukkdasz8yr33lc","2021-08-07T11:00:00Z","2021-08-07T12:00:00Z")

        //var info=that.info
        //console.log(this.DescribeEniMonitorData("2021-08-04T15:00:00Z","2021-08-04T16:00:00Z"))
        //console.log(info)
        // //加密
        // const CryptoJS = require("crypto-js");
        // //uuid
        // const uuid=require('node-uuid')
        // //time
        // const moment=require('moment')
        // //解码
        // const utf8 = require('nodejs-utf8');
        // //正则
        // //var regexp=/.....$/gm
        // //当前时间戳
        // var Timestamp=moment(new Date().getTime() - 3600 * 1000 * 8).format("YYYY-MM-DDTHH:mm:ss") + 'Z'
        // //var Timestamp = utf8.encode(new Date().toISOString().replace(regexp,'Z'))
        // //随机签名nonce
        // var SignatureNonce=uuid.v1()
        // var AccessKeyId= 'LTAI5tRbdWtxBecM2uCLMAnq'
        // //用Secret加密
        // var AccessKeySecret= 'jJOTr06fe6qGKoUG7qNLlKXnBo31zJ&'
        // var stringtosign=`GET&%2F&AccessKeyId%3D${AccessKeyId}%26Action%3DDescribeInstanceMonitorData%26Format%3DXML%26SignatureMethod%3DHMAC-SHA1%26SignatureNonce%3D${SignatureNonce}%26SignatureVersion%3D1.0%26Timestamp%3D${Timestamp}%26Version%3D2014-05-26`

        // var Signature = Base64.encode(CryptoJS.HmacSHA1(AccessKeySecret,utf8.encode(stringtosign)))
        // Signature=Signature.replace(/\*/, '%2A').replace(/%7E/, '~')
        // var pubString =`Format=xml&Version=2014-05-26&SignatureMethod=HMAC-SHA1&SignatureNonce=${SignatureNonce}&SignatureVersion=1.0&AccessKeyId=${AccessKeyId}&Signature=${Signature}&Timestamp=${Timestamp}`

        // var url=`https://ecs.aliyuncs.com/?Action=DescribeInstanceMonitorData&EndTime=2021-08-03T15:00:00Z&InstanceId=i-j6cg9rukkdaswo89jsou&StartTime=2021-08-03T15:00:00Z&Period=3600&${pubString}`
        // console.log(url,Timestamp)
    },
}

</script>
<style>
    .wrapper {
        position:absolute;
        top:36px;
        bottom:10px;
        left:10px;
        right:10px;
        padding:10px 10px 0 10px;
        min-height:500px;
        /*background:url("../assets//img/wrapper-bg.png") no-repeat;*/
        background-size:100% 100%;
        box-sizing:border-box;
    }
    .content {
        display:-webkit-flex;
        display:-ms-flexbox;
        display:flex;
        padding:25px 15px;
        height:100%;
        min-height:100%;
        box-sizing:border-box;
    }
    .col {margin:0 10px;height:100%;}
    .col-l {-webkit-flex:2;-ms-flex:2;flex:2}
    .col-c {-webkit-flex:3;-ms-flex:3;flex:3;}
    .col-r {-webkit-flex:2;-ms-flex:2;flex:2;}
    /* PC */
    @media (max-width:1919px) {
        .content {padding:0;}
    }
    /* Mobile */
    @media (max-width:1279px) {
        .content {
            -webkit-flex-direction:column;
            -ms-flex-direction:column;
            flex-direction:column;
        }
        .col {margin:5px 0;}
        .col-l, 
        .col-c, 
        .col-r {-webkit-flex:none;-ms-flex:none;flex:none;}
    }
    .xpanel-wrapper {padding-bottom:10px;box-sizing:border-box;}
    .xpanel-wrapper {height:100%;}
    .xpanel-wrapper-25 {height:25%;}
    .xpanel-wrapper-30 {height:30%;}
    .xpanel-wrapper-40 {height:40%;}
    .xpanel-wrapper-45 {height:45%;}
    .xpanel-wrapper-60 {height:60%;}
    .xpanel-wrapper-75 {height:75%;}
    .xpanel {
        height:100%;
        min-height:100px;
        background-repeat:no-repeat;
        background-size:100% 100%;
        box-sizing:border-box;
    }
    .xpanel-l-t {background-image:url("../assets/img/panel-l-t.png");}
    .xpanel-l-b {background-image:url("../assets//img/panel-l-b.png");}
    .xpanel-c-b {background-image:url("../assets//img/panel-c-b.png");}
    .xpanel-r-t {background-image:url("../assets//img/panel-r-t.png");}
    .xpanel-r-m {background-image:url("../assets///img/panel-r-m.png");}
    .xpanel-r-b {background-image:url("../assets///img/panel-r-b.png");}

</style>