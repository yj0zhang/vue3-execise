import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import GlobalTest from '@/globalComponents/GlobalTest.vue'
import globalTestDirective from '@/globalDirectives/globalTest';
// import myGlobalMixin from '@/globalMixins/globalMixin'
// 全局mixin，所有组件都会有myGlobalMixin里面的options配置
// app.mixin(myGlobalMixin)

const app = createApp(App)

app.component('MyGlobalComponent', GlobalTest)
app.directive('myGlobalDirective', globalTestDirective)

app.use(createPinia())
app.use(router)

app.mount('#app')

// setTimeout(() => {
//   app.unmount()
// }, 5000)
// app.onUnmount((...restArgs) => {
//   console.log('app unmounted', restArgs);
// })



// app.provide('globalProvide', '我是全局注入')

// const injected = app.runWithContext(() => {
//   return inject('globalProvide')
// })
// // 使用runWithContext，可以在没有活动组件的情况下，获取全局注入
// console.log(injected, getCurrentInstance())



//当前app使用的vue版本号
// console.log(app.version)


//app的配置，可以在挂载前更改，插件可能会修改这些配置，所以要在挂载前use
// console.log(app.config)
// app.config.compilerOptions, 指在运行时编译的选项，在使用这个配置时，必须使用带compiler模块的vue包；或者在构建时，通过loader或插件把这里的配置传递给构建工具，详情参阅：https://cn.vuejs.org/api/application.html#app-config-compileroptions





