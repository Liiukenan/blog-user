let ipUrl = '' //接口
if(process.env.CMLINT_ENV==="development"){
  ipUrl='http://127.0.0.1:7002/admin/'
}else {
  ipUrl='https://adminapi.goldaner.com/admin/';
}
let servicePath = {
  checkLogin: ipUrl + 'checkLogin', //首页接口
  getTypeInfo: ipUrl + 'getTypeInfo', //获得文章类别信息
  addArticle: ipUrl + 'addArticle', //添加文章数据
  updateArticle: ipUrl + 'updateArticle',//更新文章数据
  getArticleList: ipUrl + 'getArticleList', //获取文章列表
  delArticle: ipUrl + 'delArticle/', //获取文章列表
  getArticleById: ipUrl + 'getArticleById/', //根据ID获取文章详情
  upload: ipUrl + 'upload' //上传文件
}
export default servicePath
