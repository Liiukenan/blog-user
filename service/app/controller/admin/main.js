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
    let password = this.ctx.request.body.password
    const sql=`SELECT userName FROM user WHERE userName = "${userName}" AND password="${password}"`;
    const  res=await this.app.mysql.query(sql)
    if (res.length>0){
        let openId=new Date().getTime()
        this.ctx.session.openId=openId;
        this.ctx.body={
            data:'登录成功',
            openId:openId
        }
    }else {
        this.ctx.body={data:'登录失败'}
    }
  }
  async getTypeInfo(){
    const resType=await this.app.mysql.select('type')
    this.ctx.body={
      data:resType
    }
  }
  async addArticle() {
    let tmpArticle=this.ctx.request.body
    const result=await this.app.mysql.insert('article',tmpArticle)
    const insertSuccess=result.affectedRows===1
    const insertId=result.insertId
    console.log(result)
    this.ctx.body={
      isSuccess:insertSuccess,
      insertId:insertId
    }
  }
  async updateArticle() {
    let tmpArticle=this.ctx.request.body
    const result=await this.app.mysql.update('article',tmpArticle)
    console.log(123432423)
    // 有几行发生了改变
    const updateSuccess=result.affectedRows===1
    this.ctx.body={
      isSuccess: updateSuccess
    }

  }
  async getArticleList() {
    let sql = `SELECT id AS id, 
             title AS title, 
             introduce AS introduce,
             FROM_UNIXTIME(add_time,'%Y-%m-%d %H:%i:%s') AS addTime, 
             type_name AS typeName,
             article_content AS articleContent, 
             view_count AS viewCount FROM article
             ORDER BY id DESC
             `;
    const resList=await this.app.mysql.query(sql)
    this.ctx.body={
      list:resList
    }
    
  }
  async delArticle() {
    let id=this.ctx.params.id;
    const res=await this.app.mysql.delece('article',{id:id});
    this.ctx.body={data:res}
  }
}

module.exports = MainController
