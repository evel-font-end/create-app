import { userLogin, logout } from "api/user";
import { getApproveRecordList, getDealRecord } from '@/api';
import { delLocal } from 'util/tool'
import Cookies from 'js-cookie'
import Config from '@/config'
// 用户信息
export default {
    namespaced: true,
    state() {
        return {
            username: Cookies.get('username') || '', // 用户名
            user: Cookies.get('user') || '', // id
            userType: Cookies.get('userType') || '', // 用户类型
            operation: '', // 用户可访问页面&&权限
            userImgPath: '', // 用户头像
            record: 0, // 待办数量
            dealRecord: {
                tradeManage: 0,
                landTrade: 0,
                landDeal: 0,
                mineDeal: 0,
                mineTrade: 0,
                farmDeal: 0,
                farmTrade: 0,
            }, // 交易待办数量
        }
    },
    mutations: {
        // 设置登录用户信息
        setUserInfo(state, { username, user, userType }) {
            state.username = username
            state.user = user
            state.userType = userType
            Cookies.set('username', username, { expires: Config.cookieExpires || 1 })
            Cookies.set('user', user, { expires: Config.cookieExpires || 1 })
            Cookies.set('userType', userType, { expires: Config.cookieExpires || 1 })
        },
        // 退出登录
        outUserLogin(state) {
            state.username = ''
            state.user = ''
            state.userType = ''
            state.dynamicMenuList = []
            state.record = 0
            Cookies.remove('username')
            Cookies.remove('user')
            Cookies.remove('userType')
            delLocal('menuTags') // tage
            delLocal('refreshLog') // 删除系统日志每隔10分钟更新一次记录
            delLocal('whritRouterList') // 可访问页面白名单
            delLocal('meanOperation') // 当前页面权限
            delLocal('keepAliveRouter') // 删除缓存白名单
            delLocal('dynamicMenuList') // 删除缓存动态菜单
            delLocal('link') // 删除缓存
            delLocal('refresh') // 删除缓存
            delLocal('currentEditData') // 删除缓存
            delLocal('openPage') // 删除缓存
            window.location.reload();
        },
        setRecord(state, { total }) {
            state.record = total
        },
        setDealRecord(state, {data}) {
            state.dealRecord = data
        }
    },
    getters: {},
    actions: {
        // 登录
        userLoginTo({ commit }, { username, password, key, captcha, loginType, certName, SignedDataB64, caLogin }) {
            // username = username.trim()
            return new Promise((resolve, reject) => {

                userLogin({ username, password, key, captcha, loginType, certName, SignedDataB64, caLogin }).then(res => {
                    if (res.code === "200") {
                        const data = res.data
                        commit('setUserInfo', data.username)
                        getApproveRecordList({data:{}, pageNo: 1, pageSize: 10}).then(listRes => {
                            if (listRes.code === '200') {
                                const { total } = listRes.data;
                                commit('setRecord', {total})
                            }
                        })
                        resolve(data)
                    } else {
                        reject(res.message)
                    }
                }).catch(err => {
                    reject(err)
                })
            })
        },
        userLoginDealRecord ({commit}) {
            getDealRecord().then(recordRes => {
                if (recordRes.code === '200') {
                    commit('setDealRecord', {data: recordRes.data})
                }
            })
        },
        // 登出
        userLoginOut({ commit }) {
            return new Promise((resolve, reject) => {
                logout().then(res => {
                    if (res.code === "200") {
                        commit('outUserLogin')
                        resolve()
                    } else {
                        reject(res.message)
                    }
                })
            })
        }
    }
}