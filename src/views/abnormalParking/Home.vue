<template>
  <div class="home">
    <baidu-map class="bm-view" :center="center" :zoom="zoom"  :scroll-wheel-zoom="true" :min-zoom="1" :max-zoom="17"
      @ready="handler"
      @click="handleClick"
      @moving="syncCenterAndZoom"
      @moveend="syncCenterAndZoom"
      @zoomend="syncCenterAndZoom">

      <!-- 桩号 -->
      <bm-scale anchor="BMAP_ANCHOR_BOTTOM_RIGHT"></bm-scale>
      <template v-if="isShow">
        <bm-label
          v-for="(item) in pileList" :key="item.lat" 
          :position="{lng: item.lng, lat: item.lat}" 
          :content="String(item.endmilepost)"
          :labelStyle="{color: '#fff', fontSize : '12px', background: '#ee5d5b'}" 
          :offset="{width: 0, height: 0}"/>

      </template>

      <!-- 路段编号 -->
      <bm-label v-for="(item) in roadIdList" :key="item.lat" :position="{lng: item.lng, lat: item.lat}" :content="item.content" v-if="isRoadIdsShow" :labelStyle="{color: 'red', fontSize : '12px'}" :offset="{width: 0, height: 0}"/>
    
      <!-- 线 -->
      <!-- <bm-polyline :path="polylinePath" stroke-color="blue" :stroke-opacity="1" :stroke-weight="2"></bm-polyline> -->

      <bm-polyline v-show="isShowLine1" :path="polyLinePath1" :stroke-color="lineOptions1.strokeColor" :stroke-opacity="lineOptions1.strokeOpacity" :stroke-weight="lineOptions1.strokeWeight" :stroke-style="lineOptions1.strokeStyle"></bm-polyline>
      <bm-polyline v-show="isShowLine2" :path="polyLinePath2" :stroke-color="lineOptions2.strokeColor" :stroke-opacity="lineOptions2.strokeOpacity" :stroke-weight="lineOptions2.strokeWeight" :stroke-style="lineOptions2.strokeStyle"></bm-polyline>

    </baidu-map>

    <button class="btn" @click="togglePile">{{textHtml}}桩号</button>
  </div>
</template>

<script>
import {roadobjs, roadpoints} from '@v/config/roadobj.js'
import * as tools from '@/utils/index.js'
// 桩号位置
const pileObjs1 = {"piles":[{"endmilepost":"K207[G92]","lng":"120.541359530294","lat":"30.1450792896313"},{"endmilepost":"K208[G92]","lng":"120.550169726103","lat":"30.1402729783797"},{"endmilepost":"K209[G92]","lng":"120.559593436175","lat":"30.1369711465538"},{"endmilepost":"K210[G92]","lng":"120.568940199767","lat":"30.1346127885145"},{"endmilepost":"K211[G92]","lng":"120.578982009049","lat":"30.1321612849993"},{"endmilepost":"K212[G92]","lng":"120.589661320294","lat":"30.1296729649125"},{"endmilepost":"K213[G92]","lng":"120.59951593815","lat":"30.1266260484842"},{"endmilepost":"K214[G92]","lng":"120.608544497754","lat":"30.1223854246418"},{"endmilepost":"K215[G92]","lng":"120.6170758982","lat":"30.1172037718684"},{"endmilepost":"K206[G92]","lng":"120.534668900943","lat":"30.1520722827553"},{"endmilepost":"K205[G92]","lng":"120.529098577753","lat":"30.1595626963176"}]}
const roadSpeedList = {
  "flag":true,
  "result":[
    {
      "endmilepost":null,
      "duration1":"0",
      "duration2":"0",
      "rsindex":"3",
      "tindex2":"0.8",
      "tindex1":"0.8",
      "traffic2":"0",
      "traffic1":"0",
      "startmilepost":null,
      "speed1":"88.8",
      "speed2":"88.8",
      "road_id":"1000300001",
      "time_segment":"20191024203"
    },{
      "endmilepost":null,
      "duration1":"0",
      "duration2":"0",
      "rsindex":"4",
      "tindex2":"0.8",
      "tindex1":"0.8",
      "traffic2":"0",
      "traffic1":"0",
      "startmilepost":null,
      "speed1":"88.8",
      "speed2":"88.8",
      "road_id":"1000300001",
      "time_segment":"20191024203"
    },{
      "endmilepost":null,
      "duration1":"0",
      "duration2":"0",
      "rsindex":"5",
      "tindex2":"0.8",
      "tindex1":"0.8",
      "traffic2":"0",
      "traffic1":"0",
      "startmilepost":null,
      "speed1":"88.8",
      "speed2":"88.8",
      "road_id":"1000300001",
      "time_segment":"20191024203"
    },{
      "endmilepost":null,
      "duration1":"0",
      "duration2":"0",
      "rsindex":"6",
      "tindex2":"0.8",
      "tindex1":"0.8",
      "traffic2":"0",
      "traffic1":"0",
      "startmilepost":null,
      "speed1":"88.8",
      "speed2":"88.8",
      "road_id":"1000300001",
      "time_segment":"20191024203"
    },{
      "endmilepost":null,
      "duration1":"0",
      "duration2":"0",
      "rsindex":"7",
      "tindex2":"0.8",
      "tindex1":"0.8",
      "traffic2":"0",
      "traffic1":"0",
      "startmilepost":null,
      "speed1":"88.8",
      "speed2":"88.8",
      "road_id":"1000300001",
      "time_segment":"20191024203"
    },{
      "endmilepost":null,
      "duration1":"0",
      "duration2":"0",
      "rsindex":"8",
      "tindex2":"0.8",
      "tindex1":"0.8",
      "traffic2":"0",
      "traffic1":"0",
      "startmilepost":null,
      "speed1":"88.8",
      "speed2":"88.8",
      "road_id":"1000300001",
      "time_segment":"20191024203"
    },{
      "endmilepost":null,
      "duration1":"0",
      "duration2":"0",
      "rsindex":"9",
      "tindex2":"0.8",
      "tindex1":"0.8",
      "traffic2":"0",
      "traffic1":"0",
      "startmilepost":null,
      "speed1":"88.8",
      "speed2":"88.8",
      "road_id":"1000300001",
      "time_segment":"20191024203"
    }
  ]
}

export default {
  name: 'home',
  data() {
    return {
      BMap: null,
      map: null,
      center: {"lng":120.568166,"lat":30.139789},
      zoom: 14,
      pileList: pileObjs1.piles,
      isShow: false,
      textHtml: '显示',
      speedList: roadSpeedList.result,
      roadIdList: [],// 路段编号数据
      isRoadIdsShow: true,// 路段编号是否显示
      polylinePath: [],
      isShowLine1: true,
      polyLinePath1: [],
      lineOptions1: {
        strokeColor: 'blue',
        strokeOpacity: 1,
        strokeStyle : 'solid',
        strokeWeight: 1
      },
      isShowLine2: true,
      polyLinePath2: [],
      isShowLine3: true,
      polyLinePath3: [],
      lineOptions3: {
        strokeColor: '#8A8A8A',
        strokeOpacity: 1,
        strokeStyle : 'dashed',
        strokeWeight: 1
      },
      isShowLine4: true,
      polyLinePath4: [],
      lineOptions2: {
        strokeColor : "#8A8A8A",
        strokeOpacity : 1,
        strokeStyle : 'dashed',
        strokeWeight : 1
      }
    }
  },
  mounted() {
    // console.log(roadobjs);
  },
  methods: {
    // 由于百度地图 JS API 只有 JSONP 一种加载方式，因此 BaiduMap 组件及其所有子组件的渲染只能是异步的。
    // 因此，请使用在组件的 ready 事件来执行地图 API 加载完毕后才能执行的代码，不要试图在 vue 自身的生命周期中调用 BMap 类，更不要在这些时机修改 model 层。
    handler ({BMap, map}) {
      // console.log(BMap, map)
      this.BMap = BMap
      this.map = map

      this.getSegmentSpeed()
    },
    syncCenterAndZoom (e) {
      const {lng, lat} = e.target.getCenter()
      this.center.lng = lng
      this.center.lat = lat
      this.zoom = e.target.getZoom()
      
      // 更新路况
      this.getSegmentSpeed()
    },
    handleClick (e) {
      console.log(`lng: ${e.point.lng}, lat: ${e.point.lat}`);
    },
    togglePile () {
      this.isShow = !this.isShow
      this.textHtml = this.isShow ? '显示' : '隐藏'
    },
    getSegmentSpeed () {
      // 清除旧的路况
      this.claerLineOverlays()

      let distance, weight
      switch (this.zoom) {
        case 9:
          distance = 800
          weight = 2
          break;
        case 10:
          distance = 400
          weight = 2
          break;
        case 11:
          distance = 200
          weight = 2
          break;
        case 12:
          distance = 110
          weight = 2
          break;
        case 13:
          distance = 60
          weight = 2
          break;
        case 14:
          distance = 25
          weight = 2.5
          break;
        case 15:
          distance = 15
          weight = 3
          break;
        case 16:
          distance = 14
          weight = 6
          break;
        case 17:
          distance = 15
          weight = 11
          break;
        default:
          break;
      }
      this.roadIdList = []
      this.speedList.forEach((item) => {
        // console.log(index, item)
        this.drawLineOverlay(item, distance, weight)
      });
    },
    drawLineOverlay (seg, distance, weight) {
      let dire1,dire2
      if (roadId == 1000300001)
        dire1 = '甬向'
        dire2 = '杭向'
      // 获取主路的实时数据
      let { road_id:roadId, speed1, speed2, time_segment:timeSegment, traffic1, traffic2, tindex1, tindex2, duration1, duration2, rsindex} = seg
      // 获取主路的固有信息
      let {max_speed:maxSpeed, road_name:roadName} = roadobjs.roadobj[roadId]
      let rsInd = roadobjs.roadobj[roadId].rsindex[rsindex]
      // 获取路段(小段的)的信息
      let { length, 
              rs_name:rsName, 
              next_rs_name:nextRsName,
              begin_location:beginLocation,
              end_location:endLocation,
              line_name: lineName,
              region_name:regionName
            } = rsInd
      let startMilePost = parseFloat(seg["startmilepost"]).toFixed(3)
      let endMilePost = parseFloat(seg["endmilepost"]).toFixed(3)

      /**
       * 开始里程碑,结束里程碑
       */
      // 整数部分startmiles 小数部分startmile
      let startmiles = startMilePost.substring(0, startMilePost.toString().indexOf('.'))
      let startmile = startMilePost.substring(startMilePost.toString().indexOf('.') + 1, -1);
      let startkm, startm
      if (startmiles < 1) {
          startkm = startmiles + "K" + startmiles.substring(1, -1)
      } else {
          startkm = "K" + startmiles
      }
      if (startmile > 0) {
          startm = startkm + "+" + startmile
      } else {
          startm = startkm
      }

      let endmiles = endMilePost.substring(0, endMilePost.toString().indexOf('.'))
      let endmile = endMilePost.substring(endMilePost.toString().indexOf('.') + 1,-1);
      let endkm, endm
      if (endmiles < 1) { 
          endkm=endmiles + "K" + endmiles.substring(1,-1) 
      } else { 
          endkm="K" + endmiles 
      } 
      if (endmile> 0) {
          endm = endkm + "+" + endmile
      } else {
          endm = endkm
      }

      const _roadPath = (roadpoints.roadpoints[roadId+'_'+rsindex]).map(p=>{
        return {"lng": Number(p.lng),"lat": Number(p.lat)}
      })

      _roadPath.map(i=>{
        this.polylinePath.push(i)
      })
      // console.log('原始数据:', _roadPath)

      // let color = '#f78484'
      // let speedRatio = Number(speed1) / Number(maxSpeed)
      // if (speedRatio < 0.2) {
      //   color = '#f78484'
      // } else if (speedRatio >= 0.2 && speedRatio < 0.5) {
      //   color = '#ff9c18'
      // }else {
      //   color = "#52bd39"
      // }

      let zoom = this.zoom
      if (roadId > 300) {
        if (zoom > 11) {
          this.roadIdList.push({
            content: rsindex,
            lng: _roadPath[_roadPath.length-1].lng,
            lat: _roadPath[_roadPath.length-1].lat
          })
        }
      }else {
        if (rsindex == 1) {
          if (roadId > 300) {
            if (zoom > 11) {
              this.roadIdList.push({
                content: '0',
                lng: _roadPath[0].lng,
                lat: _roadPath[0].lat
              })
            }
          }else {
            this.roadIdList.push({
              content: '0' + '(' + beginLocation + ')',
              lng: _roadPath[0].lng,
              lat: _roadPath[0].lat
            })
          }
        }

        if (!(roadId > 300 && zoom < 12)) {
          this.roadIdList.push({
            content: rsindex+'(' + end_location + ')',
            lng: _roadPath[_roadPath.length-1].lng,
            lat: _roadPath[_roadPath.length-1].lat
          })
        }
      }

      if (roadId > 300) {
        _roadPath.shift()
        beginLocation = '经纬度('+ Number(_roadPath[0].lng).toFixed(5)+','+Number(_roadPath[0].lat).toFixed(5)+')'
        endLocation = '经纬度('+ Number(_roadPath[_roadPath.length-1].lng).toFixed(5)+','+Number(_roadPath[_roadPath.length-1].lat).toFixed(5)+')'
      }

      this.drawParallelLines(_roadPath, distance, weight, 
      {road_id: roadId, rs_index: rsindex, speed1: speed1, speed2: speed2, max_speed: maxSpeed, time_segment: timeSegment,
      dire1: dire1, dire2: dire2, traffic1: traffic1, traffic2: traffic2,
      length: length, rs_name: rsName, next_rs_name: nextRsName,duration1:duration1, duration2: duration2,
      startm: startm, endm: endm, begin_location: beginLocation, end_location: endLocation,
      road_name : roadName, line_name : lineName, region_name : regionName, 
      tindex1 : tindex1, tindex2 : tindex2
      })
    },
    drawParallelLines (path, d, w, trafficInfo) {
      let path1 = [], path2 =[]

      let time = ''
      if (trafficInfo !=null) {
        let time1 = '', time2 = ''
        if (trafficInfo.time_segment!=null) {
          let DateStr = trafficInfo.time_segment.substr(0,8) //获取年月 20191024203
          let temp = DateStr.substr(0,4)+'/'+ DateStr.substr(4,2) + '/' + DateStr.substr(6,2) // 2019/10/24
  
          time1 = new Date(new Date(temp).setMinutes(trafficInfo.time_segment.substr(8) * 5))
          time2 = time1.clone()
          time2 = new Date(time2.setMinutes(time2.getMinutes() - 5))
          time = tools.parseTime(time2, '{h}:{i}') + " - " + tools.parseTime(time1, '{h}:{i}')
        }
        var points = this.initPolyline(path,d)
        for (var i = 1; i < points.length - 1; i++) {
          var lat1, lng1, lat2, lng2;
          var p0 = points[i - 1];
          var p1 = points[i];
          var p2 = points[i + 1];
          var d_latlng = this.getParallelPoint(p0, p1, p2, d);
          lat1 = p1.lat - d_latlng.lat;
          lng1 = p1.lng - d_latlng.lng;
          lat2 = p1.lat + d_latlng.lat;
          lng2 = p1.lng + d_latlng.lng;

          path1.push({lng: lng1, lat:lat1})
          path2.push({lng: lng2, lat:lat2})
        }

        // console.log('path1:', path1);
        // console.log('path2:', path2);
        var color1, color2;

        if (trafficInfo != null) {
          color1 = this.getSpeedLineColor(trafficInfo.tindex1, trafficInfo.speed1);
          color2 = this.getSpeedLineColor(trafficInfo.tindex2, trafficInfo.speed2);
        } else {
          color1 = "white";
          color2 = "white";
        }
        this.lineOptions1 = {
          strokeColor: color1,
          strokeOpacity: 1,
          strokeWeight: w
        }
        this.lineOptions2 = {
          strokeColor: color2,
          strokeOpacity: 1,
          strokeWeight: w
        }
        this.lineOptions3 = {
          strokeWeight: w
        }
        this.lineOptions4 = {
          strokeWeight: w
        }
        path1.map(i => {
          this.polyLinePath1.push(i)
        })
        path2.map(i => {
          this.polyLinePath2.push(i)
        })

        if (trafficInfo.speed1 == 0 && trafficInfo.speed2 != 0) {
          this.isShowLine2 = true
          this.isShowLine3 = true
          this.isShowLine1 = false
          this.isShowLine2 = false
        } else if (trafficInfo.speed1 != 0 && trafficInfo.speed2 == 0) {
          this.isShowLine1 = true
          this.isShowLine4 = true
          this.isShowLine2 = false
          this.isShowLine3 = false
        } else if (trafficInfo.speed1 == 0 && trafficInfo.speed2 == 0) {
          this.isShowLine3 = true
          this.isShowLine4 = true
          this.isShowLine1 = false
          this.isShowLine2 = false
        } else {
          this.isShowLine1 = true
          this.isShowLine2 = true
          this.isShowLine3 = false
          this.isShowLine4 = false
        }

      }


    },
    initPolyline (oldArr) {
      var newArr = [];
      if(oldArr.length < 2)
          return oldArr
          
      // 加入起始辅助点
      newArr.push({lng: oldArr[0].lng * 2 - oldArr[1].lng, lat: oldArr[0].lat * 2 - oldArr[1].lat})
      // newArr.push(new BMap.Point(oldArr[0].lng * 2 - oldArr[1].lng, oldArr[0].lat * 2 - oldArr[1].lat));
      newArr.push({lng: oldArr[0].lng, lat: oldArr[0].lat})
      for (var i=1; i< oldArr.length - 1; i++){
        newArr.push({
          lng: oldArr[i].lng,
          lat: oldArr[i].lat
        })
      }
      newArr.push({
        lng: oldArr[oldArr.length-1].lng,
        lat: oldArr[oldArr.length-1].lat
      })
      // 加入结尾辅助点
      newArr.push({
        lng: oldArr[oldArr.length - 1].lng * 2 - oldArr[oldArr.length - 2].lng,
        lat: oldArr[oldArr.length - 1].lat * 2 - oldArr[oldArr.length - 2].lat
      })
      return newArr
    },
    getSpeedLineColor (radio, speed) {
      if (speed == null || speed < 0) {
        return "#8A8A8A";
      }
      if (speed >= 60) {
        return "lime"; //绿色--畅通
      } else if (speed >= 40 && speed < 60) {
        return "orange"; //橙色--缓慢
      } else if (speed >= 0 && speed < 40) {
        return "red"; //红色--拥堵
      } else {
        return "#8A8A8A";
      }
    },
    getParallelPoint (p0, p1, p2, t) {
      // 经纬度分别转换成长度单位
      var y12 = p2.lat-p1.lat;
      var x12 = p2.lng-p1.lng;
      var y01 = p1.lat-p0.lat;
      var x01 = p1.lng-p0.lng;
      var a, b
      if (x12 == 0){
          a = Math.PI/2;
          if (y12 < 0)
          a = -a;
      }else{
          a = Math.atan(y12/x12);
      }
      if (x01 == 0){
          b = Math.PI/2;
          if (y01 < 0)
              b = -b;
      }else{
          b = Math.atan(y01/x01);
      } 
      // 关键核心处
      if( p2.lng < p1.lng ){
          a += Math.PI;
      } 
      if( p1.lng < p0.lng ){
          b += Math.PI;
      }
      var k = (b-a-Math.PI)/2;
      var r = a+k;
      var d = t/Math.sin(k);
      var sinr = Math.sin(r);
      var cosr = Math.cos(r);
      var d_lat = this.lenToLat(d*sinr);
      var d_lng = this.lenToLng(p1.lat, d*cosr);
      return {lat: d_lat, lng: d_lng};
    },
    lenToLat (leng) {
      var L = 10002150; // 半个经线长度（经线圈的1/4），对应90°纬度
      var angle = 90*leng/L;
      return angle;
    },
    latToLen (d_lat) {
      var L = 10002150; // 半个经线长度（经线圈的1/4），对应90°纬度
      var len = d_lat*L/90;
      return len;
    },
    lenToLng(lat, leng){
      var L = 20037508;// 赤道一半长度（半圈，对应180°经度）
      var latL = L*Math.cos(Math.PI/180*lat); // 指定纬度对应的纬线长度（半圈）
      var angle = 180*leng/latL;
      return angle;
    },
    lngToLen(lat, d_lng){
      var L = 20037508;// 赤道一半长度（半圈，对应180°经度）
      var latL = L*Math.cos(Math.PI/180*lat); // 指定纬度对应的纬线长度（半圈）
      var len = d_lng*latL/180;
      return len;
    },
    claerLineOverlays () {
      // 清楚路况
      this.polyLinePath1 = []
      this.polyLinePath2 = []
      this.isShowLine1 = false
      this.isShowLine2 = false

    }
  }
}
</script>
<style>
.anchorBL {
  display: none;
}

.BMap_scaleCtrl div.BMap_scaleTxt {
  display: none;
}
</style>
<style lang="scss" scoped>
.home {
  width: 100%;
  height: 100%;
  position: relative;
}
.bm-view {
  width: 100%;
  height: 100%;
 
}
.btn {
  position: absolute;
  top: 100px;
  right: 50px;
}
</style>