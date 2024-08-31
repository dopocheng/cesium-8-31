<template>
    <!-- 测试状态管理 -->
    <div>
        <p>Count: {{ count }}</p>{{ doubleCount }}
        <button @click="increment">Increment</button>
    </div>
</template>

<script>
import { useCounterStore } from '../stores/counter.js';
import { storeToRefs } from 'pinia';
export default {
    setup() {
        const counterStore = useCounterStore();
        const { count, doubleCount } = storeToRefs(counterStore);
        // const { count, doubleCount } = counterStore;//直接取值不是动态的需要特殊处理 storeToRefs

        return {
            count,
            doubleCount,
            increment: counterStore.increment
            // increment: increment             //increment 方法不可以这么接
        };
    }
};
</script>