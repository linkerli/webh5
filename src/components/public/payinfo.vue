<template>
    <div id="payinfo">
        <el-card class="box-card"  v-if="orderinfos.ischeck==1">
            <div slot="header" class="clearfix">
                <span>{{$t('message.pay')}}</span>
            </div>
            <el-form label-position="left" v-if="orderinfos.state==1">
                <el-form-item :label="$t('message.payamout')" style="margin:0px;">
                    <span>{{ orderinfos.fees|current }}</span>
                </el-form-item>
                <el-form-item :label="$t('message.paysty')" style="margin:0px;">
                    <span>{{ orderinfos.paytype|paytype}}</span>
                </el-form-item>
                <el-form-item :label="$t('message.paycode')"  style="margin:0px;">
                    <span>{{ orderinfos.order_no }}</span>
                </el-form-item>
                <el-form-item :label="$t('message.paytime')" style="margin:0px;">
                    <span>{{ orderinfos.paytime }}</span>
                </el-form-item>
            </el-form>
            <pay :matchinfos="matchinfos" :payinfos="payinfos" :orderinfos="orderinfos" v-if="orderinfos.state==2 && (matchinfos.systime>=matchinfos.reg_start_time&&matchinfos.systime<=matchinfos.reg_end_time)"></pay>
             <div  v-if="orderinfos.state==2&&!(matchinfos.systime>=matchinfos.reg_start_time&&matchinfos.systime<=matchinfos.reg_end_time)">
                    {{$t('message.nopay')}}
             </div>
        </el-card>
        <el-card class="box-card" v-else>
            <div slot="header" class="clearfix">
                <span>{{$t('message.codesta')}}</span>
            </div>
            <div style="font-weight:bold;color:#f5a623" class="text-red"> {{$t('message.codeguo')}}</div>
        </el-card>
    </div>
</template>
<script>
    import pay from './pay.vue'
    import moment from 'moment'
    export default {
        props: ["payinfos","matchinfos","orderinfos"],
        components:{
            pay
        },
        filters: {
          filedate(val) {
            return moment(val*1000).format('YYYY-MM-DD')
          },
          current: function (value) {
            if (value * 1 === 0) {
              return '免费';
            }

            return '¥' + value;
          },
          paytype(value) {
            switch (value) {
              case 0:
                return "免费";
                break;
              case 1:
                return "支付宝支付";
                break;
              case 2:
                return "微信支付";
                break;
              case 3:
                return "银行转账";
                break;
              case 4:
                return "外部导入";
                break;
              case 5:
                return "折扣码";
                break;
            }
          }
        },
        data(){
          return{
              paydialogVisible:false,
              matchinfo:this.matchinfos,
              orderinfo:this.orderinfos,
              payinfo:this.payinfos,
          }
        }
    }
</script>
