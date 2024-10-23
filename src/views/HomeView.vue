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
var pointCollection
var debounceTimeout
const label = { name: '棒球公园', lonlat: [121.166493, 39.9060534], color: Cesium.Color.RED, font: "14pt monospace" }
const billboard = { name: 'ACE女王', lonlat: [121.166493, 38.9060534], image: "../../public/th.png", font: "14pt monospace" }


onMounted(() => {
  console.log("点--")
  initMap()
  drawMethod = new Draw(viewer)
  // console.log(drawMethod.drawPoint())
})

function initMap() {
  viewer = new Cesium.Viewer("cesiumMap", {
    selectionIndicator: true,//选择实体标记
    infoBox: false,//信息窗体
    // windowPosition: {
    //   x: 0,
    //   y: 0
    // },
  })
  // 绑定点击事件，用于拾取点
  var handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
  // 创建一个 PointPrimitiveCollection
  pointCollection = viewer.scene.primitives.add(new Cesium.PointPrimitiveCollection());
  debounceTimeout = null;
  scene = viewer.scene;
  if (!scene.pickPositionSupported) {
    window.alert("此浏览器不支持 pickPosition。");
    return
  }
  var point = viewer.entities.add({
    position: Cesium.Cartesian3.fromDegrees(116.407396, 39.904200), // 经度、纬度
    point: {
      pixelSize: 10, // 点的大小
      color: Cesium.Color.RED, // 点的颜色
      outlineColor: Cesium.Color.WHITE, // 边缘颜色
      outlineWidth: 2 // 边缘宽度
    },
    label: {
      text: '北京', // 标签文本
      font: '16px sans-serif',
      fillColor: Cesium.Color.WHITE,
      outlineColor: Cesium.Color.BLACK,
      outlineWidth: 2,
      verticalOrigin: Cesium.VerticalOrigin.TOP // 标签位置
    }
  });

  handler.setInputAction(function (event) {
    // 获取鼠标点击位置的屏幕坐标
    var pickedObject = viewer.scene.pick(event.position);
    // 判断是否拾取到了实体
    if (Cesium.defined(pickedObject)) {
      // 输出拾取到的对象
      console.log('拾取到的对象:', pickedObject);
      // 如果是 WMS 图层，可能需要进一步处理
      // 这里可以实现基于点击位置获取点的相关数据
      // 例如，发送请求到 WFS 获取该点的详细信息
    } else {
      console.log('未拾取到任何实体');
    }
  }, Cesium.ScreenSpaceEventType.LEFT_CLICK);

  // WMS
  // viewer.imageryLayers.addImageryProvider(new Cesium.WebMapServiceImageryProvider({
  //   url: '/api/geoserver/wms',
  //   layers: 'cite:poi',
  //   parameters: {
  //     service: 'WMS',
  //     format: 'image/png',
  //     transparent: true
  //   }
  // }));
  arrow2()
  // 绑定视图变化事件 缩放展示点
  // viewer.camera.changed.addEventListener(function () {
  //   debounceLoadWFSLayers()
  // });
  moveCoordinate(viewer)//鼠标移动显示坐标
  // setupLeftClickHandler(viewer)//左击获取坐标/实体
  // info()//指定实体显示信息框体
}
// 2.画箭头线条 创建线的起始和结束坐标
function arrow2() {
  // 假设已经有Cesium.Viewer实例叫做viewer

  // 定义线的两个顶点
  var start = Cesium.Cartesian3.fromDegrees(-75.59777, 40.03883);
  var end = Cesium.Cartesian3.fromDegrees(-75.59777, 39.95833);

  // 创建一个Polyline实体，带箭头
  var polylineArrow = viewer.entities.add({
    polyline: {
      positions: [start, end], // 线的位置数组
      width: 15, // 线的宽度
      material: new Cesium.PolylineArrowMaterialProperty(Cesium.Color.PINK), // 使用带箭头的材质
      clampToGround: true // 是否贴地
    }
  });
  // 将视角移动到这条线
  viewer.zoomTo(polylineArrow);
}
function arrow1() {
  // 假设已经有Cesium.Viewer实例叫做viewer

  // 定义线的两个顶点
  var start = Cesium.Cartesian3.fromDegrees(-75.59777, 40.03883);
  var end = Cesium.Cartesian3.fromDegrees(-75.59777, 39.95833);

  // 创建虚线部分
  var pp = viewer.entities.add({
    polyline: {
      positions: [start, end], // 线的位置数组
      width: 5, // 线的宽度
      material: new Cesium.PolylineDashMaterialProperty({
        color: Cesium.Color.PINK, // 虚线的颜色
        dashLength: 16 // 控制虚线的长度
      }),
      clampToGround: true // 是否贴地
    }
  });

  // 计算箭头的方向和尺寸
  var arrowLength = 0.5; // 箭头长度，适当缩小
  var arrowWidth = 0.2; // 箭头宽度，适当缩小
  var direction = Cesium.Cartesian3.subtract(end, start, new Cesium.Cartesian3());
  Cesium.Cartesian3.normalize(direction, direction);

  // 计算箭头的尖端和基底
  var arrowTip = end;
  var basePoint = Cesium.Cartesian3.add(end, Cesium.Cartesian3.multiplyByScalar(direction, -arrowLength, new Cesium.Cartesian3()), new Cesium.Cartesian3());
  var rightBase = Cesium.Cartesian3.add(basePoint, Cesium.Cartesian3.multiplyByScalar(Cesium.Cartesian3.cross(direction, Cesium.Cartesian3.UNIT_Z, new Cesium.Cartesian3()), arrowWidth, new Cesium.Cartesian3()), new Cesium.Cartesian3());
  var leftBase = Cesium.Cartesian3.subtract(basePoint, Cesium.Cartesian3.multiplyByScalar(Cesium.Cartesian3.cross(direction, Cesium.Cartesian3.UNIT_Z, new Cesium.Cartesian3()), arrowWidth, new Cesium.Cartesian3()), new Cesium.Cartesian3());

  // 添加箭头（使用三角形）
  viewer.entities.add({
    polygon: {
      hierarchy: new Cesium.PolygonHierarchy([arrowTip, leftBase, rightBase]),
      material: Cesium.Color.RED
    }
  });


  // 将视角移动到这条线
  viewer.zoomTo(pp);

}
function arrow() {

  const start = Cesium.Cartesian3.fromDegrees(-75.59777, 40.03883);
  const end = Cesium.Cartesian3.fromDegrees(-75.5, 40.05);

  // 添加虚线实体
  const dashedLine = viewer.entities.add({
    name: 'Dashed Line',
    polyline: {
      positions: [start, end],
      width: 5,
      material: new Cesium.PolylineDashMaterialProperty({
        dashLength: 16,
        gapLength: 8,
        color: Cesium.Color.RED.withAlpha(0.5),
      })
    }
  });

  // 计算箭头位置
  const arrowPosition = Cesium.Cartesian3.fromDegrees(-75.55, 40.045);

  // 添加箭头
  viewer.entities.add({
    position: arrowPosition,
    billboard: {
      image: 'path/to/arrow.png', // 替换为箭头图标的路径
      width: 20,
      height: 20,
      verticalOrigin: Cesium.VerticalOrigin.CENTER,
      horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
    }
  });

  // 将视角移动到这条线
  viewer.zoomTo(dashedLine);
}

//1.WFS 防抖函数，用来延迟执行加载数据的操作
function debounceLoadWFSLayers() {
  if (debounceTimeout) {
    clearTimeout(debounceTimeout);
  }

  debounceTimeout = setTimeout(function () {
    // 清空之前的点
    pointCollection.removeAll();
    var boundingBox = getVisibleBoundingBox(viewer);
    loadWFSLayers(boundingBox);
  }, 1000);  // 延迟1秒执行请求
}
// WFS 根据视图范围加载数据的函数  
function loadWFSLayers(boundingBox) {
  var wfsUrl = '/api/geoserver/wfs';
  var params = {
    service: 'WFS',
    version: '1.0.0',
    request: 'GetFeature',
    // typeName: 'tiger:poi',
    typeName: 'cite:poi',
    outputFormat: 'application/json',
    srsName: 'EPSG:4326',
    bbox: boundingBox // 传递视图范围
  };

  // 发送请求
  var queryString = Object.keys(params).map(key => key + '=' + encodeURIComponent(params[key])).join('&');
  var requestUrl = wfsUrl + '?' + queryString;

  fetch(requestUrl)
    .then(response => response.json())
    .then(geoJson => {
      // 加载数据到 Cesium
      if (geoJson) {
        // 假设 GeoJSON 里有多个点
        geoJson.features.forEach(feature => {
          var coordinates = feature.geometry.coordinates;

          // 添加点到 PointPrimitiveCollection 中
          pointCollection.add({
            position: Cesium.Cartesian3.fromDegrees(coordinates[0], coordinates[1]),
            color: Cesium.Color.RED,
            pixelSize: 10 // 设置点的大小
          });
        });
      }
      return
      // 清空之前的数据以避免重复
      viewer.dataSources.removeAll();
      console.log('dpc')
      Cesium.GeoJsonDataSource.load(geoJson, {
        stroke: Cesium.Color.YELLOW
      })
        .then(function (dataSource) {
          viewer.dataSources.add(dataSource);
          // 添加样式和其他逻辑
          const entities = dataSource.entities.values
          for (let i = 0; i < entities.length; i++) {
            let entity = entities[i]
            entity.billboard = undefined
            entity.point = {
              pixelSize: 10,
              color: Cesium.Color.BLUE,
              // outlineWidth: 2,
              clampToGround: true
            }
          }
        });
    })
    .catch(error => {
      console.error('获取WFS数据时出错:', error);
    });
}

//WFS 获取可见的边界框
function getVisibleBoundingBox(viewer) {
  var extent = viewer.camera.computeViewRectangle();
  // 将弧度转换为经纬度
  var west = Cesium.Math.toDegrees(extent.west);
  var south = Cesium.Math.toDegrees(extent.south);
  var east = Cesium.Math.toDegrees(extent.east);
  var north = Cesium.Math.toDegrees(extent.north);
  return `${west},${south},${east},${north}`;
  // return `${extent.west},${extent.south},${extent.east},${extent.north}`;
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