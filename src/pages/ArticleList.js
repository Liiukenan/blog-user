import React, { useEffect, useState } from 'react'
import { List, Row, Col, Modal, message, Button } from 'antd'
import axios from 'axios'
import '../static/css/ArticleList.css'
import servicePath from '../api/servicePath'
import { OmitProps } from 'antd/lib/transfer/ListBody'
const { confirm } = Modal
function ArticleList(props) {
  const [list, setList] = useState([])
  const getList=()=>{
    axios({
      method:'GET',
      url:servicePath.getArticleList,
      withCredentials:true
    }).then(
      res=>{
        setList(res.data.list)
      }
    )
  }
  useEffect(() => {
    getList();
  }, []);
  const delArticle=(id)=>{
    confirm({
      title:'确定要删除这篇博客吗？',
      content:'如果你点击ok，则文章永远被删除，无法恢复',
      onOk: () => {
        axios({
          method:'POST',
          url:servicePath.delArticle+id,
          withCredentials:true
        }).then(
          () => {
            message.success('删除成功')
            getList();
          }
        )
      },
      onCancel(){
        message.success('文章没有任何变化')
      }
    })
  }
  //修改文章跳转方法
  const updateArticle=(id,checked)=>{
    props.history.push('/index/add/'+id)
  }
  return (
    <div>
       <List
       header={
          <Row className="list-div">
            <Col span={4}>
              <b>标题</b>
            </Col>
            <Col span={4}>
              <b>id</b>
            </Col>
            <Col span={4}>
              <b>类别</b>
            </Col>
            <Col span={4}>
              <b>发布时间</b>
            </Col>
            <Col span={4}>
              <b>浏览量</b>
            </Col>
            <Col span={4}>
              <b>操作</b>
            </Col>
          </Row>
        }
        bordered
        dataSource={list}
        renderItem={item => (
          <List.Item>
          
            <Col span={4}>
            {item.title}
            </Col>
            <Col span={4}>
            {item.id}
            </Col>
            <Col span={4}>
              {item.typeName}
            </Col>
            <Col span={4}>
              {item.addTime}
            </Col>
            <Col span={4}>
              {item.viewCount}
            </Col>
            <Col span={4}>
              <Button type="primary" onClick={()=>{updateArticle(item.id)}}>修改</Button>&nbsp;
              <Button onClick={()=>{delArticle(item.id)}}>删除</Button>
            </Col>
          </List.Item>
        )}
      />
    </div>
  )
}
export default ArticleList



{/* <List
        
        bordered
        dataSource={list}
        renderItem={( item ) => {
          <List.Item>
            <Col span={8}>
              dsafsa
            </Col>
            <Col span={4}>
            {item.title}
            </Col>
            <Col span={4}>
              {item.typeName}
            </Col>
            <Col span={4}>
              {item.addTime}
            </Col>
            <Col span={4}>
              {item.view_count}
            </Col>
            <Col span={4}>
              <Button type="primary">修改</Button>
              <Button>删除</Button>
            </Col>
          </List.Item>
        }}
      ></List> */}