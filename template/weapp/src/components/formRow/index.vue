<template>
  <Row v-bind="{ ...$attrs, ...$props }" class="formRow"></Row>
</template>

<script>
import Row from 'comp/row/index.vue'
import './index.scss'

export default {
  name: 'formRow',
  components: {
    Row,
  },
}
</script>
