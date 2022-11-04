<template>
    <div class="login apppadding">
        <div class="logincontainer" style="height:auto;">
            <div>
                <div>
                    当前应用需要登录方可使用.
                </div>
            </div>
        </div>

        <div class="page-container-padding" style="height:auto;">
            <el-button type="warning" :loading="loading" loading-text="授权登录中" round @click="login" style="width:300px;"> 授权并登录 </el-button>
        </div>
    </div>
</template>
<script>
    import {mapMutations} from 'vuex'
    import {getuserInfo} from '@/api/user'
    

    export default {
        name: 'login',
        methods: {
            ...mapMutations([
                'setUserInfo'
            ]),
            login:function(){
                this.$wechat.getWechatCode();
            }
        },

        data() {
            return {
                code: "",
                loading: false
            }
        },
        mounted() {
            // this.$toast.loading()
            if (this.cf.iswechat()) {
                if(!!this.$route.query.code){
                        this.loading = true
                        let params = {code: this.$route.query.code}
                        this.$store.dispatch('login', params).then((res) => {
                            if (res.status * 1 === 200) {                               
                                let {urid, token} = res.data;
                                getuserInfo({urid:res.data.urid,token:res.data.token}).then((res)=>{
                                    if(res.status == 200){
                                        let rawData = res.data
                                        rawData.urid = urid
                                        rawData.token = token
                                        rawData.logintime = new Date().getTime()
                                        this.setUserInfo(rawData);
                                        this.cf.getLastRouter().then((res) => {
                                            this.$storage.remove('loastroute');
                                            let {name,params}= res;
                                            //用push拦截下次回退
                                            this.$router.push({name,params})
                                        })
                                    }
                                })
                                
                            } else {
                                this.$wechat.getWechatCode();
                            }
                        })
                }
                // let {code, state} = this.$route.query
                // if (code && state === "authorize_wechat") {
                //     this.code = code;
                //     this.login();
                //     return;
                // }

                // this.$wechat.jsAuthorize()

            } else {
                this.$toast.fail("请在微信中打开当前页面")
                this.$router.push({name:'index'})
            }

        }
    }
</script>

<style scoped lang="less">
    .login{
        .logincontainer{
            height: 100%;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: space-between;
            padding: 100px 0;
            box-sizing: border-box; 
        }
        
        .logincontainer div{
            display:flex;
            flex-direction:column;
            align-items:center;
        }
        /*.container view>view:nth-child(2)*/
        /*{*/
        /*margin:20rpx auto;*/
        /*font-size:40rpx;*/
        /*}*/
        .logincontainer div img:nth-child(1)
        {
            width:120px;
            background: #fff;
            /*height:343rpx;*/
            border-radius:50%;
        }

        .logincontainer div:nth-child(1) img:nth-child(2)
        {
            width:320px;
            height:91px;
        }
        .logincontainer div div:last-child{
            height:100px;
            width:350px;
            font-size:14px;
            background-image:url('https://moveclub-file.oss-cn-hangzhou.aliyuncs.com/icon/logintips.png');
            background-size:100% 100%;
            padding:12px;
            padding-top:22.5px;
            box-sizing:border-box;
            display:flex;
            align-items:center;
            justify-content:center;
        }
        .footer{
            box-shadow:none;
        }
        .page-container-padding{
            display: flex;
            align-items: center;
            justify-content: center;
        }
    }
    
</style>


