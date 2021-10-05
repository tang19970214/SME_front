import request from '@/utils/request'

export function getList(params) {
    return request({
        url: '/Planss/Load',
        method: 'get',
        params
    })
}

export function add(data) {
    return request({
        url: '/Planss/add',
        method: 'post',
        data
    })
}

export function update(data) {
    return request({
        url: '/Planss/update',
        method: 'post',
        data
    })
}

export function del(data) {
    return request({
        url: '/Planss/delete',
        method: 'post',
        data
    })
}

export function userLoadView(params) {
    return request({
        url: '/Planss/UserLoadView',
        method: 'get',
        params
    })
}