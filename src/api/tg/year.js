import request from '@/utils/request'

// 查询tgYear分页
export function pageTgYear(query) {
  return request({
    url: '/api/tg/year/page',
    method: 'post',
    data: query
  })
}

// 查询领取记录分页
export function pageTgYearLog(query) {
  return request({
    url: '/api/tg/year/log/page',
    method: 'post',
    data: query
  })
}

// 获取待分配号码
export function getTakeContent(data) {
  return request({
    url: '/api/tg/year/getTakeContent',
    method: 'post',
    data: data
  })
}

// 批量录入
export function addBatch(data) {
  return request({
    url: '/api/tg/year/addBatch',
    method: 'post',
    data: data
  })
}

// 更改获取的待分配号码的状态
export function updateTake(data) {
  return request({
    url: '/api/tg/year/updateTake',
    method: 'post',
    data: data
  })
}
