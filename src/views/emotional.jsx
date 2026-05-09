import PageHead from "@/components/pageHead"
import { emotionalPage ,deleteEmotionalById} from "@/api/admin"
import { useState, useEffect } from "react"
import { Table, message, Button, Modal, Descriptions, Badge, Tag, Progress } from "antd"
import TableSearch from "@/components/tableSearch"
// 情绪日志页面：用户情绪记录、分析和追踪功能（待开发）
function Emotional() {
  const searchConfig = [
    {
      type: 'input',
      name: 'userId',
      placeholder: '请输入用户ID'
    },
    {
      type: 'select',
      name: 'moodScore',
      placeholder: '请选择情绪范围',
      options: [
        {
          label: '差劲',
          value: '1-3'
        },
        {
          label: '一般',
          value: '4-6'
        },
        {
          label: '很棒',
          value: '7-10'
        }
      ]
    }
  ]
  const columns = [
    {
      title: '会话ID',
      dataIndex: 'id',
      key: 'id',
      width: 60,
    },
    {
      title: '用户ID',
      dataIndex: 'nickname',
      key: 'nickname',
      width: 120,
    },
    {
      title: '记录日期',
      dataIndex: 'diaryDate',
      key: 'diaryDate',
      width: 120,
    },
    {
      title: '情绪评分',
      dataIndex: 'moodScore',
      key: 'moodScore',
      width: 200,
      render: (_, record) => {
        const score = Number(record.moodScore) || 0
        const filledStars = Math.round(score)
        return (
          <span style={{ display: 'inline-flex', gap: 2, alignItems: 'center' }}>
            {Array.from({ length: 10 }, (_, i) => (
              <svg key={i} width="14" height="14" viewBox="0 0 24 24" style={{ display: 'block' }}>
                <path
                  d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
                  fill={i < filledStars ? '#faad14' : '#e8e8e8'}
                />
              </svg>
            ))}
          </span>
        )
      },
    },
    {
      title: '生活指标',
      dataIndex: 'lifeIndicators',
      key: 'lifeIndicators',
      width: 100,
    },
    {
      title: '情绪触发因素',
      dataIndex: 'emotionTriggers',
      key: 'emotionTriggers',
      ellipsis: true,
      width: 120,
    },
    {
      title: '日记内容',
      dataIndex: 'diaryContent',
      key: 'diaryContent',
      ellipsis: true,
      width: 600,
    },
    {
      title: '操作',
      dataIndex: 'operation',
      key: 'operation',
      width: 100,
      render: (_, record) => (
        <div>
          <a type="primary" size="small" onClick={() => emotionalDetail(record)}>详情</a>
          <a type="danger" size="small" onClick={() => deleteEmotional(record.id)} style={{ color: 'red', marginLeft: 10 }}>删除</a>
        </div>
      )
    }
  ]

  // 删除情绪日志
  const deleteEmotional = async (id) => {
    try {
      await deleteEmotionalById(id)
      message.success('删除成功')
      fetchEmotionalList(searchValues, pagination.current, pagination.pageSize)
    } catch (error) {
      console.error('删除情绪日志失败:', error)
      message.error('删除失败')
    }
  }


  const [loading, setLoading] = useState(false)
  const [searchValues, setSearchValues] = useState({})
  const [emotionalList, setEmotionalList] = useState([])
  const fetchEmotionalList = async (values, current, pageSize) => {
    try {
      setLoading(true)
      // 调用知识库列表接口（params：current，size，userId，minMoodScore，maxMoodScore，dominantEmotion，）
      const res = await emotionalPage({ ...values, currentPage: current, size: pageSize })
      // 根据API返回的数据结构：res = { records: [...], total: ... }
      // 从 records 字段提取文章列表
      const dataList = res?.records || []
      setEmotionalList(dataList)
      setPagination(prev => ({
        ...prev,
        total: res?.total || 0,
        current: current,
        pageSize: pageSize,
      }))
    } catch (error) {
      console.error('获取情绪日志列表失败:', error)
      setEmotionalList([])
    } finally {
      setLoading(false)
    }
  }
  const handleSearch = (values) => {
    // if (!values.userId && !values.emotionalScore) {
    //   message.error('请输入用户ID或情绪范围')
    //   return
    // }

    const newValues = {}
    if (values.emotionalScore) {
      newValues.minMoodScore = values.emotionalScore.split('-')[0]
      newValues.maxMoodScore = values.emotionalScore.split('-')[1]
    } else {
      newValues.minMoodScore = 0
      newValues.maxMoodScore = 10
    }
    newValues.userId = values.userId || ''
    setSearchValues(newValues)
    fetchEmotionalList(newValues, 1, pagination.pageSize)
  }
  //分页参数
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10
  })

  useEffect(() => {
    fetchEmotionalList(searchValues, pagination.current, pagination.pageSize)
  }, [])

  const setPageChange = (pagination) => {
    fetchEmotionalList(searchValues, pagination.current, pagination.pageSize)
  }


  // 新增情绪日志详情弹窗
  const [modalVisible, setModalVisible] = useState(false)
  //编辑情绪日志功能
  const emotionalDetail = (record) => {
    setModalVisible(true)
    setRecord(record)
  }
  const [record, setRecord] = useState({})

  //情绪日志详情弹窗数据（根据上面的json数据）
  const userItems = [
    {
      key: '1',
      label: '用户名',
      children: record.username
    },
    {
      key: '2',
      label: '用户id',
      children: record.userId,
      span: 2
    },
    {
      key: '3',
      label: '昵称',
      children: record.nickname
    }, {
      key: '4',
      label: '记录日期',
      children: record.diaryDate,
      span: 2
    }
  ];
  const emotionalItems = [
    {
      key: '4',
      label: '情绪评分',
      children: (() => {
        const score = Number(record.moodScore) || 0
        const filledStars = Math.round(score)
        return (
          <span style={{ display: 'inline-flex', gap: 2, alignItems: 'center' }}>
            {Array.from({ length: 10 }, (_, i) => (
              <svg key={i} width="14" height="14" viewBox="0 0 24 24" style={{ display: 'block' }}>
                <path
                  d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
                  fill={i < filledStars ? '#faad14' : '#e8e8e8'}
                />
              </svg>
            ))}
          </span>
        )
      })()
    },
    {
      key: '5',
      label: '主要情绪',
      children: <Tag>{record.dominantEmotion}</Tag>,
      span: 2
    },
    {
      key: '6',
      label: '睡眠质量',
      children: record.sleepQuality>5?record.sleepQuality+'/10':record.sleepQuality*2+'/10',
      span: 2
    },
    {
      key: '7',
      label: '压力等级',
      children: record.stressLevel>5?record.stressLevel+'/10':record.stressLevel*2+'/10',
      span: 2
    }
  ]
  const diaryItems = [
    {
      key: '8',
      label: '情绪触发因素',
      children: record.emotionTriggers,
      span: 3
    },
    {
      key: '9',
      label: '日记内容',
      children: record.diaryContent,
      span: 3
    }

  ]
  //情绪日志详情弹窗数据（根据上面的json数据）
  const aiItems = [
    {
      key: '10',
      label: '主要情绪',
      children: <Tag>{record.aiAnalysisStatus}</Tag>,
      span: 2
    },
    {
      key: '11',
      label: '情绪强度',
      children: <Progress percent={record.contentLength/2} />,
      span: 2
    }
  ]



  return (

    <div>
      <div><PageHead title="情绪日志" />
        <TableSearch Config={searchConfig} onSearch={handleSearch} />
      </div>
      <div>
        {/* 情绪日志列表 */}
        <Table
          columns={columns}
          dataSource={emotionalList}
          pagination={pagination}
          loading={loading}
          rowKey="id"
          onChange={setPageChange}
          scroll={{ x: 950 }}
        />
      </div>
      <Modal
        title="情绪日志详情"
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
        width={800}
        destroyOnHidden
      >
        <Descriptions title="用户信息" bordered items={userItems} />
        <Descriptions title="情绪状态" bordered items={emotionalItems} layout="vertical" />
        <Descriptions title="日记内容" bordered items={diaryItems} layout="vertical" />
        <Descriptions title="ai分析" bordered items={aiItems} layout="vertical" />
      </Modal>
    </div>
  )
}

export default Emotional
