/* global Cesium */
export default class Draw {
    constructor(viewer) {
        this.viewer = viewer
        this.config = {
            borderColor: Cesium.Color.BLUE,
            borderWidth: 2,
            material: Cesium.Color.GREEN.withAlpha(0.5),
        }
        /**存贮绘制的数据 坐标 */
        this.infoDetail = { point: [], line: [], rectangle: [], circle: [], planeSelf: [] }
        this.handler = new Cesium.ScreenSpaceEventHandler(this.viewer.scene.canvas)
    }
    drawPoint() {   //点：绘制点
        this.resetHandler();
        // console.log(this.handler);
        // if (!this.handler.isDestroyed()) {
        //     this.handler.destroy()
        // }
        // this.handler = new Cesium.ScreenSpaceEventHandler(this.viewer.scene.canvas)
        this.handler.setInputAction((click) => {
            const cartesian = this.viewer.camera.pickEllipsoid(click.position, this.viewer.scene.globe.ellipsoid);
            if (!cartesian) return; // 确保笛卡尔点有效 
            /**点击位置笛卡尔坐标 */
            // let cartesian = this.viewer.camera.pickEllipsoid(click.position, this.viewer.scene.globe.ellipsoid)
            /**笛卡尔转弧度坐标 */
            let cartographic = Cesium.Cartographic.fromCartesian(cartesian, this.viewer.scene.globe.ellipsoid, new Cesium.Cartographic())
            /**点击位置经度 */
            let lng = Cesium.Math.toDegrees(cartographic.longitude)
            /**点击位置维度 */
            let lat = Cesium.Math.toDegrees(cartographic.latitude)
            /**实体的唯一标注 */
            let id = new Date().getTime()
            this.viewer.entities.add({
                position: Cesium.Cartesian3.fromDegrees(lng, lat, 0),
                name: 'point',
                id: id,
                point: {
                    color: this.config.material,
                    pixelSize: 12,
                    outlineColor: this.config.borderColor,
                    outlineWidth: this.config.borderWidth
                }
            })
            this.infoDetail.point.push({ id: id, position: [lng, lat] })

        }, Cesium.ScreenSpaceEventType.LEFT_CLICK)

        this.handler.setInputAction((click) => {
            this.handler.destroy();
        }, Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK)
    }
    drawLine() {    //线：绘制线段
        this.resetHandler();
        // if (!this.handler.isDestroyed()) {
        //     this.handler.destroy()
        // }
        // console.log(this.handler);
        /**实体的唯一标注 */
        let id = null
        /**记录拐点坐标 */
        let positions = [],
            /**记录返回结果 */
            codeInfo = [],
            /**面的hierarchy属性 */
            polygon = new Cesium.PolygonHierarchy(),
            _polygonEntity = new Cesium.Entity(),
            /**面对象配置 */
            polyObj = null
        // this.handler = new Cesium.ScreenSpaceEventHandler(this.viewer.scene.canvas);
        // left
        this.handler.setInputAction((click) => {
            const cartesian = this.viewer.camera.pickEllipsoid(click.position, this.viewer.scene.globe.ellipsoid);
            if (!cartesian) return; // 确保笛卡尔点有效
            id = new Date().getTime()
            // let cartesian = this.viewer.camera.pickEllipsoid(movement.position, this.viewer.scene.globe.ellipsoid);
            let cartographic = Cesium.Cartographic.fromCartesian(cartesian, this.viewer.scene.globe.ellipsoid, new Cesium.Cartographic())
            let lng = Cesium.Math.toDegrees(cartographic.longitude)
            let lat = Cesium.Math.toDegrees(cartographic.latitude)

            if (cartesian && cartesian.x) {
                if (positions.length == 0) {
                    positions.push(cartesian.clone());
                }
                // codeInfo.push([lng, lat])
                codeInfo.push({ lon: lng, lat: lat });
                positions.push(cartesian.clone());
                polygon.positions.push(cartesian.clone())
                if (!polyObj) {
                    _polygonEntity.polyline = {
                        width: this.config.borderWidth,
                        material: this.config.borderColor,
                        clampToGround: false
                    }
                    _polygonEntity.polyline.positions = new Cesium.CallbackProperty(function () {
                        return positions
                    }, false)
                    _polygonEntity.name = 'line'
                    _polygonEntity._id = id

                    polyObj = this.viewer.entities.add(_polygonEntity)
                }
            }

        }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
        // mouse
        this.handler.setInputAction((movement) => {
            let cartesian = this.viewer.camera.pickEllipsoid(movement.endPosition, this.viewer.scene.globe.ellipsoid);
            let cartographic = Cesium.Cartographic.fromCartesian(cartesian, this.viewer.scene.globe.ellipsoid, new Cesium.Cartographic())
            let lng = Cesium.Math.toDegrees(cartographic.longitude)
            let lat = Cesium.Math.toDegrees(cartographic.latitude)

            if (positions.length >= 0) {
                if (cartesian && cartesian.x) {
                    positions.pop()
                    positions.push(cartesian);
                    codeInfo.pop()
                    // codeInfo.push([lng, lat]);
                    codeInfo.push({ lon: lng, lat: lat });
                }
            }
        }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);

        // right
        this.handler.setInputAction((movement) => {
            this.infoDetail.line.push({ id: id, positions: codeInfo })
            this.handler.destroy();
        }, Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK);
    }
    drawPlane() {   //多边形：自定义区域绘制
        if (!this.handler.isDestroyed()) {
            this.handler.destroy()
        }
        /**实体的唯一标注 */
        let id = new Date().getTime()
        /**记录拐点坐标 */
        let positions = [],
            /**记录返回结果 */
            codeInfo = [],
            /**面的hierarchy属性 */
            polygon = new Cesium.PolygonHierarchy(),
            _polygonEntity = new Cesium.Entity(),
            /**面对象配置 */
            polyObj = null
        this.handler = new Cesium.ScreenSpaceEventHandler(this.viewer.scene.canvas);
        // left
        this.handler.setInputAction((movement) => {
            let cartesian = this.viewer.camera.pickEllipsoid(movement.position, this.viewer.scene.globe.ellipsoid);
            let cartographic = Cesium.Cartographic.fromCartesian(cartesian, this.viewer.scene.globe.ellipsoid, new Cesium.Cartographic())
            let lng = Cesium.Math.toDegrees(cartographic.longitude)
            let lat = Cesium.Math.toDegrees(cartographic.latitude)


            if (cartesian && cartesian.x) {
                if (positions.length == 0) {
                    positions.push(cartesian.clone());
                }
                // codeInfo.push([lng, lat])
                codeInfo.push({ lon: lng, lat: lat });
                positions.push(cartesian.clone());
                polygon.positions.push(cartesian.clone())
                if (!polyObj) {
                    _polygonEntity.polyline = {
                        width: this.config.borderWidth,
                        material: this.config.borderColor,
                        clampToGround: false
                    }
                    _polygonEntity.polyline.positions = new Cesium.CallbackProperty(function () {
                        return positions
                    }, false)

                    _polygonEntity.polygon = {

                        hierarchy: new Cesium.CallbackProperty(function () {
                            return polygon
                        }, false),

                        material: this.config.material,
                        clampToGround: false
                    }
                    _polygonEntity.name = 'planeSelf'

                    _polygonEntity._id = id
                    polyObj = this.viewer.entities.add(_polygonEntity)
                }
            }
        }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
        // mouse
        this.handler.setInputAction((movement) => {
            let cartesian = this.viewer.camera.pickEllipsoid(movement.endPosition, this.viewer.scene.globe.ellipsoid);
            let cartographic = Cesium.Cartographic.fromCartesian(cartesian, this.viewer.scene.globe.ellipsoid, new Cesium.Cartographic())
            let lng = Cesium.Math.toDegrees(cartographic.longitude)
            let lat = Cesium.Math.toDegrees(cartographic.latitude)

            if (positions.length >= 0) {
                if (cartesian && cartesian.x) {
                    positions.pop()
                    positions.push(cartesian);
                    polygon.positions.pop()
                    polygon.positions.push(cartesian);
                    codeInfo.pop()
                    codeInfo.push({ lon: lng, lat: lat });
                }
            }
        }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);

        // right
        this.handler.setInputAction((movement) => {
            let coor = []
            coor = JSON.parse(JSON.stringify(codeInfo))
            coor.push(coor[0])//首尾相连
            this.infoDetail.planeSelf.push({ id: id, positions: coor })
            this.handler.destroy();
            positions.push(positions[0]);
        }, Cesium.ScreenSpaceEventType.RIGHT_CLICK);

    }
    drawRectangle() {//矩形：绘制矩形区域
        // 然而，当为实体的 polygon 和 polyline 设置 material 时，Cesium 需要一个有效的材质类型，而不是一个 Cesium.Color 对象本身。
        console.log(6)
        this.resetHandler();
        // console.log(this.handler);
        // if (!this.handler.isDestroyed()) {
        //     this.handler.destroy()
        // }
        let westSouthEastNorth = []//矩形四点坐标
        /**实体的唯一标注 */
        let id = null
        /**地图点击对象 */
        // this.handler = new Cesium.ScreenSpaceEventHandler(this.viewer.scene.canvas)
        this.handler.setInputAction((click) => {
            const cartesian = this.viewer.camera.pickEllipsoid(click.position, this.viewer.scene.globe.ellipsoid);
            if (!cartesian) return; // 确保笛卡尔点有效
            /**点击位置笛卡尔坐标 */
            // let cartesian = this.viewer.camera.pickEllipsoid(click.position, this.viewer.scene.globe.ellipsoid)
            /**笛卡尔转弧度坐标 */
            let cartographic = Cesium.Cartographic.fromCartesian(cartesian, this.viewer.scene.globe.ellipsoid, new Cesium.Cartographic())
            /**点击位置经度 */
            let lng1 = Cesium.Math.toDegrees(cartographic.longitude)
            /**点击位置维度 */
            let lat1 = Cesium.Math.toDegrees(cartographic.latitude)
            /**边框坐标 */
            westSouthEastNorth = [lng1, lat1]
            id = new Date().getTime()
            if (westSouthEastNorth) {
                this.handler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK)
            }
            /**面实例对象 */
            let polygons = this.viewer.entities.add({
                name: 'rectangle',
                id: id,
                polygon: {
                    hierarchy: new Cesium.CallbackProperty(function () {
                        return {
                            positions: Cesium.Cartesian3.fromDegreesArray(westSouthEastNorth)
                        }
                    }, false),
                    height: 0,
                    // 填充的颜色，withAlpha透明度
                    material: new Cesium.ColorMaterialProperty(this.config.material),
                    // 是否被提供的材质填充
                    fill: true,
                    // 是否显示
                    show: true,
                },
                polyline: {
                    positions: new Cesium.CallbackProperty(function () { return Cesium.Cartesian3.fromDegreesArray(westSouthEastNorth) }, false),
                    material: new Cesium.ColorMaterialProperty(this.config.borderColor),
                    width: this.config.borderWidth,
                    zIndex: 1,
                    clampToGround: true
                }
            })
            this.handler.setInputAction((move) => {
                let cartesian = this.viewer.camera.pickEllipsoid(move.endPosition, this.viewer.scene.globe.ellipsoid)
                let cartographic = Cesium.Cartographic.fromCartesian(cartesian, this.viewer.scene.globe.ellipsoid, new Cesium.Cartographic())
                let lng = Cesium.Math.toDegrees(cartographic.longitude)
                let lat = Cesium.Math.toDegrees(cartographic.latitude)
                // westSouthEastNorth = [lng1, lat1, lng1, lat, lng, lat, lng, lat1, lng1, lat1]
                westSouthEastNorth = [lng1, lat, lng, lat, lng, lat1, lng1, lat1, lng1, lat]
                // westSouthEastNorth = [{lon:lng1,lat:lat},{lon:lng,lat:lat},{lon:lng,lat:lat1},{lon:lng1,lat:lat1},{lon:lng1,lat:lat}]
            }, Cesium.ScreenSpaceEventType.MOUSE_MOVE)
        }, Cesium.ScreenSpaceEventType.LEFT_CLICK)

        let _ = this
        this.handler.setInputAction(() => {
            this.handler.destroy();
            this.infoDetail.rectangle.push({ id: id, position: westSouthEastNorth })
            let p = westSouthEastNorth
            let rectangleLast = [{ lon: p[0], lat: p[1] }, { lon: p[2], lat: p[3] }, { lon: p[4], lat: p[5] }, { lon: p[6], lat: p[7] }, { lon: p[8], lat: p[9] }]
            // target(rectangleLast)
            // if (target && this.infoDetail.rectangle.length > 0) {
            //     target()
            // }
        }, Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK)
    }
    drawCircle() {  //圆：绘制圆形区域
        if (!this.handler.isDestroyed()) {
            this.handler.destroy()
        }
        /**实体的唯一标注 */
        let id = null

        /**圆半径 */
        let radius = 0
        /**圆心 */
        let lngLat = []
        /**鼠标事件 */
        this.handler = new Cesium.ScreenSpaceEventHandler(this.viewer.scene.canvas)
        this.handler.setInputAction((click) => {
            id = new Date().getTime()
            let cartesian = this.viewer.camera.pickEllipsoid(click.position, this.viewer.scene.globe.ellipsoid)
            let cartographic = Cesium.Cartographic.fromCartesian(cartesian, this.viewer.scene.globe.ellipsoid, new Cesium.Cartographic())
            let lng = Cesium.Math.toDegrees(cartographic.longitude)
            let lat = Cesium.Math.toDegrees(cartographic.latitude)
            lngLat = [lng, lat]
            let entity = this.viewer.entities.add({
                position: new Cesium.CallbackProperty(function () { return new Cesium.Cartesian3.fromDegrees(...lngLat, 0) }, false),
                name: 'circle',
                id: id,
                ellipse: {
                    height: 0,
                    outline: true,
                    material: this.config.material,
                    outlineColor: this.config.borderColor,
                    outlineWidth: this.config.borderWidth
                }
            })
            entity.ellipse.semiMajorAxis = new Cesium.CallbackProperty(function () { return radius }, false)
            entity.ellipse.semiMinorAxis = new Cesium.CallbackProperty(function () { return radius }, false)

            if (lngLat) {
                this.handler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK)
            }
            this.handler.setInputAction((move) => {
                let cartesian2 = this.viewer.camera.pickEllipsoid(move.endPosition, this.viewer.scene.globe.ellipsoid)
                radius = Cesium.Cartesian3.distance(cartesian, cartesian2)
            }, Cesium.ScreenSpaceEventType.MOUSE_MOVE)
        }, Cesium.ScreenSpaceEventType.LEFT_CLICK)

        this.handler.setInputAction(() => {

            this.infoDetail.circle.push({ id: id, center: lngLat, radius: radius })
            this.handler.destroy();
        }, Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK)


    }
    addGeojson(geoJsonData) {  //

        let dataSource = Cesium.GeoJsonDataSource.load(geoJsonData, {

        })
        dataSource.then((data) => {
            data.name = '嘻嘻嘻'
            this.viewer.dataSources.add(data)
        })
        this.viewer.zoomTo(dataSource)
        // let dataSource = new Cesium.GeoJsonDataSource("测试Geo");
        // this.viewer.dataSources.add(dataSource);
        // dataSource.load(geoJsonData).then(() => {
        //     this.viewer.zoomTo(dataSource);
        //     console.error('Error loading GeoJSON:');
        //     dataSource.entities.values.forEach((entity) => {
        //         entity.name = "测试Geo";
        //     })
        // }).catch(error => {
        //     console.error('Error loading GeoJSON:', error);
        // });
    }
    removeGeojsonByCond(name) {//按条件（name）删除 geojson 实体
        console.log('删除所有实体--')
        let dataS = this.viewer.dataSources
        console.log('删除指定geojson实体--', dataS)
        if (!dataS) return
        for (let i = dataS.length - 1; i >= 0; i--) {
            if (dataS.get(i).name == name) {
                console.log(name)
                dataS.remove(dataS.get(i))
            }
        }
    }
    removeEntityByCond(name) {//按条件（id,name）删除 entity 实体
        console.log('删除所有实体--')
        let dataS = this.viewer.entities.values
        console.log('删除指定geojson实体--', dataS)
        if (!dataS) return
        for (let i = dataS.length - 1; i >= 0; i--) {
            if (dataS[i].name === name) {
                console.log(name)
                this.viewer.entities.remove(dataS[i])
            }
        }
    }
    removeAll() {
        console.log('删除所有实体--')
        this.viewer.dataSources.removeAll()//清除 geojson 数据
        this.viewer.entities.removeAll()//清除实体
    }
    backInfoDetail() {//返回绘制数据
        return this.infoDetail
    }
    resetHandler() {// 唯一 handler
        if (this.handler && !this.handler.isDestroyed()) {
            this.handler.destroy();
        }
        this.handler = new Cesium.ScreenSpaceEventHandler(this.viewer.scene.canvas);
    }
}
