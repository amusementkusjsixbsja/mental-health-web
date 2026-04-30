import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import './App.css'
import { Button, message } from 'antd'
import BackendLayout from './components/backendLayout.jsx'

// 主应用组件（当前作为临时测试使用，实际路由由router/index.jsx管理）
function App() {
  const [count, setCount] = useState(0)

  return (
    <div>
      <div>
        <BackendLayout />
      </div>
    </div>
  )
}

export default App
