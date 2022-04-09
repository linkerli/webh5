<template>
  <div id="jump" style="height:100%;width:100%;position:static !important;">
    加载中...
  </div>
</template>

<style scoped>
  #app #jump{ height:100%;min-height:500px;line-height:500px;text-align:center;}
</style>

<script>
    import { throttle } from 'throttle-debounce';
    export default {
        created:function(){
            //判断用户是否登录 如果已经登录 直接返回来源网址  用户登录后
            let routerinfo  = this.$store.getters.getRouterinfo;
            if(routerinfo.length===0)
            {
                this.$router.push({name:'usercenter',params:{userid:this.$store.getters.urid,activename:'mymatch'}});
            }else{
                this.$router.push({name:routerinfo.name,params:routerinfo.params});
            }
        },
        mounted() {


        },

    }
</script>

