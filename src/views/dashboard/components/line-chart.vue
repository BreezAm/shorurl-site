<template>
  <div :class="className" :style="{height:height,width:width}"/>
</template>

<script>
  import * as echarts from 'echarts'
  require('echarts/theme/macarons')

  export default {
    name: 'LineChart',
    props: {
      className: {
        type: String,
        default: 'chart'
      },
      width: {
        type: String,
        default: '100%'
      },
      height: {
        type: String,
        default: '400px'
      },
      autoResize: {
        type: Boolean,
        default: true
      },
      chartData: {
        type: Object,
        required: true
      }
    },
    data() {
      return {
        chart: null
      }
    },
    watch: {
      chartData: {
        deep: true,
        handler(val) {
          this.setOptions(val)
        }
      }
    },
    mounted() {
      this.$nextTick(() => {
        this.initChart()
      })
    },
    beforeDestroy() {
      if (!this.chart) {
        return
      }
      this.chart.dispose()
      this.chart = null
    },
    methods: {
      initChart() {
        this.chart = echarts.init(this.$el, 'macarons')
        this.setOptions(this.chartData)
      },
      setOptions(chartData) {
        this.chart.setOption({
          xAxis: {
            type: 'category',
            data: chartData.days
          },
          yAxis: {
            type: 'value'
          },
          series: [
            {
              data:chartData.count,
              type: 'line'
            }
          ]
        })
      }
    }
  }
</script>
