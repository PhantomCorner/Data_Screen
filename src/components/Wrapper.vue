<template lang="zh">
    <div class="wrapper">
            <div class="content">
                     <!--左侧-->
                <div class="col col-l">
                    <div class="xpanel-wrapper xpanel-wrapper-40">
                        <div class="xpanel xpanel-l-t">
                            <div class="title"></div>
                        </div>
                    </div>
                    <div class="xpanel-wrapper xpanel-wrapper-60">
                        <div class="xpanel xpanel-l-b">
                            <div class="title"></div>
                        </div>
                    </div>
                </div>
                 <!--中间-->
                <div class="col col-c">
                    <div class="xpanel-wrapper xpanel-wrapper-75">
                        <div class="xpanel no-bg">
                        </div>
                    </div>
                    <div class="xpanel-wrapper xpanel-wrapper-25">
                        <div class="xpanel xpanel-c-b">
                            <div class="title title-long"></div>
                        </div>
                    </div>
                </div>
                 <!--右侧-->
                <div class="col col-r">
                    <div class="xpanel-wrapper xpanel-wrapper-25">
                        <div class="xpanel xpanel-r-t">
                            <div class="title"></div>
                        </div>
                    </div>
                    <div class="xpanel-wrapper xpanel-wrapper-30">
                        <div class="xpanel xpanel-r-m">
                            <div class="title"></div>
                        </div>
                    </div>
                    <div class="xpanel-wrapper xpanel-wrapper-45">
                        <div class="xpanel xpanel-r-b">
                            <div class="title"></div>
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
            info:null
        }
    },
methods: {
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
    //client.request('DescribeInstanceMonitorData', params, requestOption)=new Promise((reslove,reject)=>{})
    client.request('DescribeInstanceMonitorData', params, requestOption).then(res=>{
        console.log(res)
    })
    .catch((error)=>{
        error.toString().replace(regexp,function(){
             that.$axios.get(arguments[0])
             .then(res=>{
                 that.info=res
                 })
            .catch(error=>{
                console.log(error)
                })
            })
         })

    }
},
    mounted() {
         this.DescribeEniMonitorData("2021-08-04T15:00:00Z","2021-08-04T17:00:00Z")
            console.log(this.info)

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
        background:url("../assets//img/wrapper-bg.png") no-repeat;
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
        .content {padding:5px 0;}
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
    .xpanel .title {
        padding-left:24px;
        height:44px;
        line-height:44px;
        font-size:24px;
        font-weight:normal;
        color:#fff;
        background-image:url("../assets//img/title-bg.png");
        background-repeat:no-repeat;
        background-size:100% 100%;
    }
    .xpanel .title-long {background-image:url("../assets/img/title-bg-long.png");}
</style>