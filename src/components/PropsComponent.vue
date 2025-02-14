<script lang="ts">
import type {PropType} from 'vue'
import {Fragment,h,toRefs} from 'vue'

interface IAddress {
  n: number
}
export default {
  props: {
    name: String,
    age: Number,
    address: {
      type: Object as PropType<IAddress>,
      default: () => ({})
    }
  },
  setup(props, {emit,attrs,expose,slots}) {
    console.log(emit,attrs,expose,slots)
    const {name,age,address} = toRefs(props)
    expose({name})
    return () => {
      return h(Fragment, null,[
        h('div', props.name),
        h('div', props.age),
        h('div', props.address.n),

        h('div', '解构：'+ name.value),
        h('div', '解构：'+ age.value),
        h('div', '解构：'+ address.value.n),
      ])
    }
  }
}
// const props = defineProps(
//   {
//     name: String,
//     age: Number,
//     address: {
//       type: Object as PropType<IAddress>,
//       default: () => ({})
//     }
//   }
// )
</script>

<!-- <script lang="ts" setup>
// import type {PropType} from 'vue'
import {toRefs} from 'vue'

interface IAddress {
  n: number
}
const props = defineProps<{
  name: string,
  age: number,
  address: IAddress
}>()
const {name,age,address} = toRefs(props)

// const props = defineProps(
//   {
//     name: String,
//     age: Number,
//     address: {
//       type: Object as PropType<IAddress>,
//       default: () => ({})
//     }
//   }
// )
</script>
<template>
  <div>通过props传递的名字：{{props.name}}</div>
  <div>通过props传递的年龄：{{props.age}}</div>
  <div>通过props传递的门牌号：{{props.address.n}}</div>

  <div>通过props传递的名字：{{name}}</div>
  <div>通过props传递的年龄：{{age}}</div>
  <div>通过props传递的门牌号：{{address.n}}</div>
</template> -->
