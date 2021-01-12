'use strict'
const Controller = require('egg').Controller
const fs = require('fs');
const path = require('path');
const mineType = require('mime-types');
const sendToWormhole = require('stream-wormhole');
const awaitWriteStream = require('await-stream-ready').write;
class MainController extends Controller {
  async index() {
    let result = await this.app.mysql.get("blog_content", {});
    this.ctx.body = result;
  }
  async upload() {
    const { ctx } = this;
    const stream = await ctx.getFileStream();
    const name = Date.now() + '' + path.extname(stream.filename).toLocaleLowerCase(); // 获取文件的尾缀名（扩展名）
    console.log('name:>>>>>>>', name);
    // console.log('filename:>>>>>>>', stream.filename);
    
    const target = path.resolve(__dirname, '../../public/images'); // 保存的文件夹路径

    // 判断存储的文件夹是否存在，不存在则创建
    if (!fs.existsSync(target)) {
      fs.mkdirSync(target);
    }

    const targetFilename = path.join(target, name); // 写入的文件名称, 目标文件名
    // console.log('filename:>>>>>>>', targetFilename); 
    const writeStream = fs.createWriteStream(targetFilename);
    try {
      await awaitWriteStream(stream.pipe(writeStream));
    } catch (e) {
      await sendToWormhole(stream);
      // console.log(e);
      throw e;
    }
    
    ctx.body = {
      code: 200,
      message: '上传成功',
      data: "http://127.0.0.1:7002/public/images/"+name,
    };
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
    this.ctx.body={
      isSuccess:insertSuccess,
      insertId:insertId
    }
  }
  async updateArticle() {
    let tmpArticle=this.ctx.request.body
    const result=await this.app.mysql.update('article',tmpArticle)
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
             ORDER BY id DESC`;

    const resList=await this.app.mysql.query(sql)
    this.ctx.body={
      list:resList
    }
    
  }
  async delArticle() {
    let id=this.ctx.params.id;
    const res=await this.app.mysql.delete('article',{id:id});
    this.ctx.body={data:res}
  }
  async getArticleById() {
    let id = this.ctx.params.id;
    let sql = `SELECT id AS id, 
             title AS title,
             type_id AS typeId,
             introduce AS introduce,
             FROM_UNIXTIME(add_time,"%Y-%m-%d %H:%i:%s") AS addTime, 
             type_name AS typeName,
             article_content AS articleContent, 
             view_count AS viewCount FROM article
             WHERE id='${id}'`;
    const result = await this.app.mysql.query(sql);
    this.ctx.body = result;
  }
}

module.exports = MainController
