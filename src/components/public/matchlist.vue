<template>

    <el-card class="el-cord-list mymatchlist">
        <div slot="header" class="clearfix">
            <span>
                {{matchinfo.title}}
                <i class="el-icon-more other-card" style="color:#f69d00;text-align:center;float:right;"></i>
            </span>
        </div>

        <el-row >

            <el-col :span="24">
                <el-row class="mathc-info">
                    <el-col :span="18"  :xs="24"  id="matchinfo">
                        <el-form label-position="left">

                            <el-form-item label="比赛地点:" style="margin:0px;">
                                <span>{{ matchinfo.address||'暂无数据' }}</span>
                            </el-form-item>
                            <el-form-item label="报名时间:" style="margin:0px;">
                                <span>{{matchinfo.reg_start_time|filedatetime}} -{{matchinfo.reg_end_time|filedatetime}} </span>
                            </el-form-item>
                         <el-form-item label="比赛日期:" style="margin:0px;">
                             <span>{{matchinfo.start_time|filedate}} {{matchinfo.start_time|fileday}} </span>
                            </el-form-item>


                        </el-form>
                    </el-col>
                    <el-col :span="6" :xs="24" >
                        <el-card>
                            <el-form style="text-align:center;">
                                <el-form-item style="margin:0px;">
                                    <span>{{matchinfo.start_time|filedate}}</span>
                                </el-form-item>
                                <el-form-item style="margin:0px;">
                                    <span>{{matchinfo.start_time|fileday}} </span>
                                </el-form-item>
                            </el-form>
                            <div style="padding:10px;text-align:center;color:#FFF;background-color:#F5A623;">
                                {{matchinfo.state.statetips}}
                            </div>
                        </el-card>
                    </el-col>
                </el-row>
            </el-col>


        </el-row>

        <div label="" class="max768" style="color:#f69d00;text-align:center;padding-top:10px;">
            更多信息...
        </div>

    </el-card>



</template>
<style  lang="less">
    .el-form-item__label{color:#000 !important;}
    .mymatchlist{
        .mathc-info{
            .el-card__body{
                padding:0px !important;
            }
            :last-child{
                .el-form-item__content{
                    font-size:15px;
                }
            }
        }
        @media (max-width: 768px) {
           .el-card{display:none;}
            .other-card{display:none;}
           .max768{display:block;}
        }
        @media (min-width: 768px) {
           .max768{display:none;}
        }


    }
</style>
<script>
    import moment from 'moment'
    export default {
        methods:{
            go(){
                alert(1);
            }
        },
        props: ['matchinfo','smallimgcss'],
        filters:{
            filedate(val) {
              return moment(val*1000).format('YYYY-MM-DD')
            },
            filedatetime(val) {
              return moment(val*1000).format('YYYY-MM-DD HH:mm:ss')
            },
            fileday(val) {
              return moment(val*1000).format('dddd')
            }
        }
    }
</script>
