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