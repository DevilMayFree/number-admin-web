import request from '@/utils/request'

// 查询tgVIP分页
export function pageAppleVIP(query) {
  return request({
    url: '/api/apple/vip/page',
    method: 'post',
    data: query
  })
}

// 查询领取记录分页
export function pageAppleVIPLog(query) {
  return request({
    url: '/api/apple/vip/log/page',
    method: 'post',
    data: query
  })
}

// 获取待分配号码
export function getTakeContent(data) {
  return request({
    url: '/api/apple/vip/getTakeContent',
    method: 'post',
    data: data
  })
}

// 批量录入
export function addBatch(data) {
  return request({
    url: '/api/apple/vip/addBatch',
    method: 'post',
    data: data
  })
}

// 更改获取的待分配号码的状态
export function updateTake(data) {
  return request({
    url: '/api/apple/vip/updateTake',
    method: 'post',
    data: data
  })
}
