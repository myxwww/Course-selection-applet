//小程序配置文件

var apiUrl ="http://localhost:81/1/index.php/Api"
var appid ="wx5f430a8a208b1158"
//var apiUrl ="http://zjgsujiaoxue.applinzi.com/index.php/Api"

var config={
  apiUrl,
  appid,
  wxUrl:`${apiUrl}/Weixin/`,
  userUrl: `${apiUrl}/User/`,
  courseId: 10016
};

module.exports=config