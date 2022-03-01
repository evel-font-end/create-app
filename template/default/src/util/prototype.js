// 指定索引添加数据
Array.prototype.insert = function (index, item) {
    this.splice(index, 0, item)
}


