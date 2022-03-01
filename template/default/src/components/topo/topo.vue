<template>
  <div id="indexPage" class="pos-r">
  </div>
</template>
<script>
import { 
  relayListByCity
} from "api/basicsManagement/networkData";
import {
  expand,
  shrink,
  cloud
} from 'util/topoUtil';
// import dataJson from './demo.json';
// 拓扑
var level_1 = 0,
  level_2 = 0,
  level_3 = 0,
  level_4 = 0,
  level_5 = 0,
  backList = [],
  moreDomType = 'circular';
// 创建警告闪动动画
let warning = {
  interval: 800,
  action: (data) => {
      if(!data.a('warning.enabled')) return
      data.a('warning.visible', !data.a('warning.visible'));
  }
};
export default {
  props: {
    topHeight: {
      type: Number,
      default: 50
    },
    cityName: {
      type: String,
      default: ''
    },
    deviceNoteInfo: {
      type: Array,
      default: []
    }
  },
  data() {
    return {
      dataList: [], // 城市拓扑图数据
      dataModel: new ht.DataModel(),
      toolbar: new ht.widget.Toolbar(),
      graphView: null,
      note: new ht.HtmlNode(),
      view: null,
      finder: null,
      historyManager: null,
      activeDevice: null,
      activeCityName: null,
      zoomValue: 1,
      group: [],
      devel: {}
    };
  },
  mounted() {
    this.$nextTick(() => {
      // this.init();
      this._relayListByCity(this.cityName);
    });
  },
  //这里用watch方法来监听父组件传过来的值，来实现实时更新
  watch:{
    topHeight(val){
      let nodeMain = document.getElementById("nodeMain");
      if(nodeMain) {
        nodeMain.style.top = `${val}px`;
      }
    },
    cityName(cityName) {
      if(cityName !== this.activeCityName) {
        this.dataModel.clear();
        ht.Default.removeHTML(document.getElementById("nodeMain"))
        this.dataList = [];
        this.activeCityName = cityName;
        this.group = [];
        this._relayListByCity(cityName);
      }
    },
    deviceNoteInfo(info) {
      if (this.activeDevice) {
        let liListHtml = '';
        info.map((item, index) => {
          if(item.name && item.value) {
            liListHtml += `<li>${item.name}: ${item.value}</li>`;
          }
        });
        this.note.setHtml(`<ul class="networkList-notewrapper">${liListHtml}</ul>`);
        this.setNoteVisibe(true);
      }
    }
  },
  methods: {
    init() {
      level_1 = 0,
      level_2 = 0,
      level_3 = 0,
      level_4 = 0,
      level_5 = 0;
      
      ht.Default.setImage('cloud', cloud);
      ht.Default.setImage('warning', {
            width: 100,
            height: 100,
            visible: { func: 'attr@warning.visible'},
            comps: [
                {
                    type: 'triangle',
                    rect: [2, 2, 96, 96],
                    background: { 
                        value : 'red',
                        func: 'attr@alarm.color'
                    }
                },
                {
                    type: 'rect',
                    rect: [45, 30, 10, 40],
                    background: 'white'
                },                        
                {
                    type: 'circle',
                    rect: [40, 72, 20, 20],
                    background: 'white'
                }
            ]
        });

      const _this = this;
      // 鹰眼
      function ToggleOverview(graphView) {
        var self = this;
        ToggleOverview.superClass.constructor.apply(self, [graphView]);                
        self._expand = true;
        
        var div = document.createElement("div");
        div.style.setProperty("width", "24px", null);
        div.style.setProperty("height", "24px", null);
        div.style.setProperty("position", "absolute", null);
        div.style.setProperty("right", "0", null);
        div.style.setProperty("top", "0", null);
        div.style.setProperty("background",  `url(${shrink}) no-repeat`, null);
        div.style.setProperty("background-position", "center center", null);                
        self._view.appendChild(div);
        
        function handleTransitionEnd(e) {
            if (e.propertyName === "width"){
                self.invalidate();
            }                    
        }
        self._view.addEventListener("webkitTransitionEnd", handleTransitionEnd, false);
        self._view.addEventListener("transitionend", handleTransitionEnd, false);
        var eventName = ht.Default.isTouchable ? "touchstart" : "mousedown";
        div.addEventListener(eventName, function(e) {
            if (self._expand) {
                self._view.style.setProperty("width", "24px", null);
                self._view.style.setProperty("height", "24px", null);
                self._canvas.style.setProperty("opacity", "0", null);
                self._mask.style.setProperty("opacity", "0", null);
                div.style.setProperty("background-image", `url(${expand})`, null);
                div.style.setProperty("width", "24px", null);
                div.style.setProperty("height", "24px", null);
                self._expand = false;
            } else {
                self._view.style.setProperty("width", "", null);
                self._view.style.setProperty("height", "", null);
                self._canvas.style.setProperty("opacity", "1", null);
                self._mask.style.setProperty("opacity", "1", null);
                div.style.setProperty("background-image", `url(shrink)`, null);
                div.style.setProperty("width", "24px", null);
                div.style.setProperty("height", "24px", null);
                self._expand = true;
            }                    
            self.invalidate();                     
            e.stopPropagation();
        });
        self.setContentBackground("white");
      }
      ht.Default.def(ToggleOverview, ht.graph.Overview, {});

      let borderPane = new ht.widget.BorderPane(),
      innerBorder = new ht.widget.BorderPane();
      this.graphView = new ht.graph.GraphView(this.dataModel)
      let overview = new ToggleOverview(this.graphView);

      innerBorder.setTopView(this.toolbar, 40);
      innerBorder.setCenterView(this.graphView);
      borderPane.setCenterView(innerBorder, '300px');
      // 布局
      this.view = borderPane.getView();
      let eyeOverview = overview.getView();
      this.graphView.fitContent(true);

      this.view.className = "main";
      this.view.style.left = 0;
      this.view.style.top = 0;
      this.view.style.right = 0;
      this.view.style.bottom = 0;

      let _node = document.createElement('div');
      _node.id = "nodeMain";
      _node.style.position = 'absolute';
      _node.style.top =  `${this.topHeight}px`;
      _node.style.left = '20px';
      _node.style.height = '500px';
      _node.style.width = 'calc(100% - 40px)';
      _node.style.overflow = 'hidden';
      _node.style.border = '1px solid #d4d4d4';

      eyeOverview.className = "networkList-overview networkList-animation";

      document.getElementById("indexPage").appendChild(_node);
      document.getElementById("indexPage").appendChild(eyeOverview);
      document.getElementById("nodeMain").appendChild(this.view);
      document.getElementById("nodeMain").appendChild(eyeOverview);

      this.dataModel.addScheduleTask(warning)  // 启动调度任务
      window.addEventListener(
        "resize",
        e => {
          this.setChildren(this.view);
          this.graphView.fitContent();
        },
        false
      );

      // 新建note弹窗
      this.setNoteVisibe(false);
      this.note.setLayer('higher');
      this.dataModel.add(this.note);

      let contextmenu = new ht.widget.ContextMenu();
      contextmenu.enableGlobalKey();
      contextmenu.beforeShow = function(e) {
        var data = _this.graphView.getDataAt(e);
        const menuJson = [{
          label: "查看端口详细信息",
          action: function(item, event) {
            _this.$emit('getEdgeName', data._id);
          },
        }];
        if (data instanceof ht.Edge) {
          this.setItems(menuJson);
        } else {
          this.setItems(null);
        }
      };
      contextmenu.addTo(this.view);

      // graphView监听
      this.graphView.mi((e) => {
        if(e.kind === 'clickData'){
            let data = e.data;
            let attrObjects = data.getAttrObject();
            this.setNodeStatus(data);
        } else if (e.kind === 'clickBackground') {
            this.setNoteVisibe(false);
        }
      });
      this.graphView.enableFlow(60);

      this.graphView.getLabel = function(data){
          if(data instanceof ht.Edge){
              if(data.isEdgeGroupAgent()){
                  return data.getEdgeGroupSize() + ' become 1';
              }
          }
          return data.getName();
      };
      this.setView();

      // toolbar 工具条
      this.creatToolbar();
    },
    setChildren(view) {
      const children = view.children;
      for (let i = 0; i < children.length; i++) {
        if(children[i].tagName === "DIV") children[i].style.width='100%';
        if(children[i].children.length > 0) {
          this.setChildren(children[i]);
        }
      }
    },
    setSelectStyle(data) {
      data.setStyle('select.color', '#ff0000');
      data.setStyle('select.width', 3);
    },
    setNodeStatus(data) {
      if(data instanceof ht.Node && !(data instanceof ht.HtmlNode)){
        this.setSelectStyle(data);
        this.$emit('getDeviceName', data.getId());
        this.activeDevice = data.getId();
        this.note.setPosition(data._position.x + 150, data._position.y + 90);
      }
      if (data instanceof ht.Edge) {
        this.setSelectStyle(data);
        this.setNoteVisibe(false);
      }
    },
    setView() {
      this.finder = new ht.QuickFinder(this.dataModel, "id");

      const list = this.dataList;
      this.getLevel();
      list.forEach((item, index) => {
        let a, z;
        const itemA = item.circuitADevice;
        const itemZ = item.circuitZDevice;
        const first = this.finder.find(itemA).length === 0 || this.finder.find(itemZ).length === 0;
        if (this.finder.find(itemA).length === 0) {
          a = this.creatNode(
            item.id,
            item.circuitADevice,
            item.aDisPlayName,
            item.aDevel,
            item.aDeviceAlarmStatus,
            index
          );
        } else {
          a = this.finder.findFirst(itemA);
        }

        if (this.finder.find(itemZ).length === 0) {
          z = this.creatNode(
            item.id,
            item.circuitZDevice,
            item.zDisPlayName,
            item.zDevel,
            item.zDeviceAlarmStatus,
            index
          );
        } else {
          z = this.finder.findFirst(itemZ);
        }
        this.creatEdge(a, z, first, item.relayId);
      });
    },
    getLevel() {
      let array = {};
      this.dataList.find(list => {
        ['a', 'z'].map(letter => {
          let devel = list[`${letter}Devel`];
          let name = list[`circuit${letter.toUpperCase()}Device`]
          if (array[devel]) {
            if(array[devel].indexOf(name) === -1) array[devel].push(name);
          } else {
            array[devel] = [name];
          }
        });
      });
      this.devel = array;
      let mustDevel = Object.keys(this.devel).filter(item => {
        return this.devel[item].length > 13;
      });
      this.devel = {
        ...this.devel,
        'mustDevel': mustDevel
      };
    },
    // 拓扑图数据
    _relayListByCity(cityName) {
      if(cityName) {
        relayListByCity(cityName).then(res => {
          if (res.code === "200") {
            this.dataList = res.data;
            this.init();
          }
        });
      }
    },
    // 拓扑
    creatNode(id, deviceName, name, level, warnStatus) {
      let node = new ht.Node();
      node.setName(name);
      node.setId(deviceName);
      node.s({
        // 'shape': 'rect',
        'label.position': 17
      })
      node.a('id', id);
      if(!!warnStatus)  {
        // 添加警告
        this.setIcon(node, ['warning'])
        // 设置attr备注
        node.a({
          'warning.enabled': true,
          'warning.visible' : true
        })
      }
      let position = {};
      switch (level) {
        case 1:
          position = this.getPosition(1, level_1);
          node.setPosition(position.x, position.y);
          level_1 += 1;
          break;
        case 2:
          position = this.getPosition(2, level_2);
          node.setPosition(position.x, position.y);
          level_2 += 1;
          break;
        case 3:
          position = this.getPosition(3, level_3);
          node.setPosition(position.x, position.y);
          level_3 += 1;
          break;
        case 4:
          position = this.getPosition(4, level_4);
          node.setPosition(position.x, position.y);
          level_4 += 1;
          break;
        case 5:
          position = this.getPosition(5, level_5);
          node.setPosition(position.x, position.y);
          level_5 += 1;
          break;
      }
      this.dataModel.add(node);
      return node;
    },
    getPosition(num, level) {
      let parity = false,
       x = 0,
       y = 0;
      const circuitList = parseInt(this.devel[num].length, 10);
       if(this.devel['mustDevel'].indexOf(`${num}`) > -1) {
         const yNum = (circuitList / 4);
          parity = level % 2 === 0;
          x = level * 150 - ((circuitList / 2) * 140);
          y = parity ? yNum * 110 : yNum * 90;
       } else {
         let yNextNum = num;
         if(this.devel['mustDevel'].indexOf(`${num - 1}`) > -1){
           const prevList = parseInt(this.devel[num - 1].length, 10);
           yNextNum = (prevList / 4) + ((prevList / 4) > 5 ? 3 : 2);
         };
         x = level * 100 - ((circuitList / 2) * 100);
         y = yNextNum * 100;
       }
      return {
        x,
        y
      };
    },
    // 线
    creatEdge(start, target, frist = true, relayId) {
      let edge;
      edge = new ht.Edge(start, target);
      const sName = start._name;
      const tName = target._name;
      const sId = start.getAttrObject().id;
      const tId = target.getAttrObject().id;
      const _group = this.group.find(group => {
        return (group.sName === sName || group.sName == tName) && (group.tName === tName || group.tName == sName) && (group.id == `${sId}&${tId}` || group.id == `${tId}&${sId}`);
      });
      const groupIndex = this.group.indexOf(_group);
      if (frist || _group === undefined) {
        this.group.push({
          id: `${sId}&${tId}`,
          sName,
          tName,
          toogle: false,
        });
      } else if(_group !== undefined && groupIndex > -1 && this.group[groupIndex].toogle === false){
        this.group[groupIndex].toogle = true;
        edge.toggle();
      }
      edge.setId(relayId);
      edge.s({
        flow: true,
        "flow.count": 1,
        "flow.element.background": "rgba(39,236,16,1)",
        "flow.element.shadow.max": 0,
        "flow.element.max": 5,
        "flow.element.count": 1,
      });
      this.dataModel.add(edge);
      return edge;
    },
    setIcon(el, name, pos) {
      el.setStyle('icons', {
        flags: {
            position: 0,
            names: name,
            width: 20,
            height: 20,
            offsetY: pos ? pos.y : 30,
            offsetX: pos ? pos.x : 5
        }
      })
    },
    // 设置note弹窗显示
    setNoteVisibe(visible, id) {
      if (!!id) {
        this.activeDevice = id;
      } else {
        this.activeDevice = null;
      }
      this.note.s('2d.visible',visible);
    },
    layout(type) {
      const _this = this;
      moreDomType = 'circular';
      let autoLayout = new ht.layout.AutoLayout(this.graphView);
      autoLayout.layout(type, function(){
        _this.creatToolbar();
        _this.graphView.fitContent(true);
      });
    },
    creatToolbar() {
      const _this = this;
      this.zoomValue = this.graphView.getZoom();
      if(!ht.Default.isTouchable){
        const toolbarView = this.toolbar.getView();
        toolbarView.style.background = '#F5F7FA';
      }
      this.toolbar.getSelectBackground = function(item){ return '#67c23a'; };
      this.toolbar.setItems([                    
        // {                        
        //     label: '图例',
        //     toolTip: 'legend',
        //     disabled: true,
        //     action: function(){
        //     }
        // },
        // 'separator',
        // {                        
        //     label: '后退',
        //     toolTip: 'back',
        //     disabled: true,
        //     action: function(){
        //        _this.getBack();
        //     }
        // },
        // 'separator',
        {
            id: 'yuanxing',
            label: '圆形布局',
            toolTip: 'circular',
            disabled: false,
            action: function() {
              _this.layout(this.toolTip);
            }
        },
        {
            id: 'cenci',
            label: '层次布局',
            toolTip: 'hierarchical',
            action: function() {
              _this.layout(this.toolTip);
            }
        },
        'separator',
        {                        
            label: '放大',
            toolTip: 'big',
            selected: this.bigSelect,
            action: () => {
              this.zoomValue += 0.1;
              this.graphView.setZoom(this.zoomValue);
            }
        },
        {                        
            label: '缩小',
            toolTip: 'narrow',
            selected: this.narrowSelect,
            action: () => {
              if (this.zoomValue === 0.1) return;
              this.zoomValue -= 0.1;
              this.graphView.setZoom(this.zoomValue);
            }
        },
        {                        
            label: '自适应',
            toolTip: 'adaptive',
            action: () => {
              this.zoomValue = 1;
              this.graphView.setZoom(this.zoomValue);
              this.graphView.fitContent(true);
            }
        },
        'separator',
        {
            id: 'image',
            label: '保存到图片',
            action: () => {
              var doc = window.open().document;
              doc.open();
              doc.write("<img src='" + this.graphView.toDataURL() + "'/>");
              doc.close();
              doc.body.style.margin = '0';
              doc.title = 'Export image at ' + new Date();
            }
        },
        // {
        //     id: 'address',
        //     label: '保存位置',
        //     disabled: true,
        // },
        'separator',
        {
            id: 'text',
            textField: {
                width: 120
            },
        },
        {                        
            type: 'toggle',
            label: '检索',
            toolTip: 'search',
            action: function(){
              const inputVal = _this.toolbar.getValue('text');
              if(!!inputVal) {
                const finderObj = _this.finder.find(inputVal);
                _this.graphView.sm().as(finderObj.get(0));_this.setSelectStyle(finderObj.get(0));
                _this.setNodeStatus(finderObj.get(0))
              } else {
                _this.$message({ message: "无检索数据！", type: "warning" });
              }
            }
        },
      ]);
      this.toolbar.enableToolTip();  
    },
    getBack() {
      this.historyManager.setHistoryIndex(1);
      // this.toolbar.redraw();
    }
  }
};
</script>


<style lang="less" scoped>
html,
body {
  padding: 0px;
  margin: 0px;
  height: 500px;
}
ul,li{
  list-style: none;
}
.main {
  margin: 0px;
  padding: 0px;
  position: absolute;
  top: 0px;
  bottom: 0px;
  left: 0px;
  right: 0px;
  height: 500px;
}
</style>

