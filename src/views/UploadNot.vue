<template>
    <!-- 不请求接口本地加载数据 -->
    <div>
        <el-upload :action="null" :before-upload="beforeUpload" :file-list="fileList" :auto-upload="false" multiple
            accept=".json,.geojson" drag>
            <!-- <el-button slot="trigger" type="primary">Select Files</el-button> -->
        </el-upload>
        <el-button style="margin-left: 10px;" @click="submitUpload">Upload</el-button>


        <div>
            <!-- 数据添加 status 简单些如果用 index 去判断匹配麻烦些还有些 bug, 先触发el-switch按钮才触发行点击,导致el-switch更改状态报错 -->
            <el-table :data="tableData" @row-click="handleRowClick">
                <el-table-column prop="date" label="日期" width="180"></el-table-column>
                <el-table-column prop="name" label="姓名" width="180"></el-table-column>
                <el-table-column prop="address" label="地址"></el-table-column>
                <el-table-column>
                    <template #default="scope">
                        <el-switch v-model="scope.row.value1" />
                    </template>
                </el-table-column>
            </el-table>
        </div>

    </div>
</template>

<script>
export default {
    data() {
        return {
            value1: false,
            drawer: false,
            tableData: [
                { date: '2023-01-01', name: 'Alice', address: '123 Main St', value1: false },
                { date: '2023-01-02', name: 'Bob', address: '456 Elm St', value1: true },
            ],

            fileList: []
        };
    },
    methods: {

        openDrawer() {
            console.log(0)
            this.drawer = true;
            this.$nextTick(() => {
                console.log(1)
                // 强制 el-table 重新渲染
                this.$refs.table && this.$refs.table.doLayout();
            });
        },
        // handleChange(file, fileList) {
        // Since fileList might be empty, update it manually
        // console.log('File List Change:', file, fileList);
        // this.fileList = [...fileList];
        // },
        beforeUpload(file) {
            // Add the file to the fileList before uploading
            console.log('Before upload:', file);
            this.fileList.push(file);
            return false; // Prevent automatic upload
        },
        submitUpload() {
            // Handle file upload manually
            this.fileList.forEach(file => {
                console.log('Uploading:', file);
                // Here you can handle the file data as needed
                const reader = new FileReader();
                reader.onload = (e) => {
                    const fileContent = e.target.result;
                    console.log('File content:', fileContent);
                    // Process file content here
                };
                reader.readAsText(file.raw); // Use file directly
            });
        }
    }
};
</script>

<style>
/* Add any custom styles here */
</style>