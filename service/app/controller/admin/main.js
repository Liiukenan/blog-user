'use strict'
const Controller = require('egg').Controller
class MainController extends Controller {
  async index() {
    //  let result = await this.app.mysql.get("blog_content", {});
    this.ctx.body = {
      name: 'kenan'
    }
  }
  async checkLogin() {
    let userName = this.ctx.request.body.userName
    let password = this.ctx.request.password
    const sql=`SELECT userName FROM user WHERE userName = "${userName}" AND password="${password}"`;
    const  res=await this.app.mysql.query(sql)
    if (res.length>0){
        let openId=new Date().getTime()
        this.ctx.session.openId = {openId:openId}
        this.ctx.body={
            data:'登录成功',
            openId:openId
        }
    }else {
        this.ctx.body={data:'登录失败'}
    }
  }
}

module.exports = MainController
