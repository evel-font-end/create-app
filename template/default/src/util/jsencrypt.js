import { JSEncrypt } from 'jsencrypt'
import { PUBLIC_KEY, PRIVATE_KEY } from './constants';

// 密钥对生成 http://web.chacuo.net/netrsakeypair

// 加密
export function encrypt(txt, publicKey = PUBLIC_KEY) {
  const encryptor = new JSEncrypt()
  encryptor.setPublicKey(publicKey) // 设置公钥
  return encryptor.encrypt(txt) // 对数据进行加密
}

// 解密
export function decrypt(txt, privateKey = PRIVATE_KEY) {
  const encryptor = new JSEncrypt()
  encryptor.setPrivateKey(privateKey) // 设置私钥
  return encryptor.decrypt(txt) // 对数据进行解密
}

