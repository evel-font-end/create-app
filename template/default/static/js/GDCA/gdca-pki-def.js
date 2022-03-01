//设备信息标识
var SGD_DEVICE_SORT                   = 0x00000201;  //设备类别
var SGD_DEVICE_TYPE                   = 0x00000202;  //设备型号
var SGD_DEVICE_NAME                   = 0x00000203;  //设备名称
var SGD_DEVICE_MANUFACTURER           = 0x00000204;  //生产厂商
var SGD_DEVICE_HARDWARE_VERSION       = 0x00000205;  //硬件版本
var SGD_DEVICE_SOFTWARE_VERSION       = 0x00000206;  //软件版本
var SGD_DEVICE_STANDARD_VERSION       = 0x00000207;  //符合标准版本
var SGD_DEVICE_SERIAL_NUMBER          = 0x00000208;  //设备编号
var SGD_DEVICE_SUPPORT_ALG            = 0x00000209;  //设备能力字段,标识密码设备支持的非对称密码算法
var SGD_DEVICE_SUPPORT_SYM            = 0x0000020A;  //设备能力字段,标识密码设备支持的对称密码算法
var SGD_DEVICE_SUPPORT_HASH_ALG       = 0x0000020B;  //设备能力字段,标识密码设备支持的杂凑密码算法
var SGD_DEVICE_SUPPORT_STORAGE_SPACE  = 0x0000020C;  //设备能力字段,标识密码设备最大文件存储空间
var SGD_DEVICE_SUPPORT_FREE_SPACE     = 0x0000020D;  //设备能力字段,标识密码设备空闲文件存储空间
var SGD_DEVICE_RUNTIME                = 0x0000020E;  //已运行时间
var SGD_DEVICE_USED_TIMES             = 0x0000020F;  //设备调用次数
var SGD_DEVICE_LOCATION               = 0x00000210;  //设备物理位置
var SGD_DEVICE_DESCRIPTION            = 0x00000211;  //设备描述
var SGD_DEVICE_MANAGER_INFO           = 0x00000212;  //设备管理者描述信息
var SGD_DEVICE_MAX_DATA_SIZE          = 0x00000213;  //设备能力字段,一次能处理的数据容量

//证书解析项标识
var SGD_CERT_ALL                         = 0x00000000;  //证书信息
var SGD_CERT_VERISON                     = 0x00000001;  //证书版本
var SGD_CERT_SERIAL                      = 0x00000002;  //证书序列号
var SGD_CERT_SIGNALG                     = 0x00000004;  //证书签名算法
var SGD_CERT_ISSUER                      = 0x00000005;  //证书颁发者信息
var SGD_CERT_VALID_TIME                  = 0x00000006;  //证书有效期
var SGD_CERT_SUBJECT                     = 0x00000007;  //证书拥有者信息
var SGD_CERT_DER_PUBLIC_KEY              = 0x00000008;  //证书公钥信息
var SGD_CERT_DER_EXTENSIONS              = 0x00000009;  //证书扩展项信息
var SGD_EXT_AUTHORITYKEYIDENTIFIER_INFO  = 0x00000011;  //颁发者密钥标识符
var SGD_EXT_SUBJECTKEYIDENTIFIER_INFO    = 0x00000012;  //证书持有者密钥标识符
var SGD_EXT_KEYUSAGE_INFO                = 0x00000013;  //密钥用途
var SGD_EXT_PRIVATEKEYUSAGEPERIOD_INFO   = 0x00000014;  //私钥有效期
var SGD_EXT_CERTIFICATEPOLICIES_INFO     = 0x00000015;  //证书策略
var SGD_EXT_POLICYMAPPINGS_INFO          = 0x00000016;  //策略映射
var SGD_EXT_BASICCONSTRAINTS_INFO        = 0x00000017;  //基本限制
var SGD_EXT_POLICYCONTRAINTS_INFO        = 0x00000018;  //策略限制
var SGD_EXT_EXTKEYUSAGE_INFO             = 0x00000019;  //扩展密钥用途
var SGD_EXT_CRLDISTRIBUTIONPOINTS_INFO   = 0x0000001A;  //CRL发布点
var SGD_EXT_NETSCAPE_CERT_TYPE_INFO      = 0x0000001B;  //Netscape属性
var SGD_EXT_SELFDEFINED_EXTENSION_INFO   = 0x0000001C;  //私有的自定义扩展项
var SGD_CERT_ISSUER_CN                   = 0x00000021;  //证书颁发者CN
var SGD_CERT_ISSUER_O                    = 0x00000022;  //证书颁发者O
var SGD_CERT_ISSUER_OU                   = 0x00000023;  //证书颁发者OU
var SGD_CERT_SUBJECT_CN                  = 0x00000031;  //证书拥有者信息CN
var SGD_CERT_SUBJECT_O                   = 0x00000032;  //证书拥有者信息O
var SGD_CERT_SUBJECT_OU                  = 0x00000033;  //证书拥有者信息OU
var SGD_CERT_SUBJECT_EMAIL               = 0x00000034;  //证书拥有者信息EMAIL
var SGD_EXT_CERT_TYPE_UFID               = 0x00010001;  //证书类型统一编号
var SGD_EXT_CERT_TYPE_SUBCODE            = 0x00010002;  //证书类型子代码
var SGD_EXT_CERT_TYPE_ALL                = 0x00010003;  //证书类型统一编号及子代码

//错误代码
var SOR_OK                      =  0;             //成功
var SOR_UnknownErr              = 0x0B000001;    //异常错误
var SOR_NotSupportYetErr        = 0x0B000002;    //不支持的服务
var SOR_FileErr                 = 0x0B000003;    //文件操作错误
var SOR_ProviderTypeErr         = 0x0B000004;    //服务提供者参数类型错误
var SOR_LoadProviderErr         = 0x0B000005;    //导入服务提供者接口错误
var SOR_LoadDevMngApiErr        = 0x0B000006;    //导入设备管理接口错误
var SOR_AlgoTypeErr             = 0x0B000007;    //算法类型错误
var SOR_NameLenErr              = 0x0B000008;    //名称长度错误
var SOR_KeyUsageErr             = 0x0B000009;    //密钥用途错误
var SOR_ModulusLenErr           = 0x0B000010;    //模的长度错误
var SOR_NotInitializeErr        = 0x0B000011;    //未初始化
var SOR_ObjErr                  = 0x0B000012;    //对象错误
var SOR_MemoryErr               = 0x0B000100;    //内存错误
var SOR_TimeoutErr              = 0x0B000101;    //服务超时
var SOR_IndataLenErr            = 0x0B000200;    //输入数据长度错误
var SOR_IndataErr               = 0x0B000201;    //输入数据错误
var SOR_GenRandErr              = 0x0B000300;    //生成随机数错误
var SOR_HashObjErr              = 0x0B000301;    //HASH对象错
var SOR_HashErr                 = 0x0B000302;    //HASH运算错误
var SOR_GenRsaKeyErr            = 0x0B000303;    //产生RSA密钥错
var SOR_RsaModulusLenErr        = 0x0B000304;    //RSA密钥模长错误
var SOR_CspImprtPubKeyErr       = 0x0B000305;    //CSP服务导入公钥错误
var SOR_RsaEncErr               = 0x0B000306;    //RSA加密错误
var SOR_RsaDecErr               = 0x0B000307;    //RSA解密错误
var SOR_HashNotEqualErr         = 0x0B000308;    //HASH值不相等
var SOR_KeyNotFountErr          = 0x0B000309;    //密钥未发现
var SOR_CertNotFountErr         = 0x0B000310;    //证书未发现
var SOR_NotExportErr            = 0x0B000311;    //对象未导出
var SOR_VeryPolicyErr           = 0x0B000312;    //未能完全按照策略验证成功宏描述预定义值说明
var SOR_DecryptPadErr           = 0x0B000400;    //解密时做补丁错误
var SOR_MacLenErr               = 0x0B000401;    //MAC长度错误
var SOR_KeyInfoTypeErr          = 0x0B000402;    //密钥类型错误
var SOR_NULLPointerErr          = 0x0B000403;    //某一个参数为空指针
var SOR_APPNotFoundErr          = 0x0B000404;    //没有找到该应用
var SOR_CERTENCODEErr           = 0x0B000405;    //证书编码格式错误
var SOR_CERTINVALIDErr          = 0x0B000406;    //证书无效,不是可信CA颁发的证书
var SOR_CERTHASEXPIREDErr       = 0x0B000407;    //证书已过期
var SOR_CERTREVOKEDErr          = 0x0B000408;    //证书已经被吊销
var SOR_SIGNDATAErr             = 0x0B000409;    //签名失败
var SOR_VERIFYSIGNDATAErr       = 0x0B000410;    //验证签名失败
var SOR_READFILEErr             = 0x0B000411;    //读文件异常,可能文件不存在限等或没有读取权
var SOR_WRITEFILEErr            = 0x0B000412;    //写文件异常,
var SOR_SECRETSEGMENTErr        = 0x0B000413;    //门限算法密钥分割失败
var SOR_SECERTRECOVERYErr       = 0x0B000414;    //门限恢复失败
var SOR_ENCRYPTDATAErr          = 0x0B000415;    //对数据的对称加密失败
var SOR_DECRYPTDATAErr          = 0x0B000416;    //对称算法的数据解密失败
var SOR_PKCS7ENCODEErr          = 0x0B000417;    //PKCS7编码格式错误
var SOR_XMLENCODEErr            = 0x0B000418;    //不是合法的xml编码数据
var SOR_PARAMETERNOTSUPPORTErr  = 0x0B000419;    //不支持的参数
var SOR_CTLNOTFOUND             = 0x0B000420;    //没有发现信任列表
var SOR_APPNOTFOUND             = 0x0B000421;    //设置的应用名称没发现
var SOR_ECCEncErr             	= 0x0B000427;    //ECC加密错误
var SOR_P7SignErr             	= 0x0B000428;    //P7签名错误
var SOR_P7DecErr             	= 0x0B000429;    //P7解密错误
var SOR_EnumDevErr              = 0x0B000500;	 //设备枚举错误
var SOR_CertNotYetValidErr      = 0x0B000501;	 //证书未生效
var SOR_CertFrozenErr      	  	= 0x0B000502;	 //证书被冻结

//签名算法
var SGD_SM3_RSA      = 0x00010001;     	  //基于SM3算法和RSA算法的签名
var SGD_SHA1_RSA     = 0x00010002;     	  //基于SHA_1算法和RSA算法的签名
var SGD_SHA256_RSA   = 0x00010004;     	  //基于SHA_256算法和RSA算法的签名
var SGD_SM3_SM2      = 0x00020201;     	  //基于SM3算法和SM2算法的签名

//哈希算法
var SGD_SHASM3      = 0x00000001;
var SGD_SHA1      	= 0x00000002;
var SGD_SHA256      = 0x00000004;

//分组密码算法
var SGD_SM1_ECB     = 0x00000101;         //SM1算法ECB加密模式
var SGD_SM1_CBC     = 0x00000102;         //SM1算法CBC加密模式
var SGD_SM1_CFB     = 0x00000104;         //SM1算法CFB加密模式
var SGD_SM1_OFB     = 0x00000108;         //SM1算法OFB加密模式
var SGD_SM1_MAC     = 0x00000110;         //SM1算法MAC运算

var SGD_SSF33_ECB   = 0x00000201;         //SSF33算法ECB加密模式
var SGD_SSF33_CBC   = 0x00000202;         //SSF33算法CBC加密模式
var SGD_SSF33_CFB   = 0x00000204;         //SSF33算法CFB加密模式
var SGD_SSF33_OFB   = 0x00000208;         //SSF33算法OFB加密模式
var SGD_SSF33_MAC   = 0x00000210;         //SSF33算法MAC运算

var SGD_SM4_ECB     = 0x00000401;         //SM4算法ECB加密模式
var SGD_SM4_CBC     = 0x00000402;         //SM4算法CBC加密模式
var SGD_SM4_CFB     = 0x00000404;         //SM4算法CFB加密模式
var SGD_SM4_OFB     = 0x00000408;         //SM4算法OFB加密模式
var SGD_SM4_MAC     = 0x00000410;         //SM4算法MAC运算

var SGD_ZUC_EEA3    = 0x00000801;         //ZUC祖冲之;机密性算法128-EEA3算法
var SGD_ZUC_EEI3    = 0x00000802;         //ZUC祖冲之机密性算法128-EIA3算法

var SGD_RSA     = 0x00010000         	  //RSA算法
var SGD_SM2     = 0X00020100         	  //SM2椭圆曲线密码算法

var XML_SIGN_INFO_PLAIN_DATA =		1;		//原文
var XML_SIGN_INFO_DIGEST =			2;		//摘要
var XML_SIGN_INFO_SIGNVALUE =		3;		//签名值
var XML_SIGN_INFO_SIGNER_CERT =		4;		//签名证书
var XML_SIGN_INFO_DIGESTALGORITHM =	5;		//摘要算法
var XML_SIGN_INFO_SIGNALGORITHM =	6;		//签名算法

//消息签名标识
var SIGN_FLAG_WITH_ORI  =    0;        //带原文
var SIGN_FLAG_WITHOUT_ORI =  1;        //不带原文

var CERT_TYPE_SIGN 		= 1;			//签名证书
var CERT_TYPE_EXCHANGE  = 2;			//加密证书

var DEV_EVENT_ARRIVAL = 1;				//设备插入
var DEV_EVENT_REMOVE  = 2;				//设备拔出

var PROTO_HTTP 	 = 1;					//HTTP协议
var PROTO_HTTPS  = 2;					//HTTPS协议

//证书状态
var SOF_CERT_NOT_TRUSTED			= -1;
var SOF_CERT_HASEXPIRED				= -2;		
var SOF_CERT_REVOKED				= -3;
var SOF_CERT_FROZEN					= -4;
var SOF_CERT_NOTYETVALID			= -5;
var SOF_CERT_OTHER_ERR				= -6;

//设置类型
var SOF_SET_SUPPORT_DEVICE  					= 1;	//设置支持设备
var SOF_SET_INDATA_FORMAT   					= 2;	//设置P1数据签名,P7数据签名和写多用户数据等输入数据格式

//支持设备标志,GDCA设备默认支持
var DEV_GDCA_FEITIAN		= 0x1;		//GDCA飞天28 31
var DEV_GDCA_WATCH			= 0x2;		//GDCA握奇29 30
var DEV_GDCA_CSP			= 0x8;		//GDCA-CSP
var DEV_SZCA_3000GM			= 0x10;		//096e&0309 ShuttleCsp11_3000GM_SZCA.dll
var DEV_SZCA_HAITAI			= 0x20;		//5448&0003 SKFAPI20538.dll
var DEV_NETCA				= 0x40;		//5448&0003 f02e&0101 NetcaSKF.dll
var DEV_BJCA_LINGUO			= 0x80;		//6588&1514 lgu3073_p1514_gm.dll
var DEV_BJCA_ZTXA			= 0x100;	//22fb&1014 USK218_GM.dll
var DEV_LONGMAI				= 0x200;	//055c&db08 mtoken_gm3000.dll

var DEV_SZCA = DEV_SZCA_3000GM | DEV_SZCA_HAITAI;
var DEV_BJCA = DEV_BJCA_LINGUO | DEV_BJCA_ZTXA;

//证书颁发方类型
var CA_GDCA 	= 1;		//数安时代
var CA_NETCA 	= 2;		//网证通
var CA_SZCA 	= 3;		//深圳CA
var CA_BJCA 	= 4;		//北京CA


//签名加密等接口的输入数据格式
var INDATA_FMT_PLAIN		= 1;	//纯文本格式
var INDATA_FMT_BASE64		= 2;	//Base64编码格式

//标签名称
var LAB_USERCERT_SIG = "LAB_USERCERT_SIG";
var LAB_USERCERT_SIG_SN = "LAB_USERCERT_SIG_SN";
var LAB_USERCERT_ENC = "LAB_USERCERT_ENC";
var LAB_USERCERT_ENC_SN = "LAB_USERCERT_ENC_SN";
var LAB_USERID = "LAB_USERID";
var LAB_OPERATORID = "LAB_OPERATORID";
var CA_CERT = "CA_CERT";

//标签类型
var GDCA_LBL_CONFIG = 1;
var GDCA_LBL_DATA = 2;
var GDCA_LBL_EXDATA = 3;
var GDCA_LBL_SIGNKEY = 4;
var GDCA_LBL_ENCKEY = 5;
var GDCA_LBL_ENCCERT = 7;
var GDCA_LBL_SIGNCERT = 8;
var GDCA_LBL_CACERT = 9;

//错误码
var SOR_OK                       = 0;			//成功
var SOR_UnknownErr               = 0X0B000001;	//异常错误
var SOR_NotSupportYetErr         = 0X0B000002;	//不支持的服务
var SOR_FileErr                  = 0X0B000003;	//文件操作错误
var SOR_ProviderTypeErr          = 0X0B000004;	//服务提供者参数类型错误
var SOR_LoadProviderErr          = 0X0B000005;	//导入服务提供者接口错误
var SOR_LoadDevMngApiErr         = 0X0B000006;	//导入设备管理接口错误
var SOR_AlgoTypeErr              = 0X0B000007;	//算法类型错误
var SOR_NameLenErr               = 0X0B000008;	//名称长度错误
var SOR_KeyUsageErr              = 0X0B000009;	//密钥用途错误
var SOR_ModulusLenErr            = 0X0B000010;	//模的长度错误
var SOR_NotInitializeErr         = 0X0B000011;	//未初始化
var SOR_ObjErr                   = 0X0B000012;	//对象错误
var SOR_MemoryErr                = 0X0B000100;	//内存错误
var SOR_TimeoutErr               = 0X0B000101;	//服务超时
var SOR_IndataLenErr             = 0X0B000200;	//输入数据长度错误
var SOR_IndataErr                = 0X0B000201;	//输入数据错误
var SOR_GenRandErr               = 0X0B000300;	//生成随机数错误
var SOR_HashObjErr               = 0X0B000301;	//HASH对象错
var SOR_HashErr                  = 0X0B000302;	//HASH运算错误
var SOR_GenRsaKeyErr             = 0X0B000303;	//产生RSA密钥错
var SOR_RsaModulusLenErr         = 0X0B000304;	//RSA密钥模长错误
var SOR_CspImprtPubKeyErr        = 0X0B000305;	//CSP服务导入公钥错误
var SOR_RsaEncErr                = 0X0B000306;	//RSA加密错误
var SOR_RSGDecErr                = 0X0B000307;	//RSA解密错误
var SOR_HashNotEqualErr          = 0X0B000308;	//HASH值不相等
var SOR_KeyNotFountErr           = 0X0B000309;	//密钥未发现
var SOR_CertNotFountErr          = 0X0B000310;	//证书未发现
var SOR_NotExportErr             = 0X0B000311;	//对象未导出
var SOR_VeryPolicyErr            = 0X0B000312;	//未能完全按照策略验证成功宏描述预定义值说明
var SOR_DecryptPadErr            = 0X0B000400;	//解密时做补丁错误
var SOR_MacLenErr                = 0X0B000401;	//MAC长度错误
var SOR_KeyInfoTypeErr           = 0X0B000402;	//密钥类型错误
var SOR_NULLPointerErr           = 0X0B000403;	//某一个参数为空指针
var SOR_APPNotFoundErr           = 0X0B000404;	//没有找到该应用
var SOR_CERTENCODEErr            = 0X0B000405;	//证书编码格式错误
var SOR_CERTINVALIDErr           = 0X0B000406;	//证书无效,不是可信CA颁发的证书
var SOR_CERTHASEXPIREDErr        = 0X0B000407;	//证书已过期
var SOR_CERTREVOKEDErr           = 0X0B000408;	//证书已经被吊销
var SOR_SIGNDATAErr              = 0X0B000409;	//签名失败
var SOR_VERIFYSIGNDATAErr        = 0X0B000410;	//验证签名失败
var SOR_READFILEErr              = 0X0B000411;	//读文件异常,可能文件不存在限等或没有读取权
var SOR_WRITEFILEErr             = 0X0B000412;	//写文件异常
var SOR_SECRETSEGMENTErr         = 0X0B000413;	//门限算法密钥分割失败
var SOR_SECERTRECOVERYErr        = 0X0B000414;	//门限恢复失败
var SOR_ENCRYPTDATAErr           = 0X0B000415;	//对数据的对称加密失败
var SOR_DECRYPTDATAErr           = 0X0B000416;	//对称算法的数据解密失败
var SOR_PKCS7ENCODEErr           = 0X0B000417;	//PKCS7编码格式错误
var SOR_XMLENCODEErr             = 0X0B000418;	//不是合法的xml编码数据
var SOR_PARAMETERNOTSUPPORTErr   = 0X0B000419;	//不支持的参数
var SOR_CTLNOTFOUND              = 0X0B000420;	//没有发现信任列表
var SOR_APPNOTFOUND              = 0X0B000421;	//设置的应用名称没发现
var SOR_EnumDevErr               = 0X0B000500;	//设备枚举错误
var SOR_CertNotYetValidErr       = 0X0B000501;	//证书未生效
var SOR_CertFrozenErr      	  	 = 0X0B000502;	//证书被冻结
