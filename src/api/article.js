import request from '@/utils/request'

export function getList(params) {
    return request({
        url: '/Articles/Load',
        method: 'get',
        params
    })
}

export function get(params) {
    return request({
        url: '/Articles/Get',
        method: 'get',
        params
    })
}

export function add(data) {
    return request({
        url: '/Articles/Add',
        method: 'post',
        data
    })
}

export function update(data) {
    return request({
        url: '/Articles/Update',
        method: 'post',
        data
    })
}

export function del(data) {
    return request({
        url: '/Articles/delete',
        method: 'post',
        data
    })
}