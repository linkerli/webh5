<template>
    <div>
        <div v-loading="loading" class="page-container page-component">
            <mvform :attrs="gattrs" :disclaimer="matchinfo.disclaimer" @getAuth="addsuccess"></mvform>
            <transition name="back-top-fade">
                <div class="page-component-up"
                     :class="{ 'hover': hover }"
                     v-show="showBackToTop"
                     @mouseenter="hover = true"
                     @mouseleave="hover = false"
                     @click="toTop"
                    >
                    <i class="el-icon-caret-top"></i>
                </div>
            </transition>
        </div>
    </div>
</template>
<script>
    import { throttle } from 'throttle-debounce'
    import mvform from '@/components/form/index.vue'
    import { matchInfo,submitmemberinfos } from '@/api/activity'

    export default {
        name: "addgream",
        components:{
            mvform
        },
        mounted(){
            this.loading = true
            this.throttledresizeHandler = throttle(300, this.handleResize);
            window.addEventListener('resize',this.handleResize);
            this.throttledScrollHandler = throttle(300, this.handleScroll);
            document.addEventListener('scroll', this.throttledScrollHandler);
            this.$nextTick(() => {
                let that = this;
                matchInfo({acid: this.$route.params.acid}).then((res) => {
                    if (res.status === 200) {
                        that.matchinfo = res.data;
                        res.data.questions.forEach(item=>{
                          item.key_name = 'keyname'+ item.id
                        })
                        that.gattrs = res.data.questions
                        if(res.data.jumpurl &&  res.data.jumpurl.indexOf('http') !==-1) {
                          let urid = localStorage.getItem('urid')
                          window.location.href = res.data.jumpurl+'?uid='+urid
                          return
                        }
                        if(res.data.isuser) {
                          this.$router.replace({name:'finish'})
                        }

                        that.flag   =   true;
                        that.loading   =   false;
                        document.title = res.data.title
                    } else {
                        that.$message.error(res.message);
                    }
                })
            })
       },
        methods:{
            refresh () {
                // 如果可以取消就用　confirm
                window.location.reload()
            },
            addsuccess(list){
                console.log(list)
                let query = {
                    acid: this.$route.params.acid,
                    registerinfos: JSON.stringify(list)
                }
                submitmemberinfos(query).then(res=>{
                    if(res.status === 200){
                        // this.$message.success('感谢参与')
                        this.$router.replace({name:'finish'})
                    }
                })
            },
            toTop() {
                this.hover = false;
                this.showBackToTop = false;
                document.body.scrollTop = 0;
                document.documentElement.scrollTop = 0;
            },
            handleResize() {
                this.screenWidth = document.documentElement.clientWidth;
            },
            handleScroll() {
                this.showBackToTop = (document.body.scrollTop || document.documentElement.scrollTop) >= 0.5 * document.body.clientHeight;
            },
            carouselheight:function(){
                return this.screenWidth/10+"px";
            },
        },
        computed:{
            regstatus:function(){
                if(this.matchinfo.submitendtime > Date.parse(new Date())/1000)
                {
                    return true;
                }else{
                    return false;
                }
            },
        },
        data () {
            return {
                categoryinfo:'',
                memberinfo:'',
                flag:false,
                showinfo:'',
                showinfodialogVisible:false,
                disclaimerdialogVisible:false,
                selectinfo:[],
                ruleForm:{},
                memberAttrs:[],
                gattrs:[],
                payinfo:[],
                smallimgcss:'',
                matchinfo:{},
                hover: false,
                showBackToTop: false,
                screenWidth:document.body.clientWidth,
                loading: false
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
    font-size: 14px;
    box-sizing: border-box;
    padding: 30px 10px;
    display: flex;
    align-items: center;
    justify-content: space-around;
    flex-direction: column;
}
</style>
