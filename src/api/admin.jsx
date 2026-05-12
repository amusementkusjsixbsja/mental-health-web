import service from '@/utils/request.jsx'

// 用户登录接口
export function login(data) {
  return service.post('/user/login', data)
}
// 用户注册接口
export function register(data) {
  return service.post('/user/add', data)
}
//用户退出登录接口
export function logout() {
  return service.post('/user/logout')
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
//分页查询咨询会话
export function consultPage(params) {
  return service.get('/psychological-chat/sessions', { params })
}
//获取咨询会话详情
export function consultDetail(id) {
  return service.get(`/psychological-chat/sessions/${id}/messages`)
}
//分页查询用户情绪日志
export function emotionalPage(params) {
  return service.get('/emotion-diary/admin/page', { params })
}

//删除用户情绪日志
export function deleteEmotional(id) {
  return service.delete(`/emotion-diary/admin/${id}`)
}
//获取数据分析
export function getAnalysis() {
  return service.get('/data-analytics/overview')
}
//创建新的会话
export function createChat(data) {
  return service.post('/psychological-chat/session/start', data)
}
//分页查询咨询会话
export function getConsultPage(params) {
  return service.get('/psychological-chat/sessions', { params })
}
//删除咨询会话
export function deleteConsult(sessionId) {
  return service.delete(`/psychological-chat/sessions/${sessionId}`)
}
//获取对话信息列表
export function getChatMessages(sessionId) {
  return service.get(`/psychological-chat/sessions/${sessionId}/messages`)
}
//获取情绪花园数据
export function getEmotionGarden(sessionId) {
  return service.get(`/psychological-chat/session/${sessionId}/emotion`)
}
