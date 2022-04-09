<template>
  <div id="app">
    <router-view />
  </div>
</template>
<script>
export default {
  name: 'App'
}
</script>
<style lang="less">
@blockspace:12px;
@import 'assets/styles/common.css';
@import 'assets/styles/fonts/style.css';
.el-message-box{
  width:80%;
  max-width:500px;
  min-width:300px;
}
html, body {
  margin: 0;
  padding: 0;
  height: 100%;
  background-color:#F2F2F2;
}

.main-cnt{
  min-height:100%;
}


#app {
  height: 100%;
  min-width:300px;
  .meta{
    padding:10px;
    .description{
      background-color:#FFF;
      padding:10px;

    }
  }
}
.meta{
  .meta{
    padding:0px !important;
  }
}
body {
  font-family: 'Helvetica Neue',Helvetica,'PingFang SC','Hiragino Sans GB','Microsoft YaHei',SimSun,sans-serif;
  overflow: auto;
  font-weight: 400;
  -webkit-font-smoothing: antialiased;
  /*background:url('http://cdn.moveclub.cn/uploads/iosfix/fix_1513222264.png') repeat left top;*/

}
a {
  color: #4078c0;
  text-decoration: none;
}
code {
  background-color: #f9fafc;
  padding: 0 4px;
  border: 1px solid #eaeefb;
  border-radius: 4px;
}
button, input, select, textarea {
  font-family: inherit;
  font-size: inherit;
  line-height: inherit;
  color: inherit;
}
.hljs {
  line-height: 1.8;
  font-family: Menlo, Monaco, Consolas, Courier, monospace;
  font-size: 12px;
  padding: 18px 24px;
  background-color: #f9fafc;
  border: solid 1px #eaeefb;
  margin-bottom: 25px;
  border-radius: 4px;
  -webkit-font-smoothing: auto;
}
.fa-icon {
  width: auto;
  height: 1em; /* or any other relative font sizes */
  margin-right:2px;
}


.containers,.container,.page-container{
  width: 1140px;
  margin: 0 auto;
}

.page-container {
  margin-top:1%;
  margin-bottom:2.5%;
}



@media (max-width: 768px) {
  .el-card__body{
    padding:10px;
  }
  .el-card__header{
    padding:10px;
    font-size:14px;

  }

  .containers,.container
  {
    width: 100%;
  }
  .page-container{
    width:95%;
  }

  body{
    background:none;
  }
  .el-carousel__button{
    width: 8px !important;
    height: 8px !important;
  }
}
.logindialog{
  max-width:480px !important;
  .el-dialog__body{
  }
  .el-dialog__header{
    display:none;
  }
  .el-tabs__item{
    font-size:20px !important;
  }
}
.regimage{
  max-width:100px;
  height:auto;
}
.el-radio{
  margin-right:15px;
  margin-left:0px !important;
}
.router-fade-enter-active, .router-fade-leave-active {
  transition: opacity .3s;
}
.router-fade-enter, .router-fade-leave-active {
  opacity: 0;
}
.el-select{
  width: 100%;
}
//定义全局  布局

.box-card-main{
  margin:20px 0;
  >.el-card__body{
    padding:0px;
    >.el-card{
      margin:20px;
    }
  }
}

@media (max-width: 768px) {

  .box-card-main{
    margin:0;
    border-radius:0px;
    border-style:none;

  }

  .pay-footer{
    position:fixed;
    bottom:0px;
    left:0px;
    width:100%;
  }
  .payfooter{
    display:flex;
    justify-content:space-around;
    .el-button+.el-button{
      margin:0;
    }
    button{
      color:#fff !important;
      font-weight:bold;
      flex-grow:1;
      padding-left:0;
      padding-right:0;
      margin-left:0;
      margin-right:0;
      border-radius:0px;
      &:first-child{
        background-color:#191920;
        border:1px solid #191920;
      }
      &:last-child{
        background-color:#f5a623;
        border:1px solid #f5a623;
      }
    }
  }

}
@font-face {
  font-family: 'sysfont';
  src: url('/static/font/MFLiHei_Noncommercial-Regular.otf') format('truetype');
}
.blur{
  -webkit-filter: blur(10px); /* Chrome, Opera */
  -moz-filter: blur(10px);
  -ms-filter: blur(10px);
  filter: blur(10px);

}



@media (max-width: 767px)
{

  .tab-title{
    position: relative;
    width: 200px;
    font-family: sysfont;
    color: #000000;
    text-align: center;
    font-size: 20px;
    margin: 0 auto;
  }

  .tab-title:before,.tab-title:after {
    width: 30px;
    height: 3px;
    background: #000;
    position: absolute;
    left:20px;
    top: 12px;
    content: "";
  }
  .tab-title:after{
    left:150px ;
  }


}
@media (min-width: 768px)
{


  .tab-title{
    position: relative;
    width: 200px;
    font-family: sysfont;
    color: #000000;
    text-align: center;
    font-size: 30px;
    margin: 0 auto;

  }

  .tab-title:before,.tab-title:after {
    width: 30px;
    height: 3px;
    background: #000;
    position: absolute;
    left:-10px;
    top: 20px;
    content: "";
  }
  .tab-title:after{
    left:180px ;
  }



}



</style>
