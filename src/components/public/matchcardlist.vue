<template>
    <div class="matchlist">
        <el-row>
            <el-col :span="span" :xs="24" v-for="(value,index) in matchlist" :key="index">
                <router-link :to="{name:routername,params:{ aid:value.id,matchname:value.title}}">
                    <el-card :body-style="{ padding: '0px',position:'relative' }" >
                        <img :src="value.imgurl" style="display:block;" :onerror="errorimg">
                        <span class="imagestatus" v-if="from=='index'">
                            <img :src="value.state|matchstatus">
                         </span>
                        <div class="albuminfo">
                            {{value.title}}
                        </div>
                    </el-card>

                </router-link>
            </el-col>
        </el-row>
    </div>
</template>
<style lang="less">
    @lineheight: 5px;
    .matchlist {
        a{
            &:hover{
                .albuminfo{
                    background-color:#f69d00;
                }
            }
        }
    }


    .imagestatus {
        top: 0;
        right: 0;
        position: absolute;
    }

    .albuminfo {
        background-color:#373737;
        color:#fff;
        font-size:.9em;
        padding:14px 0;
        text-align:center;
        white-space:nowrap;overflow:hidden;text-overflow:ellipsis;
    }

    .matchlist {
        margin-top: @lineheight;
        .el-row {
            .el-col {
                padding: 10px;
                height:248px;
            }
        }
    }

    #home {
        .el-card, .box-card {
            margin-bottom: 0px !important;
        }
    }

    @media (max-width: 768px) {
        .albuminfo{
            position: absolute;
            bottom: 0px;
            width: 100%;
            opacity: 0.9;
            left: 0px;
            padding:1em 0;
            font-size:14px;
        }
        .matchlist {
            margin: 0 3%;


            .el-row {
                .el-col {
                    padding: 10px;
                    height:auto;
                }
            }

            /*.el-row .el-col{*/
                /*padding:10px 20px;*/
            /*}*/

        }
    }

    #home .page-container .el-row .el-col {
        text-align: center;
    }

    .el-col img {
        width: 100%;
        height: 100%;
        cursor: pointer;
        transition: all 0.6s;
    }



</style>
<script>
    export default {
        mounted(){
            this.$nextTick(function(){
                this.cmatchlist =   this.matchlist;
                this.cfrom      =   this.from;

                switch(this.cfrom)
                {

//                    name:"photo",
//                        path:'/photo/:aid/:matchname',
//                        component:Photo,

                    case "album":
                        this.routername =   "photo";
                        break;
                    default:
                        this.routername =   "detail";
                        break;

                }

            })
        },
        data(){
            return {
                cmatchlist:"",
                cfrom:"",
                routername:"",
                errorimg: "this.src='http://iph.href.lu/800x500?text=每步'"
            }
        },
        filters: {
            matchstatus(val)
            {
                switch (val) {
                    case 10:
                        return "@/assets/images/not-start.png"
                        break;
                    case 11:
                        return "@/assets/images/enrolling.png"
                        break;
                     case 13:
                        return "@/assets/images/enrollfull.png"
                        break;
                    case 99:
                        return "@/assets/images/enrolled.png"
                        break;
                    default:
                        return "@/assets/images/enrolled.png"
                        break;
                }
            }
        },
        methods: {
            havestateimg(state)
            {
                switch (state) {
                    case 10:
                    case 11:
                    case 99:
                        return true;
                        break;
                    default:
                        return false;
                        break;
                }
            },
        },

        props: ['matchlist','from','span']
    }
</script>
