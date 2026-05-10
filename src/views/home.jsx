import '@/views/home.css'
import { Button } from 'antd';
import { RobotOutlined } from '@ant-design/icons';



function Home() {
  return (
    <div className="content">
      <div className='left-content'>
        <p className='big-white-p'>一次温暖的对话</p>
        <p className='big-yellow-p'>化孤独为慰籍</p>
        <span className='description'>每个深夜，每个焦虑的时刻，不在独处，在这里，我们让你感受心与心连接的温暖</span>
        <div className='btn-group'>
          <Button className='start-btn'>开始倾诉</Button>
          <Button className='record-btn'>记录心情</Button>
        </div>
      </div>
      <div className='right-content'>
        <div className='logo'> 
          <RobotOutlined className="logo-icon" />
        </div>
      </div>
    </div>
  )
}
export default Home