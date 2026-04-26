import './login.css'

import { Link } from 'react-router-dom'
import { login } from '@/api/admin.jsx'
import { Form, Input, Button, message } from 'antd'
import { useNavigate } from 'react-router-dom'

function Login() {
  const [form] = Form.useForm()
  const navigate = useNavigate()

  const handleLogin = (values) => {
    login(values).then((res) => {
      if (res.token) {
        localStorage.setItem('token', res.token)
        localStorage.setItem('userInfo', JSON.stringify(res.userInfo))
        
        // ✅ 正确写法：第三个参数才是关闭后的回调
        message.success('登录成功', 0.5, () => {
          navigate('/back/dashboard')
        })
      }
    }).catch((err) => {
      message.error(err.message || '用户名或密码错误')
    })
  }

  return (
    <div className="login-container">
      <Link to="/" className="back-link">
        ←返回首页
      </Link>

      <div className="login-content">
        <h2 className="login-title">登录您的账户</h2>
        <p className="login-subtitle">请输入您的登录信息</p>

        <Form className="login-form" layout="vertical" form={form} onFinish={handleLogin}>
          <Form.Item
            label={
              <span className="required-label">
                用户名或邮箱
              </span>
            }
            name="username"
            rules={[{ required: true, message: '请输入用户名或邮箱' }]}
          >
            <Input placeholder="请输入用户名或邮箱" />
          </Form.Item>

          <Form.Item
            label={
              <span className="required-label">
                密码
              </span>
            }
            name="password"
            rules={[{ required: true, message: '请输入密码' }]}
          >
            <Input.Password placeholder="请输入密码" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" className="login-btn" htmlType="submit">
              登录账户
            </Button>
          </Form.Item>
        </Form>

        <div className="register-link">
          还没有账户？
          <Link to="/Auth/register">去注册</Link>
        </div>
      </div>
    </div>
  )
}

export default Login