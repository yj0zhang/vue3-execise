<script setup lang="ts">
import {
  // inject,
  nextTick, onMounted, ref, type Component, type Ref } from 'vue';
  import PropsComponent from '@/components/PropsComponent.vue'

// const globalProvide = inject('globalProvide')

const myValue = ref(1);
defineExpose({
  myValue
})
setTimeout(() => {
  myValue.value = 3
  nextTick().then(() => {
    //这种情况拿不到currentInstance
    console.log('计时器方法执行了',divRef.value!.innerHTML)
  })
}, 1000);

const divRef:Ref<HTMLElement | null> = ref(null);

onMounted(async () => {
  myValue.value = 2
  console.log('挂载后',divRef.value!.innerHTML)
  nextTick().then(() => {
    //这种情况拿不到currentInstance
    console.log('dom更新后',divRef.value!.innerHTML)
  })
  // await nextTick();
  // console.log('nextTick后',divRef.value!.innerHTML)
})

const address = ref({n:1})
const name = ref('zyj')
setTimeout(() => {
  address.value.n = 2
  name.value = 'zyj p'
}, 1000);

// 可以拿到自组件expose出来的数据
const comRef:Ref<Component | null> = ref(null);

</script>
<template>

    <!-- <MyGlobalComponent v-my-global-directive:myArg.myModifier1.myModifier2="myValue" myattrs="3"/> -->
  <!-- <div v-my-global-directive:myArg.myModifier1.myModifier2="myValue">dom元素</div> -->
   <!-- <span>{{ globalProvide }}</span> -->
   <div class="test" ref="divRef">about {{ myValue }}</div>
   <PropsComponent ref="comRef" :name="name" :age="30" gender="女" :address="address"/>
</template>

<style>
@media (min-width: 1024px) {
  .about {
    min-height: 100vh;
    display: flex;
    align-items: center;
  }
}
</style>
