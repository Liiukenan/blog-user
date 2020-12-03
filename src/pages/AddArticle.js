import React, { useState, useEffect } from 'react'
import marked from 'marked'
import '../static/css/AddArticle.css'
import { Row, Col, Input, Select, Button, DatePicker, message } from 'antd'
import axios from 'axios'
import moment from 'moment'
import servicePath from '../api/servicePath.js'
const { Option } = Select
const { TextArea } = Input
function AddArticle(props) {
  const [articleId, setArticleId] = useState(0) // 文章的ID，如果是0说明是新增加，如果不是0，说明是修改
  const [articleTitle, setArticleTitle] = useState('') //文章标题
  const [articleContent, setArticleContent] = useState('') //markdown的编辑内容
  const [markdownContent, setMarkdownContent] = useState('预览内容') //html内容
  const [introducemd, setIntroducemd] = useState('') //简介的markdown内容
  const [introducehtml, setIntroducehtml] = useState('等待编辑') //简介的html内容
  const [showDate, setShowDate] = useState(new Date()) //发布日期
  const [typeInfo, setTypeInfo] = useState([]) // 文章类别信息
  const [selectedType, setSelectType] = useState('视频教程') //选择的文章类别
  const [format,setFormat]=useState('YYYY-MM-DD HH:mm:ss')
  marked.setOptions({
    renderer: marked.Renderer(),
    gfm: true,
    pedantic: false,
    sanitize: false,
    tables: true,
    breaks: false,
    smartLists: true,
    smartypants: false
  })
  const changeContent = (e) => {
    setArticleContent(e.target.value)
    let html = marked(e.target.value)
    setMarkdownContent(html)
  }
  const changeIntroduce = (e) => {
    setIntroducemd(e.target.value)
    let html = marked(e.target.value)
    setIntroducehtml(html)
  }
  const getTypeInfo = () => {
    axios({
      method: 'get',
      url: servicePath.getTypeInfo,
      withCredentials: true
    }).then((result) => {
      if (result.data.data === '未登录') {
        localStorage.removeItem('openId')
        props.history.push('/')
      } else {
        setTypeInfo(result.data.data)
      }
    })
  }
  useEffect(() => {
    getTypeInfo()
    if(props.match.params.id){
      getArticleById(props.match.params.id)
    }
    
  }, [])
  const selectTypeHandler = (value) => {
    setSelectType(value)
  }
  const saveArticle = () => {
    if (!selectedType) {
      message.error('文章类型不能为空')
      return false
    }
    if (!articleTitle) {
      message.error('文章名称不能为空')
      return false
    }
    if (!articleContent) {
      message.error('内容不能为空')
      return false
    }
    if (!introducemd) {
      message.error('简介不能为空')
      return false
    }
    if (!showDate) {
      message.error('日期不能为空')
      return false
    }
    let typeId=1;
    for(var item of typeInfo){
      if(item.typeName===selectedType){
        typeId=item.id
      }
    }
    let dataProps = {
      type_id: typeId,
      title: articleTitle,
      article_content: articleContent,
      introduce: introducemd,
      add_time: new Date(showDate).getTime() / 1000,
      type_name: selectedType
    }
    if (articleId === 0) {
      
      dataProps.view_count = 0
      axios({
        method: 'post',
        url: servicePath.addArticle,
        data: dataProps,
        withCredentials: true
      }).then((res) => {
        setArticleId(res.data.insertId)
        if (res.data.isSuccess) {
          message.success('文章添加成功')
        } else {
          message.error('文章添加失败')
        }
      })
    } else {
      dataProps.id = articleId
      axios({
        method: 'post',
        url: servicePath.updateArticle,
        data: dataProps,
        withCredentials: true
      }).then((res) => {
        if (res.data.isSuccess) {
          message.success('文章修改成功')
        } else {
          message.error('文章修改失败')
        }
      })
    }
  }
  const getArticleById=(id)=>{
    axios(servicePath.getArticleById+id,{
      withCredentials:true
    }).then((res)=>{
        
        let articleInfo=res.data[0]
        setArticleTitle(articleInfo.title)
        setArticleContent(articleInfo.articleContent)
        let html=marked(articleInfo.articleContent)
        setMarkdownContent(html)
        setIntroducemd(articleInfo.introduce)
        
        let tmInt=marked(articleInfo.introduce)
        setIntroducehtml(tmInt)
        setShowDate(articleInfo.addTime)
        setArticleId(id)
        setSelectType(articleInfo.typeName)
    })
  }
  
  return (
    <div className="addArticle">
      <Row gutter={5}>
        <Col span={18}>
          <Row gutter={10}>
            <Col span={20}>
              <Input
                onChange={(e) => {
                  setArticleTitle(e.target.value)
                }}
                placeholder="博客标题"
                size="large"
                value={articleTitle}
              />
            </Col>
            <Col span={4}>
              &nbsp;
              <Select
                value={selectedType}
                onChange={selectTypeHandler}
                size="large"
              >
                {typeInfo.map((item, index) => {
                  return (
                    <Option value={item.typeName} key={index}>
                      {item.typeName}
                    </Option>
                  )
                })}
              </Select>
            </Col>
          </Row>
          <br />
          <Row gutter={10}>
            <Col span={12}>
              <TextArea
                className="markdown-content"
                rows={35}
                value={articleContent}
                placeholder="文章内容"
                onChange={changeContent}
              />
            </Col>
            <Col span={12}>
              <div
                className="show-html"
                dangerouslySetInnerHTML={{ __html: markdownContent }}
              ></div>
            </Col>
          </Row>
        </Col>
        <Col span={6}>
          <Row>
            <Col span={24}>
              <Button size="large">暂存文章</Button>&nbsp;
              <Button type="primary" size="large" onClick={saveArticle}>
                发布文章
              </Button>
              <br />
            </Col>
            <Col span={24}>
              <br />
              <TextArea
                rows={4}
                placeholder="文章简介"
                value={introducemd}
                onChange={changeIntroduce}
              />
              <br />
              <br />
              <div
                className="introduce-html"
                dangerouslySetInnerHTML={{ __html: introducehtml }}
              ></div>
            </Col>

            <Col span={18}>
              <div className="date-select">
                <DatePicker
                  placeholder="发布日期"
                  size="large"
                  value={moment(showDate,format)}
                  format={format}
                  showTime={{ defaultValue: moment('00:00:00', 'HH:mm:ss') }}
                  onChange={(date, dateString) => {
                    setShowDate(dateString)
                  }}
                />
              </div>
            </Col>
          </Row>
        </Col>
      </Row>
    </div>
  )
}
export default AddArticle
