module.exports = (options)=>{
    // 路由守卫
    const adminauth=async (ctx,next) => {
        if(ctx.session.openId){
            await next();
        }else {
            ctx.body={data:'未登录'}
        }
    }
    return adminauth
}