<script lang="ts" setup>
import { computed, onWatcherCleanup, reactive, readonly, ref, watch, watchEffect, type ComputedRef, type Reactive, type Ref } from 'vue';

// ref
const count:Ref<number> = ref(0);
setTimeout(() => {
  count.value ++
}, 1000);

const doubleCount:ComputedRef<number> = computed(() => count.value * 2)
const tripleCount:ComputedRef<number> = computed({
  get() {
    return count.value *3
  },
  set(v) {
    count.value = v/3
  }
})

const plusOne:ComputedRef<number> = computed(() => count.value + 1, {
  onTrack(e) {//调试计算属性
    console.log(e);
  },
  onTrigger(e) {//调试计算属性
    console.log(e);
  }
})



//reactive
const obj: Reactive<{count: number}> = reactive({count: 1})
console.log(obj)//原始对象的proxy
const refObj:Ref<{n:number}> = ref({n:1});
const obj2:Reactive<{count: Ref<number>,refObj: Ref<{n:number}>}> = reactive({count, refObj});
console.log('reactive 会把ref解包，不再需要用.value访问', obj2.count, obj2.refObj.n)
count.value= 2
console.log('可以拿到原数据最新值', obj2.count,count.value)
obj2.count = 4
console.log('可以更新原数据', obj2.count,count.value)

const arr1 = reactive([ref('s')])
console.log('遇到数组ref，不会解包，需用.value访问',arr1[0].value)
const map1 = reactive(new Map([['name',ref('s')]]))
console.log('遇到mapref，也不会解包，需用.value访问',map1.get('name')?.value)

// const obj3: Reactive<{count?:Ref<number>}> = reactive({})
// obj3.count = count.value

// readonly & watchEffect
const original = reactive({count:0});
const copy=readonly(original);
const unwatchEffect = watchEffect((onCleanup) => {
  console.log('副本变了',copy.count)
  onCleanup(() => {
    console.log('用onCleanup注册一个cleanup方法，会在该副作用下一次执行前被调用，可以在这里清除无效的副作用，比如停止上次的请求', copy.count)
  })
},{
  flush: 'pre',//pre 默认值，会在所有组件dom渲染之前(父组件更新后)执行，post是在组件渲染后执行，sync是同步调（在所有更新前）
  onTrack: e=> console.log('watchEffect track',e),
  onTrigger: e=> console.log('watchEffect trigger',e),
})
//直接调用，停止watch，与unwatchEffect.stop()一样
// unwatchEffect()
console.log('可以用这个方法暂停、恢复和停止侦听',unwatchEffect)
original.count ++
//copy.count ++//只读副本不能被修改，这行代码无效


//watch
watch(original, (/** newVal,oldVal,onCleanup */) => {

  //可以不用onCleanup，用onWatcherCleanup
  onWatcherCleanup(() => {
    //在这里清理无效的副作用
  })
}, {
  flush: 'post',
  deep: true,//boolean or number
  immediate: false,
  once: false
})

</script>

<template>
  <div>
    <h2>ref</h2>
    ref count is {{ count }} <br>
    ref doubleCount is {{ doubleCount }} <br>
    ref tripleCount is {{ tripleCount }} <br>
    ref plusOne is {{ plusOne }}
    <button @click="tripleCount = 30"> changeCount </button>
  </div>
  <div>
    <h2>reactive</h2>
  </div>
</template>

<style lang="less" scoped>

</style>
