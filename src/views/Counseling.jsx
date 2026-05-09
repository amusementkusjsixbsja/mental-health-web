import { consultPage } from '@/api/admin'
import PageHead from '@/components/pageHead.jsx'
import ChatModal from '@/components/chatModal.jsx'
import { Table, message } from 'antd'
import { useState, useEffect } from 'react'

// 心理咨询页面：提供在线咨询、预约和心理测评功能（待开发）
function Counseling() {
  //加载咨询记录
  const [loading, setLoading] = useState(false)
  const [consultList, setConsultList] = useState([])
  //分页参数
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
  })
  //分页参数改变时，获取咨询记录
  const handlePageChange = (paginationConfig) => {
    const newCurrent = paginationConfig.current;
    setPagination(prev => ({
      ...prev,
      current: newCurrent,
      pageSize: paginationConfig.pageSize,
    }));
    // 关键：立即用新参数请求数据
    getConsultList(newCurrent, paginationConfig.pageSize);
  }
  useEffect(() => {
    getConsultList(pagination.current, pagination.pageSize)
  }, [pagination.current, pagination.pageSize])
  //获取咨询记录
  const getConsultList = async (current, pageSize) => {
    try {
      setLoading(true)
      const res = await consultPage({
        currentPage: current,
        size: pageSize,
      })
      setConsultList(res.records)
      setPagination(prev => ({
        ...prev,
        total: res.total,
      }))
    } catch (error) {
      message.error(error.message || '获取咨询记录失败')
    } finally {
      setLoading(false)
    }
  }
  const lightGrayTextStyle = { color: '#918e8eff' }

  const columns = [
    {
      title: '咨询会话ID',
      dataIndex: 'id',
      key: 'id',
      width: 40,                    // 固定宽度，不随滚动变化
      fixed: 'left',
      render: (text, record) => (
        <div style={lightGrayTextStyle}>
          {record.id}
        </div>
      ),
    },
    {
      title: '情绪标签',
      dataIndex: 'emotionTag',
      key: 'emotionTag',
      width: 600,                    // 固定宽度，不随滚动变化
      render: (text, record) => (
        <div>
          <p style={{ fontSize: '14px' }}>{record.sessionTitle}</p>
          <p style={{ fontSize: '12px', marginTop: '-10px', color: '#585555ff' }}>{record.lastMessageContent}</p>
        </div>
      ),
    },
    {
      title: '消息数',
      dataIndex: 'messageCount',
      key: 'messageCount',
      width: 40,                    // 固定宽度，不随滚动变化
      render: (text, record) => (
        <div style={lightGrayTextStyle}>
          {record.messageCount}
        </div>
      ),
    },
    {
      title: '时间',
      dataIndex: 'createTime',
      key: 'createTime',
      width: 60,                    // 固定宽度，不随滚动变化  
      render: (text, record) => (
        <div style={lightGrayTextStyle}>
          {record.lastMessageTime}
        </div>
      ),
    },
    {
      title: '操作',
      key: 'operation',
      width: 80,                    // 固定宽度，不随滚动变化
      fixed: 'right',
      render: (text, record) => (
        <div>
          <a onClick={ () => { setRecordId(record.id); setSessionInfo(record); setVisible(true)}} type="primary" size="small">查看详情</a>
        </div>
      ),
    },  
  ]
//咨询记录详情弹窗
const [visible, setVisible] = useState(false)
const [recordId, setRecordId] = useState('')
const [sessionInfo, setSessionInfo] = useState({})

return (
  <div>
    <PageHead title="咨询记录" />
    <Table
      pagination={pagination}
      onChange={handlePageChange}
      columns={columns}
      dataSource={consultList}
      loading={loading}
      rowKey={(record) => record.id}
      size="small"
      scroll={{ x: 950 }}
    ></Table>
    <ChatModal visible={visible} onCancel={() => setVisible(false)} id={recordId} sessionInfo={sessionInfo} />
  </div>
)
}

export default Counseling
