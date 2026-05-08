import { Modal, message } from 'antd'
import { useState, useEffect } from 'react'
import { consultDetail } from '@/api/admin'

const ChatModal = ({ visible, onCancel, id, sessionInfo }) => {
  const [records, setRecords] = useState([])
  const [loading, setLoading] = useState(false)

  const getConsultDetail = async () => {
    if (!id) return

    setLoading(true)
    try {
      const res = await consultDetail(id)
      if (Array.isArray(res)) {
        setRecords(res)
      } else {
        setRecords([])
        console.warn('返回数据不是数组:', res)
      }
    } catch (error) {
      console.error('获取咨询记录失败:', error)
      message.error(error.message || '获取咨询记录详情失败')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (visible && id) {
      getConsultDetail()
    }
  }, [visible, id])

  // 气泡样式配置
  const getBubbleStyle = (senderType) => {
    const isUser = senderType === 1

    return {
      maxWidth: '70%',
      padding: '10px 14px',
      backgroundColor: isUser ? '#a4fb92ff' : '#1890ff',
      color: isUser ? '#000' : '#fff',
      wordBreak: 'break-word',
      // 三圆角一直角
      borderRadius: isUser
        ? '12px 12px 12px 0px'   // 用户消息：左上、右上、右下圆角，左下直角（向左的尾巴）
        : '12px 12px 0px 12px',  // AI消息：左上、右上、左下圆角，右下直角（向右的尾巴）
    }
  }

  return (
    <Modal
      title="咨询记录详情"
      open={visible}
      onCancel={onCancel}
      footer={null}
      width={800}
      destroyOnHidden
    >
      {/* 顶部信息栏 */}
      {sessionInfo && (
        <div
          style={{
            padding: '12px 16px',
            backgroundColor: '#f5f5f5',
            borderRadius: '8px',
            marginBottom: '16px',
            border: '1px solid #e8e8e8',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
            <div>
              <span style={{ fontSize: '14px', color: '#666' }}>用户名：</span>
              <span style={{ fontSize: '14px', fontWeight: 500 }}>{sessionInfo.userName || sessionInfo.userNickname || '未知用户'}</span>
            </div>
            <div>
              <span style={{ fontSize: '14px', color: '#666' }}>创建时间：</span>
              <span style={{ fontSize: '14px' }}>{sessionInfo.startedAt || sessionInfo.createdAt || '未知时间'}</span>
            </div>
            <div>
              <span style={{ fontSize: '14px', color: '#666' }}>消息数：</span>
              <span style={{ fontSize: '14px', fontWeight: 500, color: '#1890ff' }}>
                {sessionInfo.messageCount || records.length || 0}
              </span>
            </div>
          </div>
        </div>
      )}

      {loading ? (
        <div style={{ textAlign: 'center', padding: '40px' }}>加载中...</div>
      ) : records.length > 0 ? (
        <div style={{ maxHeight: '500px', overflowY: 'auto', padding: '16px' }}>
          {records.map((record) => (
            <div
              key={record.id}
              style={{
                display: 'flex',
                justifyContent: record.senderType === 1 ? 'flex-start' : 'flex-end',
                marginBottom: '16px',
              }}
            >
              <div style={getBubbleStyle(record.senderType)}>
                <div style={{ fontSize: '12px', marginBottom: '4px', opacity: 0.7 }}>
                  {record.senderTypeDesc} · {record.messageTypeDesc}
                </div>
                <div style={{ whiteSpace: 'pre-wrap' }}>{record.content}</div>
                <div style={{ fontSize: '10px', marginTop: '4px', opacity: 0.6, textAlign: 'right' }}>
                  {record.createdAt}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div style={{ textAlign: 'center', padding: '40px', color: '#999' }}>
          暂无咨询记录
        </div>
      )}
    </Modal>
  )
}

export default ChatModal