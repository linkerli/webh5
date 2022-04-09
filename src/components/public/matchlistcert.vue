<template>
    <el-card class="">
        <el-row class="mathc-info">
            <el-col :span="6" :xs="24">
                    <img :src="matchinfo.imgurl" :alt="matchinfo.title" style="display:block;border-radius:5px;">
            </el-col>
            <el-col  :sm="{span:17,offset:1}"  :xs="24"  id="matchinfo">
                <el-form label-position="left">
                    <el-form-item label="赛事名称:" style="margin:0px;">
                        <span>{{ matchinfo.title }} </span>
                    </el-form-item>

                    <el-form-item label="比赛地点:" v-if="matchinfo.address" style="margin:0px;">
                        <span>{{ matchinfo.address|public}}</span>
                    </el-form-item>

                    <el-form-item label="参赛人员:" v-if="matchinfo.name" style="margin:0px;">
                        <span>{{ matchinfo.name}}</span>
                    </el-form-item>


                    <el-form-item label="比赛时间:" style="margin:0px;">
                        <span>{{ matchinfo.starttime}}</span>
                    </el-form-item>
                </el-form>
                <slot name="operate"></slot>
            </el-col>

        </el-row>
    </el-card>
</template>

<script>
    export default {
        methods:{

        },
        props: ['matchinfo','smallimgcss'],
        filters:{
            state(val){
                //1已支付；2未支付，3-已退款
                switch(val)
                {
                    case 1:
                        return "已支付"
                        break;
                    case 2:
                        return "未支付"
                        break;
                    case 3:
                        return "已退款"
                        break;

                }
                return "请联系系统管理员";
            }
        }
    }
</script>