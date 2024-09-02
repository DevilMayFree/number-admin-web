import request from '@/utils/request'

// 查询字典数据列表
export function listData(data) {
  return request({
    url: '/api/sys/dict/data/page',
    method: 'post',
    data: data
  })
}

// 查询字典数据详细
export function getData(dataId) {
  return request({
    url: '/api/sys/dict/data/' + dataId,
    method: 'get'
  })
}

// 根据字典类型查询字典数据信息
export function getDicts(dictType) {
  return request({
    url: '/api/sys/dict/data/detail',
    method: 'post',
    data: {
      code: dictType
    }
  })
}

// 新增字典数据
export function addData(data) {
  return request({
    url: '/api/sys/dict/data/add',
    method: 'post',
    data: data
  })
}

// 修改字典数据
export function updateData(data) {
  return request({
    url: '/api/sys/dict/data/edit',
    method: 'put',
    data: data
  })
}

// 删除字典数据
export function delData(dataId) {
  return request({
    url: '/api/sys/dict/data/del',
    method: 'delete',
    data:{
      ids: dataId
    }
  })
}
