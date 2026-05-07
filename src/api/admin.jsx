import service from '@/utils/request.jsx'

// 用户登录接口
export function login(data) {
  return service.post('/user/login', data)
}

// 获取知识库分类树接口
export function categoryTree() {
  return service.get('/knowledge/category/tree')
}

// 获取知识库文章分页列表接口
export function articlePage(params) {
  return service.get('/knowledge/article/page', { params })
}
//文件上传
export function uploadFile(file, params) {
  const formData = new FormData()
  formData.append('file', file)
  formData.append('businessType', 'ARTICLE')
  formData.append('businessId', params.businessId)
  formData.append('businessField', 'cover')
  return service.post('/file/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}
// 新增知识库文章
export function addArticle(data) {
  return service.post('/knowledge/article', data
  )
}
//获取知识库文章详情
export function articleDetail(id) {
  return service.get(`/knowledge/article/${id}`)
}
// 更新知识库文章
export function updateArticle(id, data) {
  return service.put(`/knowledge/article/${id}`, data)
}
//更新文章状态
export function updateArticleStatus(id, status) {
  return service.put(`/knowledge/article/${id}/status`, { status })
}
//删除文章
export function deleteArticle(id) {
  return service.delete(`/knowledge/article/${id}`)
}