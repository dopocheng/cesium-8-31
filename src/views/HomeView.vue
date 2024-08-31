<template>
  <div>
    <div id="cesiumMap" ref="cesiumMap"></div>
    <div class="buttons">
      <el-button @click="labelEntity(label)">添加 label</el-button>
      <el-button @click="billboardEntity(billboard)">添加 billboard</el-button>
      <el-button @click="drawLine()">画实体</el-button>
      <el-button @click="remove()">清除实体</el-button>
      <el-button @click="entity()">获取实体</el-button>
      <el-button @click="addG">添加geo</el-button>
    </div>
  </div>
</template>

<script setup>
import * as Cesium from 'cesium'
import { Entity } from 'cesium';
import 'cesium/Build/Cesium/Widgets/widgets.css'
import { onMounted } from 'vue';

// import img from "../../public/th.png"
import geo from '../../src/assets/data/geo.json'
import Draw from '../../src/assets/js/drawEntity.js'
import { moveCoordinate, setupLeftClickHandler } from '../assets/js/toolCesium.js'
Cesium.Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJjOGJiNTYyYS1hYjMzLTRlZjktOTA2MC04ZGQ3YzI3MGRiMzMiLCJpZCI6MjI1ODUxLCJpYXQiOjE3MTk5MDQwNTJ9.GfT1S8hO6mAFU067OKsFtoOoMFU3gyhPbX1l_1YeCio';
// 加载地球 const变量在初始声明后无法重新赋值
let viewer = null
let scene = null
// let handler = null
let drawMethod = null
const label = { name: '棒球公园', lonlat: [121.166493, 39.9060534], color: Cesium.Color.RED, font: "14pt monospace" }
const billboard = { name: 'ACE女王', lonlat: [121.166493, 38.9060534], image: "../../public/th.png", font: "14pt monospace" }

onMounted(() => {
  initMap()
  console.log("点--")
  drawMethod = new Draw(viewer)
  // console.log(drawMethod.drawPoint())
})

function initMap() {
  viewer = new Cesium.Viewer("cesiumMap", {
    selectionIndicator: true,//选择实体标记
    infoBox: false,//信息窗体
  })

  scene = viewer.scene;
  if (!scene.pickPositionSupported) {
    window.alert("此浏览器不支持 pickPosition。");
    return
  }
  moveCoordinate(viewer)//鼠标移动显示坐标
  // setupLeftClickHandler(viewer)//左击获取坐标/实体
  // info()//指定实体显示信息框体
}
function addG() {//添加 geo
  drawMethod.removeAll()
  drawMethod.addGeojson(geo)
}
function drawLine() {// 划线
  drawMethod.drawPlane()
  // 点击绘制实体，鼠标不放球体控制台报错
}
function remove() {//指定删除
  drawMethod.removeEntityByCond('planeSelf')
  drawMethod.removeGeojsonByCond('嘻嘻嘻')
}

function billboardEntity({ name, lonlat, image, font }) {//添加广告牌
  const citizensBankPark = viewer.entities.add({//公告牌实体
    name: name,
    position: Cesium.Cartesian3.fromDegrees(lonlat[0], lonlat[1]),
    billboard: {
      image: image,
      width: 64,
      height: 64,
    },
    label: {
      text: name,
      font: font,
      style: Cesium.LabelStyle.FILL_AND_OUTLINE,
      outlineWidth: 2,
      verticalOrigin: Cesium.VerticalOrigin.TOP,
      pixelOffset: new Cesium.Cartesian2(0, 32),
    },
  });
  viewer.flyTo(citizensBankPark)
}

async function labelEntity({ name, lonlat, color, font }) {//标签实体
  console.log(3)
  const citizensBankPark = viewer.entities.add({
    name: name,
    position: Cesium.Cartesian3.fromDegrees(lonlat[0], lonlat[1]),
    point: {
      pixelSize: 5,
      color: color,
      outlineColor: Cesium.Color.WHITE,
      outlineWidth: 2,
      // pixelSize: 10,
      scaleByDistance: new Cesium.NearFarScalar(1.5e2, 9.0, 1.5e7, 0.5),//大小范围为90px（近）到5px（远
    },

    label: {
      text: name,
      font: font,
      style: Cesium.LabelStyle.FILL_AND_OUTLINE,
      outlineWidth: 2,
      verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
      pixelOffset: new Cesium.Cartesian2(0, -9),
    },
  });
  const result = await viewer.flyTo(citizensBankPark);//切换到指定实体再打开信息框 返回true/false
  if (result) {
    viewer.selectedEntity = citizensBankPark;
  }
  // return citizensBankPark
}

function entity() {//判断多边形，是否合法,取最后一个多边形
  let ey = drawMethod.backInfoDetail()
  let coor = []
  let pos = JSON.parse(JSON.stringify(ey.planeSelf))
  if (Array.isArray(pos) && pos.length > 0 && pos[pos.length - 1].positions.length > 3) {
    console.log('合法')
  } else {
    console.log('多边形不合法')
    return
  }
  coor = pos[pos.length - 1].positions
  console.log(coor)
}

async function info() {//cesium 信息框
  const wyoming = viewer.entities.add({
    id: "uniqueId",
    polygon: {
      hierarchy: Cesium.Cartesian3.fromDegreesArray([
        -109.080842, 45.002073, -105.91517, 45.002073, -104.058488, 44.996596,
        -104.053011, 43.002989, -104.053011, 41.003906, -105.728954, 40.998429,
        -107.919731, 41.003906, -109.04798, 40.998429, -111.047063, 40.998429,
        -111.047063, 42.000709, -111.047063, 44.476286, -111.05254, 45.002073,
      ]),
      height: 0,
      material: Cesium.Color.RED.withAlpha(0.5),
      outline: true,
      outlineColor: Cesium.Color.BLACK,
    },
  });
  // wyoming.id = "id";//对象id的属性Cesium.Entity是具有 getter 方法的只读属性，这意味着在创建实体后不能直接修改它。
  wyoming.polygon.height = 250000;
  wyoming.name = "Wyoming";
  wyoming.description =
    '\
      <img\
        width="50%"\
        style="float:left; margin: 0 1em 1em 0;"\
        src="/docs/tutorials/creating-entities/Flag_of_Wyoming.svg"/>\
      <p>\
        Wyoming is a state in the mountain region of the Western \
        United States.\
      </p>\
      <p>\
        Wyoming is the 10th most extensive, but the least populous \
        and the second least densely populated of the 50 United \
        States. The western two thirds of the state is covered mostly \
        with the mountain ranges and rangelands in the foothills of \
        the eastern Rocky Mountains, while the eastern third of the \
        state is high elevation prairie known as the High Plains. \
        Cheyenne is the capital and the most populous city in Wyoming, \
        with a population estimate of 63,624 in 2017.\
      </p>\
      <p>\
        Source: \
        <a style="color: WHITE"\
          target="_blank"\
          href="http://en.wikipedia.org/wiki/Wyoming">Wikpedia</a>\
  </p>';
  const result = await viewer.flyTo(wyoming);//切换到指定实体再打开信息框 返回true/false
  if (result) {

    const entity1 = viewer.entities.getById("uniqueId")
    const entity2 = viewer.entities.getOrCreateEntity("uniqueId")
    const entity3 = new Entity({
      id: "id3",
    });
    viewer.entities.add(entity3);
    viewer.entities.collectionChanged.addEventListener(onChanged);
    console.log('id---', entity1, entity2, entity3)
    viewer.selectedEntity = wyoming;
    //希望相机保持以实体为中心，而不是以地球为中心。
    wyoming.position = Cesium.Cartesian3.fromDegrees(121.724, 42.68);
    // viewer.trackedEntity = wyoming;//没有此属性
    // viewer.trackedEntityChanged = wyoming//可能是这个
  }

}
function onChanged(collection, removed, changed, added) {//统计实体id
  console.log(6)
  let message = "Added ids";
  for (var i = 0; i < added.length; i++) {
    message += "\n" + added[i].id;
  }
  console.log(message);
}
</script>

<style scoped>
#cesiumMap {
  width: 100%;
  height: 100vh;
  position: absolute;
}

.buttons {
  position: relative;
  margin: 10px;
  float: left;
}
</style>