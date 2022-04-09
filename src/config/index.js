export default {
    /**
     * @description api请求基础路径
     */
    baseUrl: {
        // dev: 'http://192.168.50.61:8095/',
        dev: 'http://www.test.com:8999/',
        pro: '/api/'
    },
    /**
     *@description 前端加密混淆
     */
    mixCode: "Zw7[:(fD\n",
    plugin: {
        // 'error-store': {
        //   showInHeader: true, // 设为false后不会在顶部显示错误日志徽标
        //   developmentOff: false // 设为true后在开发环境不会收集错误信息，方便开发中排查错误
        // }
    },
    publicattrs:[
        {
            "system": "1",
            "key_name": "mv_name",
            "show_name": "姓名",
            "type": "1",
            "rules": "",
            "options": "[]",
            "required": 1
        },
        {
            "system": "1",
            "key_name": "mv_mobile",
            "show_name": "手机号码",
            "type": "1",
            "rules": "/^1[34578]{1}\\d{9}$/",
            "options": "[]",
            "required": 1
        },
        {
            "system": "1",
            "key_name": "mv_idtype",
            "show_name": "证件类型",
            "type": "3",
            "rules": "",
            "options": "[{\"key\":0,\"value\":\"\\u8eab\\u4efd\\u8bc1\"},{\"key\":1,\"value\":\"\\u62a4\\u7167\"},{\"key\":2,\"value\":\"\\u6e2f\\u6fb3\\u53f0\\u901a\\u884c\\u8bc1\"}]",
            "required": 1
        },
        {
            "system": "1",
            "key_name": "mv_idnumber",
            "show_name": "证件号码",
            "type": "1",
            "rules": "",
            "options": "[]",
            "required": 1
        },

        {
            "system": "1",
            "key_name": "mv_sex",
            "show_name": "性别",
            "type": "3",
            "rules": "",
            "options": "[{\"key\":0,\"value\":\"\\u7537\"},{\"key\":1,\"value\":\"\\u5973\"}]",
            "required": 1
        }

    ]
}
