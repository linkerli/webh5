<template>
    <div id="null"  class="" style="text-align:center;" v-if="show">
        <i class="el-icon-information"></i>
        <br>
        暂无数据
        <br>
    </div>
</template>

<script>
    export default {
        data(){
            return{
                isshow:this.show
            }
        },
        props: ["show"],
    }
</script>