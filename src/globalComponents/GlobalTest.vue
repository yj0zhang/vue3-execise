<script type="module" lang="ts">
import { h } from 'vue';

export default {
  setup() {
    console.log('global setup')
    return () => {
      return h('div', null, '我是全局组件')
    }
  }
}
</script>
