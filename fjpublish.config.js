module.exports = {
  modules: [{
    name: '正式环境',
    env: 'build',
    ssh: {
      host: '152.136.19.118',
      username: 'root',
      // password: 'Aini=1314',
      privateKey: require("fs").readFileSync(
        "/Users/liukenan/Documents/blog.pem"
      ) //mac用户举例
    },
    buildCommand: 'build',
    localPath: 'build',
    remotePath: '/usr/local/webserver/admin'
  }]
}
// fjpublish env -s  带时间戳的缓存文件

// fjpublish env -s --nobackup  不要缓存文件
