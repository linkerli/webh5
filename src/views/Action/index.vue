<template>
    <div>
        
        <div v-if="!matchinfo.isuser" class="page-container page-component">
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
        <div v-else class="nobody">
            <span>您的答卷已经提交，感谢您的参与！</span>
            <el-steps :active="3" finish-status="success">
                <el-step title="填写表单"></el-step>
                <el-step title="提交表单"></el-step>
                <el-step title="完成提交"></el-step>
            </el-steps>
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
            this.$nextTick(() => {
                let that = this;
                matchInfo({acid: this.$route.params.acid}).then((res) => {
                    if (res.status === 200) {
                        that.$message.success(res.message);
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