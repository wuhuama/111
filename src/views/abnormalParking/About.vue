<template>
  <div class="container">
    <baidu-map 
        class="map"
        :scroll-wheel-zoom="true"
        :center="center"
        :zoom="zoom"
        @ready="ready"
        @moving="syncCenterAndZoom"
        @moveend="syncCenterAndZoom"
        @zoomend="syncCenterAndZoom">
      <bm-city-list anchor="BMAP_ANCHOR_TOP_LEFT" offset=""></bm-city-list>
    </baidu-map>
    <div class="footer-bar">
      <input v-model.number="center.lng">
      <input v-model.number="center.lat">
      <input v-model.number="zoom">
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      map: null,
      center: {
        lng: 116.404,
        lat: 39.915
      },
      zoom: 15
    }
  },
  methods: {
    ready ({BMap, map}) {
      this.map = map
      this.polkk()
    },
     syncCenterAndZoom (e) {
      const {lng, lat} = e.target.getCenter()
      this.center.lng = lng
      this.center.lat = lat
      this.zoom = e.target.getZoom()
    },
    polkk () {
      //创建矢量图标类
      var Symbol = new BMap.Symbol(BMap_Symbol_SHAPE_FORWARD_CLOSED_ARROW, //百度地图预设向上的箭头
      {
          fillColor: '#F00', //图标填充颜色
          fillOpacity: 1, //图标填充透明度
          scale: 1.5, //图标缩放大小
          rotation : 90, //图标旋转角度
          strokeColor : '#fff', //线填充颜色
          strokeWeight : 1, //线宽
          strokeOpacity : 0, //线的透明度
      });

      //设置折线样式符号显示
      var iconSequence = new BMap.IconSequence(
        Symbol,// 线上的符号 symbol为符号样式;
        '100%', // offset为符号相对于线起点的位置，取值可以是百分比也可以是像素位置，默认为"100%";
        '100%', // repeat为符号在线上重复显示的距离，可以是百分比也可以是距离值，同时设置repeat与offset时，以repeat为准;
        false  // fixedRotation设置图标的旋转角度是否与线走向一致，默认为true
        );

      //设置折线
      var routeArr = [
        new BMap.Point(116.399, 39.910),
        new BMap.Point(116.405, 39.920)
      ]
      var pl = new BMap.Polyline(routeArr, //测试的坐标点集合
      {
        icons : [iconSequence], //图标集合
        strokeColor : '#008DD5',
        strokeWeight : 5,
        strokeOpacity : 1
      });
                                      
      //添加覆盖物
      this.map.addOverlay(pl);
    }
  }
}
</script>
<style lang="scss" scoped>
  .container {
    height: 100%;
  }

  .map {
    height: 90%;
  }

  .footer-bar {
    height: 10%;
    input {
      width: 33.333%;
      height: 50px;
      padding: 0 15px;
      border: 0;
      border-bottom: 1px solid red;
      border-right: 1px solid red;

      &:last-child {
        border-right: 0;
      }
    }
  }
</style>