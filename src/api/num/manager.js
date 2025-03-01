import request from '@/utils/request'

// 查询号码分页
export function pageNumber(query) {
  return request({
    url: '/api/num/manager/page',
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

// 分配团队
export function updateTeam(data){
  return request({
    url: '/api/num/manager/updateTeam',
    method: 'put',
    data: data
  })
}

// 批量续费
export function updateRenew(data){
  return request({
    url: '/api/num/manager/updateRenew',
    method: 'put',
    data: data
  })
}

// 批量录入
export function addBatch(data){
  return request({
    url: '/api/num/manager/addBatch',
    method: 'post',
    data: data
  })
}

// 批量编辑
export function editBatch(data){
  return request({
    url: '/api/num/manager/editBatch',
    method: 'post',
    data: data
  })
}

// 卡片批量编辑
export function editCardBatch(data){
  return request({
    url: '/api/num/manager/editCardBatch',
    method: 'post',
    data: data
  })
}

// 执行批量编辑
export function doEditBatch(data){
  return request({
    url: '/api/num/manager/doEditBatch',
    method: 'post',
    data: data
  })
}

// 执行卡片批量编辑
export function doCardEditBatch(data){
  return request({
    url: '/api/num/manager/doEditCardBatch',
    method: 'post',
    data: data
  })
}
