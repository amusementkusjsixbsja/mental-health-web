import { Input, Select, DatePicker, Button } from 'antd'
import { useState, useMemo } from 'react'
import './tableSearch.css'

// 表格搜索组件：动态生成搜索表单，支持多种输入类型
function TableSearch({ Config, onSearch, layout = 'horizontal', itemWidth = '350px' }) {
  // 存储表单输入数据
  const [formData, setFormData] = useState({})

  // 处理表单字段值变化
  const handleChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  // 执行搜索操作，将表单数据传递给父组件
  const handleSearch = () => {
    onSearch(formData)
  }

  // 根据类型映射对应的Ant Design组件
  const fieldMap = useMemo(() => ({
    input: (props) => <Input {...props} />,
    select: (props) => <Select {...props} />,
    date: (props) => <DatePicker {...props} />,
  }), [])

  return (
    <div className={`table-search ${layout === 'vertical' ? 'vertical-layout' : 'horizontal-layout'}`}>
      {/* 动态渲染搜索表单项 */}
      <div className="search-items">
        {
          Config.map((item) => {
            const FieldComponent = fieldMap[item.type]
            return (
              <div key={item.name} className="search-item" style={{ flex: layout === 'vertical' ? '0 0 100%' : '0 0 auto', width: layout === 'vertical' ? '100%' : itemWidth }}>
                <FieldComponent
                  {...item}
                  value={formData[item.name] ?? undefined}
                  onChange={(e) => {
                    // 兼容Input（e.target.value）和Select/DatePicker（直接返回值）
                    const value = e?.target ? e.target.value : e
                    handleChange(item.name, value)
                  }}
                />
              </div>
            )
          })
        }
      </div>

      {/* 搜索和重置按钮 */}
      <div className="search-buttons">
        <Button type="primary" onClick={handleSearch}>搜索</Button>
        <Button style={{ marginLeft: 8 }} onClick={() => setFormData({})}>重置</Button>
      </div>
    </div>
  );
}
export default TableSearch