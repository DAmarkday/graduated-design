export default {
    // 登录
    apis: {
        test: '/api/hello', // 测试接口
        imgLoad: '/api/img/upload', // 图片上传
        detection: '/api/model/detection', // 请求图片识别接口
        change: '/api/model/change',  // 修改检测结果
        add: '/api/model/add',          // 添加类别
        download:'/api/model/download', // 模型下载
        imgDownload:'/api/img/downloadChooseRecognised',       // 单个识别图片下载
        imgZip:'/api/model/ImgZip', // 已上传的图片集
        imgReZip:'/api/model/ImgRecognisedZip'  // 已识别的图片集
    },
}
