<template>
    <div>
        <div id="cesiumContainer" ref="cesiumContainer"></div>
    </div>
</template>

<!-- 利用 Vue 3 的组合式 API 和选项式 API  数据是可以互通的。虽然这两部分代码是在不同的脚本块中编写的，但它们共享同一个组件实例 -->
<!-- defineProps  props:不可同时出现 一开始就要选择在哪里接 props-->
<script>
export default {//组合式 API 
    name: 'CesiumViewer',
    props: {
        title: {
            type: String,
            required: true
        }
    },
    data() {
        return {
            count: 0
        };
    },
    created() {
        console.log('Component created');
    }
}
</script>

<script setup>
import { onMounted } from 'vue';

// 选项式 API 
// import { ref, watch } from 'vue';
// 使用 defineProps 获取 props
// const props = defineProps({
//     title: String
// });
onMounted(() => {
    console.log('获取组合式数据---', this.title)
})
</script>