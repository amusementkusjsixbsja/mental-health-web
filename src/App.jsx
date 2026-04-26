import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import './App.css'
import { Button, message } from 'antd'
import BackendLayout from './components/backendLayout.jsx'

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
