<?php
  if($_GET['code'])
  {
    $code		=	$_GET['code'];
    $state = $_GET['state'];

    if($state==='h5'){
      $url    =   "https://h5.datatianke.cn/login?code=".$code;
    }

    Header("Location:$url");
  }
?>
