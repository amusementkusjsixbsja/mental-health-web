import '@/views/aicounseling.css'
import { RobotOutlined, HeartOutlined, PlusOutlined } from '@ant-design/icons'
import { useRef, useState, useEffect } from 'react'
import { createChat, getConsultPage, deleteConsult, getChatMessages } from '@/api/admin'
import { message as antdMessage, message } from 'antd'
import { CommentOutlined, ClockCircleOutlined, DeleteOutlined, UserOutlined } from '@ant-design/icons'
import { fetchEventSource } from '@microsoft/fetch-event-source'



function AiCounseling() {
  //是否显示欢迎
  const [isWelcome, setIsWelcome] = useState(true)
  //定义发送消息状态
  const [isAiSending, setIsAiSending] = useState(false);
  //定义发送消息事件
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }
  //定义对话消息
  const [chatMessages, setChatMessages] = useState([])
  //定义分页会话
  const [consultList, setConsultList] = useState([])  // 初始化为空数组，而不是 undefined
  //获取分页会话
  const getSessionPage = (params) => {
    getConsultPage(params).then(res => {
      setConsultList(res.records)
    })
  }
  

  //定义用户输入消息
  const [userMessage, setUserMessage] = useState('')
  //定义一个当前会话对象
  const currentChat = useRef([])
  // 定义当前正在流式输出的AI消息引用
  const aiMessageRef = useRef(null)
  //新建会话
  const addNewChat = () => {
    setIsAiSending(false)
    //清空当前会话消息
    setChatMessages([])
    //显示欢迎语
    setIsWelcome(true)
    //创建一个新的会话对象
    const newChat = {
      sessionId: 'temp_' + Date.now(),
      status: 'TEMP',
      sessionTitle: '新对话'
    }
    currentChat.current.push(newChat)
  }
  useEffect(() => {
    addNewChat()
    getSessionPage({
      pageNum: 1,
      pageSize: 10
    })
  }, [])
  //用户发送消息
  const sendMessage = async () => {
    if (!userMessage.trim()) {
      return
    }
    const msg = userMessage.trim()
    setUserMessage('')
    setIsWelcome(false)
    //添加用户消息
    setChatMessages(prev => [...prev, {
      id: 'msg_' + Date.now(),
      senderType: 1,
      content: msg,
      createdAt: new Date().toLocaleString()
    }])
    //如果没有会话或是临时会话，创建一个新的会话
    if (!currentChat.current || currentChat.current.status === 'TEMP') {
      startChat(msg)
    }
    setIsAiSending(true)
  }

  //创建新对话
  const startChat = (msg) => {
    //构建会话参数
    const chatParams = {
      initialMessage: msg
    }
    if (currentChat.current.sessionTitle === '新对话') {
      chatParams.sessionTitle = 'ai健康助手-' + Date.now()
    } else {
      chatParams.sessionTitle = currentChat.current.sessionTitle
    }
    createChat(chatParams).then(res => {
      // 更新当前会话引用
      Object.assign(currentChat.current, {
        sessionId: res.sessionId,
        status: 'ACTIVE',
        sessionTitle: chatParams.sessionTitle
      })
      getSessionPage({
        pageNum: 1,
        pageSize: 10
      })
      //开始流式对话
      startAiResponse(currentChat.current.sessionId, msg)
    })
  }
  //开始流式对话
  const startAiResponse = (sessionId, userMessage) => {
    if (isAiSending) {
      antdMessage.warning('as正在处理中，请稍后再试')
      return
    }
    setIsAiSending(true)
    const aiMessage = {
      id: 'ai_' + Date.now() + '_' + Math.random().toString().substring(2, 9),
      senderType: 2,
      content: '',
      createdAt: new Date().toISOString()
    }
    aiMessageRef.current = aiMessage
    setChatMessages([...chatMessages, aiMessage])

    //调用流式接口
    const ctrl = new AbortController()
    fetchEventSource('/api/psychological-chat/stream', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'text/event-stream',
        'Token': localStorage.getItem('token') || ''
      },
      body: JSON.stringify({
        sessionId: sessionId,
        userMessage: userMessage
      }),
      signal: ctrl.signal,
      onopen: (response) => {
        console.log(response)
        if (response.headers.get('Content-Type') !== 'text/event-stream') {
          antdMessage.error('服务器返回非流式响应')
        }
      },
      onmessage: (event) => {
        const raw = event.data.trim()
        if (!raw) return
        const eventName = event.event
        if (eventName === 'done') {
          setIsAiSending(false)
          ctrl.abort()
          return
        }
        const payload = JSON.parse(raw)
        const ok = String(payload.code) === '200'
        if (ok && payload.data && payload.content) {
          if (aiMessageRef.current) {
            aiMessageRef.current.content += payload.content
            setChatMessages(prev => [...prev])
          }
        } else if (!ok) {
          handleError(payload.message || "ai回复失败")
        }
      },
      onerror: (error) => {
        handleError(error || '服务器返回错误')
        throw error
      },
      onclose: () => {
        //调用ai情绪花园
      }
    })
  }
  //错误回复的显示
  const handleError = (error) => {
    if (aiMessageRef.current) {
      aiMessageRef.current.content = "ai回复失败"
      setChatMessages(prev => [...prev])
    }
    setIsAiSending(false)
    antdMessage.error("ai回复失败")
  }


  //点击会话
  const handleSessionClick = (item) => {
    setIsAiSending(false)
    getChatMessages(item.id).then(res => {
      //如果返回空或不是数组，显示欢迎语
      if (!res || !Array.isArray(res) || res.length === 0) {
        setChatMessages([])
        setIsWelcome(true)
        return
      }
      setChatMessages(res)
      setIsWelcome(false)
    })
    const sessionData = {
      sessionId: 'session_' + item.id,
      status: 'ACTIVE',
      sessionTitle: item.sessionTitle
    }
    currentChat.current = sessionData

  }
  //删除会话
  const deleteSession = (id) => {
    deleteConsult(id).then(res => {
      antdMessage.success('删除成功')
      getSessionPage({
        pageNum: 1,
        pageSize: 10
      })
    }
    )
  }

  return (
    <div className="consultation-container">
      <div className="siderbar">
        <div className='ai-helper'>
          <div className='ai-icon'>
            <div className='ai-icon-bg'><RobotOutlined className="sidebar-logo-icon" /></div>
          </div>
          <div className='ai-text'>
            <h3>心理健康助手</h3>
          </div>
          <div className='ai-desc'>
            <div className='ai-desc-icon'></div>
            <div>在线服务中</div>
          </div>
        </div>
        <div className='session-history'>
          <h4>会话历史</h4>
          <div className='session-list'>
            {consultList.map(item => (
              <div className='session-item' key={item.id} onClick={() => handleSessionClick(item)}>
                <div className='session-info'>
                  <div className='session-title'>
                    <span>{item.sessionTitle}</span>
                    <div className='session-meta'>
                      <span className='session-meta-time'>{item.startedAt}</span>
                    </div>
                    <div className='session-preview'>
                      <span>{item.lastMessageContent}</span>
                    </div>
                    <div className='session-stats'>
                      <span>
                        <CommentOutlined />
                        {item.messageCount || 0}
                      </span>
                      <span>
                        <ClockCircleOutlined />
                        {item.durationMinutes || 0}分钟
                      </span>
                    </div>
                  </div>
                  <div className='session-action'>
                    <DeleteOutlined onClick={() => deleteSession(item.id)} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="chat-main">
        <div className='chat-header'>
          <div className='chat-header-title'>
            <div className='chat-header-icon'>
              <div className='chat-header-icon-bg ai'><HeartOutlined className="chat-header-icon" /></div>
            </div>
            <div className='chat-header-text'>
              <h3>心理健康助手</h3>
              <p>您的贴心ai心理健康助手，为您提供专业的心理健康服务</p>
            </div>
          </div>
          <button className='add-new-chat' onClick={() => addNewChat()}>
            <PlusOutlined className='add-new-chat-icon' />
          </button>
        </div>
        <div className='chat-content'>
          {/**欢迎用语 */}
          {isWelcome && (
            <div className='chat-content-item ai'>
              <div >
                <div className='chat-content-item-icon-bg ai'><RobotOutlined className="chat-content-item-icon" /></div>
              </div>
              <div className='chat-content-item-text'>
                <div className='chat-content-item-text-chat'>
                  <p>你好，我是心理健康助手，我可以帮助你解决心理健康问题</p>
                </div>
                <p className='chat-content-item-text-chat-time'>2023-08-01 10:00:00</p>
              </div>
            </div>
          )}

          {/**对话内容 */}
          {chatMessages.map(item => (
            <div className={`chat-content-item ${item.senderType === 1 ? 'user' : 'ai'}`} key={item.id}>
              <div >
                <div className={`chat-content-item-icon-bg ${item.senderType === 1 ? 'user' : 'ai'}`}>{item.senderType === 1 ? <UserOutlined className="chat-content-item-icon" /> : <RobotOutlined className="chat-content-item-icon" />}</div>
              </div>
              <div className='chat-content-item-text'>
                {item.isError ? (
                  <div className='chat-content-item-text-chat error'>
                    <p>{item.content}</p>
                  </div>
                ) : item.content ? (
                  <div className={`chat-content-item-text-chat${item.isTyping ? ' typing' : ''}`}>
                    <p>{item.content}</p>
                  </div>
                ) : item.senderType === 2 && isAiSending ? (
                  <div className='chat-content-item-text-chat typing'>
                    <p>正在回复中</p>
                  </div>
                ) : null}
                <p className='chat-content-item-text-chat-time'>{item.createdAt}</p>
              </div>
            </div>
          ))}
        </div>
        <div className='chat-footer'>
          <div className='input-container'>
            <textarea
              placeholder='请输入'
              className='input-container-textarea'
              rows={3}
              disabled={isAiSending}
              value={userMessage}
              onKeyDown={(e) => {
                handleKeyDown(e);
              }}
              onChange={(e) => {
                setUserMessage(e.target.value)
              }}
            />
            <div className='input-container-desc-container'>
              <span className='input-container-desc'>输入enter发送，输入enter+shift换行</span>
              <span className='input-container-desc'>{userMessage.length}/{500}</span>
            </div>

          </div >
          <button className='send-btn' disabled={isAiSending || !userMessage.trim() || userMessage.length > 500} onClick={() => sendMessage()}>发送</button>
        </div>
      </div>
    </div>
  );
}
export default AiCounseling;