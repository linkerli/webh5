<template>
    <div id="register">
        
        <div class="page-container page-component">
            <mvform :attrs="gattrs" @getAuth="addsuccess"></mvform>
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
            this.throttledresizeHandler = throttle(300, this.handleResize);
            window.addEventListener('resize',this.handleResize);
            this.throttledScrollHandler = throttle(300, this.handleScroll);
            document.addEventListener('scroll', this.throttledScrollHandler);
            this.$nextTick(function() {
                let that = this;
                matchInfo({acid: this.$route.params.acid}).then((res) => {
                    console.log(111)
                    if (res.status === 200) {
                        that.matchinfo = res.data;
                        that.gattrs = res.data.registerform?JSON.parse(res.data.registerform):[]
                        that.flag   =   true;

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
                        this.$message.success('感谢参与')
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
            }
        }
    }
</script>

<style scoped lang="less">
.page-container{
    max-width: 500px;
}
</style>