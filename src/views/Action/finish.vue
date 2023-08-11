<template>
    <div>

        <div class="nobody">
            <span>已经提交，感谢您的参与！</span>
        </div>

    </div>
</template>

<script>
import { throttle } from 'throttle-debounce'
import mvform from '@/components/form/index.vue'
import { submitother } from '@/api/activity'

export default {
  data() {
    return {
      acid: '',
      burid: '',
      status: ''
    }
  },
  mounted(){
    this.acid  = this.$route.params.acid?this.$route.params.acid: ''
    let urid = localStorage.getItem('urid')
    this.burid = this.$route.query.uid?this.$route.query.uid:''
    this.status = this.$route.query.status?this.$route.query.status:''
    if (this.burid != '' && urid == this.burid && this.status == 1) {
      this.submit()
    }
  },
  methods:{
    submit() {
      submitother({status:this.status,acid: this.acid})
    }
  }
}
</script>
<style scoped lang="less">
.page-container{
    max-width: 500px;
}
.nobody{
    width: 320px;
    height: 400px;
    margin-top: 50px;
    margin: 20px auto;
    border-radius: 10px;
    background: #fff;
    font-size: 24px;
    box-sizing: border-box;
    padding: 30px 10px;
    display: flex;
    align-items: center;
    justify-content: space-around;
    flex-direction: column;
}
</style>
