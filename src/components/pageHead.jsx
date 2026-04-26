import './pageHead.css'

function PageHead({ title, children }) {
  return (
    <div className="page-head">
      <p className="page-head-title">{title || '当前页面标题'}</p>
      <div className="page-head-actions">
        {children}
      </div>
    </div>
  )
}

export default PageHead
