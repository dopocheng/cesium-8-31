<template>
  <div>
    <!-- 图片大图预览 -->
    <el-table :data="tableData" style="width: 100%">
      <el-table-column prop="name" label="Name" width="180"></el-table-column>
      <el-table-column label="Image" width="200">
        <template v-slot="scope">
          <div style="position: relative;">
            <el-image :src="scope.row.thumbnailSrc" :preview-src-list="[scope.row.largeImageSrc]" class="thumbnail"
              @mouseenter="showLargeImage(scope.$index)" @mouseleave="hideLargeImage" @mousemove="moveLargeImage"
              fit="cover" />
            <el-image v-if="isLargeImageVisible && activeIndex === scope.$index" :src="scope.row.largeImageSrc"
              class="large-img" :style="{ top: largeImageTop + 'px', left: largeImageLeft + 'px' }" fit="cover" />
          </div>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  data() {
    return {
      tableData: [
        { name: 'Item 1', thumbnailSrc: '/img/1-thumb.png', largeImageSrc: '/img/1.png' },
        { name: 'Item 2', thumbnailSrc: '/img/2-thumb.png', largeImageSrc: '/img/2.png' },
        { name: 'Item 3', thumbnailSrc: '/img/3-thumb.png', largeImageSrc: '/img/3.png' }
        // 添加更多项
      ],
      isLargeImageVisible: false,
      largeImageTop: 0,
      largeImageLeft: 0,
      activeIndex: null, // 当前活动的索引
    };
  },
  methods: {
    showLargeImage(index) {
      this.isLargeImageVisible = true;
      this.activeIndex = index; // 设置当前活动的索引
    },
    hideLargeImage() {
      this.isLargeImageVisible = false;
      this.activeIndex = null; // 重置活动的索引
    },
    moveLargeImage(event) {
      this.largeImageTop = event.clientY + 10;
      this.largeImageLeft = event.clientX + 10;
    },
  },
};
</script>

<style>
.thumbnail {
  width: 100px;
  height: 100px;
  object-fit: cover;
  /* 等比例缩放并覆盖 */
}

.large-img {
  position: absolute;
  width: 200px;
  height: 200px;
  object-fit: cover;
  /* 等比例缩放并覆盖 */
  z-index: 9999;
  /* 确保大图在最前 */
}
</style>
