import * as Cesium from 'cesium'

let handler; // 在外部作用域中声明处理程序
export function moveCoordinate(viewer) {
    // 检查处理程序是否已存在，如果不存在，则创建它
    if (!handler) {
        handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
    }
    const entity = viewer.entities.add({
        name: '经纬度',
        label: {
            show: false,
            showBackground: true,
            font: "14px monospace",
            horizontalOrigin: Cesium.HorizontalOrigin.LEFT,
            verticalOrigin: Cesium.VerticalOrigin.TOP,
            pixelOffset: new Cesium.Cartesian2(15, 0),
        },
    });

    // 定义回调函数
    const mouseMoveCallback = function (movement) {
        const cartesian = viewer.camera.pickEllipsoid(
            movement.endPosition,
            viewer.scene.globe.ellipsoid
        );
        if (cartesian) {
            const cartographic = Cesium.Cartographic.fromCartesian(cartesian);
            const longitudeString = Cesium.Math.toDegrees(cartographic.longitude).toFixed(6);
            const latitudeString = Cesium.Math.toDegrees(cartographic.latitude).toFixed(6);

            entity.position = cartesian;
            entity.label.show = true;
            entity.label.text = `Lon: ${longitudeString}\u00B0\nLat: ${latitudeString}\u00B0`;
        } else {
            entity.label.show = false;
        }
    };

    // 设置鼠标移动动作
    handler.setInputAction(mouseMoveCallback, Cesium.ScreenSpaceEventType.MOUSE_MOVE);

    // 返回一个函数以删除特定的侦听器
    return () => {
        handler.removeInputAction(Cesium.ScreenSpaceEventType.MOUSE_MOVE);
    };
    //调用页面清除此监听但不影响同监听下的其他方法
    // const removeMouseMoveListener = moveCoordinate(viewer);
    // removeMouseMoveListener();清除
}

export function setupLeftClickHandler(viewer) {//左击获取坐标/实体
    // 创建一个新的 ScreenSpaceEventHandler 实例
    const handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);

    // 定义左键点击事件的回调函数
    const handleLeftClick = (click) => {
        const windowPosition = click.position;
        const picked = viewer.scene.pick(windowPosition);

        // 获取点击位置的地理坐标
        const cartesian = viewer.scene.pickPosition(windowPosition);
        if (Cesium.defined(cartesian)) {
            const cartographic = Cesium.Cartographic.fromCartesian(cartesian);
            const longitude = Cesium.Math.toDegrees(cartographic.longitude);
            const latitude = Cesium.Math.toDegrees(cartographic.latitude);
            let height = cartographic.height;
            console.log(`坐标--: 经度: ${longitude}, 纬度: ${latitude}, 高度: ${height}`);
        } else {
            console.log('无法确定坐标.');
        }

        if (Cesium.defined(picked)) {
            const id = Cesium.defaultValue(picked.id, picked.primitive.id);
            if (id instanceof Cesium.Entity) {
                // 在这里处理选中的实体
                console.log('获取实体--:', id);
                // 例如：执行与选中的实体相关的操作
                return id;
            }
        }
        console.log('未点击到实体.');
        return undefined;
    };

    // 设置鼠标左键点击事件
    handler.setInputAction(handleLeftClick, Cesium.ScreenSpaceEventType.LEFT_CLICK);

    // 返回一个函数来移除左键点击事件监听器
    return () => {
        handler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK);
    };
    //调用页面清除此监听但不影响同监听下的其他方法
    // const removeLeftClickHandler  = moveCoordinate(viewer);
    // removeLeftClickHandler(); 清除
}
