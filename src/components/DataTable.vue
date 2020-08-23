<template>
  <table :class="['v-datatable-light', css.table]">
    <thead :class="css.thead" :style="theadStyle">
      <tr :class="css.theadTr">
        <th
          v-for="(item, columnIndex) in headers"
          :key="item.label"
          :class="[css.theadTh, `header-column-${columnIndex}`]"
          :style="getColumnWidth(item)"
          >
          <!-- header free text -->
          <div v-if="!isFieldSpecial(item.name) && !item.customHeader" :class="[css.thWrapper, `header-column-${columnIndex}`]" @click="orderBy(item.name)">
            {{ item.label }}
            <div v-if="item.sortable" :class="arrowsWrapper(item.name, css.arrowsWrapper)">
              <div v-if="showOrderArrow(item, 'desc')" :class="css.arrowUp" />
              <div v-if="showOrderArrow(item, 'asc')" :class="css.arrowDown" />
            </div>
          </div>
          <!-- end header free text -->
          <!-- header custom header -->
          <div v-if="!isFieldSpecial(item.name) && item.customHeader" :class="[css.thWrapper, `header-column-${columnIndex}`]" @click="orderBy(item.name)">
            <slot
              v-if="item.customHeader"
              :header-data="item"
              :name="customHeaderName(item)"
            />
            <div v-if="item.sortable" :class="arrowsWrapper(item.name, css.arrowsWrapper)">
              <div v-if="showOrderArrow(item, 'desc')" :class="css.arrowUp" />
              <div v-if="showOrderArrow(item, 'asc')" :class="css.arrowDown" />
            </div>
          </div>
          <!-- end header custom header -->
        </th>
      </tr>
    </thead>
    <tbody :class="css.tbody" :style="tbodyStyle">
      <!-- spinner slot -->
      <template v-if="isLoading">
        <tr :class="css.tbodyTrSpinner">
          <td :colspan="headers.length" :class="css.tbodyTdSpinner">
            <slot name="spinner"/>
          </td>
        </tr>
      </template>
      <!-- end spinner slot -->
      <!-- table rows -->
      <template v-else-if="data.length">
        <tr v-for="(item, index) in data" :key="index" :class="[css.tbodyTr, `row-${index}`]">
          <td
            v-for="(key, columnIndex) in headers"
            :key="`${index}-${key.name}`"
            :class="[css.tbodyTd, `column-${columnIndex}`]"
            :style="getColumnWidth(key)">

            <img v-if="isFieldSpecial(key.name)&& extractArgs(key.name) === 'avatarUrl'"
              v-bind:src="item[extractArgs(key.name)]" style="width:100px"/>

            <slot v-if="isTotalCount(key.name)">{{ extractTotalCount(item[extractTotalCountID(key.name)]) }}</slot>

            <slot v-if="key.name === 'repositories.totalDiskUsage'">{{ extractDiskUsage(item) }}</slot>

            <span
              v-if="isFieldHTML(key.name)"
              v-html="item[extractHtmlID(key.name)]"
            />

            <slot
              v-if="isFieldSpecial(key.name) && extractArgs(key.name) === 'actions'"
              :name="extractActionID(key.name)"
              :row-data="item"
              :row-index="index"
            />

            <template v-else-if="key.format">{{ key.format(item[key.name]) }}</template>
            <template v-else>{{ item[key.name] }}</template>
          </td>
        </tr>
      </template>
      <!-- end table rows -->
      <!-- table not found row -->
      <template v-else>
        <tr :class="css.notFoundTr">
          <td :colspan="headers.length" :class="css.notFoundTd">{{ notFoundMessage }}</td>
        </tr>
      </template>
      <!-- end table not found row -->
    </tbody>
    <tfoot v-if="hasSlots" :class="css.tfoot">
      <tr :class="css.tfootTr">
        <th :colspan="headers.length" :class="css.tfootTd">
          <div :class="css.footer">
            <slot name="ItemsPerPage"/>
            <slot name="pagination"/>
            <span style="width:200px"> User Count: {{ userCount }} </span>
          </div>
        </th>
      </tr>
    </tfoot>
  </table>
</template>
<script>
export default {
  name: 'DataTable',
  props: {
    headerFields: {
      type: Array,
      required: true
    },
    data: {
      type: Array,
      required: true
    },
    isLoading: {
      type: Boolean,
      default: false
    },
    sortField: {
      type: String,
      default: null
    },
    sort: {
      type: String,
      default: null
    },
    notFoundMsg: {
      type: String,
      default: null
    },
    trackBy: {
      type: String,
      default: 'id'
    },
    css: {
      type: Object,
      default: () => ({
        table: '',
        thead: 'thead',
        theadTr: 'thead-tr',
        theadTh: 'thead-th',
        tbody: 'tbody',
        tbodyTr: 'tbody-tr',
        tbodyTrSpinner: 'tbody-tr-spinner',
        tbodyTd: 'tbody-td',
        tbodyTdSpinner: 'tbody-td-spinner',
        tfoot: 'tfoot',
        tfootTd: 'tfoot-td',
        tfootTr: 'tfoot-tr',
        footer: 'footer',
        thWrapper: 'th-wrapper',
        arrowsWrapper: 'arrows-wrapper',
        arrowUp: 'arrow-up',
        arrowDown: 'arrow-down',
        notFoundTr: 'not-found-tr',
        notFoundTd: 'not-found-td'
      })
    },
    tableHeight: {
      type: String,
      default: null
    },
    defaultColumnWidth: {
      type: String,
      default: '150px'
    },
    onlyShowOrderedArrow: {
      type: Boolean,
      default: false
    },
    userCount: {
      type: Number,
      default: 0
    }
  },

  data: function () {
    return {
      sortedField: this.sortField,
      sortedDir: this.sort,
      notFoundMessage: this.notFoundMsg,
      loading: this.isLoading
    }
  },

  computed: {
    hasSlots: function () {
      return (
        this.$slots.pagination !== undefined ||
        this.$slots.ItemsPerPage !== undefined
      )
    },

    headers: function () {
      if (
        this.headerFields &&
        this.headerFields.constructor === Array &&
        this.headerFields.length
      ) {
        return Object.keys(this.headerFields).map(key => {
          const field = this.headerFields[key]
          if (typeof field === 'string') {
            return { label: field, name: field }
          }
          return field
        })
      }
      return []
    },
    tbodyStyle: function () {
      if (this.tableHeight) {
        return {
          height: this.tableHeight,
          display: 'block',
          overflowX: 'auto'
        }
      }
      return null
    },
    theadStyle: function () {
      return this.tableHeight ? { display: 'block' } : null
    }
  },

  methods: {
    arrowsWrapper: function (field, className) {
      if (this.sortedField === field && this.sortedDir) {
        return `${className} centralized`
      }
      return className
    },

    updateData: function () {
      const params = {
        sortField: this.sortedField,
        sort: this.sortedDir
      }

      this.$emit('on-update', params)
    },

    orderBy: function (field) {
      if (this.isFieldSortable(field)) {
        if (this.sortedField === field) {
          this.sortedDir = this.sortedDir === 'asc' ? 'desc' : 'asc'
        } else {
          this.sortedDir = 'desc'
          this.sortedField = field
        }
        this.updateData()
      }
    },

    isFieldSortable: function (field) {
      const foundHeader = this.headerFields.find(item => item.name === field)
      return foundHeader && foundHeader.sortable
    },

    headerItemClass: function (item, className = '') {
      return item && item.sortable ? className : `${className} no-sortable`
    },

    isFieldSpecial: field => field.indexOf('__') > -1,

    isFieldHTML: field => field.split('.')[1],

    isTotalCount: field => field.indexOf('totalCount') > -1,

    extractArgs: string => string.split(':')[1],

    extractActionID: string => {
      const list = string.split(':');
      return list.length === 3 ? list[2] : 'actions';
    },

    extractHtmlID: string => {
      const list = string.split('.');
      return list[1] === 'html' ? list[0] : null;
    },

    extractAvatarID: string => {
      const list = string.split(':');
      return list.length === 3 ? list[2] : 'avatarUrl';
    },

    extractTotalCountID: string => {
      const list = string.split('.');
      return list[1] === 'totalCount' ? list[0] : string;
    },

    extractTotalCount: function(item){
      return item ? item.totalCount.toString() : '0';
    },

    extractDiskUsage: function(item){
      return item.repositories ? item.repositories.totalDiskUsage.toString() + ' KB' : '0 KB';
    },

    getColumnWidth: function (item) {
      if (this.tableHeight) {
        return { width: item.width || this.defaultColumnWidth }
      }
    },

    customElementName: ({ customElement, name }) => typeof customElement === 'string' ? customElement : name,

    customHeaderName: ({ customHeader, name }) => typeof customHeader === 'string' ? customHeader : `${name}:header`,

    showOrderArrow: function (item, sortDir) {
      if (this.onlyShowOrderedArrow) {
        return this.sortedField === item.name && this.sortedDir !== sortDir
      }
      return (this.sortedField !== item.name) || (this.sortedField === item.name && this.sortedDir === sortDir)
    }
  }
}
</script>
