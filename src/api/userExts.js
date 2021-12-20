import request from '@/utils/request'

export function CheckAllColumns(params) {
  return request({
    url: '/userExts/CheckAllColumns',
    method: 'get',
    params
  })
}

export function SendPlan(params) {
  return request({
    url: '/userExts/SendPlan',
    method: 'get',
    params
  })
}