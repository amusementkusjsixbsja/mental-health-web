import './pageHead.css'

// 页面头部组件：展示页面标题和操作按钮区域
function PageHead({ title, children }) {
  return (
    <div className="page-head">
      <p className="page-head-title">{title || '当前页面标题'}</p>
      {/* 操作按钮区域，通过children插槽传入 */}
      <div className="page-head-actions">
        {children}
      </div>
    </div>
  )
}

export default PageHead
