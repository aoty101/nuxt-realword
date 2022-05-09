/**
 * axios请求模块
 */

import axios from 'axios'

const request = axios.create({
    baseURL: 'http://realworld.api.fed.lagounews.com'
    // baseURL:'https://conduit.productionready.io'
    // baseURL:'https://api.realworld.io'
})


export default request 