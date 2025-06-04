export enum ApiErrorCode {
  SUCCESS = 200, //成功
  USER_ID_INVALID = 10001, //用户id无效
  USER_NOTEXIST = 10002, //用户不存在
  USER_EXIST = 10003, //用户已存在
  PASSWORD_ERROE = 10004, //密码错误
  COMMON_CODE = 20000, //通用错误码
  FAIL = 400 //失败
}
