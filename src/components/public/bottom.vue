<template>
    <div id="" style="height:45px;text-align:center;font-weight:bold;line-height:45px;color:#F5A623;">
        <el-button type="text" @click="showmore" id="bottom" :loading="loading">{{text}}</el-button>
    </div>
</template>

<script>
    export default {
        props: ["text","loading"],
        methods:{
            showmore:function(){
                this.$emit("showmore");
            }
        }
    }
</script>