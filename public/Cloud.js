const Core = require('@alicloud/pop-core');
//const fs = require('fs');
function DescribeEniMonitorData(StartTime,EndTime){
  //console.log(StartTime,EndTime)
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
    method: 'POST',
  }
 
  //请求
  client.request('DescribeInstanceMonitorData', params, requestOption).then((result) => {
    console.log(JSON.stringify(result))
    // fs.writeFile('data.json',JSON.stringify(result),(err)=>{
    //   console.log(err)
    // })
    //console.log(JSON.stringify(result))
  }, (ex) => {
    console.log(ex);
  })
}

export{
  DescribeEniMonitorData
}