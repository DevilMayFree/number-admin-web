import request from '@/utils/request'

// 获取服务信息
export function getServer() {
  return request({
    url: '/api/sys/monitor/server',
    method: 'get'
  })
}
