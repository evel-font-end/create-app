var dhWeb;
var timeoutLoginCount = 0; //超时重登次数统计
var socketLoginCount = 0; //socket断开重登次数统计
var repeatLoginCount = 0; //账号重复登录次数统计
$(function() {
	$('div.split-pane').splitPane();
	setVideoSize();	
	dhWeb = new DHAlarmWeb();
	if(localStorage.getItem("dhUname")){
		$('#uname').val(localStorage.getItem("dhUname"));
	}
	if(localStorage.getItem("dhPwd")){
		$('#pwd').val(localStorage.getItem("dhPwd"));
	}
	if(localStorage.getItem("dhPwd")){
		$('#serverIp').val(localStorage.getItem("dhServerIp"));
	}
	if(localStorage.getItem("dhPort")){
		$('#port').val(localStorage.getItem("dhPort"));
	}
	$('.videoDiv').height($('#top-component').height()-60);
	$(".videoDiv").resize(function(){
		setVideoSize();
	})
	$("#top-component").resize(function(){
		$('.videoDiv').height($('#top-component').height()-60);
	})
	$('#loginBtn').click(function(){
		var port = $('#port').val() == "" ? 8088 : $('#port').val();
		dhWeb.setWebsocketPort({dataWsPort: port,mediaWsPort: port});
		dhWeb.login('test','123456',$('#serverIp').val());
		localStorage.setItem("dhUname",$('#uname').val());
		localStorage.setItem("dhPwd",$('#pwd').val());
		localStorage.setItem("dhServerIp",$('#serverIp').val());
		localStorage.setItem("dhPort",port);
		if($(".state").text() != "在线")$(".state").text("正在登录...");
	});
	$('#logout').click(function(){
		dhWeb.logout(sessionStorage.getItem('loginHandle'));
		sessionStorage.setItem('loginHandle',null);
		$('.device li').remove();
		$('.deviceDiv').hide();
		$('.loginDiv').show();
		$(".videoboxDiv").remove();
		$(".talking").removeClass("talking");
		$("#talk").css("background","#1E78FF");
		$(".tr_notify").remove();
		setVideoSize();
	});
	$('#closeAll').click(function(){
		// if ($('video').length === 0) {
		// 	alert('无播放设备');
		// 	return;
		// }
	   for(var i=0;i<$('video').length;i++){
		    var id = $("video")[i].id;
		    var deviceId = id.split("_")[1];
			dhWeb.stopRT(deviceId,sessionStorage.getItem('loginHandle'));
	   }
		$(".videoboxDiv").remove();
		$(".talking").removeClass("talking");
		$("#talk").css("background","#1E78FF");
		$(".liSelected").removeClass('liSelected');
		setVideoSize();
		// window.parent['clearnFastWarn']();
		
	});
	$('#talk').click(function(){
		if(!$(".selectVideo")[0]) return;
		var id = $('.selectVideo')[0].id;
		var deviceId = id.split('_')[1];
		if($("#talk").hasClass("talking")) return;
		$('#talk').addClass("talking");
		dhWeb.startTalk(deviceId);
		$(".talking").css("background","#aaa");
		showMicImg();
		
	});
	$('#unlock').click(function(){
		if(!$(".selectVideo")[0]) return;
	    var id = $(".selectVideo")[0].id;
	    var deviceId = id.split("_")[1];
		if(!deviceId){
			alert("请先选择设备");
			return;
		}
		dhWeb.doControl(deviceId,sessionStorage.getItem('loginHandle'),1);
	});
	// $('#historyList').click(function() {
	// 	window.parent['historyList']();
	// });
	
	//回调处理
	dhWeb.onLogin = function(message){
		onLogin(message);
		socketLoginCount = 0;
		timeoutLoginCount = 0;
	} 
	dhWeb.onDeviceList = function(message){
		onDeviceList(message);
	} 
	dhWeb.onNotify = function(message, clientid){
		onNotify(message, clientid);
	} 
	dhWeb.onParseMsgError = function(message){
		console.log(message);
		if(message.error.indexOf("alarmServer offline") != -1){
			$(".state").text("报警服务器不在线");
		}
	} 
	dhWeb.onAlarmServerClosed = function(){
		console.log("onAlarmServerClosed");
		$(".alarm_Online").attr("class", "alarm_Offline");
		$(".linkage_Online").attr("class", "linkage_Offline");
		$(".state").text("离线");
		$(".onlineCount").text("0");
		$(".tr_notify").remove();
		$("#closeAll").click();
		socketLoginCount++;
		if(socketLoginCount > 1000) {
			socketLoginCount = 0;
			alert("socket打开失败");
			return;
		}
		setTimeout(function(){
			$("#loginBtn").click();
		},5000)
	}
	dhWeb.onPlayRT = function(data){
		if(data.error != "success"){
			closeDevice(data.params.deviceId);
		}
	}
	dhWeb.onDeviceMove = function(data){
		var deviceList = data.params.list;
		for(var i in deviceList){
			var parentId = deviceList[i]['parentId'];
			var deviceId = deviceList[i]['deviceId'];
			$('#device_'+deviceId).attr("parentId", parentId);
		}
	}
	dhWeb.onDeviceAudioData = function(data,deviceId){
		 //data 设备音频流
	}
	dhWeb.onDeviceVideoData = function(data,deviceId){
		//data 设备视频流
		// console.log(data);
	}
	dhWeb.onLocalAudioData = function(data,deviceId){
		//data 本地音频流
	}
	dhWeb.onDHAlarmWebError = function(data){
		if(data.msg.error=="loginTimeout"){
			$(".state").text("登录超时");
			timeoutLoginCount++;
			if(timeoutLoginCount > 5) {
				timeoutLoginCount = 0;
				alert("登录超时");
				return;
			}
			$("#loginBtn").click();
		}else if(data.msg.error=="dataTimeout"){
			alert("数据获取超时或该账号无设备");
		}
	}
	$("#loginBtn").click();
	// onsingclick();
	//刷新重登
	if (window.performance.navigation.type ==1){
		if(localStorage.getItem("dhUname")!= "" && localStorage.getItem("dhPwd") != ""){
			//$("#loginBtn").click();
		}
	}
});

function onNotify(data, clientid){
	var params = data.params;
	var common = localStorage.getItem("common");
	if(params.code == "DeviceStatus"){
		var did = params.deviceId;
		// var fastWarn = common.fastWarn && common.fastWarn[did];
		// var callUser = fastWarn ? fastWarn.callUser : '';
		// var callUserTel = fastWarn ? fastWarn.callUserTel : '';
		// var callTime = fastWarn ? fastWarn.callTime : '';
		var iconClassName = getIconClassName($('#device_'+did));
		var type = iconClassName.split('_');
		var newIconClassName;
		if(params.action == "Offline"){
			newIconClassName = type[0]+"_Offline";
			$('#device_'+did).removeClass(iconClassName);
			$('#device_'+did).addClass(newIconClassName);
		}else if(params.action == "Normal"){
			newIconClassName = type[0]+"_Online";
			// window.parent['clearnFastWarn']();
			if($('#tr_'+did)){
				$('#tr_'+did).remove();
				$("#device_"+did).removeClass('dealing');
				if($("#play_"+did)[0]){
					$("#closeAll").click();
				}
			}
		}else if(params.action == "Start"){
			// newIconClassName = type[0]+"_Online";
			// var thStr = "<tr class='tr_notify' id='tr_"+did+"' ondblclick='ondbclick(this)' deviceId="+did+" name="+clientid+">"+
			// 		"<td class = 'alarmName'>"+$('#device_'+did).text()+"</td>"+
			// 		"<td class = 'alarmPerson'>"+callUser+"</td>"+
			// 		"<td class = 'alarmPhone'>"+callUserTel+"</td>"+
			// 		"<td class = 'alarmTime'>"+callTime+"</td>"+
			// 		"<td class = 'alarmStatus'>正在呼叫</td>"+
			// 		"<td class = 'alarmRecode'><input type='button' value = '记录警情' deviceId="+did+" name="+clientid+" onclick='onsingclick(this)'/></td>"
			// 	"</tr>";
			// $('#tr_'+did).remove();
			// $("#device_"+did).removeClass('dealing');
			// $("table").append(thStr);
			// if($("#play_"+did)[0]){
			// }
		}else if(params.action == "Dealing"){
			newIconClassName = type[0]+"_Online";
			$("#tr_"+did+" .alarmStatus").text("正在处理");
			$("#tr_"+did+" .alarmStatus").addClass('dealing');
			$("#tr_"+did+" .alarmRecode input").addClass('visibility');
			$("#device_"+did).addClass('dealing');
		}
		if(newIconClassName){
			$('#device_'+did).removeClass(iconClassName);
			$('#device_'+did).addClass(newIconClassName);
		}
		
		$(".totalCount").text($(".device").children("li").length);
		$(".onlineCount").text($("li[class$='_Online']").length);
	}
	
}
function getIconClassName(obj){
	if(obj.hasClass('alarm_Offline')){
		return 'alarm_Offline';
	}
	if(obj.hasClass('alarm_Online')){
		return 'alarm_Online';
	}
	if(obj.hasClass('linkage_Offline')){
		return 'linkage_Offline';
	}
	if(obj.hasClass('linkage_Online')){
		return 'linkage_Online';
	}else{
		return "";
	}
}
function onLogin(data){
	var params = data.params;
	if(data.error == "success"){
		$(".device").empty();
		$(".state").text("在线");
		sessionStorage.setItem('loginHandle',params.loginHandle);
		$('.loginDiv').hide();
		$('.deviceDiv').show();
		$('.showNameDiv p').text("用户名："+$('#uname').val());
		console.log("onLogin success");
	}else if(data.error == "repeat"){
		console.log("onLogin repeat");
		//重登5次
		repeatLoginCount++;
		if(repeatLoginCount > 5) {
			repeatLoginCount = 0;
			alert("账号已被登录");
			return;
		}
		setTimeout(function(){
			$("#loginBtn").click();
		},5000);
	}else if(data.error == "authfail"){
		alert("账号或密码错误");
	}else{
		alert("登录失败");
	}
}
var deviceId = null;
function onDeviceList(data){
	var deviceList = data.params.list;
	var className;
	for(var i in deviceList){
		if(deviceList[i]['deviceType'] == "Alarm"){
			if(deviceList[i]['action'] == "Offline"){
				className = "alarm_Offline";
			}else{
				className = "alarm_Online";
			}
		}else{
			if(deviceList[i]['action'] == "Offline"){
				className = "linkage_Offline";
			}else{
				className = "linkage_Online";
			}
		}
		if($("#device_"+deviceList[i]['deviceId'])[0]) return;
		var deviceHtml = "<li class='"+className+"' ondblclick='dbClickDevice(this)' id='device_"+deviceList[i]['deviceId']+"' parentId="+deviceList[i]['parentId']+">"+deviceList[i]['deviceName']+"</li>";
		$('.device').append(deviceHtml);
		deviceId = deviceList[i]['deviceId'];
		setTimeout(() => {
			$("#device_"+deviceId).dblclick();
		}, 500)
		console.log('deviceId');
	}
	$(".totalCount").text($(".device").children("li").length);
	$(".onlineCount").text($("li[class$='_Online']").length);
	
}
//设备列表双击事件
function dbClickDevice(obj){
	if($(obj).hasClass('dealing')){
		alert("正在处理中");
		return;
	}
	var iconClassName = getIconClassName($(obj));
	var status = iconClassName.split('_')[1];
	if(status == "Offline"){
		alert("设备不在线，无法观看");
		return;
	}
	
   var id = $(obj)[0].id;
   var deviceId = id.split("_")[1];
   if($('#play_'+deviceId)[0]) return;
   $(".liSelected").removeClass('liSelected');
   $(obj).addClass("liSelected");
   playVideo(deviceId,false);
	// window.parent['setFastWarnStatus']({deviceId});
}
function setDeviceListDbClick(serialNumber) {
	$("#device_"+serialNumber).trigger('dblclick');
}
//播放视频
function playVideo(deviceId, isTalk){
   var alarmCount = 0;
   for(var i = 0; i< $("video").length; i++){
	   var did = $("video")[i].id.split("_")[1];
	   if($("#device_"+did).hasClass("alarm_Online") || $("#device_"+did).hasClass("alarm_Offline")){
		   alarmCount++;
	   }
   }
   if(!$('#play_'+deviceId)[0] && $("#device_"+deviceId).hasClass("alarm_Online") || $("#device_"+did).hasClass("alarm_Offline")){
	   alarmCount++;
   }
   if(alarmCount > 2){
	   alert("只能同时播放两路报警设备视频");
	   return;
   }
   var html = '<div class="videoboxDiv" ondblclick="launchFullscreen(this)">'+
					'<video muted id="play_'+deviceId+'" onclick="selectedVideo(this)" oncanplay="canplayVideo(this)"></video><img class="loading" src="./image/loading.gif"/><img style="display:none;" class="micImg" src="./image/micmute.png"/>'+
				'</div>';
	if(!$('#play_'+deviceId)[0]) $('.videoDiv').append(html);
	if(!$(".selectVideo")[0]){
		$("#play_"+deviceId).addClass("selectVideo");
		dhWeb.playDeviceAudio(deviceId);
	}
   $('.selectVideo').parent().css("zIndex","2");
   var video = document.getElementById("play_"+deviceId);
   dhWeb.playRT(video,deviceId,sessionStorage.getItem('loginHandle'),isTalk);
   setVideoSize();
   if(isTalk){
	   $('#play_'+deviceId).click();
	   if(!$("#talk").hasClass("talking")){
		   	$('#talk').addClass("talking");
			$(".talking").css("background","#aaa");
	   }
		 //播放联动设备
		var parentId = $("#device_"+deviceId).attr('parentId');
		var groupDevices = $('li[parentId = '+parentId+']');
		for(var i =0; i<groupDevices.length;i++){
			var deviceId = groupDevices[i].id.split("_")[1];
			if($('#play_'+deviceId)[0]) continue;
			var iconClassName = getIconClassName($('#device_'+deviceId));
			if(!iconClassName) continue;
			var status = iconClassName.split('_');
			if(status[0] == 'alarm') continue;
			if(status[1] == 'Offline') continue;
			var html = '<div class="videoboxDiv linkDiv" ondblclick="launchFullscreen(this)">'+
							'<video id="play_'+deviceId+'" onclick="selectedVideo(this)" oncanplay="canplayVideo(this)"></video><span>'+$('#device_'+deviceId).text()+'</span>'+
							'<img class="loading" src="./image/loading.gif"/><img style="display:none;" class="micImg" src="./image/micmute.png"/>'+
						'</div>';
			$('.videoDiv').append(html);
			dhWeb.playRT($('#play_'+deviceId)[0],deviceId,sessionStorage.getItem('loginHandle'),false);
		}
   }
   setVideoSize();
}
function canplayVideo(obj){
	$(obj).siblings('.loading').hide();
	showMicImg();
}
//关闭所有设备
function closeAll(){
	 for(var i=0;i<$('video').length;i++){
		var id = $("video")[i].id;
		var deviceId = id.split("_")[1];
		dhWeb.stopRT(deviceId,sessionStorage.getItem('loginHandle'));
   }
	$(".videoboxDiv").remove();
	$(".talking").removeClass("talking");
	$("#talk").css("background","#1E78FF");
	setVideoSize();
}
//关闭单台设备
function closeDevice(deviceId){
	dhWeb.stopRT(deviceId,sessionStorage.getItem('loginHandle'));
	if($('video').length == 1 && $(".selectVideo").attr("id") == "play_"+deviceId){
		$(".talking").removeClass("talking");
		$("#talk").css("background","#1E78FF");
	}
	$("#play_"+deviceId).parent(".videoboxDiv").remove();
	setVideoSize();
}
//table双击事件
var clickTimeId;
function ondbclick(row){
	clearTimeout(clickTimeId);
	var id = $(row)[0].id;
	var deviceId = id.split("_")[1];
	if($("#"+id+" .alarmStatus").hasClass('dealing')){
		alert("正在处理中");
	}else{
		playVideo(deviceId,true);
		// window.parent['saveAlarmCallRecord']({deviceId});
	}
}
function onsingclick(dom) {
	console.dir(dom);
	clearTimeout(clickTimeId);
	clickTimeId = setTimeout( function () {
		const clientid = dom.getAttribute('name');
		const deviceId = dom.getAttribute('deviceId');
		const status = $('#device_'+deviceId).hasClass('dealing');
		// window.parent['vueDefinedMyProp']({clientid, deviceId});
	}, 250);
}
function setTableValue (allFastWarn, deviceId, clientid) {
	const warnObj = allFastWarn[deviceId];
	$("#tr_"+deviceId+" .alarmPerson").text(warnObj.callUser);
	$("#tr_"+deviceId+" .alarmPhone").text(warnObj.callUserTel);
	$("#tr_"+deviceId+" .alarmTime").text(warnObj.callTime);
}
//设置视频框宽和高
function setVideoSize(){
	var videoDivWidth = $('.videoDiv').width();
	var videoDivheight = $('.videoDiv').height();
	var tag = document.getElementsByTagName('video');
	if(tag.length == 1){
		$('.videoboxDiv').width(videoDivWidth-26);
		$('.videoboxDiv').height($('.videoDiv').height()-6);
	}else if(tag.length >=2 && tag.length <=4){
		$('.videoboxDiv').width(videoDivWidth*1/2-14);
		$('.videoboxDiv').height(videoDivheight/Math.ceil(tag.length/2)-6);
	}else if(tag.length >=5 && tag.length <=9 ){
		$('.videoboxDiv').width(videoDivWidth*1/3-12);
		$('.videoboxDiv').height(videoDivheight/Math.ceil(tag.length/3)-6);
	}else if(tag.length >=10 && tag.length <=16 ){
		$('.videoboxDiv').width(videoDivWidth*1/4-10);
		$('.videoboxDiv').height(videoDivheight/Math.ceil(tag.length/4)-6);
	}else{
		$('.videoboxDiv').width(videoDivWidth*1/4-10);
		$('.videoboxDiv').height(videoDivheight/4-4);
	}
}
//進入全屏
function launchFullscreen(element) 
{
	if(isFullscreen()){
		exitFullscreen();
		return;
	}
	if(element.requestFullscreen) {
		element.requestFullscreen();
	} else if(element.mozRequestFullScreen) {
		element.mozRequestFullScreen();
	} else if(element.msRequestFullscreen){ 
		element.msRequestFullscreen(); 
	} else if(element.oRequestFullscreen){
		element.oRequestFullscreen();
	}
	else if(element.webkitRequestFullscreen)
	{
		$(element).find("video")[0].webkitRequestFullscreen(); 
	}
}

//退出全屏
function exitFullscreen()
{
	if (document.exitFullscreen) {
		document.exitFullscreen();
	} else if (document.msExitFullscreen) {
		document.msExitFullscreen();
	} else if (document.mozCancelFullScreen) {
		document.mozCancelFullScreen();
	} else if(document.oRequestFullscreen){
		document.oCancelFullScreen();
	}else if (document.webkitExitFullscreen){
		document.webkitExitFullscreen();
	}else{
		var docHtml = document.documentElement;
		var docBody = document.body;
		var videobox = document.getElementById('videobox');
		docHtml.style.cssText = "";
		docBody.style.cssText = "";
		videobox.style.cssText = "";
		document.IsFullScreen = false;
	}
}
function isFullscreen(){
	return document.fullscreenElement    ||
		   document.msFullscreenElement  ||
		   document.mozFullScreenElement ||
		   document.webkitFullscreenElement || false;
}

//视频框选中
function selectedVideo(obj){
    if($(obj).hasClass("selectVideo")) return;
    $(".selectVideo").removeClass("selectVideo");
    $(obj).addClass("selectVideo");
	//切换对讲设备
	var deviceId = obj.id.split("_")[1];
	if($("#talk").hasClass("talking")){
		dhWeb.playDeviceAudio(deviceId);
		dhWeb.startTalk(deviceId);
	}
	showMicImg();
}
//显示静音图标
function showMicImg(){
	if($("#talk").hasClass("talking")){
		for(var i = 0; i< $("video").length; i++){
			if($($("video")[i]).hasClass("selectVideo")){
				$($("video")[i]).siblings('.micImg').hide();
			}else{
				$($("video")[i]).siblings('.micImg').show();
			}
		}
	}
}

	
