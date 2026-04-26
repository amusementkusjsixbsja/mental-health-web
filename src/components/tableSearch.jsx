import { Input, Select, DatePicker, Button } from 'antd'

function TableSearch({ Config, onSearch }) {
  const fieldMap = {
    input: (props) => <Input {...props} />,
    select: (props) => <Select {...props} />,
    date: (props) => <DatePicker {...props} />,
  }
  return (
    <div className="table-search">
      {
        Config.map((item) => {
          const FieldComponent = fieldMap[item.type]
          return (
            <div key={item.name} className="search-item">
              <FieldComponent {...item} />
            </div>
          )
        })
      }
      <Button type="primary" onClick={onSearch}>搜索</Button>
    </div>
  );
}
export default TableSearch