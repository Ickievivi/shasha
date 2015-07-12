var phoneNoArray=new Array();
var app ID ="cyl4xo2aqfxt5bod3qn35y1j1y1ilmd0s1w4nlenatq9m6c5";
var app Key="1c1i0z9nf3d47d54t6hz0kfr3na77rg42ok19oalvag8qg6l";
var Master Key="130hbfgavtkgbqvwypo38ddqnndkvymsi491i62opcnlxva2";
AV.initialize(appid,appkey);

function createCode(){//作废，没有用到
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
  // var crypto=require('crypto');//加载crypto库;https://nodejs.org/api/crypto.html#crypto_crypto
  // var hasher=crypto.createHash('md5');
  // hasher.update(password);
  // var hashpwd=hasher.digest('hex');//hashpwd为加密之后的密码
  // return hashpwd;


          var keyStr = "ABCDEFGHIJKLMNOP" + "QRSTUVWXYZabcdef" + "ghijklmnopqrstuv"
                                + "wxyz0123456789+/" + "=";

                var output = "";
                var chr1, chr2, chr3 = "";
                var enc1, enc2, enc3, enc4 = "";
                var i = 0;
                do {
                        chr1 = input.charCodeAt(i++);
                        chr2 = input.charCodeAt(i++);
                        chr3 = input.charCodeAt(i++);
                        enc1 = chr1 >> 2;
                        enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
                        enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
                        enc4 = chr3 & 63;
                        if (isNaN(chr2)) {
                                enc3 = enc4 = 64;
                        } else if (isNaN(chr3)) {
                                enc4 = 64;
                        }
                        output = output + keyStr.charAt(enc1) + keyStr.charAt(enc2)
                                        + keyStr.charAt(enc3) + keyStr.charAt(enc4);
                        chr1 = chr2 = chr3 = "";
                        enc1 = enc2 = enc3 = enc4 = "";
                } while (i < input.length);

                return output;

}

//注册1
function RegisterFirst(phoneNo){
  var date=new Date();
  var hour=date.getHours().parseInt();
  var minute=date.getMinutes().parseInt();
  //格式
  if(!phoneNo){
    return [204,"号码为空"];
  }else if(phoneNo.length!=11){
    return [400,"号码格式有误！"];
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
          op:'注册',
          ttl:1
        }).then(function(){
          //发送成功
          return [200,"注册短信发送成功"];
        },function(err){
          //发送失败
          return [500,"注册短信发送失败"];
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
    op:'注册',
    ttl:1
  }).then(function(){
    //发送成功
    return [200,"注册短信发送成功"];
  },function(err){
    //发送失败
    return [500,"注册短信发送失败"];
  });
}

//注册2
function RegisterSecond(name,avatar,phoneNo,verificationCode,password){
  var user=new AV.User();
  user.set("username",name);
  user.set("avatar",avatar);
  user.set("mobilePhoneNumber",phoneNo);
  user.set("password",hash(password));

//
//
//
  //如果头像为空，应该给一个默认的头像，这个怎么给？

  AV.User.verifyMobilePhone(verificationCode).then(function(){
    //验证成功
    user.signUp(null,{
      success:function(user){
        //注册成功
        return [200,"注册成功"];
      },
      error:function(user,error){
        //失败
        alert("Error:"+error.code+" "+error.message);
      }
    });
  },function(err){
    //验证失败
    alert("Error:"+error.code+" "+error.message);//这个message应写验证码输入错误。
  })


}

//登陆
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

//修改个人信息
function UpdateInfo(userInfo[]){
  var user=AV.User.current();
  //如果用户名不为空，且系统中不重复，为用户修改为新的用户名

  //如果头像不为空，为用户修改为新的头像


}

//忘记密码1
function ForgetPasswordFirst(username){
  //查找用户信息，向用户手机发送验证短信
  var query=new AV.Query(AV.User);
  query.get("username".{
    success:function(user){
      //成功获得用户实例
      AV.Cloud.requestSmsCode({
        mobilePhoneNumber:user.mobilePhoneNumber,
        name:'pin',
        op:'找回密码',
        ttl:1
      }).then(function(){
        //发送成功
        return [200,"找回密码短信发送成功"];
      },function(err){
        //发送失败
        return [500,"找回密码短信发送失败"];
      });
    },
    error:function(user,error){
      //失败，未找到用户
      return [500,"未找到相关用户"];
    }
  })；

}

//忘记密码2
function ForgetPasswordSecond(username,password,verificationCode){
  var user=AV.User.current();

  //校验验证码是否正确
  AV.User.verifyMobilePhone(verificationCode).then(function(){
    //验证成功，将密码加密，并设置为用户的新密码，返回状态码
    success:function(user){
      user.setPassword(hash(password));
      user.save();
      return [200,"修改成功"];
    },
    error:function(user,error){
      //修改失败
      alert("Error:"+error.code+" "+error.message);
    }
  },function(err){
    //验证失败，返回状态码，提示错误信息
    alert("Error:"+error.code+" "+error.message);//这个message应写验证码输入错误。
  });

}

//重设密码
function UpdatePassword(oldPassword,newPassword){
  //新旧密码均不为空
  if(!oldPassword){
    return [204,"旧密码为空"];
  }
  if(!newPassword){
    return [204,"新密码为空"];
  }
  //新旧密码不能相同
  if(oldPassword.equalTo(newPassword)){
    return [400,"新密码与旧密码相同"];
  }
  //新旧密码加密
  var hashOldPwd=hash(oldPassword);
  var hashNewPwd=hash(newPassword);
  //现在的用户
  var user=AV.User.current();
  //旧密码与User的密码比对，如果一致，将密码修改为新密码，返回状态码
  if(user.password.equalTo(hashOldPwd)){//这个判断相同的方法是否正确？？？？？
    user.setPassword(hashNewPwd);
    success:function(){
      //更新成功
      return [200,'成功重设密码'];
    },
    //如果不一致，返回状态码，提示错误信息
    error:function(err){
      //更新失败
      return [500,'无法重设密码'];
    }
  }

}
