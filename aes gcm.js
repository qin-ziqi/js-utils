/**
 * @author eric
 * @date 2022-3-1
 * @description AES-GCM模式加密实现
 * 直接作为一个类导入使用即可
 * encodeParams为加密方法
 * decodeParams为解密方法
 */
import crypto from 'crypto';

const aesKey = 'eric';

/**
 * 生成对应长度的字符串
 * @param { number } length 长度
 * @returns { string } 生成的字符串
 */
function generateIv(length) {
  const base64Charsets = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
  let str = '';
  for (let i = 0; i < length; i++) {
    const index = Math.floor(Math.random() * base64Charsets.length);
    str += base64Charsets[index];
  }
  return str;
}

/**
 * 加密方法
 * @param { string } word 需要加密的字符串
 * @returns { string } 加密后的字符串
 */
function encodeAes(word) {
  /* 生成12位偏移量 */
  const iv = generateIv(12);

  /* 根据key和iv对字符串进行加密 */
  const cipher = crypto.createCipheriv('aes-128-gcm', aesKey, iv);
  const encrypted = cipher.update(word, 'utf8');
  const finalstr = cipher.final();
  const auth = cipher.getAuthTag();
  let res = Buffer.concat([encrypted, finalstr, auth]);

  /* 生成偏移量iv的buffer */
  const ivbuffer = Buffer.from(iv, 'utf8');

  /* 偏移量buffer拼接到加密buffer最前面 */
  res = Buffer.concat([ivbuffer, res]);
  return res.toString('base64');
}

/**
 * 解密方法
 * @param { string } word 需要解密的字符串
 * @returns { string } 解密后的字符串
 */
function decodeAes(word) {
  let decryptedStr;
  try {
    /* base64字符串转buffer */
    const wordBuffer = Buffer.from(word, 'base64');

    /* 截取前12位作为iv */
    const iv = wordBuffer.slice(0, 12);

    /* 截取剩余部分作为加密字符串 */
    const buffer = wordBuffer.slice(12, wordBuffer.length);

    /* 字符串解密 */
    const decipher = crypto.createDecipheriv('aes-128-gcm', aesKey, iv);
    const auth = buffer.subarray(buffer.length - 16);
    decipher.setAuthTag(auth);

    const str = decipher.update(Buffer.from(buffer.subarray(0, buffer.length - 16), 'hex'));
    const fin = decipher.final();
    decryptedStr = new TextDecoder('utf8').decode(Buffer.concat([str, fin]));
  } catch (e) {
    console.log('AES decodeAes error word-----------' + word);
    return word.toString();
  }

  try {
    decryptedStr = JSON.parse(decryptedStr);
  } catch (e) {
    console.log('AES JSON parse error word-----------' + word);
  }
  return decryptedStr.toString()
}

/* 加密之前的统一拦截 */
function encodeParams(origin) {
  if (!origin) {
    return '';
  }

  if (typeof origin != 'string') {
    origin = JSON.stringify(origin);
  }

  return encodeAes(origin);
}

/* 解密之前的统一拦截 */
function decodeParams(params) {
  if (!params) {
    return '';
  }

  return decodeAes(params);
}

export { encodeParams, decodeParams };
