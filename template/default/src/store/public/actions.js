/* eslint-disable */
import router from 'router'
import { saveLocal, hasChild } from 'util/tool'
import { toTree } from 'util/util'
import { getuserRoleMeanList } from 'api/user'
import { Notification } from 'element-ui';
import { setTimeout } from 'timers';
import store from '@/store'
import routes, { loginRoute, biderRoute } from 'router/routers.js';

// 登录成功获取当前用户可访问的路由信息,添加路由表信息
let myMap = new Map(),
    whiteList = ['index', 'indexPage', 'updatePassword', 'error_404',
        'edit',
        'pdf',
        // 'bid_apply',
        // 'bid_applylist',
        // 'user_statistics',
        // 'deal_statistics',
        // 'res_statistics',
        // 'finance_statistics',
        // 'login_behavior',
        // 'docs_management',
        // 'bidd_Info_List'
    ],
    def_whiteList = []
export const getUserRoleRouter = ({ commit, state, getters }, username) => {
    return new Promise((resolve, reject) => {
        try {
            // 此处后续添加获取当前登录用户所拥有的访问页面权限
            getuserRoleMeanList(username).then(res => {
                if (res.code === '200') {
                    // 添加路由前需要重构结构
                    let list = creatMenuByRouters(meanMap(res.data.mergedPermissions, res.data.userType))
                    function creatMenuByRouters(list) {
                        list.forEach((item, index) => {
                            if (!hasChild(item)) {
                                commit('set_meanOperation', { key: item.permissionCode, value: item.operation })
                            } else {
                                creatMenuByRouters(item.children)
                            }
                        })
                    }

                    let whritRouterList = Array.from(new Set(whiteList.concat(whiteList))) // whritRouterList去重
                    // let whritRouterList = whiteList
                    commit('set_whritRouterList', whritRouterList)
                    saveLocal('whritRouterList', whritRouterList)
                    saveLocal('meanOperation', state.meanOperation)
                    resolve()
                } else {
                    Notification.error({
                        title: '失败',
                        message: '网络故障登录失败,请重新登录',
                        position: 'bottom-right'
                    });
                    setTimeout(() => {
                        commit('user/outUserLogin')
                    }, 2000)
                    reject(res.message)
                }
            }).catch(err => {
                Notification.error({
                    title: '失败',
                    message: '网络故障登录失败,请重新登录',
                    position: 'bottom-right'
                });
                setTimeout(() => {
                    commit('user/outUserLogin')
                }, 2000)

                reject(err)
            })
        } catch (err) {
            Notification.error({
                title: '失败',
                message: '网络故障登录失败,请重新登录',
                position: 'bottom-right'
            });
            setTimeout(() => {
                commit('user/outUserLogin')
            }, 2000)
            reject(err)
        }
    })
}



function meanMap(list, type) {
    if (!list) return []
    let map = {}
    list.forEach(item => {
        map[item.id] = item
    });


    let val = []
    list.forEach(item => {
        let par = map[item.parentId]
        if (par) {
            if (item.permissionType === 2) {
                // 根据permissionCode分割，取第二个字符
                (par.operation || (par.operation = [])).push(item.permissionCode.split('_')[1])
            } else {
                (par.children || (par.children = [])).push(item)
            }
        } else {
            val.push(item)
        }

        if (item.permissionType === 1) {
            const permissionCode = (type == 1 && item.parentId === 0) ? `${item.permissionCode}_static` : item.permissionCode;
            whiteList.push(permissionCode)
        }
    })

    console.log('val', val);
    return val
}