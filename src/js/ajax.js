(function() {
    var cosmos = function() {
        // body...
    };
    cosmos.prototype = {
        init: function() {
            // body...
        },
        ajax: function(config) {
            var self = this;
            /**
             * 
             * url:请求地址
             * type:请求方式
             * dataType:响应数据格式
             * data:请求参数
             * datafmat:响应数据加工函数
             */
            // 指定预先处理Ajax参数选项的回调函数
            $.ajaxPrefilter(function(options, originalOptions, jqXHR) {
                /**
                 * options：(Object对象)当前AJAX请求的所有参数选项。
                 * originalOptions：(Object对象)传递给$.ajax()方法的未经修改的参数选项。
                 * jqXHR：当前请求的jqXHR对象(经过jQuery封装的XMLHttpRequest对象)。
                 */
                 options.headers = {}; // 清空自定义的请求头
            });
            var promise = new Promise(function(resolve, reject) {
                $.ajax({
                        headers: config.headers || {},
                        url: config.url,
                        type: config.type || 'GET',
                        dataType: config.dataType || 'json',
                        data: config.data || {},
                        timeout: config.timeout || 15000,
                        beforeSend: config.beforeSend
                    })
                    .done(function(data) {
                        var res = data;
                        // 支持对响应数据作加工处理
                        config.datafmt && (res = config.datafmt(data))
                        resolve(res);
                    })
                    .fail(function(err) {
                        reject(err);
                    });
            })
            return promise;
        }
    };
    window.cosmos = new cosmos();
})();

