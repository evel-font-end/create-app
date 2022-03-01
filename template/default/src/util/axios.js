// import axios from 'axios'
import Qs from 'qs'
import Config from '@/config'
import { Notification, MessageBox } from 'element-ui';
import promise from 'es6-promise';
import store from '@/store'
import { getLocal } from 'util/tool'
promise.polyfill();

// export const baseURL = process.env.NODE_ENV === 'development' ? Config.baseURL.dev : Config.baseURL.pro
    // const baseURL = process.env.NODE_ENV === 'development' ? process.env.API_ROOT : process.env.API_ROOT
const getRequestPrefix = () => {
    // 获取网络协议
    const protocol = window.location.protocol;
    // 获取主机名+端口号
    const domainPort = window.location.host;
    // 获取发布项目的名称
    // 获取路径
    const url = window.location.pathname;
    const webApp = url.split('/')[1];
    // http://127.0.0.1/demo
    const urlPrefix = protocol + "//" + domainPort;
    return urlPrefix;
}
export const baseURL = process.env.NODE_ENV === 'development' ? Config.baseURL.dev : getRequestPrefix()
class apiRequest {
    // 基础
    constructor() {
        // this.baseURL = process.env.BASE_API // 默认baseURL
        this.baseURL = baseURL // 默认baseURL
    }

    // 默认配置
    getConfigInfo() {
        const config = {
            baseURL: this.baseURL,
            timeout: 60000,
            // responseType: 'json', // default IE不支持该配置项，启用后返回的数据将没有data字段
            headers: { 'content-type': 'application/json;charset=UTF-8' } // 默认头
        }
        return config
    }

    // 定义拦截器
    interceptor(instance) {
        // 请求前
        instance.interceptors.request.use(config => {
            // console.log('config', config.url);
            // 判断当前日志是否开启了每隔10分钟刷新(开启关闭全局加载样式)
            if (getLocal('refreshLog') && config.url === '/api/gtwAuditLog/list' && store.state.openPage !== 'systemLog') {
                // store.commit('set_loadingCont', false)
            } else {
                // 全局loading....
                // store.commit('set_loadingCont', true)
            }

            return config
        }, err => {
            // 关闭全局loading...
            // store.commit('set_loadingCont', false)
            return new Promise.reject(err)
        })

        // 响应后
        instance.interceptors.response.use(res => {
            // 关闭全局loading...
            var time = null
                // clearTimeout(time)
                // time = setTimeout(() => {
                //     store.commit('set_loadingCont', false)
                // }, 350);
            // store.commit('set_loadingCont', false)

            if (res.data.code === '200') {
                return res.data
            } else if (res.data.code === '1000') { // 登录超时,需要重新登录
                MessageBox.alert('用户登录超时', '警告', {
                    confirmButtonText: '确定',
                    type: 'error',
                    callback: action => {
                        // 清空登录数据
                        store.commit('user/outUserLogin')
                    }
                });
            } else {
                Notification.error({
                    title: '失败',
                    message: res.data.message,
                    position: 'bottom-right'
                });
                return res.data
            }
        }, err => {
            Notification.error({
                title: '失败',
                message: err.error,
                position: 'bottom-right'
            });
            // 关闭全局loading...
            // store.commit('set_loadingCont', false)
            return new Promise.reject(err)
        })
    }

    // 请求创建
    request(options) {
        const instance = axios.create()
        options = Object.assign(this.getConfigInfo(), options)
        this.interceptor(instance)
        return instance(options)
    }
}




const apiCreat = new apiRequest()

export default apiCreat