import { request } from '@/plugins/request.js'

// 登录
export const login = data => {
    return request({
        method: 'POST',
        url: '/api/users/login',
        data
    })
}

// 注册
export const register = data => {
    return request({
        method: 'POST',
        url: '/api/users',
        data
    })
}

// 修改用户信息
export const updateUser = data => {
    return request({
        method: 'PUT',
        url: '/api/user',
        data
    })
}

// 用户个人中心
export const getProfile = username => {
    return request({
        method: 'GET',
        url: `/api/profiles/${username}`
    })
}

// 关注用户
export const followUser = username => {
    return request({
        method: 'POST',
        url: `/api/profiles/${username}/follow`
    })
}

// 取消关注
export const unFollowUser = username => {
    return request({
        method: 'DELETE',
        url: `/api/profiles/${username}/follow`
    })
}