//设定小程序基地址
const baseURL = 'https://api-hmugo-web.itheima.net/api/public/v1';

const request = (config) => {
    //请求头的设置,若是有请求头，请求头包含'my'字符，需要另外解构；
    if (config.url.indexOf('/my/') != -1) {
        //获取本地的token数据；
        const token = uni.getStorageSync('tokenKey')
        //将请求头重新组合
        config.header = {
            Authorization: token,
            ...config.header
        }
    }

    return new Promise((resolve, reject) => {
        uni.request({
            ...config,
            url: baseURL + config.url,
            success: (res) => {

                if (res.statusCode == 200) {
                    //成功的回调

                    resolve(res.data.message);
                } else {

                    //失败的回调
                    reject(res.errMsg)
                }
            },
            error: (err) => {
                //失败的回调
                reject(err.errMsg)
            }
        })
    })
};

export default request;