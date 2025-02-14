import type { Component, DirectiveBinding, VNode } from "vue"

const myGlobalDirective = {
  created(el: HTMLElement | Component, binding: DirectiveBinding, vnode: VNode) {
    console.log('created', el, binding, vnode)
  },
  beforeMount(el: HTMLElement | Component, binding: DirectiveBinding, vnode: VNode) {
    console.log('beforeMount', el, binding, vnode)
  },
  mounted(el: HTMLElement | Component, binding: DirectiveBinding, vnode: VNode) {
    console.log('mounted', el, binding, vnode)
  },
  beforeUpdate(el: HTMLElement | Component, binding: DirectiveBinding, vnode: VNode, preVnode: VNode) {
    console.log('beforeUpdate', el, binding, vnode, preVnode)
  },
  updated(el: HTMLElement | Component, binding: DirectiveBinding, vnode: VNode, preVnode: VNode) {
    console.log('updated', el, binding, vnode, preVnode)
  },
  // beforeUnmount(el: HTMLElement | Component, binding: DirectiveBinding, vnode: VNode) {
  //   console.log('beforeUnmount', el, binding, vnode)
  // },
  // unmounted(el: HTMLElement | Component, binding: DirectiveBinding, vnode: VNode) {
  //   console.log('unmounted', el, binding, vnode)
  // }
}

export default myGlobalDirective
