<template>
  <div id="form"  v-loading.fullscreen.lock="loadingstate">
    <el-form ref="ruleForm" :model="ruleForm" label-position="top">
      <el-form-item v-for="(v,k) in attrs" :key="k" :label="v.title"  :prop="v.key_name"  :rules="v.validaterules" >
        
        <el-input  v-if="v.type=='text'" v-model="ruleForm[v.key_name]" placeholder="请输入"></el-input>
        <el-radio-group  v-if="v.type=='single'" v-model="ruleForm[v.key_name]" >
          <el-radio :label="a.content"  v-for ="(a,b) in v.options" class="block"></el-radio>
        </el-radio-group>
        <el-checkbox-group  v-if="v.type=='multiple'" v-model="ruleForm[v.key_name]">
          <el-checkbox :label="a.content"   v-for ="(a,b) of v.options" class="block"></el-checkbox>
        </el-checkbox-group>
        <el-time-picker
          v-if="v.type=='time'"
          v-model="ruleForm[v.key_name]"
          value-format="HH:mm:ss"
          :picker-options="{
            selectableRange: '08:30:00 - 17:30:00'
          }"
          style="width:100%"
          placeholder="请选择">
        </el-time-picker>
        <el-date-picker
          v-if="v.type=='date'"
          v-model="ruleForm[v.key_name]"
          value-format="yyyy-MM-dd"
          type="date"
          style="width:100%"
          placeholder="请选择">
        </el-date-picker>
        <el-date-picker
          v-if="v.type=='datetime'"
          v-model="ruleForm[v.key_name]"
          value-format="yyyy-MM-dd HH:mm:ss"
          type="datetime"
          style="width:100%"
          placeholder="请选择">
        </el-date-picker>
        <el-rate v-if="v.type=='rate'" v-model="ruleForm[v.key_name]"></el-rate>
        <!-- <el-select v-if="v.type==10" v-model="ruleForm[v.key_name]" clearable :placeholder="show?'Please select '+v.show_name : '请选择'+v.show_name">
          <el-option
            v-for ="(a,b) in v.options"
            :key="a.value"
            :label="a.value"
            :value="a.value">
          </el-option>
        </el-select> -->

        <!-- <el-cascader
          v-if="v.type==8"
          size="large"
          style="width: 100%;"
          :options="options"
          v-model="ruleForm[v.key_name]"
          @change="handleChange"
        >
        </el-cascader> -->
        <div style="position:relative;">
          <el-upload
            :multiple=false
            :show-file-list="false"
            list-type="picture-card"
            v-if="v.type=='upload'"
            class="upload-demo"
            :name="v.key_name"
            action="/"
            :http-request="beforeAvatarUpload"
          >
            <template v-if="ruleForm[v.key_name]">
              <img :src="ruleForm[v.key_name]" class="el-upload-list__item-thumbnail" />
              <!-- <i class="el-icon-paperclip" v-else></i> -->
            </template>

            <i class="el-icon-plus" v-else></i>
          </el-upload>
          <!-- <i class="el-icon-close"  v-if="ruleForm[v.key_name]"  @click="handleRemove(v.key_name)" style="position:absolute;top:-6px;left:142px;color:red;font-size:20px;"></i> -->
        </div>
        <!-- <div v-html="disclaimer" v-if="v.type==12"></div>
        <div class="viewhover" v-if="v.type==12">
            <div class="boder" @click="add(v.key_name)">
              <img :src="ruleForm[v.key_name]"  v-if="ruleForm[v.key_name]" />
              <i class="el-icon-plus" v-else></i>
            </div>
        </div> -->
      </el-form-item>
    </el-form>
    <div style="margin-top:10px; text-align:center;">
      <el-button size="large" type="primary" class="next" style="width:200px;" @click="submitinfo()">提交</el-button>
    </div>
    <el-dialog
      title="电子签字区"
      :visible.sync="centerDialogVisible"
      width="100%"
      :show-close="false"
      center>
      <div class="boder2">
        <vueSignature ref="signature" :w="'100%'" :h="'12rem'" :sigOption="option"></vueSignature>
      </div>

      <span slot="footer" class="dialog-footer">
        <el-button @click="clear">取 消</el-button>
        <el-button type="primary" @click="endHandler">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<style lang="less">

.el-upload-list__item-thumbnail{
  height:auto;
  max-height:100%;
  width:100%;
}
.havechooseimg{
  background-color: rgb(255, 253, 251);
  border: 1px dashed #c0ccda;
  border-radius: 6px;
  box-sizing: border-box;
  width: 148px !important;
  height: 148px !important;
  cursor: pointer;
  line-height: 146px;
  vertical-align: top;
  float: left;
  margin-right:10px;
}
.viewhover{
  background: #ffffff;
  margin-bottom: .2rem;
  box-sizing: border-box;
  padding-bottom: .2rem;
}
.boder{
  border: .01rem solid #0095FF;
  margin: 0 .2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  // width: 100%;
  height: 6rem;
  img{
    width: 100%;
    height: 6rem;
  }
}
.boder2{
  border: .01rem solid #0095FF;
  // display: flex;
  // align-items: center;
  // justify-content: center;
  margin: .2rem;
}
</style>
<script>
import { regionData, CodeToText } from "element-china-area-data";
import COS from 'cos-js-sdk-v5'
import { getconfig } from '@/api/api'
import vueSignature from "vue-signature"
export default {
  props: ["attrs","disclaimer"],
  components: {
    vueSignature
  },
  data(){
    return{
      loadingstate:'',
      uploadfilename: "",
      mymemberlist:'',
      ruleForm:{},
      fileList:[],
      options: regionData,
      matchinfos:this.matchinfo,
      payinfos:this.payinfo,
      memberinfos:this.memberinfo,
      show:false,
      uploadUrl: "https://cos.wenjuan.online/",
      cos: null,
      option: {
          panColor: "rgb(0,0,0)",
          bacgroundColor: "rgb(245,245,245)"
      },
      centerDialogVisible: false,
      key: ''
    }
  },
  watch:{
    attrs: {
      deep: true,
      handler(val) {
        this.setOptions(val)
      }
    }
  },
  methods:{
    clear() {
      this.$refs.signature.clear();
      if(this.ruleForm[this.key]) {
        this.$set(this.ruleForm, this.key, '');
      }
      this.centerDialogVisible = false
    },
    add(key) {
      this.key = key
      this.centerDialogVisible = true
    },
    endHandler() {
      var png = this.$refs.signature.save()
      let that = this
      let file = {
          content: png,
          imgkey: 'file'
      }
      var arr = file.content.split(','), mime = arr[0].match(/:(.*?);/)[1],
      bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
      while (n--) {
          u8arr[n] = bstr.charCodeAt(n);
      }
      var imgkey = 'file'

      let suffix = file.content.split(';')[0].split(':')[1].split('/')[1];
      var filename = 'wenjuanh5/'+  String(new Date().getTime())+'.'+suffix;
      var files = new File([u8arr], `${imgkey}/${filename}`, {type: mime})
      console.log(files)
      this.cos.putObject({
        Bucket: 'gangan-1305592971', /* 必须 */
        Region: 'ap-nanjing',     /* 存储桶所在地域，必须字段 */
        Key: filename,          /* 必须 */ //这里一般用于做拼接字符上传文件名称
        StorageClass: 'STANDARD',
        Body: files, // 上传文件对象
            onTaskReady:(progressData)=>{},//上传任务创建时的回调函数，返回一个 taskId，唯一标识上传任务，可用于上传任务的取消（cancelTask），停止（pauseTask）和重新开始（restartTask）
            onProgress:(progressData)=>{},//文件上传中返回的事件，loaded: 文件大小, total: 已上传大小, speed: 上传速度, percent: 上传进度
            onHashprogress:(progressData)=>{},//文件上传中返回的事件
        },function(err,data){
            // console.log(err,data);  // 上传成功返回给你的
            that.$set(that.ruleForm, that.key, that.uploadUrl+filename);
            that.centerDialogVisible = false
        })
    },
    setOptions(list){
      list.forEach((value,index)=>{
        if(value.value){
          this.$set(this.ruleForm,value.key_name,value.value)
        }else{
          if(value.type == 'multiple'){
            this.$set(this.ruleForm, value.key_name,[])
          } else {
            this.$set(this.ruleForm, value.key_name, '');
          }
        }
        let rules   =   [];
        let actionwords =   "选择";
        if(value.type=='text')
        {
            actionwords =   "输入";
        }
        if(value.require==1)
        {
            if(value.type=='multiple')
            {
                rules.push({ type: 'array', required: true, message: '请'+actionwords+value.show_name, trigger: 'blur change' });
            }else{
                rules.push({required: true, message: '请'+actionwords+value.show_name, trigger: 'blur change' });
            }
        }
        if(value.rules)
        {
            rules.push({ pattern:eval(value.rules), message: value.show_name+'格式有误', trigger: 'blur' });
        }

        value.validaterules   =   rules;
      })
      console.log(list,11)
    },
    handleRemove(key_name){
      this.$set(this.ruleForm,key_name,'');
    },
    handleChange(val) {
      var loc = "";
      for (let i = 0; i < val.length; i++) {
        loc += CodeToText[val[i]];
      }
      console.log(loc)
      // console.log(this.selectedOptions);
      // this.ruleForm.provinceid = this.selectedOptions[0]
      // this.ruleForm.cityid = this.selectedOptions[1]
      // this.ruleForm.districtid = this.selectedOptions[2]
    },
    handleSuccess(res, file, fileList){
      if(res.status==200)
      {
        this.$set(this.ruleForm, res.data.imgkey, res.data.imgurl);
      }else{
        this.$message.error(res.message);
      }
      this.loadingstate    =   false;
    },
    beforeAvatarUpload(params) {
      var file = params.file
      let filename = 'wenjuanh5/'+  file.uid +  Math.ceil(Math.random()*1000000) + file.name
      let that = this
      if(file.size <= 1024*1024*3) {
        //简单上传  适用于小文件上传，大文件建议使用分块上传
        this.cos.putObject({
          Bucket: 'gangan-1305592971', /* 必须 */
          Region: 'ap-nanjing',     /* 存储桶所在地域，必须字段 */
          Key: filename,          /* 必须 */ //这里一般用于做拼接字符上传文件名称
          StorageClass: 'STANDARD',
          Body: file, // 上传文件对象
              onTaskReady:(progressData)=>{},//上传任务创建时的回调函数，返回一个 taskId，唯一标识上传任务，可用于上传任务的取消（cancelTask），停止（pauseTask）和重新开始（restartTask）
              onProgress:(progressData)=>{},//文件上传中返回的事件，loaded: 文件大小, total: 已上传大小, speed: 上传速度, percent: 上传进度
              onHashprogress:(progressData)=>{},//文件上传中返回的事件
          },function(err,data){
              console.log(err,data);  // 上传成功返回给你的
              that.$set(that.ruleForm, params.filename, that.uploadUrl+filename);
          })
      } else {
        //分片上传，适用于大文件的上传。一般根据情况选择使用
        this.cos.sliceUploadFile({
          Bucket: 'gangan-1305592971', /* 必须 */
          Region: 'ap-nanjing',     /* 存储桶所在地域，必须字段 */
          Key: filename,          /* 必须 */ //这里一般用于做拼接字符上传文件名称
          StorageClass: 'STANDARD',
          Body: file, // 上传文件对象
              onTaskReady:(progressData)=>{
                  // taskId = progressData,
              },//上传任务创建时的回调函数，返回一个 taskId，唯一标识上传任务，可用于上传任务的取消（cancelTask），停止（pauseTask）和重新开始（restartTask）
              onProgress:(progressData)=>{},//文件上传中返回的事件，loaded: 文件大小, total: 已上传大小, speed: 上传速度, percent: 上传进度
              onHashprogress:(progressData)=>{},//文件上传中返回的事件
          },function(err,data){
              console.log(err,data);  // 上传成功返回给你的
              that.$set(that.ruleForm, params.filename, that.uploadUrl+filename);
          })
      }
    },

    handleAvatarProgress(){
      this.loadingstate    =   true;
      this.loadingtext     =   "照片上传中...";
    },

    handleSelect(item){
      for(var i in  this.ruleForm)
      {
        for(var j in item)
        {
          if(i==j)
          {
            this.$set(this.ruleForm, i,item[j]);
          }
        }
      }


    },
    querySearch(queryString, cb) {
      var restaurants = this.mymemberlist;
      var results = queryString ? restaurants.filter(this.createFilter(queryString)) : restaurants;
      // 调用 callback 返回建议列表的数据
      cb(results);
    },
    createFilter(queryString) {
      return (restaurant) => {
        return (restaurant.value.indexOf(queryString.toLowerCase()) === 0);
      };
    },
    returnback(){
      this.$emit("addmemberfstatus",false);
    },
    submitinfo(){
      console.log(this.ruleForm)
      this.$refs['ruleForm'].validate((valid) => {
        if(valid)
        {
          this.attrs.forEach((value,index)=>{
            for(let i in this.ruleForm)
            {
              if(value.key_name==i)
              {
                delete value.validaterules;
                value.value =  this.ruleForm[i];
              }
            }
          })
          this.$emit('getAuth', this.attrs)
        }else{
          return false;
        }
      })
    }
  },
  mounted() {
    this.setOptions(this.attrs)
    let _this = this; //改变指向，不然下面的methods内的cos.xxx方法找不到
    _this.cos = new COS({
      getAuthorization:(options,callback)=>{
        getconfig({peoject:'wenjuanh5/*'}).then(res=>{
          if(res.status === 200){
            var credentials = res.data && res.data.credentials;
            if (!res || !credentials) return console.error('credentials invalid');
            callback({
                TmpSecretId: credentials.tmpSecretId, //必须参数
                TmpSecretKey: credentials.tmpSecretKey, //必须参数
                XCosSecurityToken: credentials.sessionToken, //必须参数
                // 建议返回服务器时间作为签名的开始时间，避免用户浏览器本地时间偏差过大导致签名错误
                StartTime: res.data.startTime, // 时间戳，单位秒，如：1580000000
                ExpiredTime: res.data.expiredTime, // 时间戳，单位秒，如：1580000900
                // ScopeLimit: true, // 细粒度控制权限需要设为 true，会限制密钥只在相同请求时重复使用
            });
          }
        })
      }
    })
  }
}
</script>
<style scoped lang="less">
.block {
  display: block;
  margin-bottom: 10px;
}
</style>
