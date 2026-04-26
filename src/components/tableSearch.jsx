import { Input, Select, DatePicker, Button } from 'antd'
import { useState, useMemo } from 'react'
import './tableSearch.css'

function TableSearch({ Config, onSearch, layout = 'horizontal', itemWidth = '350px' }) {
  const [formData, setFormData] = useState({})

  const handleChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSearch = () => {
    onSearch(formData)
  }

  const fieldMap = useMemo(() => ({
    input: (props) => <Input {...props} />,
    select: (props) => <Select {...props} />,
    date: (props) => <DatePicker {...props} />,
  }), [])

  return (
    <div className={`table-search ${layout === 'vertical' ? 'vertical-layout' : 'horizontal-layout'}`}>
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
                    const value = e?.target ? e.target.value : e
                    handleChange(item.name, value)
                  }}
                />
              </div>
            )
          })
        }
      </div>

      <div className="search-buttons">
        <Button type="primary" onClick={handleSearch}>搜索</Button>
        <Button style={{ marginLeft: 8 }} onClick={() => setFormData({})}>重置</Button>
      </div>
    </div>
  );
}
export default TableSearch