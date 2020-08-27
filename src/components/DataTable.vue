<template>
  <table :class="['v-datatable-light', css.table]" style="margin:10px 10px 10px 10px">
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
          </div>
          <!-- end header free text -->
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
        <tr v-for="(item, index) in data" :key="index" :class="[css.tbodyTr, `row-${index}`]" v-on:dblclick="navigateToProfile(item)">
          <td
            v-for="(key, columnIndex) in headers"
            :key="`${index}-${key.name}`"
            :class="[css.tbodyTd, `column-${columnIndex}`]"
            :style="getColumnWidth(key)">

            <img v-if="isFieldSpecial(key.name)&& extractArgs(key.name) === 'avatarUrl'"
              v-bind:src="item[extractArgs(key.name)]" style="width:100px"/>

            <span
              v-if="isFieldHTML(key.name)"
              v-html="item[extractID(key.name)]"
            />

            <span
              v-if="key.name === 'status.status'"
              v-html="getStatus(item.status)"
            />

            <a v-if="isFieldURL(key.name)" v-bind:href="item[extractID(key.name)]" rel="noopener noreferrer" target="_blank">
              {{ appendHTTP(item[extractID(key.name)]) }}
            </a>

            <a v-if="isFieldTwitter(key.name)" v-bind:href="createTwitterLink(item[extractID(key.name)])" rel="noopener noreferrer" target="_blank">
              {{ item[extractID(key.name)] }}
            </a>

            <slot v-if="isTotalCount(key.name)">{{ extractTotalCount(item[extractTotalCountID(key.name)]) }}</slot>

            <slot v-if="key.name === 'repositories.totalDiskUsage'">{{ extractDiskUsage(item) }}</slot>

            <input
              v-if="isFieldSpecial(key.name) && extractArgs(key.name) === 'actions'"
              :name="extractActionID(key.name)"
              :row-data="item"
              :row-index="index"
              type="button"
              class="btn btn-info"
              value="View Profile"
              @click="navigateToProfile(item)"
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
    <tfoot :class="css.tfoot">
      <tr :class="css.tfootTr">
        <th :colspan="headers.length" :class="css.tfootTd">
          <div :class="css.footer">
            <slot name="pagination"/>
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
    notFoundMsg: {
      type: String,
      default: null
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
      default: '100px'
    },
    userCount: {
      type: Number,
      default: 0
    }
  },
  data: function () {
    return {
      notFoundMessage: this.notFoundMsg,
      loading: this.isLoading
    }
  },
  computed: {
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
    headerItemClass: function (item, className = '') {
      return item ? className : `${className} no-sortable`
    },

    isFieldSpecial: field => field.indexOf('__') > -1,

    isFieldHTML: field => field.split('.')[1] === 'html' ? true : false,

    isFieldURL: field => field.split('.')[1] === 'url' ? true : false,

    isFieldTwitter: field => field.split('.')[1] === 'twitter' ? true : false,

    isTotalCount: field => field.indexOf('totalCount') > -1,

    extractArgs: string => string.split(':')[1],

    extractActionID: string => {
      const list = string.split(':');
      return list.length === 3 ? list[2] : 'actions';
    },

    extractID: string => {
      const list = string.split('.');
      return list.length === 2 ? list[0] : null;
    },

    extractAvatarID: string => {
      const list = string.split(':');
      return list.length === 3 ? list[2] : 'avatarUrl';
    },

    extractTotalCountID: string => {
      const list = string.split('.');
      return list[1] === 'totalCount' ? list[0] : string;
    },

    appendHTTP: string => {
      if(!string) return ;
      if(string.indexOf('http://') === -1 && string.indexOf('https://') === -1){
        string = 'http://' + string;
      }
      return string;
    },

    createTwitterLink: string => {
      return string ? 'https://twitter.com/' + string : null;
    },

    navigateToProfile: function(item){
      const profile = item.url;
      if(profile)
        window.open(profile, "_blank", "noopener");
    },

    getStatus: function(item){
      return item ? item.message + ' ' + item.emojiHTML : null;
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
  }
}
</script>
