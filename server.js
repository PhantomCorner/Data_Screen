var http = require('http');
var url=require('url')
var server = http.createServer(function(req, res) {
    var keyword=req.url.split("?")[0]
    var action=req.url.split("?")[1]
    var https = require('https')
    var signer = require('./signer')
    var sig = new signer.Signer()
    sig.Key = "PBVG4VX2DJVMHAL9WAML"
    sig.Secret = "tZS17TEnmLRljv6Fzpw7dAc3Yog29jkQIEyTf3up"
    //阿里云签名
    var Core = require('@alicloud/pop-core');
    var client = new Core({
        accessKeyId: 'LTAI5tRvV9tPm6xoRJFPFGzK',
        accessKeySecret: 'uDXwKavSTXIAT29y0EYZ6bIjVqg6E9',
        endpoint: 'https://business.aliyuncs.com',
        apiVersion: '2017-12-14'
    });
    //如果请求调用华为接口
    if(keyword==='/HuaWei'){
        if(action==='res-records'){
            var r = new signer.HttpRequest("POST", "https://bss.myhuaweicloud.com/v2/bills/customer-bills/res-records/query")
            //账单日期
            r.body='{"cycle": "2021-08"}'
            var opt = sig.Sign(r)
            var APIreq = https.request(opt, function(APIres){
                //console.log(res.statusCode)  
                APIres.on("data",function(chunk){
                    res.writeHead(200, {'Content-Type': 'text/plain; charset=utf-8',"Access-Control-Allow-Origin":"*"})
                    res.end(chunk.toString(),'utf-8')
                })
            })
            APIreq.on("error",function(err){
                console.log(err.message)
            })
            APIreq.write(r.body)
            APIreq.end()
        }
        else if(action==='coupons'){
            var r = new signer.HttpRequest("GET", "https://bss.myhuaweicloud.com/v2/promotions/benefits/coupons")
            var opt = sig.Sign(r)
            var APIreq = https.request(opt, function(APIres){
                //console.log(res.statusCode)  
                APIres.on("data",function(chunk){
                    res.writeHead(200, {'Content-Type': 'text/plain; charset=utf-8',"Access-Control-Allow-Origin":"*"})
                    res.end(chunk.toString(),'utf-8')
                })
            })
            APIreq.on("error",function(err){
                console.log(err.message)
            })
            APIreq.write(r.body)
            APIreq.end()
        }
    }
    //如果请求调用阿里云接口
    if(keyword==='/Ali'){
        if(action==='QueryBillOverview'){
            var params = {
                "BillingCycle": '2021-08'
            }
            var requestOption = {
                method: 'GET'
            };
            client.request(action,params,requestOption).then(function(response){
                res.writeHead(200, {'Content-Type': 'text/plain; charset=utf-8',"Access-Control-Allow-Origin":"*"})
                res.end(JSON.stringify(response))
            })
        }
        if(action==='QueryCashCoupons'){
            var requestOption = {
                method: 'GET'
            };
            client.request(action,params,requestOption).then(function(response){
                res.writeHead(200, {'Content-Type': 'text/plain; charset=utf-8',"Access-Control-Allow-Origin":"*"})
                res.end(JSON.stringify(response))
            })
        }
        //AD4阿里云现在没有ECS,以鲲鹏科技账号的ECS为例
        if(action==='DescribeInstanceMonitorData'){
            var Core = require('@alicloud/pop-core');
            var client = new Core({
                accessKeyId: 'LTAI5tRbdWtxBecM2uCLMAnq',
                accessKeySecret: 'jJOTr06fe6qGKoUG7qNLlKXnBo31zJ',
                endpoint: 'https://ecs-cn-hangzhou.aliyuncs.com',
                apiVersion: '2014-05-26'
            });
            var params = {
                //实例ID
                "InstanceId": "i-j6cg9rukkdaswo89jsou",
                "StartTime": '2021-08-10T10:00:00Z',
                "EndTime": '2021-08-10T22:00:00Z',
                "Period":3600
            }
            var requestOption = {
                method: 'POST',
            }
            client.request(action,params,requestOption).then(function(response){
                res.writeHead(200, {'Content-Type': 'text/plain; charset=utf-8',"Access-Control-Allow-Origin":"*"})
                res.end(JSON.stringify(response))
            })
        }
        //CPU使用占比示例
        if(action==='CPU_Useage'){
            var Core = require('@alicloud/pop-core');
            var client = new Core({
                accessKeyId: 'LTAI5tRbdWtxBecM2uCLMAnq',
                accessKeySecret: 'jJOTr06fe6qGKoUG7qNLlKXnBo31zJ',
                endpoint: 'https://ecs-cn-hangzhou.aliyuncs.com',
                apiVersion: '2014-05-26'
            });
            var params = {
                //实例ID
                "InstanceId": "i-j6cg9rukkdaswo89jsou",
                "StartTime": '2021-08-10T10:01:00Z',
                "EndTime": '2021-08-10T10:02:00Z',
                "Period":60
            }
            var requestOption = {
                method: 'POST',
            }
            client.request('DescribeInstanceMonitorData',params,requestOption).then(function(response){
                res.writeHead(200, {'Content-Type': 'text/plain; charset=utf-8',"Access-Control-Allow-Origin":"*"})
                res.end(JSON.stringify(response))
            })
        }
        //云盘情况
        if(action==='DescribeDisks'){
            var Core = require('@alicloud/pop-core');
            var client = new Core({
                accessKeyId: 'LTAI5tRbdWtxBecM2uCLMAnq',
                accessKeySecret: 'jJOTr06fe6qGKoUG7qNLlKXnBo31zJ',
                endpoint: 'https://ecs-cn-hangzhou.aliyuncs.com',
                apiVersion: '2014-05-26'
            });
            var params = {
                //块存储所属的地域ID
                "RegionId": "cn-hangzhou"
              }
            var requestOption = {
                method: 'POST',
            }
            client.request(action,params,requestOption).then(function(response){
                res.writeHead(200, {'Content-Type': 'text/plain; charset=utf-8',"Access-Control-Allow-Origin":"*"})
                res.end(JSON.stringify(response))
            })
        }
    }
});
server.listen(1234, 'localhost');