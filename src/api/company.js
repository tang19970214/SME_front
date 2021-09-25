import request from '@/utils/request'

/* 輔導顧問 */
export function getUserSupExts(params) {
    return request({
        url: '/UserSupExts/Get',
        method: 'get',
        params
    })
}

export function addOrUpdateUserSupExts(data) {
    return request({
        url: '/UserSupExts/AddOrUpdate',
        method: 'post',
        data
    })
}
/* 基本資料 */
export function getUserExts(params) {
    return request({
        url: '/UserExts/Get',
        method: 'get',
        params
    })
}

export function addOrUpdateUserExts(data) {
    return request({
        url: '/UserExts/AddOrUpdateUserExt',
        method: 'post',
        data
    })
}
/* 公司發展 */
export function getCompanys(params) {
    return request({
        url: '/Companys/Get',
        method: 'get',
        params
    })
}

export function addOrUpdateCompanys(data) {
    return request({
        url: '/Companys/AddOrUpdate',
        method: 'post',
        data
    })
}
/* 營運狀況 */
export function getCompanyOperations(params) {
    return request({
        url: '/CompanyOperations/Get',
        method: 'get',
        params
    })
}

export function addOrUpdateCompanyOperations(data) {
    return request({
        url: '/CompanyOperations/AddOrUpdate',
        method: 'post',
        data
    })
}
/* 經營團隊 */
export function getCompanyTeams(params) {
    return request({
        url: '/CompanyTeams/Get',
        method: 'get',
        params
    })
}

export function addOrUpdateCompanyTeams(data) {
    return request({
        url: '/CompanyTeams/AddOrUpdate',
        method: 'post',
        data
    })
}
/* 股東結構 */
export function getCompanyShareHolders(params) {
    return request({
        url: '/CompanyShareHolders/Load',
        method: 'get',
        params
    })
}

export function addOrUpdateCompanyShareHolders(data) {
    return request({
        url: '/CompanyShareHolders/AddOrUpdate',
        method: 'post',
        data
    })
}
/* 其他項目 */
export function getCompanyOtherss(params) {
    return request({
        url: '/CompanyOtherss/Get',
        method: 'get',
        params
    })
}

export function addOrUpdateCompanyOtherss(data) {
    return request({
        url: '/CompanyOtherss/AddOrUpdate',
        method: 'post',
        data
    })
}