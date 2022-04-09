<template>
    <div id="countdown" class="" style="padding:0px;">
            <p>{{$t('message.timeout')}}</p>
            <p class="digit">{{ days | two_digits }}{{$t('message.day')}}</p>
            <p class="digit">{{ hours | two_digits }}{{$t('message.hour')}}</p>
            <p class="digit">{{ minutes | two_digits }}{{$t('message.min')}}</p>
            <p class="digit">{{ seconds | two_digits }}{{$t('message.sec')}}</p>
    </div>
</template>
<script>
    export default {
        mounted() {
            window.setInterval(() => {
                this.now = Math.trunc((new Date()).getTime() / 1000);
            },1000);
        },
        filters: {
          two_digits(value){
            if (value.toString().length <= 1) {
              return "0" + value.toString();
            }
            return value.toString();
          }
        },
        props : {
            date : {
                coerce: str => Math.trunc(Date.parse(str) / 1000)
            }
        },
        data() {
            return {
                now: Math.trunc((new Date()).getTime() / 1000)
            }
        },
        computed: {
            seconds() {
                return (this.date - this.now) % 60;
            },
            minutes() {
                return Math.trunc((this.date - this.now) / 60) % 60;
            },
            hours() {
                return Math.trunc((this.date - this.now) / 60 / 60) % 24;
            },
            days() {
                return Math.trunc((this.date - this.now) / 60 / 60 / 24);
            }
        }
    }
</script>
<style type="less">
        #countdown{
            display: flex;
            align-content: space-between;

        }
        .blocks {
            margin:0 5px;
            text-align:center;
        }

</style>
