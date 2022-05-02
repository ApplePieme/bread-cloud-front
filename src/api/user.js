import request from '@/utils/request'

export function register(data) {
  return request({
    url: '/user/register',
    method: 'post',
    data
  })
}

export function login(data) {
  return request({
    url: '/user/login',
    method: 'post',
    data
  })
}

export function getInfo(token) {
  return request({
    url: '/user/info',
    method: 'get',
    params: { token }
  })
}

export function logout(token) {
  return request({
    url: '/user/logout',
    method: 'get',
    params: { token }
  })
}

export function modifiedInfo(data) {
  return request({
    url: '/user/info/modified',
    method: 'post',
    data
  })
}

export function getRsa() {
  return request({
    url: '/user/rsa',
    method: 'get'
  })
}

export function modifiedPassword(data) {
  return request({
    url: '/user/password/modified',
    method: 'post',
    data
  })
}