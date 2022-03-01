'use strict';

var DHAlarm = DHAlarm || {};
var DHAlarmWeb = function(){
	this.localStream = null;
	this.pc = null;
	this.webrtcWs = null;		//webrtc websocket
	this.alarmWs = null;		//报警服务器websocket
	this.audioWs = {};		//发送对讲音频websocket
	this.deviceAudioWs = {};	//接收设备音频websocket
	this.started = false; // 是否开始
	this.webrtcSocketOpened = false; 
	this.alarmSocketOpened = 0; //0：初始状态，1：正在打开， 2：已打开，3：正在关闭，4：已关闭
	this.clientid = null;
	this.roomid = null;
    this.onStreamCallBack = null;	//视频流回调 webrtc
	this.alarmUrl = null;	//报警服务器websocket地址
	this.webrtcUrl = null;	//webrtc websocket地址
	this.onAlarmMessage = null; //报警信息回调
	this.onLoging = null;		//登录回调
	this.onDeviceList = null; //设备列表回调
	this.onNotify = null;	//设备通知回调
	this.onPlayRT = null;	//播放回调
	this.onDeviceMove = null;	//设备移除回调
	this.onParseMsgError = null;	//解析回调数据异常回调
	this.uname = null;
	this.pwd = null;
	this.isLogin = false;
	this.loginHandle = null;
	this.deviceId = null;
	this.context = null;	//audiocontext
	this.recorder = null;
	this.wfs = {};	
	DHAlarm.wrc = this;
	this.player = {};
    this.bufferPool = {};
	this.isDeviceAudioPlay = {};
	this.onAlarmServerClosed = null;
	this.keepAliveInterval = null;
	this.onDeviceAudioData = null;
	this.onLocalAudioData = null;
	this.onDeviceVideoData = null;
	this.onDHAlarmWebError = null;  //sdk异常回调
	this.hasDeviceList = false; //设备列表标记
	this.loginState = 0; //登录状态 0:未登录，1：正在登录，2：已登录,3：登录超时
	this.loginTimer = null;
	this.deviceListTimer = null;
	this.loginInterval = 0; //sdk登录定时器
    // test
	this.count = null;
	
	this.dataWsPort = 8088;
	this.mediaWsPort = 8088;
	// if(sessionStorage.getItem('webrtcUrl') && !this.webrtcSocketOpened){
		// this.webrtcUrl = sessionStorage.getItem('webrtcUrl');
		// this.alarmUrl = sessionStorage.getItem('alarmUrl');
		// this.openWebrtcSocket();
		// this.openAlarmSocket();
	// }
};

window.onbeforeunload = function() {
	
}.bind(this);

/**************************************************************/
//报警服务器信息处理
/**************************************************************/

 // 打开websocket
DHAlarmWeb.prototype.openAlarmSocket = function() {
	console.log("openAlarmSocket");
	this.alarmSocketOpened = 1;
	
	this.alarmWs = new WebSocket(this.alarmUrl);
	this.alarmWs.onopen = this.onAlarmSocketOpened.bind(this);
	this.alarmWs.onmessage = this.onAlarmSocketMessage.bind(this);
	this.alarmWs.onclose = this.onAlarmSocketClosed.bind(this);
	this.alarmWs.onerror = this.onAlarmSocketError.bind(this);
}
// websocket打开
DHAlarmWeb.prototype.onAlarmSocketOpened = function() {
	this.alarmSocketOpened = 2;
	console.log("onAlarmSocketOpened");
	this.registerAlarm();	
}
DHAlarmWeb.prototype.registerAlarm = function() {
	 var registerMessage = {
		cmd: 'register',
		msg: ""  
    };
	this.alarmWs.send(JSON.stringify(registerMessage));
}
// websocket收到消息
DHAlarmWeb.prototype.onAlarmSocketMessage = function(message) {
	try {
		var data = JSON.parse(message.data);
		sessionStorage.setItem('clientid',data.clientid);
		if(data.clientid){
			this.clientid = data.clientid;
		}
	}catch(e) {
		console.log(message);
	}
	this.processAlarmMessage(message.data);
	
}
// websocket异常
DHAlarmWeb.prototype.onAlarmSocketError = function(event) {
	console.log("onAlarmSocketError: " + JSON.stringify(event));
	this.loginState = 0;
	var result = {
		method: "systemManager.onError",
		error: "socketError"
	};
	var message = {
		clientid: "",
		error: "fail",
		msg: result
	};
	if(this.onDHAlarmWebError){
		this.onDHAlarmWebError(message);
	}
	this.clearLoginInt();
}
	// websocket关闭
DHAlarmWeb.prototype.onAlarmSocketClosed = function() {
	console.log("onAlarmSocketClosed");
	var lgnState = this.loginState;
	var almSktOpened = this.alarmSocketOpened;
	var message = {
		clientid: "",
		error: "fail",
		msg: {
			method: "systemManager.onError",
			error: "loginTimeout"
		}
	};
	this.alarmSocketOpened = 4;
	this.loginState = 0;
	this.clearKeepAliveInt();
	this.clearLoginInt();
	if(this.onDHAlarmWebError && lgnState == 3){
		this.onDHAlarmWebError(message);
	}
	if(this.onAlarmServerClosed && almSktOpened != 3){
		this.onAlarmServerClosed();
	}
}
// 发送信息
DHAlarmWeb.prototype.sendAlarmMessage = function(message) {
	var msgJson = JSON.stringify(message);
	if(this.alarmWs && this.alarmWs.readyState === WebSocket.OPEN){
		this.alarmWs.send(msgJson);
	}

}
// 发送信息回调
DHAlarmWeb.prototype.sendAlarmMessageCallBack = function(message, callback) {
	var msgJson = JSON.stringify(message);
	this.alarmWs.send(msgJson);
}
// 处理信息
DHAlarmWeb.prototype.processAlarmMessage = function(message) {
	if(this.onAlarmMessage){
		this.onAlarmMessage(message);
	}
	try {
		var data = JSON.parse(message);
		var msg = JSON.parse(data.msg);
		console.log('msg', msg);
		if(msg.method == "eventManager.notify"){ //设备报警回调
			if(this.onNotify){
				this.onNotify(msg, data.clientid);
			}
		}else if(msg.method == "configManager.onDeviceList"){ //设备列表回调
		    this.hasDeviceList = true;
			this.clearDeviceListTimer();
			if(this.onDeviceList){
				this.onDeviceList(msg);
			}
		}else if(msg.method == "systemManager.onLogin"){ //登录回调
			this.clearLoginTimer();
			if(msg.error == "success"){
				this.loginState = 2;
				this.clearKeepAliveInt();
				this.keepAliveInterval = setInterval(function(){
					var sendMsg = {
						 cmd: "send",
						 clientId: data.clientid,
						 msg: JSON.stringify({	
							method: 'systemManager.keepAlive',
							params: {
								loginHandle: msg.params.loginHandle
							}
						})
					};
					this.sendAlarmMessage(sendMsg);
				}.bind(this),10000);
				
				this.clearDeviceListTimer();
				this.deviceListTimer = setTimeout(function(){
					//设备列表超时
					if(!this.hasDeviceList){
						var message = {
							clientid: "",
							error: "fail",
							msg:{
								method: "systemManager.onError",
								error: "dataTimeout"
							}
						};
						if(this.onDHAlarmWebError){
							this.onDHAlarmWebError(message);
						}
					}
				}.bind(this), 10000);
			}else{
				this.loginState = 0;
			}
			if(this.onLogin){
				this.onLogin(msg);
			}
		}else if(msg.method == "systemManager.onPlayRT"){ //播放回调
			if(this.onPlayRT){
				this.onPlayRT(msg);
			}
		}else if(msg.method == "configManager.onDeviceMove"){ //设备移除
			if(this.onDeviceMove){
				this.onDeviceMove(msg);
			}
		}
		}catch(e) {
			if(this.onParseMsgError){
				this.onParseMsgError(data);
			}
		    console.log(e);
		}
}

DHAlarmWeb.prototype.setWebsocketPort = function(option) {
	this.dataWsPort = option.dataWsPort;
	this.mediaWsPort = option.mediaWsPort;
}
	
//登录
DHAlarmWeb.prototype.login = function(uname,pwd,ipAddr) {
    this.count = 0;
	if(!ipAddr){
		return;
	}
	sessionStorage.setItem('serverAddr', ipAddr);
	this.alarmUrl = "wss://"+ ipAddr +":"+this.dataWsPort+"/ws";
	this.webrtcUrl = "wss://"+ ipAddr +":8089/ws";
	this.uname = uname;
	this.pwd = pwd;

	if(this.loginState != 0 && this.loginState != 3) return;
	if(sessionStorage.getItem('alarmUrl') != this.alarmUrl || this.alarmSocketOpened==0 || this.alarmSocketOpened == 4){
		this.openAlarmSocket();
	}
	// if(sessionStorage.getItem('webrtcUrl') != this.webrtcUrl || !this.webrtcSocketOpened){
		// this.openWebrtcSocket();
	// }
	this.loginState = 1;
	sessionStorage.setItem('dataWsPort', this.dataWsPort);
	sessionStorage.setItem('mediaWsPort', this.mediaWsPort);
	sessionStorage.setItem('alarmUrl', this.alarmUrl );
	sessionStorage.setItem('webrtcUrl', this.webrtcUrl);
	
	this.clearLoginInt();
	this.loginInterval = setInterval(function(){
		if(DHAlarm.wrc.alarmSocketOpened == 2){
			this.clearLoginInt();
			var msg = {
				method: 'systemManager.login',
				params: {
					userName: uname,
					password: pwd
				}
			};
			var sendMsg = {
				 cmd: "send",
				 msg: JSON.stringify(msg)
			};
			DHAlarm.wrc.sendAlarmMessage(sendMsg);	
			this.clearLoginTimer();
			this.loginTimer = setTimeout(function(){
				if(this.loginState == 1){
					this.loginState = 3;
					this.closeAlarmWs();
				}
			}.bind(this),10000);
		}
	}.bind(this),1000);
}

DHAlarmWeb.prototype.logout = function(handle) {
	if(!handle) return;
	var msg = {
			method: 'systemManager.logout',
			params: {
				loginHandle: parseInt(handle)
			}
		};
	 var sendMsg = {
		 cmd: 'send',
		 msg: JSON.stringify(msg)
	};
	this.sendAlarmMessage(sendMsg);
	var registerMessage = {
		cmd: 'deregister',
		msg: ""  
    };
	this.sendAlarmMessage(registerMessage);
	sessionStorage.setItem('clientId', null);
	this.clearKeepAliveInt();
	this.clearLoginInt();
	this.clearLoginTimer();
	this.clearDeviceListTimer();
	this.hasDeviceList = false;
	this.loginState = 0;
	
	this.closeAlarmWs();
	for(var i=0;i< this.audioWs.length;i++){
		if(this.audioWs[i]){
			this.audioWs[i].close();
		}
		if(this.deviceAudioWs[i]){
			this.deviceAudioWs[i].close();
		}
		if(this.player[i]){
			this.player[i].destroy();
		}
	}
	
}
DHAlarmWeb.prototype.playRT = function(video,deviceId,loginHandle,isTalk) {
	if(!deviceId || !loginHandle) return;
	var msg = {
			method: 'deviceManager.playRT',
			params: {
				deviceId: parseInt(deviceId),
				loginHandle: parseInt(loginHandle),
				preview: false
			}
		};
	 var sendMsg = {
		 cmd: 'send',
		 msg: JSON.stringify(msg)
	};
	if(isTalk != false){
		isTalk = true;
	} 
	this.sendAlarmMessage(sendMsg);
	if (!this.audioWs[deviceId] || this.audioWs[deviceId].readyState != 1) {
		this.openAudio(loginHandle,deviceId,isTalk);
	}else{
		if(isTalk) this.startTalk(deviceId);
	}
	if(isTalk){
		this.playDeviceAudio(deviceId);
	}
	if (!this.deviceAudioWs[deviceId] || this.deviceAudioWs[deviceId].readyState != 1) {
		this.openDeviceAudio(loginHandle,deviceId);
	}
	this.playVideo(video,deviceId,loginHandle);
}
DHAlarmWeb.prototype.stopRT = function(deviceId,loginHandle) {
	if(!deviceId || !loginHandle) return;
	var msg = {
			method: 'deviceManager.stopRT',
			params: {
				deviceId: parseInt(deviceId),
				loginHandle: parseInt(loginHandle)
			}
		};
	 var sendMsg = {
		 cmd: 'send',
		 msg: JSON.stringify(msg)
	};
	this.sendAlarmMessage(sendMsg);
	this.closeAudio(deviceId);
	
	if(this.deviceAudioWs[deviceId]){
		this.deviceAudioWs[deviceId].close();
	}
	if(this.player[deviceId]){
		this.player[deviceId].destroy();
	}
	if(this.bufferPool[deviceId]) {
		this.bufferPool[deviceId].stopBuffering();
	}
	if(this.wfs[deviceId]){
		this.wfs[deviceId].destroy();	
	}
	this.deviceId = null;
	sessionStorage.setItem('playDeviceId',null);
}

DHAlarmWeb.prototype.doControl = function(deviceId, loginHandle, doIndex) {
	 var msg = {
			method: 'deviceManager.doControl',
			params: {
				deviceId: parseInt(deviceId),
				loginHandle: parseInt(loginHandle),
				index: parseInt(doIndex)
			}
		};
	 var sendMsg = {
		 cmd: 'send',
		 msg: JSON.stringify(msg)
	};
	this.sendAlarmMessage(sendMsg);
}

DHAlarmWeb.prototype.playVideo = function(video,deviceId,loginHandle) {
	sessionStorage.setItem('playDeviceId',deviceId);
	sessionStorage.setItem('loginHandle',loginHandle);
    if (!this.wfs[deviceId] || this.wfs[deviceId].websocketLoader.client.readyState != 1) {
		this.wfs[deviceId] = new Wfs();
		this.wfs[deviceId].attachMedia(video, deviceId);
		this.wfs[deviceId].websocketLoader.onVideoFrame = function(data){
			this.onVideoFrame(data, deviceId);
		}.bind(this);
    }
}
DHAlarmWeb.prototype.onVideoFrame = function(data,deviceId) {
	if(this.onDeviceVideoData){
		this.onDeviceVideoData(data, deviceId);
	}
}
DHAlarmWeb.prototype.startTalk = function(deviceId) {
	this.sendAudio(deviceId);
}
DHAlarmWeb.prototype.registerTalk = function(deviceId) {
	 var registerMessage = {
		cmd: 'register',
		clientid: this.clientid,
		loginHandle: parseInt(this.loginHandle),
		sessiontype: "talk",
		deviceid: parseInt(deviceId),
		msg: ""
		  
    };
	this.audioWs[deviceId].send(JSON.stringify(registerMessage));
}

DHAlarmWeb.prototype.openAudio = function(loginHandle,deviceId, isTalk) {
	this.loginHandle = loginHandle;
	this.deviceId = deviceId;
	this.audioWs[deviceId] = new WebSocket("wss://"+sessionStorage.getItem('serverAddr')+":"+this.mediaWsPort+"/ws");

	this.audioWs[deviceId].onopen = function(){
		this.onAudioSocketOpened(deviceId);
	}.bind(this);
	this.audioWs[deviceId].onmessage = function(message){
		this.onAudioSocketMessage(message,deviceId,isTalk);
	}.bind(this);
	this.audioWs[deviceId].onclose = function(){
		this.onAudioSocketClosed(deviceId);
	}.bind(this);
	this.audioWs[deviceId].onerror = function(event){
		this.onAudioSocketError(event);
	}.bind(this);
}
// websocket打开
DHAlarmWeb.prototype.onAudioSocketOpened = function(deviceId) {
	console.log("onAudioSocketOpened  did:"+deviceId);
	this.registerTalk(deviceId);
}

// websocket收到消息
DHAlarmWeb.prototype.onAudioSocketMessage = function(message,deviceId,isTalk) {
	//console.log("onAudioSocketMessage: " + message.data);
	var data = JSON.parse(message.data);
	if(data.error == "success"){
		if(!isTalk) return;
		this.sendAudio(deviceId);
	}
}
// websocket异常
DHAlarmWeb.prototype.onAudioSocketError = function(event) {
	console.log("onAudioSocketError: " + JSON.stringify(event));
}
	// websocket关闭
DHAlarmWeb.prototype.onAudioSocketClosed = function(deviceId) {
	console.log("onAudioSocketClosed  did:"+deviceId);
}
//发送音频数据
DHAlarmWeb.prototype.sendAudio = function(deviceId){
	var arrBuffer = new ArrayBuffer(320);
	var sendBuffer = new DataView(arrBuffer);
	var sendBufferindex  = 0;
	if (navigator.getUserMedia) {
		navigator.getUserMedia(
			{ audio: true },
			function (stream) {
				if(this.recorder){
					this.recorder.disconnect();
				}
				this.context = new AudioContext();
				this.recorder = this.context.createScriptProcessor(1024, 1, 1);
				var audioInput = this.context.createMediaStreamSource(stream);
				audioInput.connect(this.recorder);
				this.recorder.connect(this.context.destination);
				this.recorder.onaudioprocess = function (e) {
					var buffer = e.inputBuffer.getChannelData(0);
					var arrayBuffer = this.context.createBuffer(1, 1024,this.context.sampleRate);
					var nowBuffering = arrayBuffer.getChannelData(0);
					for (var i = 0; i < arrayBuffer.length; i++) {
						nowBuffering[i] = buffer[i]
					}
					var offctx = new OfflineAudioContext(1, parseInt(1024*8000/this.context.sampleRate), 8000);
					var source = offctx.createBufferSource();
					source.buffer = arrayBuffer;
					source.connect(offctx.destination);
					source.start();
					offctx.startRendering().then(function(renderedBuffer) {
						var channetData = renderedBuffer.getChannelData(0)
						source.stop();
						var index = 0;
						var length = channetData.length;
						while (index < length) {
							var selectBuffer = channetData[index]
							var s = Math.max(-1, Math.min(1, selectBuffer));
							var point = s < 0 ? s * 0x8000 : s * 0x7FFF;
							if (sendBufferindex < 320) {
								sendBuffer.setInt16(sendBufferindex, point, true);
							} else {
								if(this.audioWs[deviceId].readyState == this.audioWs[deviceId].CLOSING || this.audioWs[deviceId].readyState == this.audioWs[deviceId].CLOSED ) {
									this.recorder.disconnect();
									return;
								}else if(this.audioWs[deviceId].readyState == this.audioWs[deviceId].CONNECTING){
									return;
								}
								this.audioWs[deviceId].send(new Int16Array(arrBuffer));
								if(this.onLocalAudioData){
									this.onLocalAudioData(arrBuffer, deviceId);
								}
								sendBuffer = new DataView(arrBuffer);
								sendBufferindex = 0;
								sendBuffer.setInt16(sendBufferindex, point, true);
							}
							index++;
							sendBufferindex = sendBufferindex + 2;
						}
					}.bind(this))
							
				}.bind(this)

			}.bind(this), function(e) {
				this.audioWs[deviceId].close();
				console.log(e);
			}.bind(this)			
		)
	}
}
DHAlarmWeb.prototype.closeAudio = function(deviceId){
	if(this.audioWs[deviceId]){
		this.audioWs[deviceId].close();
	}
	if(!this.recorder) return;
	this.recorder.disconnect();
}
DHAlarmWeb.prototype.registerDeviceAudio = function(deviceId) {
	 var registerMessage = {
		cmd: 'register',
		clientid: this.clientid,
		loginHandle: parseInt(this.loginHandle),
		sessiontype: "audio",
		deviceid: parseInt(deviceId),
		msg: ""
    };
	this.deviceAudioWs[deviceId].send(JSON.stringify(registerMessage));
}

DHAlarmWeb.prototype.openDeviceAudio = function(loginHandle,deviceId) {
	this.loginHandle = loginHandle;
	this.deviceId = deviceId;
	this.deviceAudioWs[deviceId] = new WebSocket("wss://"+sessionStorage.getItem('serverAddr')+":"+this.mediaWsPort+"/ws");
	this.deviceAudioWs[deviceId].binaryType = 'arraybuffer';
	
	this.deviceAudioWs[deviceId].onopen = function(){
		this.onDeviceAudioSocketOpened(deviceId);
	}.bind(this);
	this.deviceAudioWs[deviceId].onmessage = function(message){
		this.onDeviceAudioSocketMessage(message, deviceId);
	}.bind(this);
	this.deviceAudioWs[deviceId].onclose = function(){
		this.onDeviceAudioSocketClosed(deviceId);
	}.bind(this);
	this.deviceAudioWs[deviceId].onerror = function(event){
		this.onDeviceAudioSocketError(event);
	}.bind(this);
}
// websocket打开
DHAlarmWeb.prototype.onDeviceAudioSocketOpened = function(deviceId) {
	console.log("onDeviceAudioSocketOpened  did:"+deviceId);
	this.registerDeviceAudio(deviceId);
}

// websocket收到消息
DHAlarmWeb.prototype.onDeviceAudioSocketMessage = function(message,deviceId) {
	//console.log("onDeviceAudioSocketMessage: " + message.data);
	if(typeof(message.data) == "object"){
		if(!this.isDeviceAudioPlay || !this.isDeviceAudioPlay[deviceId]) return;
		this.parseDeviceAudio(message.data,deviceId);
		if(this.onDeviceAudioData){
			this.onDeviceAudioData(message.data, deviceId);
		}
	}else{
		var data = JSON.parse(message.data);
		if(data.error == "success"){
			this.player[deviceId] = new PCMPlayer({
				encoding: '16bitInt',
				channels: 1,
				sampleRate: 8000,
				flushingTime: 500
			});
			this.bufferPool[deviceId] = new DHBufferPool();
			this.bufferPool[deviceId].onFrame = function(arrayData){
				this.feedData(arrayData,deviceId);
			}.bind(this);
			this.bufferPool[deviceId].startBuffering();
		}
	}
}
// websocket异常
DHAlarmWeb.prototype.onDeviceAudioSocketError = function(event) {
	console.log("onDeviceAudioSocketError: " + JSON.stringify(event));
}
// websocket关闭
DHAlarmWeb.prototype.onDeviceAudioSocketClosed = function(deviceId) {
	console.log("onDeviceAudioSocketClosed  did:"+deviceId);
}

DHAlarmWeb.prototype.parseDeviceAudio = function(data,deviceId) {
	var arrayData = new Int16Array(data);
    this.bufferPool[deviceId].addFrame(arrayData)
}

DHAlarmWeb.prototype.feedData = function(arrayData,deviceId) {
	this.player[deviceId].feed(arrayData);
	this.player[deviceId].volume(1);	
}
//播放设备音频
DHAlarmWeb.prototype.playDeviceAudio = function(deviceId) {
	this.isDeviceAudioPlay = {};
	this.isDeviceAudioPlay[deviceId] = true;
}
//关闭定时器
DHAlarmWeb.prototype.clearKeepAliveInt = function() {
	if(this.keepAliveInterval) clearInterval(this.keepAliveInterval);
	this.keepAliveInterval = 0;
}
DHAlarmWeb.prototype.clearLoginInt = function() {
	if(this.loginInterval) clearInterval(this.loginInterval);
	this.loginInterval = 0;
}
DHAlarmWeb.prototype.clearLoginTimer = function() {
	if(this.loginTimer) clearTimeout(this.loginTimer);
	this.loginTimer = 0;
}
DHAlarmWeb.prototype.clearDeviceListTimer = function() {
	if(this.deviceListTimer) clearTimeout(this.deviceListTimer);
	this.deviceListTimer = 0;
}
DHAlarmWeb.prototype.closeAlarmWs = function() {
	if(this.alarmWs && this.alarmSocketOpened != 0 && this.alarmSocketOpened != 4){
		this.alarmSocketOpened = 3;
		this.alarmWs.close();
	}
}