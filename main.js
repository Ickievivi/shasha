var phoneNoArray=new Array();
var app ID ="cyl4xo2aqfxt5bod3qn35y1j1y1ilmd0s1w4nlenatq9m6c5";
var app Key="1c1i0z9nf3d47d54t6hz0kfr3na77rg42ok19oalvag8qg6l";
var Master Key="130hbfgavtkgbqvwypo38ddqnndkvymsi491i62opcnlxva2";

function createCode(){
  code="";
  var codeLength=4;
  var checkCode=document.getElementById("code");
  var random=new Array(0,1,2,3,4,5,6,7,8,9,'A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R',
     'S','T','U','V','W','X','Y','Z');
  for(var i=0;i<codeLength;i++){
    var index=Math.floor(Math.random()*36);
    code += random[index];
  }
  return code;
}

//hash加密
function hash(password){
  var crypto=require('crypto');
  var hasher=crypto.createHash('md5');
  hasher.update(password);
  var hashpwd=hasher.digest('hex');//hashpwd为加密之后的数据
  return hashpwd;
}

function RegisterFirst(phoneNo){
  var date=new Date();
  var hour=date.getHours().parseInt();
  var minute=date.getMinutes().parseInt();
  //格式
  if(!phoneNo){
    return [204,"号码为空"];
  }else if(phoneNo.length!=11){
    return [400,"手机格式有误！"];
  }

  for(var i=phoneNoArray.length;i>0;i--){
    if(phoneNoArray[i].phoneNo==phoneNo){
      if(phoneNoArray[i].hour==hour){
        if(phoneNoArray[i].munite-minute<=1){
          return [400,"1分钟后才能重新获取"];
        }
      }
      else{
        //生成验证码
        var pCode=createCode();
        //加入数组
        phoneNoArray.push({hour:hour,minute:minute,phoneNo:phoneNo,pCode:pCode});
        AV.Cloud.requestSmsCode({
          mobilePhoneNumber:phoneNo,
          name:'pin',
          op:pCode,
          ttl:1
        }).then(function(){
          //发送成功
          return [200,"成功"];
        },function(err){
          //发送失败
          return [500,"失败"];
        });
      }
    }
  }

  //生成验证码
  var pCode=createCode();
  //加入数组
  phoneNoArray.push({hour:hour,minute:minute,phoneNo:phoneNo,pCode:pCode});
  AV.Cloud.requestSmsCode({
    mobilePhoneNumber:phoneNo,
    name:'pin',
    op:pCode,
    ttl:1
  }).then(function(){
    //发送成功
    return [200,"成功"];
  },function(err){
    //发送失败
    return [500,"失败"];
  });
}

function RegisterSecond(name,avatar,phoneNo,verificationCode,password){
  var user=new AV.User();
  user.set("username",name);
  user.set("avatar",avatar)
  user.set("mobilePhoneNumber",phoneNo);
  user.set("password",hash(password));

  user.signUp(null,{
    success:function(user){
      //注册成功
      return [200,"成功"];
    },
    error:function(user,error){
      //失败
      alert("Error:"+error.code+" "+error.message);
    }
  });
}

function Login(username,password){
  AV.User.lonIn(username,password,{
    success:function(user){
      //登陆成功
    },
    error:function(user,error){
      //登陆失败
    }

  });
}
