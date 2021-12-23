<template>
  <div class="app-container bk">
    <el-row>
      <el-col :span="span">
        <el-card class="box-card">
          <div style="text-align: center">
            <h3>{{statistics.shortUrlCount}}</h3>
            <h3>短链总数</h3>
          </div>
        </el-card>
      </el-col>
      <el-col :span="span">
        <el-card class="box-card">
          <div style="text-align: center">
            <h3>{{statistics.groupCount}}</h3>
            <h3>组数</h3>
          </div>
        </el-card>
      </el-col>
      <el-col :span="span">
        <el-card class="box-card">
          <div style="text-align: center">
            <h3>{{statistics.shortUrlDayCount}}</h3>
            <h3>今日创建</h3>
          </div>
        </el-card>
      </el-col>
      <el-col :span="span">
        <el-card class="box-card">
          <div style="text-align: center">
            <h3>{{statistics.totalViewCount}}</h3>
            <h3>访问量</h3>
          </div>
        </el-card>
      </el-col>
    </el-row>
    <el-row>
      <LineChart :chartData="viewData"/>
    </el-row>
    <el-row>
      <AreaGroup v-if="groupArea.length>0" :chartData="groupArea"/>
    </el-row>
  </div>
</template>

<script>
  import {mapGetters} from 'vuex'
  import LineChart from '@/views/dashboard/components/line-chart'
  import AreaGroup from '@/views/dashboard/components/area-group'
  import {getGroupArea, getStatistics,getView} from '@/api/api'

  export default {
    name: 'Dashboard',
    components: {LineChart, AreaGroup},
    data() {
      return {
        span: 6,
        statistics: {
          shortUrlCount: 0,
          shortUrlDayCount: 0,
          groupCount: 0,
          totalViewCount:0
        },
        viewData:{},
        groupArea: []
      }
    },
    created() {
      this.initGroupArea()
      this.initStatistics()
      this.initView()
    },
    computed: {
      ...mapGetters([
        'name'
      ])
    },
    methods: {
      async  initView(){
        getView().then(res=>{
          console.log(res.data)
          this.viewData=res.data
        })
      },
      async initStatistics() {
        getStatistics().then(res => {
          this.statistics = res.data
        })

      },
      async initGroupArea() {
        getGroupArea().then(res => {
          console.log(res.data)
          this.groupArea = res.data
        })
      }
    }
  }
</script>

<style>
  .bk {
    background-color: #EBEEF5
  }

  .box-card {
    width: 80%;
  }
</style>
