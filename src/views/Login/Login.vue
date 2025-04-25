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
            <el-button type="warning" :loading="loading" loading-text="授权登录中" round @click="redirectToWeChatOAuth" style="width:300px;"> 授权并登录 </el-button>
        </div>
    </div>
</template>
<script>
    import {mapMutations} from 'vuex'
    export default {
        name: 'login',
        methods: {
            ...mapMutations([
                'setUserInfo'
            ]),
            // login:function(){
            //     this.$wechat.getWechatCode();
            // },
            redirectToWeChatOAuth() {
              const corpId = 'ww5bf50ef71d4a6b58'; // 替换为企业微信的企业 ID
              const redirectUri = encodeURIComponent('https://h5.datatianke.cn/getwechatcode/getcode.php'); // 替换为您的回调地址
              const state = 'h5'; // 自定义状态参数，可选
              const authUrl = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${corpId}&redirect_uri=${redirectUri}&response_type=code&scope=snsapi_base&state=${state}#wechat_redirect`;

              window.location.href = authUrl; // 跳转到企业微信授权页面
            },
        },

        data() {
            return {
                code: "",
                loading: false
            }
        },
        mounted() {
            // this.$toast.loading()
            if (this.$util.iswechat()) {
                if(!!this.$route.query.code){
                  this.loading = true
                  let params = {code: this.$route.query.code}
                  this.$store.dispatch('login', params).then((res) => {
                      if (res.status * 1 === 200) {
                        this.setUserInfo(res.data);
                        this.cf.getLastRouter().then((res) => {
                          this.$storage.remove('loastroute');
                          let {name,params}= res;
                          //用push拦截下次回退
                          this.$router.push({name,params})
                        })
                      } else {
                          this.redirectToWeChatOAuth();
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
                this.$alert("请在微信中打开当前页面")
                // this.$router.push({name:'index'})
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


