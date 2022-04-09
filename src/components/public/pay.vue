<template>
<div id="pay">
    <el-card class="box-card">
        <el-form  label-width="90px" label-position="left">
            <h4 style="margin:10px 0;">{{$t('message.payamout')}}&nbsp;&nbsp;{{matchinfos.fees|current}}</h4>
            <!--//hascode-->
            <el-form-item label="使用折扣码:"  style="margin:0px;" v-if="this.matchinfos.fees!=0&&this.matchinfos.hascode==1">
                <el-switch on-text="是" off-text="否" v-model="usecoupon" @change="usecouponchange"></el-switch>
            </el-form-item>

            <el-form-item v-if="usecoupon" label="折扣码:"  style="margin:0px;">
                <el-input placeholder="请输入折扣码"  v-model="speccode" @blur="checkcode" :maxlength=10 style="max-width:300px;">
                    <el-button slot="append" @click="checkcode">使用折扣码</el-button>
                </el-input>
            </el-form-item>
            <el-form-item label="支付方式:" v-if="!this.$util.iswechat()&&this.matchinfos.fees!=0&&this.$util.isPc()"  style="margin:0px;">
                <el-radio-group v-model="paytype">
                    <el-radio label="1" value="1">支付宝支付</el-radio>
                    <el-radio label="2" value="2" v-if="this.$util.isPc()">微信支付</el-radio>
                </el-radio-group>
            </el-form-item>
        </el-form>
    </el-card>
    <div class="pay-footer">
        <div style="margin-top:10px;text-align:right;" class="payfooter">
            <el-button  size="large" type="primary" class="next" @click="pre" v-if="havepre">上一步</el-button>
            <el-button  size="large" type="primary" class="next" :disabled="!this.$util.iswechat()&&this.matchinfos.fees!=0&&paydisabled" @click="pay">
                <span v-if="this.matchinfos.fees!=0"> 确认支付 </span>
                <span v-else>{{$t('message.sure')}}</span>
            </el-button>
        </div>
    </div>
    <el-dialog
            :visible.sync="qrcodedialogVisible"
            size="large"
            style="text-align:center;"
    >
        <h3 v-html="paytitle"></h3>

        <vue-qr :text="qrcodepayconfig.value"></vue-qr>
        <h3 style="background-color:#F5A623;">

        </h3>

    </el-dialog>
</div>
</template>

<script>
    import VueQr from 'vue-qr'
    import { registerpayorder,queryregisterpayorder } from '@/api/pay'
    import config from "@/config";
    export default {
        props: ["matchinfos","payinfos",'havepres','orderinfos'],
        components:{
          VueQr
        },
        filters: {
          current(value) {
            value = value * 1;
            if (value === 0) {
              return '免费';
            }

            return '¥' + value;
          }
        },
        created(){
            this.fees   =   this.matchinfos.fees;
            //判断支付方式
            //如果是微信 只能微信支付
            if(this.$util.iswechat())
            {
                this.paytype    =2;
            }else if(!this.$util.isPc()){
                this.paytype    =1;
            }

        },
        data(){
          return{
              paydisabled:false,
              showheader:false,
              fees:'',
              speccode:0,
              paytitle:'',
              usecoupon:false,
              paytype:'1',
              matchinfo:this.matchinfos,
              payinfo:this.payinfos,
              havepre:this.havepres,
              qrcodedialogVisible:false,
              qrcodepayconfig:{
                  value: '#',
                  size:250
              },

          }
        },
        methods:{
            usecouponchange(e)
            {
                if(!e)
                {
                    this.matchinfos.fees    =   this.fees;
                    this.speccode   =   '';
                }
            },
            checkcode()
            {
                if(this.speccode)
                {
                    let that    =   this;
                    let params  =   {matchid:this.matchinfos.matchid,typeid:this.matchinfos.typeid,speccode:this.speccode}
                    this.$ajax.post("pay/checkspeccode",params).then((res)=>{
                        if(res.data.status==that.$ajax.success_status)
                        {
                            that.matchinfos.fees    =   res.data.data.fees;
                        }else{
                            that.$message.error(res.data.message);
                        }
                    })

                }

            },
            pre(){
                this.$emit('pre');
            },
            pay()
            {
                this.paydisabled    =   true;
                //检查分组报名上线

                let return_url  =   window.location.origin+"/#/u/"+this.$store.getters.urid+"/mymatch";
                if(this.matchinfos.fees==0)
                {
                    let params  =   {speccode:this.speccode,matchid:this.matchinfos.matchid,typeid:this.matchinfos.typeid,rgid:this.payinfo.rgid,rrid:this.payinfo.rrid,categoryid:this.matchinfos.categoryid,paytype:0,paymethod:4,returnurl:return_url};
                    registerpayorder(params).then((res)=> {
                        if (res.status == 200) {
                            //判断 报名组别
                          var msg,title
                          if(this.matchinfos.needcheck==2)
                            {
                                msg    =  "您的报名信息已提交,请等待系统管理员审核";
                                title   = "报名提醒";
                            }else{
                                msg    =  "恭喜您,报名成功";
                                title   = "报名成功提醒";

                            }

                            this.$alert(msg, title, {
                                confirmButtonText: '确定',
                                callback: action => {
                                    //清除push history
                                    this.$router.replace({name:"usercenter",params:{userid:this.$store.getters.urid,activename:'mymatch'}});
                                }
                            });

                        }else{
                            this.paydisabled    =   false;
                            this.$message.error(res.message);
                            return false;
                        }
                    });
                    return false;
                }

                let that    =   this;
                //微信内核浏览器 且 不是 pc
                if(that.$util.iswechat() && !that.$util.isPc())
                {
                    const wechatappid   =  config.wechatappidjs;
                    const redirecturl   =  window.location.origin+"/wep/"+this.matchinfos.matchid+"/"+this.matchinfos.typeid+"/"+this.payinfo.rgid+"/"+this.payinfo.rrid+"/"+this.speccode;
                    let encodeurl = encodeURIComponent("http://www.moveclub.cn/getwechatcode/getcode.php?redirect_url="+encodeURIComponent(redirecturl));
                    let jumpurl =    "https://open.weixin.qq.com/connect/oauth2/authorize?appid="+wechatappid+"&redirect_uri="+encodeurl+"&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect";
                    window.location.href    =   jumpurl;
                    return false;
                }

                let paymethod  =   3;
                if(!this.$util.isPc())
                {
                    paymethod  =   1;
                }
                let params  =   {speccode:this.speccode,matchid:this.matchinfos.matchid,typeid:this.matchinfos.typeid,rgid:this.payinfo.rgid,rrid:this.payinfo.rrid,categoryid:this.matchinfos.categoryid,paytype:this.paytype,paymethod:paymethod,returnurl:return_url,apph5:11};

                registerpayorder(params).then((res)=>{
                    var that    =   this;
                    setTimeout(()=>{
                        that.paydisabled    =   false;
                    },1000)
                    if(res.status== 200)
                    {
                        //判断支付方式
                        if(this.paytype==1)
                        {
                            that.paytitle   =   "请使用支付宝扫码支付<span style='color:#F5A623;'>"+that.matchinfos.fees+"</span>元";
                            if(that.$util.isPc())
                            {
                                that.qrcodepayconfig.value  =   res.data.shipment;
                                that.qrcodedialogVisible    =   true;
                            }else{
                                let jumpurl = 'https://openapi.alipay.com/gateway.do?'+res.data.shipment;
                                window.location.href    =   jumpurl;
                                return false;
                            }
                        }else{

                            that.paytitle   =   "请使用微信扫码支付<span style='color:#F5A623;'>"+that.matchinfos.fees+"</span>元";
                            //微信二维码支付
                            if(that.$util.isPc())
                            {
                              that.qrcodepayconfig.value  =   res.data.shipment.code_url;
                              that.qrcodedialogVisible    =   true;
                            }else{
                              let shipment = res.data.shipment;
                              let payurl = window.location.href
                              shipment.jumpurl = encodeURIComponent(payurl);
                              delete shipment.mweb_url;
                              let jumpurl =
                                "https://store.moveclub.cn/wechatpaynew.php?info=" +
                                encodeURIComponent(JSON.stringify(shipment));
                              window.location.href = jumpurl;
                              return false;
                            }

                        }
                        let timer   =   '';
                        if(that.qrcodedialogVisible)
                        {
                            timer   =   window.setInterval(function(){
                                if(that.qrcodedialogVisible)
                                {
                                    queryregisterpayorder({typeid:params.typeid,rrid:that.payinfo.rrid,paytype:that.paytype,orderno:res.data.order_no}).then((res)=>{
                                        if(res.status === 200)
                                        {
                                            if(res.data.state==1)
                                            {
                                                that.paytitle ='您已完成支付';
                                                window.setTimeout(function(){
                                                    that.$router.push({name:"usercenter",params:{userid:that.$store.getters.urid,activename:'mymatch'}});
                                                },2000);
                                                window.clearInterval(timer);
                                                return ;
                                            }
                                        }
                                    })
                                }else{
                                    window.clearInterval(timer);
                                    return ;
                                }
                            },1500)
                        }
                    }else{
                        that.$message.error(res.message);
                    }
                });

            },
        }
    }
</script>
