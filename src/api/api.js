import request from '@/utils/request'

//------------------------------用户接口--------------------------------//
export function getUserInfo() {
  return request({
    url: '/api/shorturl/user/getUserInfo',
    method: 'get'
  })
}

//修改密码
export function updatePass(data) {
  return request({
    url: '/api/shorturl/user/updatePass',
    method: 'put',
    data
  })
}

//用户注册
export function register(data) {
  return request({
    url: `/api/shorturl/user/register/${data.code}`,
    method: 'post',
    data
  })
}

//------------------------------短网址接口--------------------------------//

export function shortInfoList(data, current, limit) {
  return request({
    url: `/api/shorturl/shortInfo/shortInfoList/${current}/${limit}`,
    method: 'post',
    data
  })
}

export function addShortInfo(data) {
  return request({
    url: '/api/shorturl/shortInfo/addShortInfo',
    method: 'post',
    data
  })
}
export function updateShortInfo(data) {
  return request({
    url: '/api/shorturl/shortInfo/updateShortInfo',
    method: 'put',
    data
  })
}
export function getTempShortInfo(data) {
  return request({
    url: `/api/shorturl/shortInfo/getTempShortInfo`,
    method: 'post',
    data
  })
}



export function remove(id) {
  return request({
    url: `/api/shorturl/shortInfo/delete/${id}`,
    method: 'delete',
  })
}

//------------------------------组接口--------------------------------//
//获取用户分组列表
export function groupList() {
  return request({
    url: '/api/shorturl/group/groupList',
    method: 'get',

  })
}

//获取分组详细信息
export function getGroup(id) {
  return request({
    url: `/api/shorturl/group/getGroup/${id}`,
    method: 'get'
  })
}

export function deleteGroup(id) {
  return request({
    url: `/api/shorturl/group/deleteGroup/${id}`,
    method: 'delete'
  })
}

export function updateGroup(data) {
  return request({
    url: '/api/shorturl/group/updateGroup',
    method: 'put',
    data
  })
}

export function addGroup(data) {
  return request({
    url: '/api/shorturl/group/addGroup',
    method: 'post',
    data
  })
}
//------------------------------数据统计接口--------------------------------//

export function getGroupArea() {
  return request({
    url: `/api/shorturl/statistics/getGroupArea`,
    method: 'get'
  })
}

export function getStatistics() {
  return request({
    url: `/api/shorturl/statistics/getStatistics`,
    method: 'get'
  })
}
export function getView() {
  return request({
    url: `/api/shorturl/statistics/getView`,
    method: 'get'
  })
}

export function sendCode(email) {
  return request({
    url: `/api/captcha/sendCode/${email}`,
    method: 'post'
  })
}

