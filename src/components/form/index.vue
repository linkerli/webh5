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

        <el-select v-if="v.type==6" v-model="ruleForm[v.key_name]" clearable :placeholder="show?'Please select '+v.show_name : '请选择'+v.show_name">
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
        <!-- <div style="position:relative;">
          <el-upload
            :multiple=false
            :data="{imgkey:v.key_name}"
            :show-file-list="false"
            :on-success="handleSuccess"
            accept="image/*"
            list-type="picture-card"
            v-if="v.type==5"
            class="upload-demo"
            :name="v.key_name"
            :action="$ajax.uploadurl"
            :before-upload="beforeAvatarUpload"
            :on-progress="handleAvatarProgress"
          >
            <img  :src="ruleForm[v.key_name]"  v-if="ruleForm[v.key_name]" class="el-upload-list__item-thumbnail">
            <i class="el-icon-plus" v-else></i>
          </el-upload>
          <i class="el-icon-close"  v-if="v.type==5&&ruleForm[v.key_name]"    @click="handleRemove(v.key_name)" style="position:absolute;top:-6px;left:142px;color:red;"></i>
        </div> -->

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
      show:false
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
          if(value.type == 3||value.type == 9){
            if(typeof(value.options)=='string') value.options = JSON.parse(value.options);
            this.$set(this.ruleForm,value.key_name,value.options[0].value)
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
    beforeAvatarUpload(file) {
      const isLt2M = file.size / 1024 / 1024 < 5;


      if (!isLt2M) {
        this.$message.error('上传图片大小不能超过 5MB!');
      }
      return  isLt2M;
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
                      loc += CodeToText[this.ruleForm[i][j]];
                    }
                
                    value.value =  loc;
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
  }
}
</script>
