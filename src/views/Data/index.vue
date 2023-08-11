<template>
    <div class="list" v-infinite-scroll="getlist" style="overflow:auto">
        <div v-for="item in list" class="item" @click="goto(item)">
          <div class="img">
            <img :src="item.imgurl?item.imgurl:'https://cos.wenjuan.online/wenjuanpc/1676971593897490383WechatIMG3193.jpeg'" alt />
          </div>
          <div>
            <div class="title">{{item.title}}</div>
            <div class="time">截止日期：{{item.end_time|timefilter}}</div>
          </div>
        </div>
    </div>
</template>

<script>
  import { getIndex } from '@/api/activity'
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
        getIndex(query).then(res=>{
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
      goto(item) {
        if(!localStorage.getItem('urid')) {
          this.$msgbox.confirm('当前页面需要登录后才可访问,前往登录页面?',{
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'success'
          }).then(() => {
            // console.log(to,'to')
              this.cf.setLastRouter({name:'data'})
              this.$router.replace({name:'login'})
          }).catch(() => {

          });
          return
        }
        if(item.jumpurl && item.jumpurl !== '') {
          let urid = localStorage.getItem('urid')
          window.location.href = item.jumpurl+'?uid='+urid
          return
        }
        this.$router.push({name:'survey',params:{acid:item.acid}})
      }
    }
  }
</script>

<style lang="less" scoped>
.list{
  box-sizing: border-box;
  padding: 10px;
  .item{
    margin-bottom: 10px;
    background: #fff;
    box-sizing: border-box;
    padding: 5px;
    border-radius: 4px;
    display: flex;
    align-items: center;
    height: 110px;
    >div:first-child{
      width: 100px;
      img{
        width: 100px;
        height: 100px;
        border-radius: 4px;
      }
    }
    >div:nth-child(2) {
      padding-left:10px;
      display: flex;
      flex-direction: column;
      justify-content: space-around;
      height: 100%;
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
