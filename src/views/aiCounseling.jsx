import '@/views/aicounseling.css'
import { RobotOutlined, HeartOutlined, PlusOutlined, CommentOutlined, ClockCircleOutlined, DeleteOutlined, UserOutlined, CheckCircleOutlined, WarningOutlined } from '@ant-design/icons'
import { useRef, useState, useEffect } from 'react'
import { createChat, getConsultPage, deleteConsult, getChatMessages, getEmotionGarden } from '@/api/admin'
import { message } from 'antd'
import { fetchEventSource } from '@microsoft/fetch-event-source'

function AiCounseling() {
  const [isWelcome, setIsWelcome] = useState(true)
  const [isAiSending, setIsAiSending] = useState(false)
  const [chatMessages, setChatMessages] = useState([])
  const [consultList, setConsultList] = useState([])
  const [userMessage, setUserMessage] = useState('')
  const [selectedId, setSelectedId] = useState(null)

  const currentChat = useRef(null)
  const aiMessageRef = useRef(null)
  const abortController = useRef(null)
  //情绪花园
  const [currentEmotion, setCurrentEmotion] = useState({
    primaryEmotion: '中性',
    emotionScore: 50,
    isNegative: false,
    riskLevel: 2,
    suggestion: '情绪状态平稳',
    improvementSuggestions: []
  })

  const loadEmotionGarden = (sessionId) => {
    const id = sessionId.toString().startsWith('session_') ? sessionId : 'session_' + sessionId
    getEmotionGarden(id).then(res => {
      setCurrentEmotion(res || {})
    }).catch(error => {
      console.error('获取情绪花园失败:', error)
    })
  }

  const getIntensity = () => {
    if (currentEmotion.emotionScore >= 61) {
      return 3
    } else if (currentEmotion.emotionScore >= 41) {
      return 2
    } else {
      return 1
    }
  }
  const getRiskLevel = (level) => {
    if (level === 0) {
      return '正常'
    } else if (level === 1) {
      return '关注'
    } else if (level === 2) {
      return '预警'
    } else {
      return '危机'
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const getSessionPage = async (params) => {
    try {
      const res = await getConsultPage(params)
      setConsultList(res.records || [])
    } catch (error) {
      console.error('获取会话列表失败:', error)
      setConsultList([])
    }
  }

  const addNewChat = () => {
    if (abortController.current) {
      abortController.current.abort()
      abortController.current = null
    }
    setIsAiSending(false)
    setChatMessages([])
    setIsWelcome(true)
    setUserMessage('')
    setSelectedId(null)
    currentChat.current = {
      sessionId: 'temp_' + Date.now(),
      status: 'TEMP',
      sessionTitle: '新对话'
    }
  }

  useEffect(() => {
    addNewChat()
    getSessionPage({ pageNum: 1, pageSize: 10 })
  }, [])

  const sendMessage = async () => {
    if (!userMessage.trim() || isAiSending) return

    const msg = userMessage.trim()
    setUserMessage('')
    setIsWelcome(false)

    setIsAiSending(true)

    try {
      if (!currentChat.current || currentChat.current.status === 'TEMP') {
        await startChat(msg)
      } else {
        //将用户输入的信息放入会话列表
        setChatMessages(prev => [...prev, {
          id: 'user_' + Date.now() + '_' + Math.random().toString().substring(2, 9),
          senderType: 1,
          content: msg,
          createdAt: new Date().toISOString()
        }])
        await startAiResponse(currentChat.current.sessionId, msg)
      }
    } catch (error) {
      console.error('发送消息失败:', error)
      handleError(error)
    }
  }

  const startChat = async (msg) => {
    //构建会话参数
    const chatParams = {
      initialMessage: msg,
      sessionTitle: currentChat.current?.sessionTitle === '新对话'
        ? 'ai健康助手-' + Date.now()
        : currentChat.current?.sessionTitle
    }

    try {
      //调用后端接口创建会话
      const res = await createChat(chatParams)
      //转换
      const sessionData = {
        sessionId: res.sessionId,
        status: 'ACTIVE',
        sessionTitle: chatParams.sessionTitle
      }
      if (!currentChat.current || currentChat.current.status === 'TEMP') {
        //更新为正式会话
        Object.assign(currentChat.current, sessionData)
      } else {
        currentChat.current = sessionData
      }
      await getSessionPage({ pageNum: 1, pageSize: 10 })
      await startAiResponse(currentChat.current.sessionId, msg)
    } catch (error) {
      throw error
    }
  }

  const startAiResponse = async (sessionId, userMessage) => {
    if (abortController.current) {
      abortController.current.abort()
    }
    const ctrl = new AbortController()
    abortController.current = ctrl

    const aiMessage = {
      id: 'ai_' + Date.now() + '_' + Math.random().toString().substring(2, 9),
      senderType: 2,
      content: '',
      createdAt: new Date().toISOString()
    }
    aiMessageRef.current = aiMessage
    setChatMessages(prev => [...prev, aiMessage])

    try {
      await fetchEventSource('/api/psychological-chat/stream', {
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
          if (response.headers.get('Content-Type') !== 'text/event-stream') {
            message.error('服务器返回非流式响应')
          }
        },
        onmessage: (event) => {
          const raw = event.data.trim()
          if (!raw) return
          const eventName = event.event
          if (eventName === 'done') {
            setIsAiSending(false)
            ctrl.abort()
            loadEmotionGarden(sessionId)
            getSessionPage({ pageNum: 1, pageSize: 10 })
            return
          }
          const payload = JSON.parse(raw)
          const ok = String(payload.code) === '200'
          if (ok && payload.data && payload.data.content) {
            if (aiMessageRef.current) {
              aiMessageRef.current.content += payload.data.content
              setChatMessages(prev => [...prev])
            }
          } else if (!ok) {
            if (aiMessageRef.current) {
              aiMessageRef.current.content = payload.msg || 'ai回复失败'
              setChatMessages(prev => [...prev])
            }
            setIsAiSending(false)
            ctrl.abort()
          }
        },
        onerror: (error) => {
          if (ctrl.signal.aborted) return
          throw error
        },
        onclose: () => {
          loadEmotionGarden(sessionId)
        }
      })
    } catch (error) {
      if (error.name === 'AbortError') return
      throw error
    }
  }

  const handleError = (error) => {
    if (aiMessageRef.current) {
      aiMessageRef.current.content = 'ai回复失败'
      setChatMessages(prev => [...prev])
    }
    setIsAiSending(false)
    message.error('ai回复失败')
  }

  const handleSessionClick = async (item) => {
    if (abortController.current) {
      abortController.current.abort()
      abortController.current = null
    }
    setIsAiSending(false)
    setSelectedId(item.id)
    loadEmotionGarden(item.id)
    try {
      const res = await getChatMessages(item.id)
      if (!res || !Array.isArray(res) || res.length === 0) {
        setChatMessages([])
        setIsWelcome(true)
      } else {
        setChatMessages(res)
        setIsWelcome(false)
      }

    } catch (error) {
      console.error('获取会话消息失败:', error)
      message.error('加载消息失败')
      setChatMessages([])
      setIsWelcome(true)
    }
    const sessionData = {
      sessionId: "session_" + item.id,
      serverId: item.id,
      status: 'ACTIVE',
      sessionTitle: item.sessionTitle
    }
    currentChat.current = sessionData
  }

  const deleteSession = async (id) => {
    try {
      const res = await deleteConsult(id)
      message.success('删除成功')
      if (currentChat.current?.serverId === id) {
        addNewChat()
      }
      setSelectedId(prev => prev === id ? null : prev)
      await getSessionPage({ pageNum: 1, pageSize: 10 })
    } catch (error) {
      console.error('删除失败:', error)
      message.error('删除失败')
    }
  }

  return (
    <div className="consultation-container">
      <div className="siderbar">
        {/** 心理健康助手 */}
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
        {/**情绪花园 */}
        <div className='emotion-garden'>
          <div className='garden-header'>
            <div className='garden-title'>
              情绪花园
            </div>
          </div>
          <div className='emotion-info'>
            <span className='emotion-name'>{currentEmotion.primaryEmotion}</span>
            <span className='emotion-score'>{currentEmotion.emotionScore}</span>
          </div>
          <div className='warm-tips'>
            <div className='emotion-status-text'>
              <span className='status-label'>今天感觉：</span>
              <span className='status-emotion'>{currentEmotion.isNegative ? '很糟糕' : '很不错'}</span>
            </div>
            <div className='emotion-intensity'>
              <span className='intensity-dots'>
                {Array.from({ length: 3 }).map((_, index) => (
                  <span
                    key={index}
                    className={`dot${index < getIntensity() ? ' active' : ''}`}
                  ></span>
                ))}
              </span>
              <span className='intensity-text'>{getRiskLevel(currentEmotion.riskLevel)}</span>
            </div>
          </div>
          {/**温暖建议卡片 */}
          {currentEmotion.suggestion && (
            <div className='warm-tips-card'>
              <div className='warm-tips-icon'>
                <HeartOutlined className="warm-tips-icon" />
              </div>
              <div className='warm-tips-content'>
                <div className='warm-tips-title'>
                  <span className='warm-tips-title-text'>给你的小建议</span>
                </div>
                <div className='warm-tips-content-text'>
                  <span className='warm-tips-content-text-span'>{currentEmotion.suggestion}</span>
                </div>
              </div>

            </div>)}
          {/**治愈行动清单 */}
          {currentEmotion.improvementSuggestions.length > 0 && (
            <div className='health-actions'>
              <div className='health-actions-title'>治愈行动清单</div>
              <div className='health-actions-list'>
                {currentEmotion.improvementSuggestions.map((item, index) => (
                  <div key={index} className='health-action-item'>
                    <div className='health-action-icon'>
                      <CheckCircleOutlined className="health-action-icon" />
                    </div>
                    <div className='health-action-text'>
                      {item}
                    </div>
                  </div>
                ))}
              </div>
              {/**风险提示 */}
              {currentEmotion.riskLevel > 1 && currentEmotion.isNegative && (
                <div className='risk-notice'>
                  <div className='risk-notice-icon'>
                    <WarningOutlined className="risk-notice-icon" />
                  </div>
                  <div className='risk-notice-content'>
                    <span className='risk-notice-title'>温馨提示</span>
                    <span className='risk-notice-text'>{currentEmotion.riskDescription}</span>
                  </div>
                </div>)}
            </div>)}
        </div>
        {/** 会话历史 */}
        <div className='session-history'>
          <h4>会话历史</h4>
          <div className='session-list'>
            {consultList.map(item => (
              <div className={`session-item${selectedId === item.id ? ' active' : ''}`} key={item.id} onClick={() => handleSessionClick(item)}>
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
                    <DeleteOutlined onClick={(e) => { e.stopPropagation(); deleteSession(item.id) }} />
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

          {chatMessages.map(item => (
            <div className={`chat-content-item ${item.senderType === 1 ? 'user' : 'ai'}`} key={item.id}>
              <div >
                <div className={`chat-content-item-icon-bg ${item.senderType === 1 ? 'user' : 'ai'}`}>{item.senderType === 1 ? <UserOutlined className="chat-content-item-icon" /> : <RobotOutlined className="chat-content-item-icon" />}</div>
              </div>
              <div className='chat-content-item-text'>
                {item.content ? (
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
              onKeyDown={(e) => { handleKeyDown(e) }}
              onChange={(e) => { setUserMessage(e.target.value) }}
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
