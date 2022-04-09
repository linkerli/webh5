<template>
<div id="form"  v-loading.fullscreen.lock="loadingstate" :element-loading-text="loadingtext">
    <el-form ref="ruleForm" :model="ruleForm" label-position="top">
        <el-form-item v-for="(v,k) in gattrs" :key="k" :label="v.show_name"  :prop="v.key_name"  :rules="v.validaterules"  >
            <el-input  v-if="v.type==1" v-model="ruleForm[v.key_name]" :placeholder="show?'Please input '+v.show_name : '请输入'+v.show_name"></el-input>
            <el-input type="textarea"  v-if="v.type==2" v-model="ruleForm[v.key_name]"></el-input>
            <el-radio-group  v-if="v.type==3"v-model="ruleForm[v.key_name]" >
                <el-radio :label="a.value"  v-for ="(a,b) in v.options"></el-radio>
            </el-radio-group>

            <el-select v-if="v.type==6" v-model="ruleForm[v.key_name]" clearable :placeholder="show?'Please input '+v.show_name : '请输入'+v.show_name">
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
              v-if="v.type==9"
              v-model="ruleForm[v.key_name]"
              :placeholder="show?'Please select '+v.show_name : '请选择'+v.show_name"
              clearable
              :options="v.options"></el-cascader>


            <div style="position:relative;">
                <el-upload
                        :multiple=false
                        :data="formdata"
                        :show-file-list="false"
                        :on-success="handleSuccess"
                        list-type="picture-card"
                        v-if="v.type==5"
                        class="upload-demo"
                        name="file"
                        :headers="headers"
                        :action="uploadUrl"
                        :before-upload="beforeAvatarUpload"
                        :on-progress="handleAvatarProgress"
                >
                    <span v-if="ruleForm[v.key_name]" class="el-upload-list__item-thumbnail">{{ruleForm[v.key_name]}}</span>
                    <!-- <img  :src="ruleForm[v.key_name]"  v-if="ruleForm[v.key_name]" class="el-upload-list__item-thumbnail"> -->
                    <i class="el-icon-plus" @click="upload(v.key_name)" v-else></i>
                </el-upload>
                <i class="el-icon-close"  v-if="v.type==5&&ruleForm[v.key_name]"    @click="handleRemove(v.key_name)" style="position:absolute;top:-6px;left:142px;color:red;"></i>
            </div>




        </el-form-item>
    </el-form>

</div>
</template>
<script>
    import axios from 'axios'
    import { getToken } from '@/libs/auth'
    export default {
        props: ["gattrs","ruleForm"],
        data () {
            return {
                imgList: [],
                uploadfilename: "",
                loadingstate:false,
                loadingtext:'',
                show:false,
                formdata: {},
                headers: {
                  Authorization: "Bearer " + getToken()
                },
                uploadUrl: '',
                host: '',
                dir: '',
                key_name: ''
            }
        },
        created(){
          axios
            .get(
              "https://api.mdc.movecloud.cn/api/oss-signature?objname=alphamovecloud"
            )
            .then(res => {
              if (res.status * 1 == 200) {
                this.uploadUrl = res.data.data.host;
                this.formdata = {
                  signature: res.data.data.signature,
                  ossAccessKeyId: res.data.data.accessid,
                  policy: res.data.data.policy,
                  key: res.data.data.dir + res.data.sys_time
                };
                this.host = res.data.data.host;
                this.dir = res.data.data.dir + res.data.sys_time;
              }
            });
        },
        methods: {
            upload(key_name){
              this.key_name = key_name
            },
            handleRemove(key_name){
                this.$set(this.ruleForm,key_name,'');
            },
            handleSuccess(res, file, fileList){
                this.imageUrl = this.host + "/" + this.formdata.key;
                // console.log(this.imageUrl,111)
                this.$set(this.ruleForm[this.activeName.split("_")[1]], this.key_name, this.imageUrl);
                this.loadingstate    =   false;
            },
            beforeAvatarUpload(file) {
                const reader = new FileReader();
                reader.readAsDataURL(file);

                reader.onload = event => {
                  this.insideSrc = event.srcElement.result;
                };
                let fileExtension = file.name.split('.').pop().toLowerCase();
                let filename = Math.ceil(Math.random()*1000000)+ "."+fileExtension
                this.formdata.key = this.dir + '/'+filename;
            },

            handleAvatarProgress(){
                this.loadingstate    =   true;
                this.loadingtext     =   "照片上传中...";
            },
            handleSelect(item){
                this.ruleForm   =   item;
            },
        }
        }
</script>
