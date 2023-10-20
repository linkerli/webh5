<template>
    <div class="wxlist" v-infinite-scroll="getlist" style="overflow:auto">
        <div v-for="item in list" class="item">
          <div class="img">
            <el-image :src="item.imgurl" :preview-src-list="[item.imgurl]" alt ></el-image>
          </div>
          <div>
            <div class="title">{{item.title}}</div>
            <!-- <div class="time">截止日期：{{item.end_time|timefilter}}</div> -->
          </div>
        </div>
    </div>
</template>

<script>
  import { getWxIndex } from '@/api/activity'
  import moment from 'moment'
  export default {
    data() {
      return {
        page: 1,
        pages: 1,
        list: [],
        finished: false
      }
    },
    filters: {
      timefilter(time) {
        if(time == '') {
          return '未知'
        }
        return moment(time * 1000).format("YYYY-MM-DD");

      }
    },
    mounted(){
      // this.$nextTick(() => {
      //   this.getlist()
      // })
    },
    methods: {
      getlist() {
        let query = {
          page: this.page,
          limit: 20
        }
        if(this.finished) return
        getWxIndex(query).then(res=>{
          if(res.status === 200) {
            let { list, page, pages } = res.data
            if (page == 1) {
              this.list = list;
            } else {
              this.list = this.list.concat(list);
            }

            if (page >= pages) {
              this.finished = true;
            } else {
              this.page++;
            }
          }
        })
      },
      // goto(item) {
      //   if(item.jumpurl && item.jumpurl !== '') {
      //     window.location.href = item.jumpurl+'?uid='+urid
      //     return
      //   }
      // }
    }
  }
</script>

<style lang="less" scoped>
.wxlist{
  box-sizing: border-box;
  padding: 10px;
  .item{
    margin-bottom: 10px;
    background: #fff;
    box-sizing: border-box;
    padding: 5px;
    border-radius: 4px;
    display: flex;
    flex-direction: column;
    align-items: center;
    // height: 110px;
    >div:first-child{
      width: 100%;
      img{
        width: 100%;
        height: auto;
        border-radius: 4px;
      }
    }
    >div:nth-child(2) {
      padding: 10px 4px;
      .title{
        font-size: 16px;
        font-weight: bold;
      }
      .time{
        color: #999;
      }
    }
  }
}
</style>
