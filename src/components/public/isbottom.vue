<template>
    <div id="bt">
        <el-button type="primary" :plain="true" @click="showmore" id="bottom" :class="{'small':small}">{{text}}</el-button>
    </div>
</template>

<script>
  export default {
      computed:{
          small:function(){
              if(this.$util.isPc())
              {
                  return false;
              }else{
                  return true;
              }
          }
      },
      props: ["text"],
      methods:{
          showmore:function(){
              this.$emit("showmore");
          }
      }
  }
</script>

<style lang="less">
.small{
  border-style:none !important;
  font-size:12px;
}
#bt{
  display:flex;
  justify-content:center;
  padding:10px;
  button{
    border-style:none !important;
  }
}

</style>
