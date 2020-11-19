let ipUrl = "http://127.0.0.1:7001/admin"; //接口
let servicePath = {
  checkLogin: ipUrl + "/checkLogin", //首页接口
  getTypeInfo: ipUrl + "/getTypeInfo", //获得文章类别信息
};
export default servicePath;
