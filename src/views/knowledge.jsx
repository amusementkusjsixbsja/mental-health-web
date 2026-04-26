import PageHead from '../components/pageHead'
import { Button } from 'antd'
import TableSearch from '../components/tableSearch'

function Knowledge() {
  const searchConfig = [
    { type: 'input', name: 'search', placeholder: '搜索知识库' },
    { type: 'select', name: 'type', placeholder: '知识库类型', options: [{ label: '情感分析', value: 'emotional' }, { label: '咨询管理', value: 'cousutation' }, { label: '其他知识库' ,value:'other'}] }
  ]
  const onSearch = (values) => {
    console.log('搜索参数:', values)
  }
  return (
    <div>
      <PageHead title="知识库">
        <div style={{ display: 'flex', gap: 8 }}>
          <Button type="primary">新增</Button>
          <Button type="primary">删除</Button>
        </div>

      </PageHead>
      <TableSearch Config={searchConfig} onSearch={onSearch} />
    </div>
  )
}

export default Knowledge
