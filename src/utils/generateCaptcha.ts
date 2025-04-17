import { create } from "svg-captcha"
import * as crypto from "crypto"

export default () => {
    const captcha = create({
        size: 4, //验证码长度
        ignoreChars: "0o1i", //验证码字符中排除 0o1i
        noise: 2, //干扰线条的数量
        background: "#999",//验证码图片背景颜色
        color: true, //验证码文字颜色
        width: 100, //验证码图片宽度
        height: 40, //验证码图片高度
    })
    //crypto.randomBytes(10) => <Buffer 01 93 fc 6b bc 3c d4 8f 55 9a>  
    //crypto.randomBytes(10).toString("hex") => 0193fc6bbc3cd48f559a
    const id = crypto.randomBytes(10).toString("hex") //生成一个随机的id，用于存储验证码
    return { id, captcha }
}