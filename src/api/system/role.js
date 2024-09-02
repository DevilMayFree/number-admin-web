import request from '@/utils/request'

// 查询角色分页
export function pageRole(query) {
  return request({
    url: '/api/sys/role/page',
    method: 'post',
    data: query
  })
}

// 查询角色分页
export function listRole(query) {
  return request({
    url: '/api/sys/role/list',
    method: 'post',
    data: query
  })
}

// 查询角色详细
export function getRole(roleId) {
  return request({
    url: '/api/sys/role/' + roleId,
    method: 'get'
  })
}

// 新增角色
export function addRole(data) {
  return request({
    url: '/api/sys/role/add',
    method: 'post',
    data: data
  })
}

// 修改角色
export function updateRole(data) {
  return request({
    url: '/api/sys/role/edit',
    method: 'put',
    data: data
  })
}

// 角色数据权限
export function dataScope(data) {
  return request({
    url: '/system/role/dataScope',
    method: 'put',
    data: data
  })
}

// 删除角色
export function delRole(roleId) {
  return request({
    url: '/api/sys/role/del',
    method: 'delete',
    data: {
      ids: roleId
    }
  })
}

// 取消用户授权角色
export function authUserCancel(data) {
  return request({
    url: '/api/sys/role/authCancel',
    method: 'delete',
    data: data
  })
}

// 授权用户选择
export function authUserSelectAll(data) {
  return request({
    url: '/api/sys/role/userAuth',
    method: 'put',
    data: data
  })
}

// 根据角色ID查询部门树结构
export function deptTreeSelect(roleId) {
  return request({
    url: '/system/role/deptTree/' + roleId,
    method: 'get'
  })
}
