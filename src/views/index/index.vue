<template>
  <div class="app-container">
    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row
    >
      <el-table-column label="文件名" width="1000">
        <template slot-scope="scope">
          <svg-icon icon-class="dir" v-if="scope.row.svg === 'dir'" />
          <svg-icon icon-class="wenjiantubiao-yinpin" v-if="scope.row.svg === 'wenjiantubiao-yinpin'" />
          <svg-icon icon-class="pdf" v-if="scope.row.svg === 'pdf'" />
          <svg-icon icon-class="excel" v-if="scope.row.svg === 'excel'" />
          {{ scope.row.name }}
        </template>
      </el-table-column>
      <el-table-column label="修改时间">
        <template slot-scope="scope">
          {{ scope.row.time }}
        </template>
      </el-table-column>
      <el-table-column label="大小" width="110">
        <template slot-scope="scope">
          <span>{{ scope.row.length }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="360">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" round v-if="scope.row.type === 1">下载</el-button>
          <el-button type="primary" size="mini" round>重命名</el-button>
          <el-button type="primary" size="mini" round>移动</el-button>
          <el-button type="success" size="mini" round v-if="scope.row.type === 1">分享</el-button>
          <el-button type="danger" size="mini" round>删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { getList } from '@/api/table'

export default {
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: 'success',
        draft: 'gray',
        deleted: 'danger'
      }
      return statusMap[status]
    }
  },
  data() {
    return {
      list: [
        {name: 'C++基础教程', time: '2022-04-03 11:35', length: '-', type: 0, svg: 'dir'},
        {name: 'Java进阶教程', time: '2022-03-21 17:41', length: '-', type: 0, svg: 'dir'},
        {name: '岁月如歌.mp4', time: '2022-03-23 21:31', length: '5.36MB', type: 1, svg: 'wenjiantubiao-yinpin'},
        {name: '算法导论.pdf', time: '2022-04-11 19:15', length: '12.42MB', type: 1, svg: 'pdf'},
        {name: '算法竞赛报名表.xls', time: '2022-04-16 10:30', length: '894KB', type: 1, svg: 'excel'}
      ],
      listLoading: false
    }
  },
  created() {
    // this.fetchData()
  },
  methods: {
    fetchData() {
      this.listLoading = true
      getList().then(response => {
        this.list = response.data.items
        this.listLoading = false
      })
    }
  }
}
</script>
