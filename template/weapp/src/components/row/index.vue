<template>
  <view class="rowx">
    <view
      class="row"
      v-for="(item, i) in listValue.filter(item => !item.hide)"
      :class="{ column: item.column }"
      :key="i"
    >
      <!-- 左侧 -->
      <view class="itemLeft" :style="'width:' + (item.nameWidth || nameWidth)">
        <image class="icon" v-if="item.img" :src="item.img" />
        <view class="flex flexAlignCenter flexJustifyCenter iconView" v-else-if="item.icon">
          <AtIcon
            prefixClass="icon"
            :value="item.icon.value || 'chevron-down'"
            :size="item.icon.size || 12"
            class="iconfont"
            :color="item.icon.color || '#6C6C6C'"
          ></AtIcon>
        </view>
        <text class="name" v-if="item.name">{{ item.name }}</text>
      </view>
      <!-- 右侧 -->
      <view
        class="value"
        :class="{ valueNoOverflow: !valueNoOverflow, 'value--emptyName': !item.name, [state.align]: true }"
        @click="clickRowRight(item)"
      >
        <slot :name="item.slotname" :row="item" :datas="form" :index="i">
          <inputVue
            v-if="!item.type || item.type === 'text'"
            class="at-input ellipsis"
            :class="item.isShowArrow ? 'arrow-class' : ''"
            v-model="formValue[item.prop]"
            :disabled="item.disabled"
            @change="changeValue"
          />

          <Picker
            class="picker"
            v-if="item.type === 'picker'"
            :disabled="item.disabled"
            mode="selector"
            :range="
              item.options.constructor === Array ? item.options.map(e => e.name) : item.options
            "
            @change="pickerChange($event, item)"
          >
            <AtList class="atlist">
              <AtListItem
                :extraText="
                  (item.options.constructor === Array
                    ? item.options.find(e => {
                        return e.id === formValue[item.prop]
                      })?.name
                    : formValue[item.prop]) || '请选择'
                "
              />
            </AtList>
          </Picker>

          <Picker
            class="picker"
            v-if="item.type === 'date'"
            :disabled="item.disabled"
            :range="ranges"
            mode="date"
            @change="pickerDateChange($event, item)"
          >
            <AtList>
              <AtListItem :extraText="formValue[item.prop] || '请选择'" />
            </AtList>
          </Picker>
          <TimePicker
            v-if="item.type === 'datetime'"
            :min-date="item.minDate ? item.minDate : null"
            @onDateChange="$event => pickerDateChange($event, item)"
          >
            <AtList>
              <AtListItem :extraText="formValue[item.prop] || '请选择'" />
            </AtList>
          </TimePicker>
          <RegionPicker
            v-if="item.type === 'region'"
            border
            @onAreaChange="e => onAreaChange(e, item)"
            class="regionPicker"
          >
          </RegionPicker>
          <AtTextarea
            v-if="item.type === 'textArea'"
            :disabled="item.disabled"
            :value="formValue[item.prop] || ''"
            :maxLength="item.maxlength || 200"
            :placeholder="item.placeholder || '请输入'"
            @change="string => atTextareaChangeValue(string, item)"
          />
          <textarea
            v-show="false"
            :value="formValue[item.prop]"
            :maxLength="item.maxlength || 200"
            :placeholder="item.placeholder || '请输入'"
          >
          <!-- 这里不能删除，因为没有原生的，上面的组件可能就不会出来，暂时没找到是什么原因 -->
          </textarea>
          <label
            v-for="it in item.options"
            :key="it.id"
            class="checkbox-list__label"
            v-if="item.type === 'labelCheckbox'"
            @change="string => labelCheckboxChangeValue(string, item)"
          >
            <checkbox
              class="checkbox-list__checkbox"
              :value="it.id"
              :checked="it.checked || false"
              :disabled="item.disabled"
              >{{ it.name }}</checkbox
            >
          </label>
          <view v-if="item.type === 'checkbox'" class="checkbox" @click="isOpened = true">
            <!-- <text>{{ isOpened }}</text> -->
            <text class="ellipsis text">{{
              item.options
                .filter(e => formValue[item.prop]?.indexOf(e.id) > -1)
                .map(e => e.name)
                .join(',') || '请选择'
            }}</text>
          </view>

          <!-- style="width: 200px; height: 100px" -->
          <AtImagePicker
            class="rowImageClass"
            v-if="item.type === 'image'"
            :multiple="item.multiple || false"
            :length="item.length || 1"
            :files="formValue[item.prop] || []"
            @change="imageChangeValue"
            @fail="imageFail"
            @imageClick="onImageClick"
          />

          <View class="img-container" v-if="item.type === 'images'">
            <img v-if="item.isImgUrl" class="rowImageClass-img" :src="formValue[item.prop]" />
            <img
              class="rowImageClass-img"
              v-else
              :src="img"
              v-for="(img, idx) in formValue[item.prop]"
              :key="idx"
            />

            <view class="rowImageClass" @click="myChooseImage(item)">
              <AtIcon
                prefixClass="icon"
                :value="'jiahao'"
                :size="30"
                class="iconfont"
                :color="'#707070'"
              ></AtIcon>
            </view>
          </View>

          <View class="img-container" v-if="item.type === 'imagesId'">
            <img
              v-if="item.fileList"
              class="rowImageClass-img"
              :src="fileObj.url"
              v-for="(fileObj, idx) in item.fileList"
              :key="idx"
            />

            <view class="rowImageClass" @click="myChooseImageId(item)" v-if="!item.disabled">
              <AtIcon
                prefixClass="icon"
                :value="'jiahao'"
                :size="30"
                class="iconfont"
                :color="'#707070'"
              ></AtIcon>
            </view>
          </View>
          <AtIcon
            v-if="item.isShowArrow"
            prefixClass="icon"
            :value="'youbianjiantou'"
            :size="12"
            class="iconfont arrow-icon"
            :color="'#6C6C6C'"
          ></AtIcon>
        </slot>
      </view>
    </view>
    <view
      v-if="hasToggle && list.length > expandFromRow"
      class="flex flexAlignCenter flexJustifyCenter toggle-control"
    >
      <AtButton
        @click="toggleRows"
        class="flex flexAlignCenter flexJustifyCenter"
        :class="{ expanded: state.isExpanded }"
      >
        {{ state.isExpanded ? '收起' : '展开' }}
        <AtIcon
          prefixClass="at-icon"
          :value="state.isExpanded ? 'chevron-up' : 'chevron-down'"
          :size="15"
          :color="'#0051AA'"
        ></AtIcon>
      </AtButton>
    </view>
  </view>
</template>

<script>
import { ref, watch, reactive, computed } from 'vue'

import { AtList, AtListItem, AtTextarea, AtIcon, AtImagePicker, AtButton } from 'taro-ui-vue3'
import TimePicker from 'comp/timePick/index.vue'
import RegionPicker from '@/components/regionPicker/index.vue'
import inputVue from 'comp/input/index.vue'

import { Picker } from '@tarojs/components'
import { fileInitupload } from '@/api/fireDetails/index.js'
import Taro from '@tarojs/taro'

import './index.scss'

export default {
  name: 'rowView',
  components: {
    Picker,
    AtList,
    AtListItem,
    AtTextarea,
    inputVue,
    AtIcon,
    AtButton,
    AtImagePicker,
    TimePicker,
    RegionPicker,
  },
  props: {
    list: {
      type: Array,
    },
    form: {
      type: Object,
    },
    nameWidth: {
      type: String,
    },
    valueNoOverflow: {
      type: Boolean,
    },
    expandFromRow: {
      type: Number,
      default: 6,
    },
    hasToggle: {
      type: Boolean,
      default: false,
    },
    align: {
      type: String,
      default: 'left',
    },
  },
  setup(props, { emit }) {
    // watch(
    //   () => {
    //     return props.list
    //   },
    //   (now, old) => {
    //     // 处理一下数据
    //     handleData()
    //     listValue.value = now
    //   }
    // )

    watch(
      () => {
        return props.form
      },
      (now, old) => {
        formValue.value = now
      }
    )

    // 列表
    // const listValue = ref(props.list)
    const formJson = {}
    props.list.forEach(e => {
      formJson[e.prop] = ''
    })

    // 展开收起功能
    const state = reactive({
      isExpanded: false,
      align: props.align,
    })
    const listValue = computed(() => {
      if (!props.hasToggle || state.isExpanded || props.list.length <= props.expandFromRow) {
        return props.list
      } else {
        return props.list.slice(0, props.expandFromRow)
      }
    })

    const toggleRows = () => {
      if (props.hasToggle) {
        state.isExpanded = !state.isExpanded
      }
    }

    // 值
    const formValue = ref({ ...formJson, ...props.form })
    props.list.forEach(e => {
      if (e.type === 'imagesId') {
        if (formValue.value[e.prop]) {
          e.fileList.push({
            fileId: formValue.value[e.prop],
            url: `${process.env.TARO_APP_PATH}/api/V1/file/download/${formValue.value[e.prop]}`,
          })
        }
      }
    })

    const pickerChange = function (event, item) {
      if (item.options.constructor === Array) {
        // item.value = item.options[event.detail.value].id
        formValue.value[item.prop] = item.options[event.detail.value].id
      } else {
        // item.value = item.options[event.detail.value]
        formValue.value[item.prop] = item.options[event.detail.value]
      }
      // emit('update:list', props.list)
      changeValue()
    }

    const pickerDateChange = function (event, item) {
      formValue.value[item.prop] = event.detail.value
      changeValue()
    }

    const onAreaChange = (e, item) => {
      console.log('onAreaChange', e, item)
      const { province, city, district, street } = e;
      formValue.value[item.prop] = street.id || district.id || city.id || province.id;
      changeValue();
    }

    const changeValue = function () {
      console.log('formValue.value', formValue.value)
      emit('update:form', formValue.value)
    }

    const atTextareaChangeValue = function (str, item) {
      formValue.value[item.prop] = str
      changeValue()
    }

    const labelCheckboxChangeValue = (str, item) => {
      console.log('labelCheckboxChangeValue', str, item)
      formValue.value[item.prop] = str
      changeValue()
    }

    // 右边的row点击事件
    const clickRowRight = function (item) {
      emit('clickRowRight', item)
    }

    // -------------- 多选内容代码
    const isOpened = ref(false)
    const changeCheckbox = function (e, item) {
      formValue.value[item.prop] = e
      isOpened.value = false
      changeValue()
    }
    // ------------------

    // files 值发生变化触发的回调函数,
    // operationType 操作类型有添加，移除，如果是移除操作，则第三个参数代表的是移除图片的索引
    // (files: Array, operationType: string, index: number) => void
    const imageChangeValue = function (files, operationType, index) {
      // console.log('files', files)
      // console.log('operationType', operationType)
      // console.log('index', index)
      changeValue()
    }
    // 图片上传失败 （选择失败触发的回调）	(msg: string) => void
    const imageFail = function () {}
    // 点击图片触发的回调 	(index: number, file: Object) => void
    const onImageClick = function () {}

    const onSuccess = (res, item) => {
      const data = JSON.parse(res.data)
      if (!formValue.value[item.prop]) {
        formValue.value[item.prop] = []
      }
      if (formValue.value[item.prop].constructor === Array) {
        formValue.value[item.prop].push(
          `${process.env.TARO_APP_PATH}/api/V1/file/download/${data.fileId}`
        )
      } else {
        formValue.value[item.prop] = [
          `${process.env.TARO_APP_PATH}/api/V1/file/download/${data.fileId}`,
        ]
      }

      if (item.length && item.length < formValue.value[item.prop].length) {
        // 如果超过限制上传的数量，就从第一位移除一个元素
        formValue.value[item.prop].shift()
      }
    }

    const onFail = err => {
      console.error(err)
    }
    // 选择图片
    const myChooseImage = item => {
      wx.chooseImage({
        success(res) {
          const tempFilePaths = res.tempFilePaths
          const parames = {
            files: tempFilePaths,
          }
          fileInitupload(parames).then(res => {
            // let params = {
            //   fileId: res.fileId,
            //   file: tempFilePaths,
            //   md5: new Date().getTime(),
            // }
            wx.uploadFile({
              url: `${process.env.TARO_APP_PATH}/api/V1/file/upload?fileId=${res.fileId}`, // 真实的接口地址
              filePath: tempFilePaths[0],
              name: 'file',
              formData: {
                //需要补充内容。
                // fileId: res.fileId,
                // file: tempFilePaths,
                // md5: new Date().getTime(),
              },
              header: {
                'content-type': 'multipart/form-data', // 设置请求的header
                'iffrobot-auth-token': Taro.getStorageSync('iffrobotAuthToken'),
              },
              success(res) {
                //do something
                onSuccess(res, item)
              },
              fail(err) {
                onFail(err)
              },
            })
          })
        },
      })
    }

    const onSuccessId = (res, item) => {
      const data = JSON.parse(res.data)
      if (!formValue.value[item.prop]) {
        formValue.value[item.prop] = []
      }
      if (formValue.value[item.prop].constructor === Array) {
        formValue.value[item.prop].push(data.fileId)
      } else {
        formValue.value[item.prop].push(data.fileId)
      }

      // 为了显示用的
      if (!item.fileList) {
        item.fileList = []
      }
      if (item.fileList.constructor === Array) {
        item.fileList.push({
          fileId: data.fileId,
          url: `${process.env.TARO_APP_PATH}/api/V1/file/download/${data.fileId}`,
        })
      } else {
        item.fileList = [
          {
            fileId: data.fileId,
            url: `${process.env.TARO_APP_PATH}/api/V1/file/download/${data.fileId}`,
          },
        ]
      }

      if (item.length && item.length < item.fileList.length) {
        // 如果超过限制上传的数量，就从第一位移除一个元素
        formValue.value[item.prop].shift()
        item.fileList.shift()
      }
    }

    const onFailId = err => {
      console.error(err)
    }
    // 选择图片
    const myChooseImageId = item => {
      wx.chooseImage({
        success(res) {
          const tempFilePaths = res.tempFilePaths
          const parames = {
            files: tempFilePaths,
          }
          fileInitupload(parames).then(res => {
            wx.uploadFile({
              url: `${process.env.TARO_APP_PATH}/api/V1/file/upload?fileId=${res.fileId}`, // 真实的接口地址
              filePath: tempFilePaths[0],
              name: 'file',
              formData: {
                //需要补充内容。
                // fileId: res.fileId,
                // file: tempFilePaths,
                // md5: new Date().getTime(),
              },
              header: {
                'content-type': 'multipart/form-data', // 设置请求的header
                'iffrobot-auth-token': Taro.getStorageSync('iffrobotAuthToken'),
              },
              success(res) {
                //do something
                onSuccessId(res, item)
              },
              fail(err) {
                onFailId(err)
              },
            })
          })
        },
      })
    }

    return {
      state,
      isOpened,
      listValue,
      formValue,
      pickerChange,
      pickerDateChange,
      onAreaChange,
      changeValue,
      clickRowRight,
      changeCheckbox,
      imageChangeValue,
      imageFail,
      onImageClick,
      atTextareaChangeValue,
      labelCheckboxChangeValue,
      myChooseImage,
      myChooseImageId,
      toggleRows,
    }
  },
}
</script>
