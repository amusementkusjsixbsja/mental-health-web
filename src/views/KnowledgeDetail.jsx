import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { message, Tag } from 'antd';
import { knowledgeArticleDetail } from '@/api/admin';
import { BookOutlined, UserOutlined, CalendarOutlined, EyeOutlined, TagsOutlined, CheckCircleOutlined } from '@ant-design/icons';
import '@/views/KnowledgeDetail.css'

function KnowledgeDetail() {
  const [detail, setDetail] = useState({});
  const { id } = useParams();
  const navigate = useNavigate();

  const getImage = (url) => {
    if (!url) return 'https://file.itndedu.com/psychology_ai.png';
    if (url.startsWith('http')) return url;
    return `http://159.75.169.224:1235${url}`;
  }

  useEffect(() => {
    knowledgeArticleDetail(id).then((res) => {
      setDetail(res);
    }).catch((err) => {
      message.error(err.message);
      navigate('/front/knowledge');
    })
  }, [id]);

  return (
    <div className='detail-page'>
      <div className='detail-header'>
        <div className='detail-header-content'>
          <BookOutlined className='detail-header-icon' />
          <h1 className='detail-header-title'>知识文章详情</h1>
        </div>
      </div>

      <div className='detail-body'>
        <div className='detail-card'>
          <div className='detail-content-label'>
            <BookOutlined /> 文章信息
          </div>

          <div className='detail-article-info'>
            <div className='detail-cover'>
              <img src={getImage(detail.coverImage)} alt={detail.title} />
            </div>

            <div className='detail-info-content'>
              <h1 className='detail-article-title'>{detail.title}</h1>

              <div className='detail-meta'>
                <span><UserOutlined /> {detail.authorName}</span>
                <span><CalendarOutlined /> {detail.publishedAt || detail.createdAt}</span>
                <span><EyeOutlined /> 阅读 {detail.readCount}</span>
                <span><CheckCircleOutlined /> {detail.statusText}</span>
              </div>

              {detail.summary && (
                <div className='detail-summary'>
                  <div className='detail-summary-label'>摘要</div>
                  <p>{detail.summary}</p>
                </div>
              )}

              {detail.categoryName && (
                <div className='detail-info-row'>
                  <div className='detail-info-label'>分类</div>
                  <div className='detail-info-value'><Tag color='blue'>{detail.categoryName}</Tag></div>
                </div>
              )}

              {detail.tagArray && detail.tagArray.length > 0 && (
                <div className='detail-info-row'>
                  <div className='detail-info-label'><TagsOutlined /> 标签</div>
                  <div className='detail-info-value detail-tags'>
                    {detail.tagArray.map((tag) => (
                      <Tag key={tag} color='green'>{tag}</Tag>
                    ))}
                  </div>
                </div>
              )}

              {detail.updatedAt && (
                <div className='detail-info-row'>
                  <div className='detail-info-label'>最后更新</div>
                  <div className='detail-info-value'>{detail.updatedAt}</div>
                </div>
              )}
            </div>
          </div>

        </div>

        <div className='detail-card'>
          <div className='detail-content-label'>
            <BookOutlined /> 文章正文
          </div>
          <div className='detail-article-body' dangerouslySetInnerHTML={{ __html: detail.content }} />
        </div>
      </div>

    </div>
  )
}
export default KnowledgeDetail;
