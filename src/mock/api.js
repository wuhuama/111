import Mock from 'mockjs'

const userRes = {
  refreshCode: {
    "code": 1,
    "data": {
      "authcode": /\d{4}/,
      "date":Mock.Random.date('yyyy-MM-dd HH:mm:ss')
    },
    "msg": "成功"
  }
}

export default userRes