import store from '@/store'
import { mapGetters } from 'vuex';
const mapOperation = (store as any).state.meanOperation

export default {
  beforeRouteUpdate (to: any, from: any, next: any) {
    (this as any).getDataAllList && (this as any).getDataAllList() // tab刷新页面数据
    next()
  },
  computed: {
    ...mapGetters([
      'loadingCont'
    ]),
    $_loading () {
      return this.loadingCont;
    }
  },
  methods: {
    // 验证规则 - 判断是否为空
    $_checkValidate (rule: any, value: any, callBack: any) {
      if (!value || !value.length) {
        (this as any).$set((this as any).rulesTips, rule.fullField, true);
        return callBack(new Error(' '));
      } else {
        (this as any).$set((this as any).rulesTips, rule.fullField, false);
        callBack();
      }
    },
    // 重置表单数据
    $_resetForm () {
      (this as any).$refs.searchModel && (this as any).$refs.searchModel.resetFields(); // 搜索

      if ((this as any).$refs.formData) {
        (this as any).$refs.formData.resetFields(); // 内部表单
        (this as any).resetRulesTips() // 内部表单重置验证信息
      }
    },
    // 权限限制
    $_hasOperation (name: any, operation: any) {
      // console.log(mapOperation);
      const list = mapOperation.get(name)
      if (!list) return false
      if (list.some((i: any) => i === operation)) return true
      else return false
    },
    $_useTypes (values: any) {
      let labels: any = {};
      const types: any = {};
      const options = Object.keys(values).map(key => {
        types[values[key]] = key;
        return {
          name: key,
          id: values[key],
          label: labels[key]
        };
      });
      return {
        values,
        labels: labels,
        types,
        options
      };
    },
    $_notifyError (values: any) {
      const arr = Object.keys(values);
      let errArray: any = [];
      for (let i = 0; i <= arr.length - 1; i++) {
        const item = arr[i];
        const error = values[item].rule;
        const message = values[item].message;
        if (error) {
          errArray.push(item);
          (this as any).$notify.error({
            title: '失败',
            message: `请${message}!!!`,
            position: 'bottom-right'
          });
          return false;
        }
      }
      return errArray;
    },
    $_setItem (items: any, data: any) {
      return items.map((item: any) => {
        return {
          ...item,
          value: (data[item.id] !== null && data[item.id] !== undefined) ? data[item.id] : ''
        }
      });
    }
  }
}






