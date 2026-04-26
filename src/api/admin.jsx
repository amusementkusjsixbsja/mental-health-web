import service from '@/utils/request.jsx'

export function login(data) {
  return service.post('/user/login',data)
}