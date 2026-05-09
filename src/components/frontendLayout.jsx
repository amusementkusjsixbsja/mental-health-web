import { Outlet, Link } from 'react-router-dom'
import { Layout, Button } from 'antd'
import { RobotOutlined } from '@ant-design/icons'
import './frontendLayout.css'
import { useState, useEffect } from 'react'


const { Header, Footer, Content } = Layout;


function FrontendLayout() {


  const [isLogin, setIsLogin] = useState(false)
  // useEffect(() => {
  //   setIsLogin(localStorage.getItem('token') !== null)
  // }, [])





  return (
    <div className="frontend-layout">
      <Layout className='layout-container'>
        <Header className='header-container'>
          <div className="header-logo-container">
            <RobotOutlined className="header-logo-icon" />
            <h1>心理健康ai助手</h1>
          </div>
          <div className="header-menu-container">
            <Link to="/front/home">首页</Link>
            {isLogin && (
              <Link to="/front/aiCounseling">AI咨询</Link>
            )}
            {isLogin && (
              <Link to="/front/emotionDairy">情绪日记</Link>
            )}
            <Link to="/front/knowledgeFront">知识库</Link>
            {!isLogin && (
              <Link to="/Auth/login">登录</Link>
            )}
            {!isLogin && (
              <Link to="/Auth/register">注册</Link>
            )}
            {isLogin && (
              <Button type="primary">退出登录</Button>
            )}
          </div>
        </Header>
        <Content className='content-container'>
          <Outlet />
        </Content>
        <Footer className='footer-container'><p>@2026心理健康ai助手 保留所有权利</p></Footer>
      </Layout>
    </div>
  )
}

export default FrontendLayout