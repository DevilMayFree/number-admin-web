import request from '@/utils/request'

// 查询GmailVIP分页
export function pageGmailVIP(query) {
  return request({
    url: '/api/gmail/vip/page',
    method: 'post',
    data: query
  })
}

// 查询领取记录分页
export function pageGmailVIPLog(query) {
  return request({
    url: '/api/gmail/vip/log/page',
    method: 'post',
    data: query
  })
}

// 获取待分配号码
export function getTakeContent(data) {
  return request({
    url: '/api/gmail/vip/getTakeContent',
    method: 'post',
    data: data
  })
}

// 批量录入
export function addBatch(data) {
  return request({
    url: '/api/gmail/vip/addBatch',
    method: 'post',
    data: data
  })
}

// 更改获取的待分配号码的状态
export function updateTake(data) {
  return request({
    url: '/api/gmail/vip/updateTake',
    method: 'post',
    data: data
  })
}
