<template>
  <div>
    <!-- 基本用法 -->
    <div class="wrapper">
      <h4>基础用法</h4>
      <selector
        v-model="selected"
        :options="options"
        @mounted="onMounted"
      />
    </div>
    <!-- 多选 -->
    <div class="wrapper">
      <h4>多选</h4>
      <selector
        v-model="selected2"
        :options="options2"
        multiple
        @remove-tag="onRemoveTag"
      />
    </div>
  </div>
</template>

<script>
import Selector from '@/components/selector';

export default {
  name: 'SelectorDemo',
  components: {
    Selector
  },
  data () {
    return {
      selected: '',
      options: [
        { label: 'iPhone 8', value: 1 },
        { label: 'iPhone X', value: 2 },
        { label: 'OPPO Find X', value: 3 },
        { label: 'Vivo x1', value: 4 }
      ],
      selectorInstance: null,

      selected2: [],
      options2: [
        { label: '苹果', value: 5 },
        { label: '三星', value: 6 },
        { label: '华为', value: 7 },
        { label: '小米', value: 8 }
      ]
    };
  },
  methods: {
    onMounted (instance) {
      this.selectorInstance = instance;
    },
    onRemoveTag (param) {
      console.log(`${param} has been remove !`);
    }
  }
};
</script>

<style scoped>
.wrapper {
  margin-bottom: 50px;
}
h4 {
  margin: 10px 0;
}
</style>
