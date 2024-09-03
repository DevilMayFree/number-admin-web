import request from '@/utils/request'

// 查询号码分页
export function pageNumber(query) {
  return request({
    url: '/api/num/manager/page',
    method: 'post',
    data: query
  })
}

// 查询号码分页
export function listNumber(query) {
  return request({
    url: '/api/num/manager/list',
    method: 'post',
    data: query
  })
}

// 查询号码详细
export function getNumber(NumberId) {
  return request({
    url: '/api/num/manager/' + NumberId,
    method: 'get'
  })
}

// 新增号码
export function addNumber(data) {
  return request({
    url: '/api/num/manager/add',
    method: 'post',
    data: data
  })
}

// 修改号码
export function updateNumber(data) {
  return request({
    url: '/api/num/manager/edit',
    method: 'put',
    data: data
  })
}

// 删除号码
export function delNumber(NumberId) {
  return request({
    url: '/api/num/manager/del',
    method: 'delete',
    data: {
      ids: NumberId
    }
  })
}

