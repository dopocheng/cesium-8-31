<!-- 水文气象 -->
<template>
    <div>
        <EC />
        <div class="right-button">
            <div v-for="(item, index) in rightList" :key="index">
                <img :src="'data:image/jpeg;base64,' + item.url" alt="" srcset="">
                <p>{{ item.name }}</p>
            </div>
        </div>
        <el-drawer v-model="drawer" direction="btt">
            <template #header>
                <h4>set title by slot</h4>
            </template>
            <template #default>
                <div>
                    <el-radio v-model="radio1" value="Option 1" size="large">
                        Option 1
                    </el-radio>
                    <el-radio v-model="radio1" value="Option 2" size="large">
                        Option 2
                    </el-radio>
                </div>
            </template>
            <template #footer>
                <div style="flex: auto">
                    <el-button @click="cancelClick">cancel</el-button>
                    <el-button type="primary" @click="confirmClick">confirm</el-button>
                </div>
            </template>
        </el-drawer>
    </div>
</template>
<script setup>
import { ref } from 'vue'
import EC from '../components/earth/EarthCom.vue'
const drawer = ref(false)
import rightList from '../../src/assets/data/rightList.json'
</script>
<style scoped></style>
