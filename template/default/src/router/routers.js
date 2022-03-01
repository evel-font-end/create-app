/* eslint-disable */
/*
    title 标题
    hideInMenu: (false) 设为true后在左侧菜单不显示
    role: (null) 可访问该页面的权限数组[]
    hideChildenAlways: (false)  如果设置true则显示当前路由下的子级到左侧菜单
    icon: 该页面在左侧菜单、面包屑和标签导航处显示的图标
*/

// 土地管理
//   地块信息
//   标的信息
// 	 公告信息
// 矿业管理
//   矿区信息
//   标的信息
//   公告信息
// 耕地指标		
// 	 指标管理	
// 	 公告管理
// 交易管理
//     土地交易
//         中止交易
//         限价管理
//         底价管理
//         确认审核
//         交易监控
//     矿产交易
//         中止交易
//         限价管理
//         底价管理
//         确认审核
//         交易监控
//    耕地指标交易	
//         中止交易
//         成交确认
//         摇号管理
//         资格审核

// 基础信息管理
//     角色管理
//     用户管理
//     权限管理
//     字典管理
//     附件模板
//     审核流程配置
// 以下菜单为竞买人菜单
// 我的交易
//     竞价记录
//     我的申请
// 交易公告
//     标的申请

const MainView = () =>
    import('components/mainView');
const sonView = () =>
    import('components/sonView') // 挂载
import Config from '@/config'


export const loginRoute = [
    // { path: '/', redirect: '/index/indexPage' },
    {
        path: '/login',
        name: 'login',
        component: () =>
            import('components/login/login')
    }];
export default [
    { path: '/', redirect: '/index/indexPage' },
    {
        path: '/login',
        name: 'login',
        component: () =>
            import('components/login/login')
    },
    {
        path: '/index',
        name: 'index',
        component: MainView,
        meta: {
            hideInMenu: true,
            title: '首页',
            icon: 'iconfont icon-home'
        },
        children: [
            // 测试首页显示
            {
                path: "indexPage",
                name: "indexPage",
                component: () =>
                    import('view/testpage/index'),
                meta: {
                    title: "首页",
                    icon: "iconfont icon-dot",
                },
            },
            {
                path: 'updatePassword',
                name: 'updatePassword',
                component: () =>
                    import('components/updatePassword/updatePassword')
            },
        ]
    },



    {
        path: "/deal_examine",
        name: "deal_examine",
        component: MainView,
        meta: {
            title: "个人事项",
            icon: "iconfont icon-tongyongleiyonghunan"
        },
        children: [
            {
                path: "audit_Information",
                name: "audit_Information",
                component: () =>
                    import('view/dealExamine/auditInformation/index'),
                meta: {
                    title: "我的待办",
                    icon: "iconfont icon-dot",
                }
            },
            {
                path: "been_approve",
                name: "been_approve",
                component: () =>
                    import('view/dealExamine/beenApprove/index'),
                meta: {
                    title: "我的已办",
                    icon: "iconfont icon-dot",
                }
            }
        ]
    },
    {
        path: "/land_management",
        name: "land_management",
        component: MainView,
        meta: {
            title: "土地管理",
            icon: "iconfont icon-sifaleifangqu"
        },
        children: [{
            path: "goods_list",
            name: "goods_list",
            component: () =>
                import('view/landManagement/landTrade/LandTradeList'),
            meta: {
                title: "线上委托",
                icon: "iconfont icon-dot",
            },
        },
        {
            path: "taragelist",
            name: "tarage_list",
            component: () =>
                import('view/landManagement/tarageList/index'),
            meta: {
                title: "标的管理",
                icon: "iconfont icon-dot",
            },
        },
        {
            path: "noticelist",
            name: "notice_list",
            component: () =>
                import('view/landManagement/noticeList/index'),
            meta: {
                title: "公告信息",
                icon: "iconfont icon-dot",
            }
        },
        ]
    },
    {
        path: "/mine_management",
        name: "mine_management",
        component: MainView,
        meta: {
            title: "矿业管理",
            icon: "iconfont icon-tongyongleiziyuanquanxian"
        },
        children: [{
            path: "mine_list",
            name: "mine_list",
            component: () =>
                import('view/mineManagement/TradeList/index'),
            meta: {
                title: "线上委托",
                icon: "iconfont icon-dot",
            },
        }, {
            path: "mineTargetList",
            name: "mine_target_list",
            component: () =>
                import('view/mineManagement/mineTargetList/index'),
            meta: {
                title: "标的管理",
                icon: "iconfont icon-dot",
            }
        },
        {
            path: "minenoticelist",
            name: "mine_notice_list",
            component: () =>
                import('view/mineManagement/mineNoticeList/index'),
            meta: {
                title: "公告信息",
                icon: "iconfont icon-dot",
            },
        },
        ]
    },
    {
        path: "/plow_management",
        name: "plow_management",
        component: MainView,
        meta: {
            title: "耕地指标",
            icon: "iconfont icon-qitaleinongzuowu"
        },
        children: [{
            path: "low_bidder_list",
            name: "low_bidder_list",
            component: () =>
                import('view/plowMmanagement/lowBidderList/index'),
            meta: {
                title: "委托人管理",
                icon: "iconfont icon-dot",
            }
        }, {
            path: "low_entrast_list",
            name: "low_entrast_list",
            component: () =>
                import('view/plowMmanagement/lowEntrastList/index'),
            meta: {
                title: "线上委托",
                icon: "iconfont icon-dot",
            }
        }, {
            path: "low_index_list",
            name: "low_index_list",
            component: () =>
                import('view/plowMmanagement/lowIndexList/index'),
            meta: {
                title: "指标管理",
                icon: "iconfont icon-dot",
            }
        }, {
            path: "low_noticelist",
            name: "low_noticelist",
            component: () =>
                import('view/plowMmanagement/lowNoticelist/index'),
            meta: {
                title: "公告管理",
                icon: "iconfont icon-dot",
            },
        },
        ]
    },
    {
        path: "/deal_management",
        name: "deal_management",
        component: MainView,
        meta: {
            title: "交易管理",
            icon: "iconfont icon-jiaoyiguanli"
        },
        children: [{
            path: "deal_land_manage",
            name: "deal_land_manage",
            component: () =>
                import('view/dealManagement/dealLandManage/index'),
            meta: {
                title: "土地交易",
                icon: "iconfont icon-dot",
            },
            children: [{
                path: "breakdeal_list",
                name: "break_deal_list",
                component: () =>
                    import('view/dealManagement/dealLandManage/breakdealList/index'),
                meta: {
                    title: "中止交易",
                    icon: "iconfont icon-dot",
                }
            },
            {
                path: "highpricemangelist",
                name: "high_price_mange_list",
                component: () =>
                    import('view/dealManagement/dealLandManage/highPriceMangeList/index'),
                meta: {
                    title: "限价管理",
                    icon: "iconfont icon-dot",
                }
            },
            {
                path: "lowpricemangelist",
                name: "low_price_mange_list",
                component: () =>
                    import('view/dealManagement/dealLandManage/lowPriceMangeList/index'),
                meta: {
                    title: "底价管理",
                    icon: "iconfont icon-dot",
                }
            },
            {
                path: "updatedeal_list",
                name: "update_deal_list",
                component: () =>
                    import('view/dealManagement/dealLandManage/updatedealLlist/index'),
                meta: {
                    title: "成交确认",
                    icon: "iconfont icon-dot",
                }
            }
            ]
        },
        {
            path: "mine_deal_management",
            name: "mine_deal_management",
            component: () =>
                import('view/dealManagement/mineDealManagement/index'),
            meta: {
                title: "矿产交易",
                icon: "iconfont icon-dot",
            },
            children: [{
                path: "mine_breakdeal_list",
                name: "mine_break_deal_list",
                component: () =>
                    import('view/dealManagement/mineDealManagement/mineBreakdealList/index'),
                meta: {
                    title: "中止交易",
                    icon: "iconfont icon-dot",
                }
            },
            {
                path: "miehighpricemangelist",
                name: "mie_high_price_mange_list",
                component: () =>
                    import('view/dealManagement/mineDealManagement/mieHighPriceMangeList/index'),
                meta: {
                    title: "限价管理",
                    icon: "iconfont icon-dot",
                }
            },
            {
                path: "minelowpricemangelist",
                name: "mine_low_price_mange_list",
                component: () => import('view/dealManagement/mineDealManagement/mineLowPriceMangeList/index'),

                meta: {
                    title: "底价管理",
                    icon: "iconfont icon-dot",
                }
            },
            {
                path: "mine_afterdeal_list",
                name: "mine_afterdeal_list",
                component: () => import('view/dealManagement/mineDealManagement/mineAfterdealList/index'),

                meta: {
                    title: "成交确认",
                    icon: "iconfont icon-dot",
                }
            },
            {
                path: "mine_control_list",
                name: "mine_control_list",
                component: () =>
                    import('view/dealManagement/mineDealManagement/mineControlList/index'),
                meta: {
                    title: "交易监控",
                    icon: "iconfont icon-dot",
                }
            }
            ]
        },
        {
            path: "plow_deal_management",
            name: "plow_deal_management",
            component: () =>
                import('view/dealManagement/plowDealManagement/index'),
            meta: {
                title: "耕地指标交易",
                icon: "iconfont icon-dot",
            },
            children: [
                // {
                //     path: "plow_qualification_examine",
                //     name: "plow_qualification_examine",
                //     component: () =>
                //         import('view/dealManagement/plowDealManagement/plowQualificationExamine/index'),
                //     meta: {
                //         title: "资格审核",
                //         icon: "iconfont icon-dot",
                //     }
                // },
                {
                    path: "plow_breakdeal_list",
                    name: "plow_breakdeal_list",
                    component: () => import('view/dealManagement/plowDealManagement/plowBreakdealList/index'),
                    meta: {
                        title: "中止交易",
                        icon: "iconfont icon-dot",
                    }
                },
                {
                    path: "plow_high_price_mange_list",
                    name: "plow_high_price_mange_list",
                    component: () => import('view/dealManagement/plowDealManagement/plowHighPriceMangeList/index'),
                    meta: {
                        title: "限价管理",
                        icon: "iconfont icon-dot",
                    }
                },
                {
                    path: "plow_low_price_mange_list",
                    name: "plow_low_price_mange_list",
                    component: () => import('view/dealManagement/plowDealManagement/plowLowPriceMangeList/index'),
                    meta: {
                        title: "底价管理",
                        icon: "iconfont icon-dot",
                    }
                },
                {
                    path: "plow_updatedeal_list",
                    name: "plow_updatedeal_list",
                    component: () =>
                        import('view/dealManagement/plowDealManagement/plowUpdatedealList/index'),
                    meta: {
                        title: "成交确认",
                        // title: "确认审核",
                        icon: "iconfont icon-dot",
                    }
                },
                // {
                //     path: "plow_random_management",
                //     name: "plow_random_management",
                //     component: () =>
                //         import('view/dealManagement/plowDealManagement/plowRandomManagement/index'),
                //     meta: {
                //         title: "摇号管理",
                //         icon: "iconfont icon-dot",
                //     }
                // }
            ]
        },
        {
            path: "return_earnest_money",
            name: "return_earnest_money",
            component: () =>
                import('view/dealManagement/returnEarnestMoney'),
            meta: {
                title: "退还保证金",
                icon: "iconfont icon-dot",
            }
        },
        {
            path: "bank_account_management",
            name: "bank_account_management",
            component: () =>
                import('view/dealManagement/bankAccountManagement'),
            meta: {
                title: "银行账户管理",
                icon: "iconfont icon-dot",
            }
        },
        {
            path: "afterdeal_list",
            name: "afterdeal_list",
            component: () =>
                import('view/dealManagement/dealLandManage/afterdealList/index'),
            meta: {
                title: "交易监控",
                icon: "iconfont icon-dot",
            }
        },
        {
            path: "blacklist_deal_management",
            name: "blacklist_deal_management",
            component: () =>
                import('view/dealManagement/blacklistDealManagement'),
            meta: {
                title: "黑名单管理",
                icon: "iconfont icon-dot",
            }
        }
        ]
    },
    // 交易统计start
    {
        path: "/deal_statistics",
        name: "deal_statistics",
        component: MainView,
        meta: {
            title: "统计分析",
            icon: "iconfont icon-jiaoyiguanli"
        },
        children: [
            {
                path: "user_statistics",
                name: "user_statistics",
                component: () =>
                    import('view/dealStatistics/userStatis/index'),
                meta: {
                    title: "用户统计",
                    icon: "iconfont icon-dot",
                }
            },
            {
                path: "login_behavior",
                name: "login_behavior",
                component: () =>
                    import('view/dealStatistics/loginBehavior/index'),
                meta: {
                    title: "登录行为",
                    icon: "iconfont icon-dot",
                }
            },
            {
                path: "res_statistics",
                name: "res_statistics",
                component: () =>
                    import('view/dealStatistics/resStatis/index'),
                meta: {
                    title: "资源统计",
                    icon: "iconfont icon-dot",
                }
            },
            {
                path: "finance_statistics",
                name: "finance_statistics",
                component: () =>
                    import('view/dealStatistics/financeStatis/index'),
                meta: {
                    title: "财务统计",
                    icon: "iconfont icon-dot",
                }
            },
            {
                path: "docs_management",
                name: "docs_management",
                component: () =>
                    import('view/dealStatistics/docsManagement/index'),
                meta: {
                    title: "文档管理",
                    icon: "iconfont icon-dot",
                }
            },
            {
                path: "bidd_Info_List",
                name: "bidd_Info_List",
                component: () =>
                    import('view/dealStatistics/biddInfoList/index'),
                meta: {
                    title: "竞买信息",
                    icon: "iconfont icon-dot",
                }
            },
        ]
    },
    // 交易统计end     
    {
        path: "/help_center",
        name: "help_center",
        component: MainView,
        meta: {
            title: "帮助中心",
            icon: "iconfont icon-rule"
        },
        children: [
            {
                path: "help_list",
                name: "help_list",
                component: () =>
                    import('view/helpCenter/helpList/index'),
                meta: {
                    title: "帮助中心",
                    icon: "iconfont icon-dot",
                }
            }
        ]
    },
    {
        path: "/basic_information_management",
        name: "basic_information_management",
        component: MainView,
        meta: {
            title: "基础信息管理",
            icon: "iconfont icon-tongyongleizudakai"
        },
        children: [{
            path: "role_management",
            name: "role_management",
            component: () =>
                import('view/baseInfoManage/roleManagement/index'),
            meta: {
                title: "角色管理",
                icon: "iconfont icon-dot",
            }
        },
        {
            path: "user_management",
            name: "user_management",
            component: () =>
                import('@/view/baseInfoManage/userManagement/Users'),
            meta: {
                title: "用户管理",
                icon: "iconfont icon-dot",
            }
        },
        {
            path: "resources-management",
            name: "resources_management",
            component: () =>
                import('@/view/baseInfoManage/resourcesManagement/index'),
            meta: {
                title: "权限管理",
                icon: "iconfont icon-dot",
            }
        },
        {
            path: "dictionaries_management",
            name: "dictionaries_management",
            component: () =>
                import('@/view/baseInfoManage/dictionariesManagement/index'),
            meta: {
                title: "字典管理",
                icon: "iconfont icon-dot",
            }
        },
        {
            path: "atta_templet",
            name: "atta_templet",
            component: () =>
                import('@/view/baseInfoManage/attaTemplet/index'),
            meta: {
                title: "附件模板",
                icon: "iconfont icon-dot",
                hideInMenu: true
            }
        },
        {
            path: "approve_config",
            name: "approve_config",
            component: () =>
                import('@/view/baseInfoManage/approveConfig/index'),
            meta: {
                title: "审核流程配置",
                icon: "iconfont icon-dot",
            }
        },
        ]
    },

    {
        path: "/people_deal_management",
        name: "people_deal_management",
        component: MainView,
        meta: {
            title: "我的交易",
            icon: "iconfont icon-main_trans1",
            hideInMenu: true
        },
        children: [
            {
                path: "bidding_price_list",
                name: "bidding_price_list",
                component: () =>
                    import('view/peopleDealManagement/biddingPriceList/index'),
                meta: {
                    title: "我的申请",
                    icon: "iconfont icon-dot",
                }
            }, {
                path: "people_deal_offer_log",
                name: "people_deal_offer_log",
                component: () =>
                    import('view/peopleDealManagement/peopleDealOfferLog/index'),
                meta: {
                    title: "竞价记录",
                    icon: "iconfont icon-dot",
                },
                children: [{
                    path: 'edit',
                    name: 'edit',
                    component: () =>
                        import('view/peopleDealManagement/peopleDealOfferLog/Edit'),
                    meta: {
                        title: "竞价申请",
                        icon: "iconfont icon-dot",
                        hideInMenu: true
                    }
                }]
            },

        ]
    },
    {
        path: "/people_deal_notic_list",
        name: "people_deal_notic_list",
        component: MainView,
        meta: {
            title: "交易公告",
            icon: "iconfont icon-notice1",
            hideInMenu: true
        },
        children: [{
            path: "tarage_apply",
            name: "tarage_apply",
            component: () =>
                import('view/peopleDealNoticList/tarageApply/index'),
            meta: {
                title: "标的申请",
                icon: "iconfont icon-dot",
            }
        }]
    },
    {
        path: '/error_404',
        name: 'error_404',
        component: () =>
            import('components/error_404')
    }
]