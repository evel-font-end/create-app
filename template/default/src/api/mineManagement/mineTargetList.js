import api from '@/util/axios'
// 标的列表
export const getTransMineTargetList = ({ data, pageNo, pageSize, sorting }) => {
        const fromData = {
            data: {...data }, //查询角色信息 
            pageNo, //查询的分页页码。默认值为1 ,
            pageSize, //查询的分页页大小。默认值为10 
            sorting, // 排序
        }
        return api.request({
            method: 'post',
            url: '/api/transMineTarget/list',
            data: fromData
        })
    }
    // 批量删除标的
export const delTransByIds = (data) => {
        return api.request({
            method: 'post',
            url: '/api/transTarget/deleteByIds',
            data: data
        })
    }
    // 查询标的详情
export const getTransMineTargetInfo = (targetId) => {
        return api.request({
            method: 'get',
            url: '/api/transMineTarget/' + targetId,
        })
    }
    // 获取所有矿业交易类型
export const getMineBusinessType = () => {
    return api.request({
        method: 'get',
        url: '/api/transMineTarget/getMineBusinessType',
    })
}

// 获取交易类型
export const getTransactionType = () => {
    return api.request({
        method: 'get',
        url: '/api/transMineTarget/getTransactionType',
    })
}

// 获取标的状态
export const getTargetStatus = () => {
        return api.request({
            method: 'get',
            url: '/api/transTarget/getTargetStatus',
        })
    }
    // 初始化标的附件信息
export const initMineGoodsAttach = () => {
        return api.request({
            method: 'get',
            url: '/api/transMineTarget/initTargetAttach',
        })
    }

    // 查询矿业标的附件目录信息
export const getMineTargetAttach = (id) => {
    return api.request({
        method: 'get',
        url: '/api/transMineTarget/mineTargetAttach?targetId=' + id,
    })
}

// 查询未绑定标的的土地交易物
export const getunBindList = ({ data, pageNo, pageSize, sorting }) => {
    const fromData = {
        data: {...data }, //查询角色信息 
        pageNo, //查询的分页页码。默认值为1 ,
        pageSize, //查询的分页页大小。默认值为10 
        sorting, // 排序
    }
    return api.request({
        method: 'post',
        url: '/api/transMineGoods/unBindList',
        data: fromData
    })
}

// 修改/保存标的
export const saveTransTarget = (data) => {
    return api.request({
        method: 'post',
        url: '/api/transMineTarget/saveTransTarget',
        data: data
    })
}