import request from '@/utils/request'

export function getList(params) {
  return request({
    url: '/WebFeedbacks/Load',
    method: 'get',
    params
  })
}

export function add(data) {
  return request({
    url: '/WebFeedbacks/add',
    method: 'post',
    data
  })
}

export function replayFeedBack(data) {
  return request({
    url: '/WebFeedbacks/ReplayFeedBack',
    method: 'post',
    data
  })
}