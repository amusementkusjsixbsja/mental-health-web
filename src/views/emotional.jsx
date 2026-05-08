import PageHead from "@/components/pageHead"
import { emotionalPage } from "@/api/admin"
import { useState, useEffect } from "react"
import { Table, message, Button } from "antd"
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
      name: 'emotionalScore',
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
      width:200,
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
      dataIndex: 'dominantEmotion',
      key: 'dominantEmotion',
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
      width:100,
      render: (record) => (
        <div>
          <a type="primary" size="small">详情</a>
          <a type="danger" size="small" style={{ color: 'red', marginLeft: 10 }}>删除</a>
        </div>
      )
    }
  ]
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
    if(values.emotionalScore) {
      newValues.minMoodScore = values.emotionalScore.split('-')[0] 
      newValues.maxMoodScore = values.emotionalScore.split('-')[1] 
    }else{
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
    </div>
  )
}

export default Emotional
