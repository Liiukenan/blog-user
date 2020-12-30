import React, { useState } from "react";
import "antd/dist/antd.css";
import "../static/css/Login.css";
import { Card, Input, Button, Spin,message } from "antd";
import { UserOutlined,KeyOutlined} from "@ant-design/icons";
import servicePath from "../api/servicePath"
import axios from "axios"
function Login(props) {
  const [userName, setUserName] = useState(" ");
  const [password, setPassword] = useState(" ");
  const [isLoading, setIsLoading] = useState(false);
  const checkLogin = () => {
       if(!userName){
         message.error('请输入正确的用户名')
         return
       }
       if(!password){
         message.error('请输入正确的密码')
         return
       }

       setIsLoading(true)
       let dataUser={
         userName:userName,
         password:password
       }
       axios({
         method:'post',
         url:servicePath.checkLogin,
         data:dataUser,
         withCredentials: true,
       }).then(
         res=>{
            setIsLoading(false)
            if(res.data.data==='登录成功'){
              localStorage.setItem('openId',res.data.openId)
              props.history.push('/index')
            }else{
              message.error('密码错误')
            }
            
         }
       )


      //  setTimeout(()=>{
      //       setIsLoading(false)
      //   },1000)
  };
  return (
    <div className="login-div">
      <Spin tip="Loading..." spinning={isLoading}>
        <Card
          title="JSPang Blog  System"
          bordered={true}
          style={{ width: 400 }}
        >
          <Input
            id="userName"
            size="large"
            placeholder="Enter your userName"
            prefix={<UserOutlined style={{ color: "rgba(0,0,0,.25)" }} />}
            onChange={(e) => {
              setUserName(e.target.value);
            }}
          />
          <br />
          <br />
          <Input.Password
                id="password"
                size="large"
                placeholder="Enter your password"
                prefix={<KeyOutlined style={{color:'rgba(0,0,0,.25)'}} />}
                onChange={(e)=>{setPassword(e.target.value)}}
            />     
          <br />
          <br />
          <Button type="primary" size="large" block onClick={checkLogin}>
            {" "}
            Login in{" "}
          </Button>
        </Card>
      </Spin>
    </div>
  );
}
export default Login;
