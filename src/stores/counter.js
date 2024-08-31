
// 组合式 API --- 小型项目或简单的状态管理
// import { ref, computed } from 'vue'
// import { defineStore } from 'pinia'

// // 是用来导入 Pinia 库中的 createPinia 方法。Pinia 是一个用于 Vue.js 的状态管理库，它是 Vuex 的替代品，提供了更简单和直观的 API

// export const useCounterStore = defineStore('counter', () => {
//   const count = ref(0)
//   const doubleCount = computed(() => count.value * 2)
//   function increment() {
//     count.value++;
//     console.log('增加--   -')
//   }

//   return { count, doubleCount, increment }
// })

// 选项式 API --- 型项目或复杂状态管理推荐使用选项式 API
import { defineStore } from 'pinia';

export const useCounterStore = defineStore('counter', {
  state: () => ({
    count: 0
  }),
  getters: {
    doubleCount: (state) => state.count * 2
  },
  actions: {
    increment() {
      this.count++;
    }
  }
});
