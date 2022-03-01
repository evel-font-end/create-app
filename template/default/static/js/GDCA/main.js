var gsSelectUser = '';
var gsSelectContainer = '';
var gUserList = [];
var gIsLogin = false;
var gIsScan = false;
var t1;
var t2;

function clearForm() {
    //testForm.dev_info.value = "";
    testForm.sign_cert.value = "";
    testForm.enc_cert.value = "";
    testForm.CertInfo.value = "";
    testForm.CertInfo2.value = "";
    testForm.SignMsgInfo.value = "";
    testForm.SignedData.value = "";
    testForm.signed_msg.value = "";
    testForm.EncryptedData.value = "";
    testForm.DecryptedData.value = "";
    testForm.RandomData.value = "";
    testForm.xml_signed.value = "";
    testForm.xml_sign_info.value = "";
}

function OnEncryptPlainDataChannged(obj) {
	document.getElementById('enc_pdata_len').innerHTML = parseInt(obj.value.length);
}

function UpdateProtocol() {
	var proto = parseInt(get_radio_val('test_protocol'));

	$GDCA.setProtocol(proto);

	g_login = false;
}

function parse_trustid(trustid) {
	if(trustid.substr(0, 2) == '..') return trustid.substr(2);
	return trustid;
}

function ClearListBox(obj_id) {
	$('#'+obj_id).html('');
}

window.onload=function(){
	testForm.api_version.value = "";

	clearForm();

	testForm.xml_sign_plain.value = '' + 
'<?xml version="1.0" encoding="utf-8"?>\n' +
'<info title="title">\n' +
'   <intro>信息</intro>\n' +
'    <list id="001">\n' +
'     <head>auto_userone</head>\n' +
'     <name>Jordy</name>\n' +
'     <number>12345678</number>\n' +
'     <age>20</age>\n' +
'     <sex>Man</sex>\n' +
'     <hobby>看电影</hobby>\n' +
'    </list>\n' +
'</info>';

	UpdateProtocol();
	
	$("input:radio[name='test_protocol']").change(function (){
		UpdateProtocol();
	});

	//$GDCA.onDeviceNotify(function(dev_evt){
	//	if(dev_evt == DEV_EVENT_ARRIVAL) show_msg('设备插入', 1500);
	//	if(dev_evt == DEV_EVENT_REMOVE) show_msg('设备拔出', 1500);
	//});
};


function ctlScanFunc(enable) {
	document.getElementById('scan_opt').style.display=enable?'inline':'none';
}

window.onbeforeunload = function(){
}  

window.onunload = function(){  
}  

function ShowError(e)
{
    if(e.ErrorMsg != undefined){
        alert("操作错误:\n消息:" + e.ErrorMsg + "\n代码:0x" + e.ErrorCode.toString(16).toUpperCase());
    }
    else
        alert("Exception:\n" + e.ErrorMsg);
}


function ReSetData()
{
    gsSelectUser = "";
    gsSelectContainer = "";
}

function OnCertTypeChange()
{
    testForm.CertData.value = "";
}

function OnUserSelected()
{
    ReSetData();
    clearForm();

    var Index = testForm.UserList.options.selectedIndex;

    var sUser = gUserList[Index];

    var UserInfo = sUser.split("||");
    
    gsSelectUser = UserInfo[0];
    gsSelectContainer = UserInfo[1];

	gIsScan = gsSelectContainer == 'SCAN_CONTAINER';

	ctlScanFunc(gIsScan);
}

function OnEncFileChanged() {
    var sPath = document.getElementById('EncInFilePath').value;
    document.getElementById('EncOutFilePath').value = FilePathAddSufix(sPath, "_encrypted");
}

function OnDecFileChanged() {
    var sPath = document.getElementById('DecInFilePath').value;
    document.getElementById('DecOutFilePath').value = FilePathAddSufix(sPath, "_decrypted");
}

function OnExtEncFileChanged() {
    var sPath = document.getElementById('ExtEncInFilePath').value;
    document.getElementById('ExtEncOutFilePath').value = FilePathAddSufix(sPath, "_encrypted");
}

function OnExtDecFileChanged() {
    var sPath = document.getElementById('ExtDecInFilePath').value;
    document.getElementById('ExtDecOutFilePath').value = FilePathAddSufix(sPath, "_decrypted");
}

function CheckCert(cert_type)
{
    if(cert_type == CERT_TYPE_SIGN && testForm.sign_cert.value == '')
    {
        alert("签名证书为空");
        return false;
    }
    else if(cert_type == CERT_TYPE_EXCHANGE && testForm.enc_cert.value == '')
    {
        alert("加密证书为空");
        return false;
    }

    return true;
}

function CheckUser()
{
    if(gsSelectContainer == '')
    {
        alert("请先选择用户");
        return false;
    }

    return true;
}

function CheckLogin()
{
	if(gIsScan) return true;
	
    if(!gIsLogin)
    {
        alert("请先登录");
        return false;
    }

    return true;
}

function CheckScan()
{
    if(gIsScan){
	    alert("本功能不支持一扫签");
	    return false;
    }

    return true;
}

function SetInDataFormat()
{
	var indata_format = parseInt(document.getElementById('indata_format').value);
	
	$GDCA.apiConfig(SOF_SET_INDATA_FORMAT, indata_format, function(res){
		alert("设置成功");
	},function(err){
		ShowError(err);
	});
}

function Test_GetVersion()
{
	testForm.api_version.value = '';
	
	t1 = new Date().getTime();

    $GDCA.getVersion(function(res){
	    t2 = new Date().getTime();
	    
		testForm.api_version.value = res;
	    testForm.elapse1.value = t2 - t1;
	},function(err){
		ShowError(err);
	});
}

function Test_GetProductVersion()
{
	var product_type = parseInt(testForm.product_type.value);
	
	testForm.product_version.value = '';
	
	t1 = new Date().getTime();

    $GDCA.getProductVersion(product_type, function(res){
	    t2 = new Date().getTime();
	    
		testForm.product_version.value = res;
	    testForm.elapse2.value = t2 - t1;
	},function(err){
		ShowError(err);
	});
}

function Test_EnumDevice()
{
	testForm.enum_dev.value = '';
	
	t1 = new Date().getTime();

    $GDCA.enumDevice(function(res){
	    t2 = new Date().getTime();
	    
		testForm.enum_dev.value = res;
	    testForm.elapse46.value = t2 - t1;

		var devTypeList = JSON.parse(res);
		if(devTypeList.length == 0){
			alert("没有检测到UKey");
		}
	    
	},function(err){
		ShowError(err);
	});
}

function Test_EnumUser(obj)
{
	document.getElementById("UserList").options.length = 0; 
	
	t1 = new Date().getTime();

	obj.disabled=true;

    $GDCA.getUserList("0", function(res){
	    t2 = new Date().getTime();

		gUserList = res;

        for (i = 0; i < res.length; i++)
            testForm.UserList.options.add(new Option(res[i]), i);

		testForm.UserList.options[0].selected=true;
		
	    testForm.elapse2.value = t2 - t1;

		OnUserSelected();

		obj.disabled=false;

	},function(err){
		obj.disabled=false;
		ShowError(err);
	});

}

function Test_GetDeviceInfo()
{
	$('textarea[id="dev_info"]').val('');
	
	var devInfoType = parseInt(testForm.DevInfoType.value, 16);
	
	t1 = new Date().getTime();

    $GDCA.getDeviceInfo(gsSelectContainer,devInfoType, function(res){
	    t2 = new Date().getTime();
        testForm.dev_info.value = res;
	    testForm.elapse3.value = t2 - t1;
	},function(err){
		testForm.dev_info.value = "";
		var errCode = parseInt(err.ErrorCode, 16);

		if(errCode == SOR_NotSupportYetErr)
			alert("设备不支持此属性！");
		else
			ShowError(err);
	});
}

function Test_Login()
{
    if(!CheckScan()) return;
       
    if(!CheckUser())
       return;
       
    var sPassword = testForm.password.value;
    if(sPassword == "")
    {
        alert("请输入密码!");
        return;
    }
        
	t1 = new Date().getTime();

    $GDCA.Login(gsSelectContainer,sPassword,function(res){
	    t2 = new Date().getTime();
	    alert("登录成功");
        gIsLogin = true;
	    testForm.elapse4.value = t2 - t1;
	},function(err){
		ShowError(err);
	});
}

function Test_Finalize()
{
    $GDCA.finalize(function(res){
	    alert('清理成功！');
	},function(err){
		ShowError(err);
	});
}

function Test_GetPinRetryCount()
{
	testForm.PinRetryCount.value = '';
	
	if(!CheckScan()) return;
	
    if(!CheckUser())
        return;

	t1 = new Date().getTime();

    $GDCA.getPinRetryCount(gsSelectContainer,function(res){
	    t2 = new Date().getTime();
        testForm.PinRetryCount.value = res;
	    testForm.elapse5.value = t2 - t1;
	},function(err){
		ShowError(err);
	});
}

function Test_ChangePassWd()
{
	if(!CheckScan()) return;
	
    if(!CheckUser())
        return;
        
    var oldpin = testForm.OldPassword.value;
    var newpin = testForm.NewPassword.value;
    if(oldpin == "" || newpin == "")
    {
        alert("请输入完整!");
        return;
    }
        
	t1 = new Date().getTime();

    $GDCA.ChangePin(gsSelectContainer,oldpin,newpin,function(res){
	    t2 = new Date().getTime();
        alert("修改密码成功");
	    testForm.elapse6.value = t2 - t1;
	},function(err){
		ShowError(err);
	});
}

function Test_ReadUserCert(certType)
{
    if(!CheckUser())
        return;
        
    var cert_type = parseInt(certType);
    var time1 = new Date().getTime();
	var sContainer = gsSelectContainer;
	
	if(testForm.CertSource.value == "1") sContainer += "_FromSign";
	if(testForm.reg_cert.checked) sContainer += "_RegCert";
		
	t1 = new Date().getTime();
	
	if(cert_type == 1){
		testForm.sign_cert.value = '';
	    $GDCA.exportUserCert(sContainer,function(res){
		    t2 = new Date().getTime();
		    testForm.sign_cert.value = res;
		    testForm.elapse7.value = t2 - t1;
		},function(err){
			ShowError(err);
		});
	}else{
		testForm.enc_cert.value = '';
	    $GDCA.exportExChangeUserCert(sContainer,function(res){
		    t2 = new Date().getTime();
		    testForm.enc_cert.value = res;
		    testForm.elapse8.value = t2 - t1;
		},function(err){
			ShowError(err);
		});
	}

}

var g_info = '';
var g_info_count = 0;
var g_time = 0;

function GetCertInfo(title, usercert, info_type, obj) {

	$('textarea[id="CertInfo"]').val('');

	t1 = new Date().getTime();
	
	$GDCA.getCertInfo(usercert, info_type, function(res){
		t2 = new Date().getTime();
		g_time += t2 - t1;
		g_info += title + res + '\n';
		g_info_count++;
		
		if(g_info_count == 26){
			g_info_count = 0;
			$('textarea[id="CertInfo"]').val(g_info);
			testForm.elapse9.value = g_time;
			g_time = 0;
			g_info = '';
			obj.disabled=false;
		}
	},function(err){
		g_info_count++;
		if(g_info_count == 26){
			g_info_count = 0;
			$('textarea[id="CertInfo"]').val(g_info);
			testForm.elapse9.value = g_time;
			g_time = 0;
			g_info = '';
			obj.disabled=false;
		}
	});
}

function Test_GetCertInfo(obj)
{
    var info_type = parseInt(testForm.CertInfoType.value, 16);
	var cert_type = parseInt(testForm.CertType1.value);
	var usercert = '';

	$('textarea[id="CertInfo"]').val('');
	
    if(!CheckCert(cert_type))
        return;

	obj.disabled=true;

	usercert = (cert_type == CERT_TYPE_SIGN)?testForm.sign_cert.value:testForm.enc_cert.value;
    
	if(info_type == 0){
        GetCertInfo('证书版本: ', usercert, SGD_CERT_VERISON, obj);
        GetCertInfo('证书序列号: ', usercert, SGD_CERT_SERIAL, obj);
        GetCertInfo('签名算法: ', usercert, SGD_CERT_SIGNALG, obj);
		GetCertInfo('证书颁发者信息: ', usercert, SGD_CERT_ISSUER, obj);
		GetCertInfo('证书有效期: ', usercert, SGD_CERT_VALID_TIME, obj);
		GetCertInfo('证书拥有者信息: ', usercert, SGD_CERT_SUBJECT, obj);
		GetCertInfo('证书公钥信息: ', usercert, SGD_CERT_DER_PUBLIC_KEY, obj);
		GetCertInfo('证书扩展项信息: ', usercert, SGD_CERT_DER_EXTENSIONS, obj);
		GetCertInfo('颁发者密钥标识符: ', usercert, SGD_EXT_AUTHORITYKEYIDENTIFIER_INFO, obj);
		GetCertInfo('证书持有者密钥标识符: ', usercert, SGD_EXT_SUBJECTKEYIDENTIFIER_INFO, obj);
		GetCertInfo('密钥用途: ', usercert, SGD_EXT_KEYUSAGE_INFO, obj);
		GetCertInfo('私钥有效期: ', usercert, SGD_EXT_PRIVATEKEYUSAGEPERIOD_INFO, obj);
		GetCertInfo('证书策略: ', usercert, SGD_EXT_CERTIFICATEPOLICIES_INFO, obj);
		GetCertInfo('策略映射: ', usercert, SGD_EXT_POLICYMAPPINGS_INFO, obj);
		GetCertInfo('基本限制: ', usercert, SGD_EXT_BASICCONSTRAINTS_INFO, obj);
		GetCertInfo('策略限制: ', usercert, SGD_EXT_POLICYCONTRAINTS_INFO, obj);
		GetCertInfo('扩展密钥用途: ', usercert, SGD_EXT_EXTKEYUSAGE_INFO, obj);
		GetCertInfo('CRL发布点: ', usercert, SGD_EXT_CRLDISTRIBUTIONPOINTS_INFO, obj);
		GetCertInfo('Netscape属性: ', usercert, SGD_EXT_NETSCAPE_CERT_TYPE_INFO, obj);
		GetCertInfo('证书颁发者CN: ', usercert, SGD_CERT_ISSUER_CN, obj);
		GetCertInfo('证书颁发者O: ', usercert, SGD_CERT_ISSUER_O, obj);
		GetCertInfo('证书颁发者OU: ', usercert, SGD_CERT_ISSUER_OU, obj);
		GetCertInfo('证书拥有者信息CN: ', usercert, SGD_CERT_SUBJECT_CN, obj);
		GetCertInfo('证书拥有者信息O: ', usercert, SGD_CERT_SUBJECT_O, obj);
		GetCertInfo('证书拥有者信息OU: ', usercert, SGD_CERT_SUBJECT_OU, obj);
		GetCertInfo('证书拥有者信息EMAIL: ', usercert, SGD_CERT_SUBJECT_EMAIL, obj);

	}else{
		t1 = new Date().getTime();
		
		$GDCA.getCertInfo(usercert, info_type, function(res){
			t2 = new Date().getTime();
			testForm.elapse9.value = t2 - t1;
		    $('textarea[id="CertInfo"]').val(res);
		    obj.disabled=false;
		},function(err){
			$('textarea[id="CertInfo"]').val("");
			ShowError(err);
		});
	}
}

function Test_GetCertInfoByOid()
{
    var oid_name = testForm.OIDNameSel.value;
	var cert_type = parseInt(testForm.CertType2.value);
	var usercert = '';

	testForm.CertInfo2.value = '';
	
    if(!CheckCert(cert_type))
        return;

	usercert = (cert_type == CERT_TYPE_SIGN)?testForm.sign_cert.value:testForm.enc_cert.value;

    if(oid_name == "0"){
        if(testForm.OID.value == '')
        {
            alert("请填写OID");
            return;
        }
        oid_name = testForm.OID.value;
    }

	t1 = new Date().getTime();
	
	$GDCA.getCertInfoByOid(usercert, oid_name, function(res){
		t2 = new Date().getTime();

		if(oid_name == '1.2.86.21.1.3') res = parse_trustid(res);
		testForm.CertInfo2.value = res;
		testForm.elapse10.value = t2 - t1;
	},function(err){
		//针对其它CA证书的情况，获取唯一标识失败，返回证书序列号，
		$GDCA.getCertInfo(usercert, SGD_CERT_SERIAL, function(res){
			t2 = new Date().getTime();
			testForm.elapse10.value = t2 - t1;
			testForm.CertInfo2.value = res;
		},function(err){
			testForm.CertInfo2.value = "";
			ShowError(err);
		});
	});
}

function Test_ValidateCert()
{
	var cert_type = parseInt(testForm.CertType3.value);
	var usercert = '';
	
    if(!CheckCert(cert_type))
        return;
        
	usercert = (cert_type == CERT_TYPE_SIGN)?testForm.sign_cert.value:testForm.enc_cert.value;
	
	t1 = new Date().getTime();
	
	$GDCA.validateCert(usercert, function(res){
		t2 = new Date().getTime();
		testForm.elapse11.value = t2 - t1;
		alert("证书验证通过");
	},function(err){
		var errCode = parseInt(err.ErrorCode, 10);
		
		switch (errCode) 
		{
			case SOF_CERT_NOT_TRUSTED:
				alert("证书验证失败：证书不被信任！");
				break;
				
			case SOF_CERT_HASEXPIRED:
				alert("证书验证失败：证书已过有效期！");
				break;
				
			case SOF_CERT_REVOKED:
				alert("证书验证失败：证书已被吊销！");
				break;
				
			case SOF_CERT_FROZEN:
				alert("证书验证失败：证书已被冻结！");
				break;
				
			case SOF_CERT_NOTYETVALID:
				alert("证书验证失败：证书未生效！");
				break;
				
			case SOF_CERT_OTHER_ERR:
				alert("证书验证失败！");
				break;
				
			default:
				alert("证书验证失败(0x" + err.ErrorCode.toUpperCase() + ")！");
				break;
		}
	});
}

function Test_Sign()
{
	testForm.SignedData.value = '';
	
    if(!CheckUser())
        return;

	var sSignPlainData = testForm.SignPlainData.value;
	
	t1 = new Date().getTime();
	
	$GDCA.signData(gsSelectContainer, sSignPlainData, function(res){
		t2 = new Date().getTime();
		testForm.SignedData.value = res;
		testForm.elapse12.value = t2 - t1;
		alert("P1签名成功");
	},function(err){
		var errCode = parseInt(err.ErrorCode, 16);

		//此处错误码判断，需要4.1.7以上版本
		if(errCode == SOR_RsaEncErr || errCode == SOR_ECCEncErr)
			alert("P1签名失败，请确认是否登录!");
		else if(errCode == SOF_CERT_HASEXPIRED)
			alert("P1签名失败，证书已过期!");
		else if(errCode == SOF_CERT_REVOKED)
			alert("P1签名失败，证书已被吊销!");
		else if(errCode == SOF_CERT_NOT_TRUSTED)
			alert("P1签名失败，证书不被信任!");
		else if(errCode == SOR_IndataErr)
			alert("P1签名失败：原文不是Base64格式!");
		else
			ShowError(err);
	});
}

function Test_Verify()
{
    var sign_cert = testForm.sign_cert.value;
    var sSignPlainData = testForm.SignPlainData.value;
    var sSignedDataB64 = testForm.SignedData.value;
    
	if(sign_cert.length == 0 || sign_cert == null){
		alert("签名证书为空");
		return;
	}
	
	t1 = new Date().getTime();
	
	$GDCA.verifySignedData(sign_cert, sSignPlainData, sSignedDataB64, function(res){
		t2 = new Date().getTime();
		testForm.elapse13.value = t2 - t1;
		alert("P1验签成功");
	},function(err){
		ShowError(err);
	});
}

function Test_SignMessage()
{
	testForm.signed_msg.value = '';
	
    if(!CheckUser())
        return;

    var plain_data = testForm.signmsg_plain_data.value;
    var sign_flag = parseInt(testForm.sign_flag.value);
    var indata_format = parseInt(testForm.indata_format.value);

	if(indata_format == INDATA_FMT_BASE64 && sign_flag == SIGN_FLAG_WITH_ORI){
		alert('带原文不支持Base64格式输入！');
		return;
	}
    
	t1 = new Date().getTime();
	
	$GDCA.signMessage(gsSelectContainer, plain_data, sign_flag, function(res){
		t2 = new Date().getTime();
		testForm.signed_msg.value = res;
		testForm.elapse14.value = t2 - t1;
		alert("P7签名成功");
	},function(err){
		var errCode = parseInt(err.ErrorCode, 16);

		//此处错误码判断，需要4.1.7以上版本
		if(errCode == SOR_P7SignErr)
			alert("P7签名失败，请确认是否登录!");
		else if(errCode == SOF_CERT_HASEXPIRED)
			alert("P7签名失败，证书已过期!");
		else if(errCode == SOF_CERT_REVOKED)
			alert("P7签名失败，证书已被吊销!");
		else if(errCode == SOF_CERT_NOT_TRUSTED)
			alert("P7签名失败，证书不被信任!");
		else if(errCode == SOR_IndataErr)
			alert("P7签名失败：原文不是Base64格式!");
		else
			ShowError(err);
	});
}

function Test_VerifyMessage()
{
    var signed_msg = testForm.signed_msg.value;
    var plain_data = testForm.signmsg_plain_data.value;
    var sign_flag = parseInt(testForm.sign_flag.value);
    
	if(sign_flag == SIGN_FLAG_WITH_ORI) plain_data = null;
	
	t1 = new Date().getTime();

	$GDCA.verifySignedMessage(signed_msg, plain_data, function(res){
		t2 = new Date().getTime();
		testForm.elapse15.value = t2 - t1;
		alert("P7验签成功");
	},function(err){
		ShowError(err);
	});
}

function Test_ParseSignMessage()
{
	var signed_msg = testForm.signed_msg.value;
    var iParseType = parseInt(testForm.ParseType.value);

	testForm.SignMsgInfo.value = '';
    
	t1 = new Date().getTime();
	
	$GDCA.getInfoFromSignedMessage(signed_msg, iParseType, function(res){
		t2 = new Date().getTime();
		testForm.SignMsgInfo.value = res;
		testForm.elapse16.value = t2 - t1;
	},function(err){
		ShowError(err);
	});

}

function Test_SetEnvelopType()
{
	var envType = parseInt(testForm.EnvType.value)
	
	$GDCA.setEnvelopType(envType, function(res){
		alert("设置成功");
	},function(err){
		ShowError(err);
	});
}

function Test_Encrypt()
{
	testForm.EncryptedData.value = '';
	
	if(!CheckScan()) return;
	
    var sEncryptPlainData = testForm.EncryptPlainData.value;

    if(!CheckCert(CERT_TYPE_EXCHANGE))
        return;
        
	t1 = new Date().getTime();
	
	$GDCA.encryptData(testForm.enc_cert.value, sEncryptPlainData, function(res){
		t2 = new Date().getTime();
		testForm.EncryptedData.value = res;
		testForm.elapse17.value = t2 - t1;
		alert("P7加密成功");
	},function(err){
		ShowError(err);
	});
}

function Test_Decrypt()
{
	testForm.DecryptedData.value = '';
	
	if(!CheckScan()) return;
	
    if(!CheckUser())
        return;
	
	var sEncryptedDataB64 = testForm.EncryptedData.value;
	var sEncryptPlainData = testForm.EncryptPlainData.value;
	
	t1 = new Date().getTime();
	
	$GDCA.decryptData(gsSelectContainer, sEncryptedDataB64, function(res){
		t2 = new Date().getTime();

		if(sEncryptPlainData == res)
			alert("P7解密成功");
		else
			alert("P7解密失败,解密出结果和原文不相等");
		
		testForm.DecryptedData.value = res;
		testForm.elapse18.value = t2 - t1;
		
	},function(err){
		var errCode = parseInt(err.ErrorCode, 16);

		//此处错误码判断，需要4.1.7以上版本
		if(errCode == SOR_P7DecErr)
			alert("P7解密失败，请确认是否登录!")
		else
			ShowError(err);
	});
}

function Test_GenRandom()
{
	var gen_len = parseInt(testForm.RandomLen.value);

	testForm.RandomData.value = '';
	
	t1 = new Date().getTime();
	
	$GDCA.genRandData(gen_len, function(res){
		t2 = new Date().getTime();
		testForm.RandomData.value = res;
		testForm.elapse19.value = t2 - t1;
	},function(err){
		ShowError(err);
	});
}


function Test_Ext_isLogin()
{
	if(!CheckScan()) return;
       
    if(!CheckUser())
       return;
       
	t1 = new Date().getTime();

    $GDCA.isLogin(gsSelectContainer, 1, function(res){
	    t2 = new Date().getTime();
	    alert(res?"已登录":"未登录");
	    testForm.elapse51.value = t2 - t1;
	},function(err){
		ShowError(err);
	});
}

function Test_Ext_Logout()
{
	if(!CheckScan()) return;
       
    if(!CheckUser())
       return;
       
	t1 = new Date().getTime();

    $GDCA.Logout(gsSelectContainer, 1, function(res){
	    t2 = new Date().getTime();
	    alert("登出成功");
        gIsLogin = false;
	    testForm.elapse52.value = t2 - t1;
	},function(err){
		ShowError(err);
	});
}

function Test_Ext_ReadLabel()
{
	if(!CheckScan()) return;
	
	var lable_name = testForm.preset_lable_name.value;
	var lable_type = GDCA_LBL_EXDATA;

	if(lable_name == "custom"){
		lable_type = GDCA_LBL_EXDATA;
		lable_name = testForm.custom_lable_name.value;
	}else if(lable_name == LAB_USERCERT_SIG)
		lable_type = GDCA_LBL_SIGNCERT;
	else if(lable_name == LAB_USERCERT_ENC)
		lable_type = GDCA_LBL_ENCCERT;
	else if(lable_name == CA_CERT)
		lable_type = GDCA_LBL_CACERT;
	
	t1 = new Date().getTime();
	
	$GDCA.readLable(gsSelectContainer, lable_name, lable_type, function(res){
		t2 = new Date().getTime();
		testForm.LabelData.value = res;
		testForm.elapse53.value = t2 - t1;
	},function(err){
		if(parseInt(err.ErrorCode, 16) == SOR_CertNotFountErr)
			alert("标签不存在！");
		else
        	ShowError(err);
	});
}

function Test_Ext_WriteUsrDataFile()
{
	if(!CheckScan()) return;

	if(testForm.WriteData.value.length == 0){
		alert("写入数据为空！");
		return;
	}
	
	var userpin = testForm.FilePIN.value;
	var nFileType = parseInt(testForm.FileType.value, 16);
	var nFileIndex = parseInt(testForm.FileIndex.value, 10);
	var nFileOffset = parseInt(testForm.FileOffset.value, 10);
	var sWriteData = gdca_base64.encode(testForm.WriteData.value);
	
	t1 = new Date().getTime();
	
	$GDCA.writeUsrDataFile(gsSelectContainer, userpin, nFileType, nFileIndex,nFileOffset,sWriteData, function(res){
		t2 = new Date().getTime();
		alert("写入成功");
		testForm.elapse23.value = t2 - t1;
	},function(err){
		var errCode = parseInt(err.ErrorCode, 16);
		
		if(errCode == SOR_IndataErr)
			alert("写多用户数据失败：写入数据不是Base64格式");
		else
			ShowError(err);
	});
}


function Test_Ext_ReadUsrDataFile()
{
	if(!CheckScan()) return;
	
	var nFileType = parseInt(testForm.FileType.value, 16);
	var nFileIndex = parseInt(testForm.FileIndex.value, 10);
	var nFileOffset = parseInt(testForm.FileOffset.value, 10);
	var nReadLen = parseInt(testForm.ReadLen.value, 10);
	
	t1 = new Date().getTime();
	
	$GDCA.readUsrDataFile(gsSelectContainer, nFileType, nFileIndex,nFileOffset,nReadLen, function(res){
		t2 = new Date().getTime();
		testForm.ReadData.value = res;
		testForm.ReadDataBase64DecodeData.value = gdca_base64.decode(res);  
		testForm.elapse24.value = t2 - t1;
	},function(err){
		ShowError(err);
	});
}

function Test_Ext_HashFile()
{
	var nHashAlgo = parseInt(testForm.HashAlgo.value, 16);
	var filepath = $('#hash_file_path').val();

	testForm.HashResult.value = '';

	if(1 == nHashAlgo)//sm3
    {
		if(!CheckScan()) return;
		
        if(!CheckCert(CERT_TYPE_SIGN))
            return;
            
        var userid = $('#userid').val();
		var sign_cert = testForm.sign_cert.value;

		t1 = new Date().getTime();

        $GDCA.getCertInfo(sign_cert, SGD_CERT_DER_PUBLIC_KEY, function(res){
			$GDCA.hashFile(nHashAlgo, filepath, res, userid,function(res1){
				t2 = new Date().getTime();
		        testForm.HashResult.value = res1;
		        alert("文件哈希成功");
        		testForm.elapse25.value = t2 - t1;
			},function(err){
				var errCode = parseInt(err.ErrorCode, 16);
				
				if(errCode == SOR_FileErr)
					alert("文件打开错误，请确认输入文件是否存在!")
				else
					ShowError(err);
			});
		},function(err){
			
		});
   	}
	else
	{
		t1 = new Date().getTime();
		
		$GDCA.hashFile(nHashAlgo, filepath, "", "", function(res){
			t2 = new Date().getTime();
	        testForm.HashResult.value = res;
	        alert("文件哈希成功");
    		testForm.elapse25.value = t2 - t1;
		},function(err){
			var errCode = parseInt(err.ErrorCode, 16);
			
			if(errCode == SOR_FileErr)
				alert("文件打开错误，请确认输入文件是否存在!")
			else
				ShowError(err);
		});
	}
}

function Test_Ext_TspGetTime()
{
 
}


function Test_Ext_TspGetStamp()
{
}

function Test_Ext_TspVerifyStamp()
{

}


function Test_Ext_TspGetFileStamp()
{
 
}

function Test_Ext_TspVerifyFileStamp()
{
 
}


function Test_Ext_Base64Encode()
{

}

function Test_Ext_Base64Decode()
{
 
}

function Test_PKCS7_File_Encrypt()
{
	if(!CheckScan()) return;
	
	var sEnc_cert = testForm.enc_cert.value;
	var sInFilePath = testForm.EncInFilePath.value;
    var sOutFilePath = testForm.EncOutFilePath.value;

    if(!CheckCert(CERT_TYPE_EXCHANGE))
        return;
        
	t1 = new Date().getTime();
	
	$GDCA.encryptFile(sEnc_cert, sInFilePath,sOutFilePath, function(res){
		t2 = new Date().getTime();
		testForm.elapse34.value = t2 - t1;
		alert("P7文件加密成功");
	},function(err){
		ShowError(err);
	});
}

function Test_PKCS7_File_Decrypt()
{
	if(!CheckScan()) return;
	
    if(!CheckUser())
        return;
	
	 var sInFilePath = testForm.DecInFilePath.value;
     var sOutFilePath = testForm.DecOutFilePath.value;
	
	t1 = new Date().getTime();
	
	$GDCA.decryptFile(gsSelectContainer, sInFilePath, sOutFilePath, function(res){
		t2 = new Date().getTime();
		testForm.elapse35.value = t2 - t1;
		alert("P7文件解密成功");
	},function(err){
		var errCode = parseInt(err.ErrorCode, 16);

		//此处错误码判断，需要4.1.7以上版本
		if(errCode == SOR_P7DecErr){
			alert("P7文件解密失败，请确认是否登录!");
		}
		else{
			ShowError(err);
		}
	});
}

function Test_PKCS1_File_Sign()
{
	testForm.FileSignedValue.value = '';
    if(!CheckUser())
       return;

	var sInFilePath = testForm.SignInFilePath.value;

	t1 = new Date().getTime();
	
	$GDCA.signFile(
		gsSelectContainer, 
		sInFilePath, 
		function(res){
			t2 = new Date().getTime();		
			testForm.elapse36.value = t2 - t1;
			testForm.FileSignedValue.value = res;
			alert("P1文件签名成功");
		},
		function(err){
			var errCode = parseInt(err.ErrorCode, 16);

			//此处错误码判断，需要4.1.7以上版本
			if(errCode == SOR_RsaEncErr || errCode == SOR_ECCEncErr)
				alert("P1文件签名失败，请确认是否登录!");
			else if(errCode == SOF_CERT_HASEXPIRED)
				alert("P1文件签名失败，证书已过期!");
			else if(errCode == SOF_CERT_REVOKED)
				alert("P1文件签名失败，证书已被吊销!");
			else if(errCode == SOF_CERT_NOT_TRUSTED)
				alert("P1文件签名失败，证书不被信任!");
			else
				ShowError(err);
		}		
	);
}

function Test_PKCS1_File_VerifySign()
{
    var sign_cert = testForm.sign_cert.value;  
	var sInFilePath = testForm.SignInFilePath.value;
    var sSignedValue64 = testForm.FileSignedValue.value;

	if(sign_cert.length == 0 || sign_cert == null){
		alert("签名证书为空");
		return;
	}
	
	t1 = new Date().getTime();
	
	$GDCA.verifySignedFile(sign_cert, sInFilePath, sSignedValue64, function(res){
		t2 = new Date().getTime();
		testForm.elapse37.value = t2 - t1;
		alert("P1文件验签成功");
	},function(err){
		ShowError(err);
	});
}

function Test_XMLSign()
{
	testForm.xml_signed.value = '';

    if(!CheckUser())
        return;

	var xml_sign_plain = testForm.xml_sign_plain.value;
	
	t1 = new Date().getTime();
	
	$GDCA.signXML(gsSelectContainer, xml_sign_plain, function(res){
		t2 = new Date().getTime();
		testForm.xml_signed.value = res;
		testForm.elapse40.value = t2 - t1;
		alert("XML签名成功");
	},function(err){
		var errCode = parseInt(err.ErrorCode, 16);

		//此处错误码判断，需要4.1.7以上版本
		if(errCode == SOR_RsaEncErr || errCode == SOR_ECCEncErr)
			alert("XML签名失败，请确认是否登录!")
		else if(errCode == SOF_CERT_HASEXPIRED)
			alert("XML签名失败，证书已过期!");
		else if(errCode == SOF_CERT_REVOKED)
			alert("XML签名失败，证书已被吊销!");
		else if(errCode == SOF_CERT_NOT_TRUSTED)
			alert("XML签名失败，证书不被信任!");
		else
			ShowError(err);
	});
}

function Test_VerifyXMLSign()
{
	var xml_signed = testForm.xml_signed.value;
	
	t1 = new Date().getTime();

	$GDCA.verifyXMLSign(xml_signed, function(res){
		t2 = new Date().getTime();
		testForm.elapse41.value = t2 - t1;
		alert("验签成功");
	},function(err){
		ShowError(err);
	});
}

function Test_ParseXMLSignResult()
{
    var xml_signed = testForm.xml_signed.value;
    var xml_info_type = parseInt(testForm.xml_info_type.value);

	testForm.xml_sign_info.value = '';
    
	t1 = new Date().getTime();

	$GDCA.parseXMLSign(xml_signed, xml_info_type, function(res){
		t2 = new Date().getTime();
		testForm.xml_sign_info.value = res;
		testForm.elapse42.value = t2 - t1;
	},function(err){
		ShowError(err);
	});
}

function Test_Ext_GM_TspGetTime()
{
	$('#gm_tsp_time').val('');
	
	t1 = new Date().getTime();

	$GDCA.tspGetTime(function(res){
		t2 = new Date().getTime();
		$('#gm_tsp_time').val(res);
		testForm.elapse43.value = t2 - t1;
		alert("获取时间戳成功");
	},function(err){
		ShowError(err);
	});
}

function Test_Ext_GM_TspSealTimeStamp()
{
	var in_data = testForm.gm_tsp_in_data.value;
	var algType = parseInt(testForm.gm_tsp_alg_type.value, 16);
	var codeType = parseInt(testForm.gm_tsp_indata_code.value);
	
	$('#gm_tsp_timestamp').val('');

	t1 = new Date().getTime();
	
	$GDCA.tspSealTimeStamp(in_data, algType, function(res){
		t2 = new Date().getTime();
		$('#gm_tsp_timestamp').val(res);
		testForm.elapse44.value = t2 - t1;
		alert("加盖时间戳成功");
	},function(err){
		if(codeType == 2 && errCode == SOR_IndataErr)
			alert("输入数据错误，必须是base64格式！");
		else
			ShowError(err);
	});
}

function Test_Ext_GM_TspVerifyTimeStamp()
{
	var gm_tsp_in_data = $('#gm_tsp_in_data').val();
	var gm_tsp_timestamp = $('#gm_tsp_timestamp').val();
	var cert = '';

	$('#gm_tsp_verify_result').val('');

	t1 = new Date().getTime();
	
	$GDCA.tspVerifyTimeStamp(gm_tsp_in_data, gm_tsp_timestamp, cert, function(res){
		t2 = new Date().getTime();
		$('#gm_tsp_verify_result').val(res);
		testForm.elapse45.value = t2 - t1;
		alert('验证时间戳成功');
	},function(err){
		ShowError(err);
	});
}

//接口控制
var apiControl = function(obj, ctrl_name, ctrl_cmd){
    if(!CheckUser())
        return;
        
	var ctrl_cmd = get_radio_val(ctrl_cmd);

	t1 = new Date().getTime();

	$GDCA.apiControl(gsSelectContainer, ctrl_name, ctrl_cmd, function(res){
		t2 = new Date().getTime();
		testForm.elapse47.value = t2 - t1;
		alert('设置成功');
	},function(err){
		ShowError(err);
	});

	return false;
};

//签名验签循环
var OnLoopSignStart = function(obj){

    if(!CheckUser())
        return;

	var test_num = parseInt($('#sign_test_num').val());
	var indata_max_len = parseInt($('#sign_indata_max_len').val());
	var sign_cert = testForm.sign_cert.value;

	obj.disabled=true;

	ClearListBox('sign_test_result')

	var total = 1;
	
	var runFn = function(){
        if(total <= test_num){
			var l = 1 + Math.ceil(Math.random() * indata_max_len);
			var indata = genRandString(l);
			var now1 = new Date();
			var msecs1 = now1.getTime();
			
            $GDCA.signData(gsSelectContainer,indata,function(res){
				$GDCA.verifySignedData(sign_cert,indata,res,function(res1){
					var now2 = new Date();
					var msecs2 = now2.getTime();
					var msecs = msecs2 - msecs1;
					
					$('#sign_test_result').append('<div>第'+total+'次测试通过 长度:'+l+' 耗时:'+msecs+'ms</div>');

					total++;
					runFn();
				},function(err){
					var txt = 'code='+err.ErrorCode+',msg='+err.ErrorMsg;
					$('#sign_test_result').append('<div class="war_msg">第'+total+'次测试失败 长度:'+l+' 信息:'+txt+'</div>');
					total++;
					runFn();
				});
				//total++;
				//runFn();
			},function(err){
				var txt = 'code='+err.ErrorCode+',msg='+err.ErrorMsg;
				$('#sign_test_result').append('<div class="war_msg">第'+total+'次测试失败 长度:'+l+' 信息:'+txt+'</div>');
				total++;
				runFn();
			});
        }else{
	        obj.disabled=false;
        }
    };

    runFn();

	return false;
};

//消息签名验签循环
var OnLoopSignMessageStart = function(obj){

    if(!CheckUser())
        return;

	var test_num = parseInt($('#signmsg_test_num').val());
	var indata_max_len = parseInt($('#signmsg_indata_max_len').val());
	var signmsg_flag = parseInt(testForm.signmsg_flag.value);

	obj.disabled=true;

	ClearListBox('signmsg_test_result')
	
	var total = 1;
	var runFn = function(){
        if(total <= test_num){
			var l = 1 + Math.ceil(Math.random() * indata_max_len);
			var indata = genRandString(l);
			var now1 = new Date();
			var msecs1 = now1.getTime();
			
            $GDCA.signMessage(gsSelectContainer,indata, signmsg_flag, function(res){
                
                if(signmsg_flag == SIGN_FLAG_WITH_ORI) indata = null;
                
				$GDCA.verifySignedMessage(res,indata,function(res1){
					var now2 = new Date();
					var msecs2 = now2.getTime();
					var msecs = msecs2 - msecs1;
					
					$('#signmsg_test_result').append('<div>第'+total+'次测试通过 长度:'+l+' 耗时:'+msecs+'ms</div>');

					total++;
					runFn();
				},function(err){
					var txt = 'code='+err.ErrorCode+',msg='+err.ErrorMsg;
					$('#signmsg_test_result').append('<div class="war_msg">第'+total+'次测试失败 长度:'+l+' 信息:'+txt+'</div>');
					total++;
					runFn();
				});
				//total++;
				//runFn();
			},function(err){
				var txt = 'code='+err.ErrorCode+',msg='+err.ErrorMsg;
				$('#signmsg_test_result').append('<div class="war_msg">第'+total+'次测试失败 长度:'+l+' 信息:'+txt+'</div>');
				total++;
				runFn();
			});
        }else{
	        obj.disabled=false;
        }
    };

    runFn();

	return false;
};

var total = 1;

var OnLoopCryptStart = function(obj){

    if(!CheckUser())
        return;

	var test_num = parseInt($('#crypt_test_num').val());
	var indata_max_len = parseInt($('#crypt_indata_max_len').val());
	var enc_cert = testForm.enc_cert.value;

	obj.disabled=true;

	ClearListBox('crypt_test_result')

	total = 1;

	var runFn = function(){
        if(total <= test_num){
			var l = 1 + Math.ceil(Math.random() * indata_max_len);
			var indata = genRandString(l);
			var now1 = new Date();
			var msecs1 = now1.getTime();
			
            $GDCA.encryptData(enc_cert,indata,function(res){
				$GDCA.decryptData(gsSelectContainer,res,function(res1){
					var now2 = new Date();
					var msecs2 = now2.getTime();
					var msecs = msecs2 - msecs1;

					if(res1 == indata)
						$('#crypt_test_result').append('<div>第'+total+'次测试通过 长度:'+l+' 耗时:'+msecs+'ms</div>');
					else
						$('#crypt_test_result').append('<div class="war_msg">第'+total+'次测试失败 长度:'+l+' 解密明文与原文不符</div>');

					total++;
					runFn();
				},function(err){
					var txt = 'code='+err.ErrorCode+',msg='+err.ErrorMsg;
					$('#crypt_test_result').append('<div class="war_msg">第'+total+'次测试失败 长度:'+l+' 信息:'+txt+'</div>');
					total++;
					runFn();
				});
				
			},function(err){
				var txt = 'code='+err.ErrorCode+',msg='+err.ErrorMsg;
				$('#crypt_test_result').append('<div class="war_msg">第'+total+'次测试失败 长度:'+l+' 信息:'+txt+'</div>');
				total++;
				runFn();
			});
        }else{
	        obj.disabled=false;
        }
    };

    runFn();

	return false;
};

function Test_SymmEncFile()
{
	var symmAlg = parseInt(testForm.symmAlg.value, 16);
	var symmKey = testForm.symmKey.value;
	var symmIV = testForm.symmIV.value;
	var inFilePath = $('#symmFileEncInPath').val();
	var outFilePath = $('#symmFileEncOutPath').val();

	t1 = new Date().getTime();
	
	$GDCA.symmEncFile(symmAlg, symmKey, symmIV, inFilePath, outFilePath, function(res){
		t2 = new Date().getTime();
        alert("加密成功");
		testForm.elapse48.value = t2 - t1;
	},function(err){
		var errCode = parseInt(err.ErrorCode, 16);
		if(errCode == SOR_IndataLenErr)
			alert("密钥或初始向量长度不正确，3DES为24，其它算法16")
		else if(errCode == SOR_FileErr)
			alert("文件打开错误，请确认输入文件是否存在!")
		else
			ShowError(err);
	});
}

function Test_SymmDecFile()
{
	var symmAlg = parseInt(testForm.symmAlg.value, 16);
	var symmKey = testForm.symmKey.value;
	var symmIV = testForm.symmIV.value;
	var inFilePath = $('#symmFileDecInPath').val();
	var outFilePath = $('#symmFileDecOutPath').val();

	t1 = new Date().getTime();
	
	$GDCA.symmDecFile(symmAlg, symmKey, symmIV, inFilePath, outFilePath, function(res){
		t2 = new Date().getTime();
        alert("解密成功");
		testForm.elapse49.value = t2 - t1;
	},function(err){
		var errCode = parseInt(err.ErrorCode, 16);
		if(errCode == SOR_IndataLenErr)
			alert("密钥或初始向量长度不正确，3DES为24，其它算法16")
		else if(errCode == SOR_FileErr)
			alert("文件打开错误，请确认输入文件是否存在!")
		else
			ShowError(err);
	});
}

function Test_GetDeviceType()
{
	testForm.dev_type.value = '';
	
	t1 = new Date().getTime();

    $GDCA.getDeviceType(function(res){
	    t2 = new Date().getTime();
	    
		testForm.dev_type.value = res;
	    testForm.elapse50.value = t2 - t1;
	},function(err){
		ShowError(err);
	});
}

function UpdateSetSupportDevFlags()
{
	var dev_szca_3000gm = document.getElementById('dev_szca_3000gm');
	var dev_szca_ht = document.getElementById('dev_szca_ht');
	var dev_netca = document.getElementById('dev_netca');
	var dev_bjca_lg = document.getElementById('dev_bjca_lg');
	var dev_bjca_ztxa = document.getElementById('dev_bjca_ztxa');
	var dev_longmai = document.getElementById('dev_longmai');
	var setVal = 0;

	if(dev_szca_3000gm.checked)
		setVal |= DEV_SZCA_3000GM;

	if(dev_szca_ht.checked)
		setVal |= DEV_SZCA_HAITAI;
		
	if(dev_netca.checked)
		setVal |= DEV_NETCA;

	if(dev_bjca_lg.checked)
		setVal |= DEV_BJCA_LINGUO;

	if(dev_bjca_ztxa.checked)
		setVal |= DEV_BJCA_ZTXA;

	if(dev_longmai.checked)
		setVal |= DEV_LONGMAI;

	testForm.dev_flags.value = setVal;
}

function SelectAllDevice()
{
	var dev_szca_3000gm = document.getElementById('dev_szca_3000gm');
	var dev_szca_ht = document.getElementById('dev_szca_ht');
	var dev_netca = document.getElementById('dev_netca');
	var dev_bjca_lg = document.getElementById('dev_bjca_lg');
	var dev_bjca_ztxa = document.getElementById('dev_bjca_ztxa');
	var dev_longmai = document.getElementById('dev_longmai');

	dev_szca_3000gm.checked = true;
	dev_szca_ht.checked = true;
	dev_netca.checked = true;
	dev_bjca_lg.checked = true;
	dev_bjca_ztxa.checked = true;
	dev_longmai.checked = true;

	UpdateSetSupportDevFlags();
}

function SupportDeviceClick()
{
	var dev_szca_3000gm = document.getElementById('dev_szca_3000gm');
	var dev_szca_ht = document.getElementById('dev_szca_ht');
	var dev_netca = document.getElementById('dev_netca');
	var dev_bjca_lg = document.getElementById('dev_bjca_lg');
	var dev_bjca_ztxa = document.getElementById('dev_bjca_ztxa');
	var dev_longmai = document.getElementById('dev_longmai');

	UpdateSetSupportDevFlags();
}

function Test_ConfigSupportDevice()
{
	var dev_flags = parseInt(testForm.dev_flags.value);
	
	$GDCA.apiConfig(SOF_SET_SUPPORT_DEVICE, dev_flags, function(res){
		alert("设置成功");
	},function(err){
		ShowError(err);
	});
}


////////////////////////////////////////////////////////////////////////

function Test_Pkcs7_File_Sign()
{
	testForm.P7SignedValue.value = '';
    if(!CheckUser())
       return;

	var sInFilePath = testForm.P7_SignInFilePath.value;
	var psignfile_flag = parseInt(testForm.signfile_flag.value);

	t1 = new Date().getTime();
	
	$GDCA.Pkcs7_SignFile(
		gsSelectContainer, 
		sInFilePath, 
		psignfile_flag,
		function(res){
			t2 = new Date().getTime();		
			testForm.elapse38.value = t2 - t1;
			testForm.P7SignedValue.value = res;
			alert("P7文件签名成功");
		},
		function(err){			
			var errCode = parseInt(err.ErrorCode, 16);

			//此处错误码判断，需要4.1.7以上版本
			if(errCode == SOR_P7SignErr)
				alert("P7签名失败，请确认是否登录!");
			else if(errCode == SOF_CERT_HASEXPIRED)
				alert("P7签名失败，证书已过期!");
			else if(errCode == SOF_CERT_REVOKED)
				alert("P7签名失败，证书已被吊销!");
			else if(errCode == SOF_CERT_NOT_TRUSTED)
				alert("P7签名失败，证书不被信任!");
			else
				ShowError(err);
		}		
	);
}

function Test_Pkcs7_File_VerifySign()
{
	var signed_msg = testForm.P7SignedValue.value;
    var sInFilePath = testForm.P7_SignInFilePath.value;
    var psignfile_flag = parseInt(testForm.signfile_flag.value);
    
	//if(sign_flag == SIGN_FLAG_WITH_ORI) plain_data = null;
	
	t1 = new Date().getTime();

	$GDCA.Pkcs7_verifySignFile(signed_msg, sInFilePath, psignfile_flag,function(res){
		t2 = new Date().getTime();
		testForm.elapse39.value = t2 - t1;
		alert("P7验签成功");
	},function(err){
		ShowError(err);
	});
}



