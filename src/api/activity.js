import request from '@/utils/request'

export function getList(params) {
    return request({
        url: '/Activitys/Load',
        method: 'get',
        params
    })
}

export function get(params) {
    return request({
        url: '/Activitys/Get',
        method: 'get',
        params
    })
}

export function add(data) {
    return request({
        url: '/Activitys/Add',
        method: 'post',
        data
    })
}

export function update(data) {
    return request({
        url: '/Activitys/Update',
        method: 'post',
        data
    })
}

export function del(data) {
    return request({
        url: '/Activitys/delete',
        method: 'post',
        data
    })
}