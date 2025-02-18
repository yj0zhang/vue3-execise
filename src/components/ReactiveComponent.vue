<script lang="ts" setup>
import { useDebouncedRef } from '@/hooks/useDebounceRef';
import { computed, effect, effectScope, getCurrentScope, isReactive, onScopeDispose, onWatcherCleanup, reactive, readonly, ref, shallowReactive, shallowRef, toRaw, toRef, toRefs, triggerRef, watch, watchEffect, type ComputedRef, type Reactive, type Ref } from 'vue';

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

interface IObj {
  name: string;
  address: {
    n:number
  }
}

const obj4:Reactive<IObj> = reactive({name:'1', address:{n:1}})
const obj5:Ref<IObj> = ref({name:'1', address:{n:1}})
// eslint-disable-next-line prefer-const
let {name: name4, address: address4} = obj4
// eslint-disable-next-line prefer-const
let {name: name5, address: address5} = obj5.value
setTimeout(() => {
  name4 = '2';
  address4.n = 2;
  name5 = '2';
  address5.n = 2;
}, 1000);


/**
 * isRef 判断一个变量是否ref类型
 * unref 等价于 isRef(val) ? val.value : val
 * toRef 返回一个ref，与原数据关联，使用返回的ref get或set，实际上操作的是原数据
 * toValue 在unref的基础上，增加了对getter的规范化，会把ref，普通值和getter规范化为值
 * toRefs 将reactive对象，转换成普通对象，这个普通对象的每个属性是对reactive对象属性的ref
 */

const obj6 = reactive({name: 'ss'})
const refToObje6name = toRef(obj6, 'name');
console.log('refToObje6name',refToObje6name.value)
const refToObje6nameGetter = toRef(() => obj6.name);
console.log('refToObje6nameGetter',refToObje6nameGetter.value)
// const refToObje6nameGetterSetter = toRef({
//   get() {
//     return obj6.name
//   },
//   set(v: string) {
//     obj6.name = v
//   }
// });
// console.log('refToObje6nameGetterSetter',refToObje6nameGetterSetter.value)

const obj7 = reactive({name:'2',age:20});
const obj7Refs = toRefs(obj7);
console.log('obj7Refs的每个属性，与obj7的属性关联了',obj7Refs.age.value === obj7.age)
console.log('obj7Refs的每个属性，与obj7的属性关联了',obj7Refs.name.value === obj7.name)



const obj8 = shallowRef({count: 3});
console.log('shallow ref',obj8.value.count)
effect(() => {
  console.log('shallow ref obj8的effect触发了',obj8.value)
})
// 这样修改会直接触发上面的effect
obj8.value = {count :5}
console.log('shallow ref 修改value',obj8)
//这样修改，不会触发上面的effect，因为这样不会触发obj8的set方法
obj8.value.count = 4
//get的时候会取到最新值
console.log('shallow ref 修改属性',obj8.value)
//但是可以用triggerRef方法直接触发
console.log('shallow ref 使用triggerRef直接触发obj8的effect')
triggerRef(obj8)


//customRef，使用customRef实现在设置text时，实现防抖，修改text后500毫秒后才生效
//可以绑定在input上，实现用户输入防抖
const text = useDebouncedRef('hello',500);
console.log(text)

//shallowReactive
const obj9 = shallowReactive({
  foo: 1,
  nested: {
    bar: 2
  }
})
effect(() => {
  console.log('obj9的副作用被触发了',JSON.stringify(obj9))
})
// 更改状态自身的属性是响应式的
obj9.foo = 3
// ...但下层嵌套对象不会被转为响应式
isReactive(obj9.nested) // false
// 不是响应式的，不会触发副作用
obj9.nested.bar = 3
console.log('obj9.nested.bar不是响应式的，不会触发副作用，但读取时可以取到最新值',JSON.stringify(obj9))
//shallowReadonly 只有对象的第一层属性不可更改；同时如果属性值为ref，不会被自动解包
// toRaw返回Vue创建的代理的原始对象，包括reactive,readonly,shallowReactive,shallowReadonly
// toRaw也可以返回ref.value的原始对象
const obj10 = {foo:1}
const obj10Ref = ref(obj10)
console.log('返回ref.value的原始对象：',toRaw(obj10Ref.value) === obj10)
//markRaw 将一个对象标记为不可代理

//effectScope
const scope = effectScope();
const obj11 = ref(2)
obj11.value = 3;

scope.run(() => {
  console.log('effectScope run', obj11.value)
  const doubled = computed(() => obj11.value * 2)
  watch(doubled, () => console.log('effectScope run double',doubled.value))
  watchEffect(() => console.log('effectScope run Count: ', doubled.value))
  onScopeDispose(() => {
    console.log('effectScope scope disposed')
  })
})
const curscope1 = getCurrentScope()
obj11.value = 4
setTimeout(() => {
  obj11.value ++
  console.log('effectScope',curscope1 === getCurrentScope())
  curscope1?.stop()
}, 1000);

// stop后，副作用解除，意味着当前run函数之后的同步修改不会再产生副作用
scope.stop()



const obj12:Reactive<{address?: {n:number[]}}> = reactive({})
obj12.address = {n:[]};
effect(() => {
  console.log('reactive对象添加新的对象属性，这个对象属性是响应式的吗？不是',obj12.address?.n)
})
setTimeout(() => {
  obj12.address?.n.push(1);
}, 1000);
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
    <h2>reactive&ref解构</h2>
    reactive 解构的基础类型名字：{{ name4 }} <br>
    reactive 解构的对象：{{ address4.n }} <br>
    obj4，原始对象的基础类型name没变: {{ JSON.stringify(obj4) }} <br>
    ref 解构的基础类型名字：{{ name5 }} <br>
    ref 解构的对象：{{ address5.n }} <br>
    obj5，原始对象的基础类型name没变: {{ JSON.stringify(obj5) }} <br>
  </div>
</template>

<style lang="less" scoped>

</style>
