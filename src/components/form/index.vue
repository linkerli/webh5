<template>
  <div id="form"  v-loading.fullscreen.lock="loadingstate">
    <el-form ref="ruleForm" :model="ruleForm" label-position="top">
      <el-form-item v-for="(v,k) in attrs" :key="k" :label="v.show_name"  :prop="v.key_name"  :rules="v.validaterules" >

        <el-input  v-if="v.type==1&&v.key_name!='mv_name'" v-model="ruleForm[v.key_name]" :placeholder="show?'Please input '+v.show_name : '请输入'+v.show_name"></el-input>
        <el-input  v-if="v.type==1&&$route.name=='invitregister'&&v.key_name=='mv_name'" v-model="ruleForm[v.key_name]" ></el-input>

        <el-autocomplete
          v-if="v.key_name=='mv_name'&&$route.name!='invitregister'"
          v-model="ruleForm[v.key_name]"
          :fetch-suggestions="querySearch"
          @select="handleSelect"
          style="display:block;"
          :placeholder="show?'Please input '+v.show_name : '请输入'+v.show_name"
        ></el-autocomplete>



        <el-input type="textarea"  v-if="v.type==2" v-model="ruleForm[v.key_name]"></el-input>



        <el-radio-group  v-if="v.type==3" v-model="ruleForm[v.key_name]" >
          <el-radio :label="a.value"  v-for ="(a,b) in v.options"></el-radio>
        </el-radio-group>
        <el-date-picker
          v-if="v.type==7"
          v-model="ruleForm[v.key_name]"
          value-format="yyyy-MM-dd HH:mm:ss"
          type="datetime"
          style="width:100%"
          :placeholder="show?'Please input '+v.show_name : '请输入'+v.show_name">
        </el-date-picker>

        <el-select v-if="v.type==10" v-model="ruleForm[v.key_name]" clearable :placeholder="show?'Please select '+v.show_name : '请选择'+v.show_name">
          <el-option
            v-for ="(a,b) in v.options"
            :key="a.value"
            :label="a.value"
            :value="a.value">
          </el-option>
        </el-select>
        <el-checkbox-group  v-if="v.type==4" v-model="ruleForm[v.key_name]">
          <el-checkbox :label="a.value"   v-for ="(a,b) of v.options"></el-checkbox>
        </el-checkbox-group>
        <el-cascader
          v-if="v.type==8"
          size="large"
          style="width: 100%;"
          :options="options"
          v-model="ruleForm[v.key_name]"
          @change="handleChange"
        >
        </el-cascader>
        <div style="position:relative;">
          <el-upload
            :multiple=false
            :show-file-list="false"
            list-type="picture-card"
            v-if="(v.type==5 || v.type==6)"
            class="upload-demo"
            :name="v.key_name"
            action="/"
            :http-request="beforeAvatarUpload"
          >
            <template v-if="ruleForm[v.key_name]">
              <img  :src="ruleForm[v.key_name]"  v-if="v.type==5" class="el-upload-list__item-thumbnail" />
              <i class="el-icon-paperclip" v-else></i>
            </template>

            <i class="el-icon-plus" v-else></i>
          </el-upload>
          <!-- <i class="el-icon-close"  v-if="ruleForm[v.key_name]"  @click="handleRemove(v.key_name)" style="position:absolute;top:-6px;left:142px;color:red;font-size:20px;"></i> -->
        </div>

      </el-form-item>
    </el-form>
    <div style="margin-top:10px; text-align:center;">
      <el-button size="large" type="primary" class="next" style="width:200px;" @click="submitinfo()">提交</el-button>
    </div>
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
</style>
<script>
import Cookies from 'js-cookie';
import { regionData, CodeToText } from "element-china-area-data";
import COS from 'cos-js-sdk-v5'
import { getconfig } from '@/api/api'
export default {
  props: ["attrs"],
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
      cos: null
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
    setOptions(list){
      list.forEach((value,index)=>{
        if(value.value){
          this.$set(this.ruleForm,value.key_name,value.value)
        }else{
          if(value.type == 3||value.type == 4||value.type == 9||value.type == 10){
            if(typeof(value.options)=='string') value.options = JSON.parse(value.options);
            if(value.type == 4) {
              this.$set(this.ruleForm,value.key_name,[])
            } else {
              this.$set(this.ruleForm,value.key_name,'')
            }

          } else {
            this.$set(this.ruleForm, value.key_name, '');
          }
        }
        let rules   =   [];
        let actionwords =   "选择";
        if(value.type==1||value.type==2)
        {
            actionwords =   "输入";
        }
        if(value.required==1)
        {
            if(value.type==4)
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

        //证件号码
        if(value.key_name=='mv_idnumber')
        {
            rules.push({ validator: (rule, value, callback) => {
                //判断当前的 证件证类型
                let idtype  =   this.ruleForm['mv_idtype'];
                if(idtype=='身份证')
                {
                    if(!this.$util.IsIdCardNo(value)){
                        return callback(new Error('证件格式有误'));
                    }else{
                        if (parseInt(value.substr(16, 1)) % 2 == 1) {
                            this.ruleForm['mv_sex']='男';
                        } else {
                            this.ruleForm['mv_sex']='女';
                        }
                    }
                }

                callback();

            }, trigger: 'blur change' });
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
                if(value.type==8)
                {
                    //去重复
                    var loc = "";
                    for (let j = 0; j < this.ruleForm[i].length; j++) {
                      loc += CodeToText[this.ruleForm[i][j]] + '/';
                    }
                    value.value =  loc.substring(0,loc.length-1);
                }else{
                    value.value =  this.ruleForm[i];
                }
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
