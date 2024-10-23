    <template>
        <div>
            <div id="cesiumContainer" ref="cesiumContainer"></div>
        </div>
    </template>

<!-- 利用 Vue 3 的组合式 API 和选项式 API  数据是可以互通的。虽然这两部分代码是在不同的脚本块中编写的，但它们共享同一个组件实例 -->
<!-- defineProps  props:不可同时出现 组合式用 props proxy.$props-->
<script>
import * as Cesium from 'cesium'
import 'cesium/Build/Cesium/Widgets/widgets.css'
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
            lonlats: [{ lon: 121.20, lat: 25.00 }, { lon: 121.36, lat: 25.09 }, { lon: 121.46, lat: 25.25 }, { lon: 121.52, lat: 25.28 }],
            count: '200',
            viewer: null,
        };
    },

    created() {
        console.log('Component created');
    },

    mounted() {
        Cesium.Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJjOGJiNTYyYS1hYjMzLTRlZjktOTA2MC04ZGQ3YzI3MGRiMzMiLCJpZCI6MjI1ODUxLCJpYXQiOjE3MTk5MDQwNTJ9.GfT1S8hO6mAFU067OKsFtoOoMFU3gyhPbX1l_1YeCio';
        // 加载地球
        this.viewer = new Cesium.Viewer('cesiumContainer', {
            // terrainProvider: Cesium.createWorldTerrain(),
            // imageryProvider: new Cesium.UrlTemplateImageryProvider({
            //     url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
            //     credit: 'Map data © OpenStreetMap contributors',
            // }),
            baseLayerPicker: false,
        });
        // Load a 3D tileset
        // const tileset = new Cesium.Cesium3DTileset({
        //     url: 'https://assets.cesium.com/1/tileset.json',
        // });

        // this.viewer.scene.primitives.add(tileset);
        // this.middleLine()
        // this.drawPoint()
        // this.oo()
        // this.pp() //测试添加图片标签 svg 是否清晰（否）
        this.jj()
    },

    methods: {
        jj() {//已知点和斜率确定直线
            // 定义起点和方向向量
            const startPoint = Cesium.Cartesian3.fromDegrees(100, 30, 0);
            const directionVector = new Cesium.Cartesian3(1, 2, 90);

            // 计算直线上的第二个点
            const t = 1000;  // 可以调节 t 的值来确定线的长度
            const endPoint = Cesium.Cartesian3.add(
                startPoint,
                Cesium.Cartesian3.multiplyByScalar(directionVector, t, new Cesium.Cartesian3()),
                new Cesium.Cartesian3()
            );

            // 创建线条实体
            let pointEntity = this.viewer.entities.add({
                polyline: {
                    positions: [startPoint, endPoint],
                    width: 2,
                    material: Cesium.Color.RED
                }
            });

            this.viewer.zoomTo(pointEntity);
        },
        createImageFromSVG(svgData) {
            return new Promise((resolve, reject) => {
                const img = new Image();
                img.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svgData);
                img.onload = function () {
                    const canvas = document.createElement('canvas');
                    const context = canvas.getContext('2d');
                    canvas.width = img.width;
                    canvas.height = img.height;
                    context.drawImage(img, 0, 0);
                    resolve(canvas.toDataURL());
                };
                img.onerror = function () {
                    reject('Failed to load image');
                };
            });
        },

        async pp() {
            const svgData = `<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">

                <!-- Uploaded to: SVG Repo, www.svgrepo.com, Transformed by: SVG Repo Mixer Tools -->
                <svg width="64px" height="64px" viewBox="-102.4 -102.4 1228.80 1228.80" class="icon" version="1.1" xmlns="http://www.w3.org/2000/svg" fill="#000000" transform="rotate(0)" stroke="#000000" stroke-width="0.01024">

                <g id="SVGRepo_bgCarrier" stroke-width="0">

                <rect x="-102.4" y="-102.4" width="1228.80" height="1228.80" rx="0" fill="#7e00ec" strokewidth="0"/>

                </g>

                <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"/>

                <g id="SVGRepo_iconCarrier">

                <path d="M396 553.6L288 883.2l264-278.4 113.6 36.8c10.4 3.2 22.4-0.8 28-10.4L992 140.8 49.6 394.4c-23.2 6.4-24 38.4-1.6 45.6l163.2 53.6 76 389.6" fill="#FFFFFF"/>

                <path d="M288 891.2c-1.6 0-3.2-0.8-4.8-1.6-0.8 0-0.8-0.8-0.8-0.8-0.8-0.8-1.6-2.4-2.4-4l-75.2-384.8L46.4 448C32 444 24 431.2 24 416.8c0-14.4 9.6-26.4 24-30.4l942.4-254.4c3.2-0.8 6.4 0 8.8 3.2 1.6 2.4 2.4 6.4 0.8 8.8L700 636c-8 12.8-23.2 18.4-37.6 13.6l-108.8-35.2-260.8 275.2c-0.8 0.8-2.4 1.6-4 2.4 0-0.8-0.8-0.8-0.8-0.8z m108-345.6h2.4c4 1.6 6.4 5.6 4.8 10.4l-96.8 296 239.2-252.8c2.4-2.4 5.6-3.2 8-2.4l113.6 36.8c7.2 2.4 14.4-0.8 18.4-7.2l288-474.4L52 402.4c-8.8 2.4-12 8.8-12 15.2s2.4 12.8 11.2 16l163.2 53.6c2.4 0.8 4.8 3.2 5.6 6.4l69.6 359.2 98.4-300c0.8-4.8 4-7.2 8-7.2z" fill="#6A576D"/>

                <path d="M382.4 304.8l198.4 20.8 16.8 86.4 80-55.2 123.2 97.6L992 140.8z" fill="#99D9E6"/>

                <path d="M800.8 462.4c-1.6 0-3.2-0.8-4.8-1.6L677.6 367.2l-75.2 51.2c-2.4 1.6-4.8 1.6-7.2 0.8-2.4-0.8-4-3.2-4.8-5.6l-16-80.8-192.8-20c-4 0-7.2-3.2-7.2-7.2s2.4-7.2 5.6-8l609.6-164c3.2-0.8 6.4 0 8.8 3.2 1.6 2.4 2.4 6.4 0.8 8.8L808 458.4c-0.8 1.6-3.2 3.2-5.6 4h-1.6zM677.6 348.8c1.6 0 2.4 0 3.2 0.8 0.8 0 0.8 0.8 1.6 0.8l116 92 176-288.8-548 148 155.2 16c3.2 0 6.4 3.2 7.2 6.4l14.4 74.4 69.6-48c1.6-0.8 3.2-1.6 4.8-1.6z" fill="#6A576D"/>

                <path d="M288 883.2l264-278.4-156-51.2z" fill="#111318"/>

                <path d="M992 140.8L211.2 492l76.8 391.2 264-278.4-156-51.2z" fill="#111318"/>

                <path d="M288 891.2h-2.4c-3.2-0.8-4.8-3.2-5.6-6.4l-76-391.2c-0.8-4 0.8-7.2 4.8-8.8l780.8-351.2c4-1.6 8 0 10.4 3.2 2.4 4 0.8 8-2.4 10.4l-584 404 140.8 46.4c2.4 0.8 4.8 3.2 5.6 5.6 0.8 2.4 0 5.6-1.6 7.2l-264 278.4c-2.4 1.6-4.8 2.4-6.4 2.4z m-67.2-394.4l72 369.6L537.6 608l-144-47.2c-3.2-0.8-4.8-3.2-5.6-6.4-0.8-3.2 0.8-6.4 3.2-8L916 184 220.8 496.8z" fill="#6A576D"/>

                </g>

                </svg>`;
            try {
                const imageUrl = await this.createImageFromSVG(svgData);

                let pointEntity = this.viewer.entities.add({
                    position: Cesium.Cartesian3.fromDegrees(110.0, 40),
                    billboard: {
                        image: imageUrl,
                        scale: 1
                    }
                });

                this.viewer.zoomTo(pointEntity);
            } catch (error) {
                console.error(error);
            }
            // 从 viewer 中获取所有标签
            const bills = this.viewer.entities.values.filter(entity => entity.billboard);
            console.log('labels--', bills)
            // 监听场景的缩放变化
            this.viewer.scene.camera.changed.addEventListener(() => {
                const cameraHeight = this.viewer.scene.camera.positionCartographic.height;

                // 根据高度调整所有标签的缩放比例
                // const newScale = Math.min(5.0, Math.max(0.5, 10000 / cameraHeight));
                const newScale = Math.min(1.0, Math.max(0.5, 10000 / cameraHeight));

                bills.forEach(item => {
                    // labelEntity.label.scale = newScale;
                    item.billboard.width = 10 * newScale
                    item.billboard.height = 10 * newScale
                });
            });
        },

        //过点做切线的垂线
        oo() {
            // 假设你有一个地球上的地理位置
            const longitude = 110.0; // 经度
            const latitude = 40.0; // 纬度
            const height = 0.0; // 高度
            const length = 100000; // 切线和垂线的长度
            // 将地理坐标转换为笛卡尔坐标
            const position = Cesium.Cartesian3.fromDegrees(longitude, latitude, height);
            // 计算该点的法向量（垂线方向）
            const ellipsoid = this.viewer.scene.globe.ellipsoid;
            const normal = ellipsoid.geodeticSurfaceNormal(position);
            // 选择一个切线方向（与法向量垂直）
            const tangentDirection = Cesium.Cartesian3.cross(Cesium.Cartesian3.UNIT_X, normal, new Cesium.Cartesian3());
            Cesium.Cartesian3.normalize(tangentDirection, tangentDirection);
            // 计算切线的两个端点
            const tangentStartPoint = Cesium.Cartesian3.add(position, Cesium.Cartesian3.multiplyByScalar(tangentDirection, -length / 2, new Cesium.Cartesian3()), new Cesium.Cartesian3());
            const tangentEndPoint = Cesium.Cartesian3.add(position, Cesium.Cartesian3.multiplyByScalar(tangentDirection, length / 2, new Cesium.Cartesian3()), new Cesium.Cartesian3());
            // 绘制切线
            this.viewer.entities.add({
                polyline: {
                    positions: [tangentStartPoint, tangentEndPoint],
                    width: 2,
                    material: Cesium.Color.RED
                }
            });
            // 计算水平垂线的方向（与切线和法向量都垂直）
            const horizontalNormalDirection = Cesium.Cartesian3.cross(tangentDirection, normal, new Cesium.Cartesian3());
            Cesium.Cartesian3.normalize(horizontalNormalDirection, horizontalNormalDirection);
            // 计算水平垂线的两个端点
            const horizontalNormalStartPoint = Cesium.Cartesian3.add(position, Cesium.Cartesian3.multiplyByScalar(horizontalNormalDirection, -length / 2, new Cesium.Cartesian3()), new Cesium.Cartesian3());
            const horizontalNormalEndPoint = Cesium.Cartesian3.add(position, Cesium.Cartesian3.multiplyByScalar(horizontalNormalDirection, length / 2, new Cesium.Cartesian3()), new Cesium.Cartesian3());
            // 绘制水平垂线
            let pointEntity = this.viewer.entities.add({
                polyline: {
                    positions: [horizontalNormalStartPoint, horizontalNormalEndPoint],
                    width: 2,
                    material: Cesium.Color.GREEN
                }
            });
            this.viewer.zoomTo(pointEntity);
        },
        //气泡
        bubble() {

        },

        drawPoint() {
            const pointEntity = this.viewer.entities.add({
                name: 'point',
                position: Cesium.Cartesian3.fromDegrees(-75.59777, 40.03883),
                point: {
                    pixelSize: 10,              // Size of the point in pixels
                    color: Cesium.Color.RED,    // Color of the point
                    outlineColor: Cesium.Color.WHITE, // Outline color of the point
                    outlineWidth: 2,
                },
                description: 'This is a point.'
            })
            this.viewer.zoomTo(pointEntity);
        },

        // 定义函数来计算中垂线
        calculatePerpendicularBisector(pointA, pointB) {
            const midpoint = Cesium.Cartesian3.midpoint(pointA, pointB, new Cesium.Cartesian3());
            const direction = Cesium.Cartesian3.subtract(pointB, pointA, new Cesium.Cartesian3());
            // 计算 2D 中的垂直方向（假设平面地面）
            const perpendicularDirection = new Cesium.Cartesian3(-direction.y, direction.x, 0);
            Cesium.Cartesian3.normalize(perpendicularDirection, perpendicularDirection);
            // 设置中垂线的长度
            const length = 0.01; // 这里可以根据需要调整中垂线的长度
            const scaledPerpendicular = Cesium.Cartesian3.multiplyByScalar(perpendicularDirection, 50000, new Cesium.Cartesian3());
            // 计算中垂线的两个端点
            const bisectorStart = Cesium.Cartesian3.add(midpoint, scaledPerpendicular, new Cesium.Cartesian3());
            const bisectorEnd = Cesium.Cartesian3.subtract(midpoint, scaledPerpendicular, new Cesium.Cartesian3());
            this.viewer.entities.add({
                polyline: {
                    positions: [bisectorStart, midpoint],
                    width: 2,
                    material: Cesium.Color.BLACK,
                    clampToGround: true
                }
            });
            // return [bisectorStart, bisectorEnd];
        },

        middleLine() {
            let point1, point2
            this.lonlats.forEach((item, index) => {
                if (index + 1 == this.lonlats.length) return
                point1 = Cesium.Cartesian3.fromDegrees(item.lon, item.lat);
                point2 = Cesium.Cartesian3.fromDegrees(this.lonlats[index + 1].lon, this.lonlats[index + 1].lat);
                this.viewer.entities.add({
                    polyline: {
                        positions: [point1, point2],
                        width: 2,
                        material: Cesium.Color.RED,
                        clampToGround: true
                    }
                });
                this.calculatePerpendicularBisector(point1, point2)
            })
            console.log(7)
            this.fly(point1, point2)//飞行
        },

        middle(start, end) {//中垂线
            const midPoint = Cesium.Cartesian3.midpoint(start, end, new Cesium.Cartesian3());//计算中点 
            const direction = Cesium.Cartesian3.subtract(end, start, new Cesium.Cartesian3());//计算线段的方向向量
            const perpendicularDirection = new Cesium.Cartesian3(-direction.y, direction.x, 0);//计算中垂线的方向向量

            Cesium.Cartesian3.normalize(perpendicularDirection, perpendicularDirection);//标准化方向向量并确定中垂线的长度
            Cesium.Cartesian3.multiplyByScalar(perpendicularDirection, 50000, perpendicularDirection);

            const midPointStart = Cesium.Cartesian3.add(midPoint, perpendicularDirection, new Cesium.Cartesian3());//计算中垂线的两个端点
            const midPointEnd = Cesium.Cartesian3.subtract(midPoint, perpendicularDirection, new Cesium.Cartesian3());
            this.viewer.entities.add({//绘制中垂线
                polyline: {
                    positions: [midPointStart, midPointEnd],
                    width: 2,
                    material: Cesium.Color.BLACK,
                    clampToGround: true
                }
            });
        },

        fly(start, end) {
            // 计算包含线段的 BoundingSphere
            const boundingSphere = Cesium.BoundingSphere.fromPoints([
                start, end
            ]);
            this.viewer.camera.flyToBoundingSphere(boundingSphere, {//对线、面操作
                duration: 3, // 飞行时间（秒）
                offset: new Cesium.HeadingPitchRange(0, -Math.PI / 4, boundingSphere.radius * 2) // 根据需要调整 offset
            });

            // 计算线段中点
            const midPoint = Cesium.Cartesian3.midpoint(start, end, new Cesium.Cartesian3());
            // 获取中点的经纬度
            const midPointCartographic = Cesium.Cartographic.fromCartesian(midPoint);
            // 设置飞行高度（以米为单位）
            const height = 50000;
            // 将中点转换为包含高度的目的地
            const destination = Cesium.Cartesian3.fromRadians(midPointCartographic.longitude, midPointCartographic.latitude, height);
            // this.viewer.camera.flyTo({//对点操作
            //     // destination: boundingSphere.center,//线段中点
            //     destination: destination,
            //     duration: 3,
            //     offset: new Cesium.HeadingPitchRange(0, -Math.PI / 4, 5000)
            // });
        },

        increment() {
            this.count++;
        },
        test() {
            console.log('组合式方法---');
        },
        initCesium() {
            this.viewer = new Cesium.Viewer(this.$refs.cesiumContainer, {
                terrainProvider: Cesium.createWorldTerrain()
            });
        }
    },
}
</script>

<script setup>
// import { onMounted, getCurrentInstance } from 'vue';
//使用 getCurrentInstance 获取的 proxy 对象只能访问选项式 API 中定义的方法
// const { proxy } = getCurrentInstance();
// 选项式 API
// import { ref, watch } from 'vue';
// 使用 defineProps 获取 props
// const props = defineProps({
//     title: String
// });
// onMounted(() => {
//     proxy.test(); // 调用选项式 API 中定义的 test 方法
//     console.log('获取组合式数据---', proxy.count, proxy.$props, proxy.$data);
// })
</script>
<style scoped>
#cesiumContainer {
    width: 100%;
    height: 100vh;
}
</style>