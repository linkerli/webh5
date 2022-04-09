<template>
    <div id="null"  class="" style="text-align:center;padding:10px;margin:10px;" v-if="show">
        <i class="el-icon-information"></i>
        <br>
        {{text}}
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
        props: ["show","text"],
    }
</script>