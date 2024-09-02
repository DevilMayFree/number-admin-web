import request from '@/utils/request'
import {parseStrEmpty} from "@/utils/ruoyi";

// 查询用户列表
export function listUser(query) {
  return request({
    url: '/api/sys/user/page',
    method: 'post',
    data: query
  })
}

// 查询角色已授权用户列表
export function authUserPage(query) {
  return request({
    url: '/api/sys/user/authUser/page',
    method: 'post',
    data: query
  })
}

// 查询角色未授权用户列表
export function unAuthUserPage(query) {
  return request({
    url: '/api/sys/user/unAuthUser/page',
    method: 'post',
    data: query
  })
}

// 查询用户详细
export function getUser(userId) {
  return request({
    url: '/api/sys/user/' + parseStrEmpty(userId),
    method: 'get'
  })
}

// 新增用户
export function addUser(data) {
  return request({
    url: '/api/sys/user/add',
    method: 'post',
    data: data
  })
}

// 修改用户
export function updateUser(data) {
  return request({
    url: '/api/sys/user/edit',
    method: 'put',
    data: data
  })
}

// 删除用户
export function delUser(userId) {
  return request({
    url: '/api/sys/user/del',
    method: 'delete',
    data: {
      ids: userId
    }
  })
}

// 用户密码重置
export function resetUserPwd(userId) {
  return request({
    url: '/api/sys/user/resetPwd',
    method: 'post',
    data: {
      id: userId
    }
  })
}

// 用户状态修改
export function changeUserStatus(userId, status) {
  const data = {
    userId,
    status
  }
  return request({
    url: '/system/user/changeStatus',
    method: 'put',
    data: data
  })
}

// 查询用户个人信息
export function getUserProfile() {
  return request({
    url: '/system/user/profile',
    method: 'get'
  })
}

// 修改用户个人信息
export function updateUserProfile(data) {
  return request({
    url: '/system/user/profile',
    method: 'put',
    data: data
  })
}

// 用户密码重置
export function updateUserPwd(oldPassword, newPassword) {
  const data = {
    oldPassword,
    newPassword
  }
  return request({
    url: '/system/user/profile/updatePwd',
    method: 'put',
    params: data
  })
}

// 用户头像上传
export function uploadAvatar(data) {
  return request({
    url: '/system/user/profile/avatar',
    method: 'post',
    data: data
  })
}

// 查询授权角色
export function getAuthRole(userId) {
  return request({
    url: '/api/sys/user/authRole/page',
    method: 'post',
    data: {
      id: userId
    }
  })
}

// 保存授权角色
export function updateAuthRole(data) {
  return request({
    url: '/api/sys/role/roleAuth',
    method: 'put',
    data: data
  })
}

// 查询部门下拉树结构
export function deptTreeSelect() {
  return request({
    url: '/api/sys/user/deptTree',
    method: 'get'
  })
}
