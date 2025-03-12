export interface AxiosResponse {
    data: ResProps
}

export interface ResProps {
    data: any,
    code: string,
    message: string
}

export interface TreeData {
    id: number,
    name: string,
    parentId: number,
    createTime: string,
    children: any[]
}

export const gradeOptions = [{
    id: '一年级',
    name: '一年级'
}, {
    id: '二年级',
    name: '二年级'
}, {
    id: '三年级',
    name: '三年级'
}, {
    id: '四年级',
    name: '四年级'
}, {
    id: '五年级',
    name: '五年级'
}, {
    id: '六年级',
    name: '六年级'
}, {
    id: '七年级',
    name: '七年级'
}, {
    id: '八年级',
    name: '八年级'
}, {
    id: '九年级',
    name: '九年级'
}, {
    id: '十年级',
    name: '十年级'
}, {
    id: '十一年级',
    name: '十一年级'
}, {
    id: '十二年级',
    name: '十二年级'
}]

export const sexOptions = [{
    id: '1',
    name: '男'
}, {
    id: '2',
    name: '女'
}]