import request from '@/utils/request'

// 查询tgVIP分页
export function pageAppleGift(query) {
  return request({
    url: '/api/apple/gift/page',
    method: 'post',
    data: query
  })
}

// 查询领取记录分页
export function pageAppleGiftLog(query) {
  return request({
    url: '/api/apple/gift/log/page',
    method: 'post',
    data: query
  })
}

// 获取待分配号码
export function getTakeContent(data) {
  return request({
    url: '/api/apple/gift/getTakeContent',
    method: 'post',
    data: data
  })
}

// 批量录入
export function addBatch(data) {
  return request({
    url: '/api/apple/gift/addBatch',
    method: 'post',
    data: data
  })
}

// 更改获取的待分配号码的状态
export function updateTake(data) {
  return request({
    url: '/api/apple/gift/updateTake',
    method: 'post',
    data: data
  })
}
