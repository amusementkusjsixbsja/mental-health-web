import '@/views/knowledgeFront.css'
import { BookOutlined } from '@ant-design/icons';
import { knowledgeArticlePage } from '@/api/admin';
import { message, Tag, Pagination } from 'antd';
import { useEffect, useState } from 'react';
import { SlidersOutlined, CalendarOutlined, UserOutlined, DesktopOutlined } from '@ant-design/icons';



function KnowledgeFront() {
  const [menuArticleList, setMenuArticleList] = useState([]);
  const [articleList, setArticleList] = useState([]);
  const [pagination, setPagination] = useState({
    total: 0,
    current: 1,
    pageSize: 10,
  });
  useEffect(() => {
    knowledgeArticlePage({
      sortField: 'readCount',
      sortDirection: 'desc',
      currentPage: 1,
      size: 5,
    }).then((res) => {
      setMenuArticleList(res.records);
    })
    knowledgeArticlePage({
      sortField: 'publishAt',
      sortDirection: 'desc',
      currentPage: pagination.current,
      size: pagination.pageSize,
    }).then((res) => {
      setArticleList(res.records);
      pagination.total = res.total;
      setPagination(pagination);
    })
  }, [pagination.current]);
  // 获取文章封面图片
  const getImage = (url) => {
    if (url?.startsWith('http')) {
      return url;
    }
    return url ? `http://159.75.169.224:1235${url}` : 'https://file.itndedu.com/psychology_ai.png';
  }

  return (
    <div className='emotion-diary-container'>
      <div className='emotion-diary-header'>
        <div className='header-content'>
          <BookOutlined className='header-icon' />
          <h1 className='header-title'>知识库</h1>
        </div>
      </div>

      {/**内容 */}
      <div className='knowledge-content'>
        {/**左侧菜单 */}
        <div className='knowledge-menu'>
          <div className='menu-title'>推荐阅读</div>
          <div className='menu-item-list'>
            {menuArticleList.map((item) => (
              <div key={item.id} className='menu-item'>
                <div className='menu-icon'><h4>{item.title}</h4></div>
                <div className='read-count'>
                  <SlidersOutlined />
                  <p>阅读量：{item.readCount}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        {/**右侧文章列表 */}
        <div className='knowledge-article-list'>
          <div className='menu-title'>文章列表</div>
          <div className='menu-item-list'>
            {articleList.map((item) => (
              <div key={item.id} className='article-item'>
                <div className='article-image'>
                  <img src={item?.coverImage ? getImage(item.coverImage) : 'https://file.itndedu.com/psychology_ai.png'} alt={item.title} style={{ width: 200, height: 120, 'objectFit': 'cover' }} />
                </div>
                <div className='article-info'>
                  <div className='article-title'>
                    {item.title}
                    <Tag color='blue' variant='outlined'>{item.categoryName}</Tag>
                  </div>
                  <div className='article-detail'>
                    <div className='article-authorName'><UserOutlined />{item.authorName}</div>
                    <div className='article-createdAt'><CalendarOutlined />{item.createdAt}</div>
                  </div>
                  <div className='article-readCount'><DesktopOutlined />{item.readCount}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
        {/**分页组件 */}
        <div className='pagination'>
          <Pagination
            total={pagination.total}
            current={pagination.current}
            pageSize={pagination.pageSize}
            onChange={(page) => {
              setPagination({
                ...pagination,
                current: page,
              });
            }}
          />
        </div>
      </div>
    </div>
  );
}
export default KnowledgeFront;