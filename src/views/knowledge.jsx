import { useState, useEffect } from 'react'
import PageHead from '../components/pageHead'
import { Button, Table, Pagination } from 'antd'
import TableSearch from '../components/tableSearch'
import { categoryTree, articlePage } from '@/api/admin.jsx'
import CreateMdal from '@/components/articleModal.jsx'

// 知识库管理页面：展示知识库列表，支持搜索、筛选、新增和删除操作
function Knowledge() {
  // 存储分类列表数据
  const [categoryList, setCategoryList] = useState([])
  // 控制加载状态
  const [loading, setLoading] = useState(false)
  // 存储表格数据
  const [tableData, setTableData] = useState([])
  // 搜索参数
  const [searchValues, setSearchValues] = useState({})
  // 分类ID到名称的映射表
  const categoryMap = {}
  //分页参数
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10
  })
  // 分页组件回调函数：处理分页变化
  const setPageChange = (paginationConfig) => {
    const newCurrent = paginationConfig.current;
    setPagination(prev => ({
      ...prev,
      current: newCurrent,
      pageSize: paginationConfig.pageSize,
    }));
    fetchArticleList(searchValues, newCurrent, paginationConfig.pageSize);
  }

  // 组件挂载时获取分类树数据
  useEffect(() => {
    fetchCategoryTree()
  }, [])

  // 获取知识库分类数据并格式化
  const fetchCategoryTree = async () => {
    try {
      setLoading(true)
      const res = await categoryTree()
      console.log('知识库分类原始数据:', res)

      // 兼容不同的响应数据格式
      const dataList = res?.data || res || []
      // 格式化分类数据为下拉选项格式
      const formattedList = dataList.map(item => {
        categoryMap[item.id] = item.categoryName
        return {
          label: item.categoryName,
          value: item.id
        }
      })
      setCategoryList(formattedList)
      // 获取分类后加载知识库数据
      fetchArticleList({}, 1, pagination.pageSize)
    } catch (error) {
      console.error('获取知识库分类失败:', error)
    } finally {
      setLoading(false)
    }
  }

  // 获取知识库文章列表
  const fetchArticleList = async (values, current, pageSize) => {
    try {
      setLoading(true)
      // 调用知识库列表接口
      const res = await articlePage({ ...values, currentPage: current, size: pageSize })
      console.log('知识库列表原始数据:', res)
      // 根据API返回的数据结构：res = { records: [...], total: ... }
      // 从 records 字段提取文章列表
      const dataList = res?.records || []
      console.log('最终处理的数据列表:', dataList)
      setTableData(dataList)
      setPagination(prev => ({
        ...prev,
        total: res?.total || 0
      }))
    } catch (error) {
      console.error('获取知识库列表失败:', error)
      setTableData([])
    } finally {
      setLoading(false)
    }
  }

  // 搜索表单配置：包含搜索框、知识库类型、状态筛选
  const searchConfig = [
    { type: 'input', name: 'title', placeholder: '搜索文章标题' },
    { type: 'select', name: 'categoryId', placeholder: '选择分类', options: categoryList },
    {
      type: 'select', name: 'status', placeholder: '选择状态', options: [
        { label: '全部', value: 0 },
        { label: '发布', value: 1 },
        { label: '下线', value: 2 }
      ]
    }]

  // 处理搜索提交
  const handleSearch = (values) => {
    console.log('搜索参数:', values)
    setSearchValues(values)
    fetchArticleList(values, 1, pagination.pageSize)
  }


// 表格列配置（带宽度和响应式滚动）
const columns = [
  {
    title: '文章标题',
    dataIndex: 'title',
    key: 'title',
    width: 280,                    // 固定宽度，不随滚动变化
    fixed: 'left',                 // 左侧固定（可选，让标题列始终可见）
    render: text => <a>{text}</a>,
  },
  {
    title: '分类',
    dataIndex: 'categoryName',
    key: 'categoryName',
    width: 120,
    render: text => <span>{text}</span>,
  },
  {
    title: '作者',
    dataIndex: 'authorName',
    key: 'authorName',
    width: 120,
  },
  {
    title: '阅读量',
    dataIndex: 'readCount',
    key: 'readCount',
    width: 100,
    align: 'center',               // 阅读量居中对齐
  },
  {
    title: '发布时间',
    dataIndex: 'publishedAt',
    key: 'publishedAt',
    width: 180,
  },
  {
    title: '操作',
    key: 'action',
    width: 150,                    // 固定宽度
    fixed: 'right',                // 右侧固定，方便操作
    render: (text, record) => (
      <span>
        <a>编辑</a>
        {record.status === 2 ? (
          <a key="unpublish" style={{ marginLeft: 8, color: 'green' }}>下线</a>
        ) : (
          <a key="publish" style={{ marginLeft: 8, color: 'orange' }}>发布</a>
        )}
      </span>
    ),
  },
];

// 新增知识库文章弹窗
const [modalVisible, setModalVisible] = useState(false)


  return (
    <div>
      {/* 页面头部：标题和操作按钮 */}
      <PageHead title="知识库">
        <div style={{ display: 'flex', gap: 8 }}>
          <Button type="primary" onClick={()=>setModalVisible(true)}>新增</Button>
        </div>
      </PageHead>

      {/* 搜索筛选表单 */}
      <TableSearch Config={searchConfig} onSearch={handleSearch} />

      {/* 数据表格 */}
      <Table
        columns={columns}
        dataSource={tableData}
        rowKey="id"
        loading={loading}
        pagination={pagination}
        onChange={setPageChange}
        scroll={{ x: 950 }}
      />
      {/* 新增知识库文章弹窗 */}
      <CreateMdal visible={modalVisible} onCancel={()=>setModalVisible(false)} categoryList={categoryList} /> 

    </div>
  )
}

export default Knowledge
