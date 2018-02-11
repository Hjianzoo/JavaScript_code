$(function () {
    // var simulateDataBase = '{"GVRMS":["1","2","3"],"GVTHDU":["3","1","2"],"GVHZ":"23","GVPS":"12","GCRMS":["1","1","2"],"GCPF":["1","6","2"],"GCTHDI":["2","6","7"]}'
    // var simulateDataWarning = '{"HF1":"5","HF2":"256"}'
    // var simulateDataSetting = '{"Switch":"2", "CTLoction":"2", "SystemCapacity": "233", "ECOEnabled":"2"}'
    // var simulateDataAbout = '{"ControlDSP":"V121B011", "AuxiliaryDSP":"V113B012", "FPGA":"V023B112", "WiFiVersion":"V1.0.1", "WiFiUpdateFile":"V2.0.1"}'
    // var simulateDataUser = '{"WiFiName":"mxchipFAE", "WiFiPassword":"mxchip123456", "User":"admin", "Password":"123456"}'
    $.get('/api/base', {}, function (res) {
        renderBase(res);
    })
    // 标签切换
    $(".section ul li").each(function (index) {
        $(this).on('click', function () {
            $(".section ul li").removeClass('active');
            $(this).addClass('active');
            $(".part").addClass('hide').removeClass('show');
            $(".part").eq(index).removeClass('hide').addClass("show");
            if (index == '0') {
                $.get('/api/base', {}, function (res) {
                    renderBase(res);
                })
            } else if (index == '1') {
                $.get('/api/setting', {}, function (res) {
                    renderSetting(res);
                })
            } else if (index == '2') {
                $.get('/api/warning', {}, function (res) {
                    renderWarning(res);
                })
            } else if (index == '3') {
                $.get('/api/about', {}, function (res) {
                    renderAbout(res);
                })
            }
        })
    })
    // 告警页面渲染
    for (var i = 0; i < 16; i++) {
        $('.group').append('<p class="num">' + i + '</p>')
    }
    // wifi设置弹框弹出
    $(".icon-shezhi").on('click', function () {
        $(".mask").removeClass('hide').addClass("show");
        $(".wifi-view").removeClass('hide').addClass("show");
        $.get('/api/wifi_config', {}, function (res) {
            setUser(res);
        })
    })
    // 点击固话参数
    $(".submit").on('click', function () {
        var data = {}; // 发送的JSON数据对象
        var dataArr = [];
        var classArr = [];
        var valArr = [];
        var data1 = ""; // 分段数据，防止数据长度过长服务器无法接受处理
        var data2 = ""; // 分段数据，防止数据长度过长服务器无法接受处理
        var data3 = ""; // 分段数据，防止数据长度过长服务器无法接受处理
        // 遍历当前页面类名
        $("select").each(function (index, item) {
            classArr.push($(item).attr('class'))
        })
        $("input").each(function (index, item) {
            classArr.push($(item).attr('class'))
        })
        classArr.splice(37, 4); // 去除wifi弹窗的4个输入值
        // 遍历当前页面值
        $("select").each(function (index, item) {
            valArr.push($(item).val())
        })
        $("input").each(function (index, item) {
            valArr.push($(item).val())
        })
        valArr.splice(37, 4); // 去除wifi弹窗的4个输入值
        // 为data添加属性
        for (var i = 0; i < classArr.length; i++) {
            var dataAttr = classArr[i];
            var dataValue = valArr[i]
            data[dataAttr] = dataValue;
        }

        var dataStr = JSON.stringify(data); // 发送的JSON数据字符串

        // 分段数据，防止数据长度过长服务器无法接受处理
        dataArr = dataStr.split(",");

        data1 = dataArr.slice(0, 14).join() + "}";
        data2 = "{" + dataArr.slice(14, 26).join() + "}";
        data3 = "{" + dataArr.slice(26, 38).join();

        $.post('/api/setting', { d1: data1, d2: data2, d3: data3 }, function (res) {
            renderSetting(res);
        })
    })
    // 点击系统复位
    $(".reset").on('click', function () {
        $.post('/api/reset', { systemReset: true }, function (res) {
            renderSetting(res);
        })
    })
    // 点击WiFi弹窗确定
    $(".comfirm").on('click', function () {
        var data = {}; // 发送的JSON数据对象
        data.WiFiName = $(".WiFiName").val();
        data.WiFiPassword = $(".WiFiPassword").val();
        data.User = $(".User").val();
        data.Password = $(".Password").val();
        var dataStr = JSON.stringify(data); // 发送的JSON数据字符串
        $.post('/api/wifi_config', { data: dataStr }, function (res) {
            if (res.setting == 'ok') {
                $(".wifi-set-ok").removeClass('hide').addClass("show");
                $(".wifi-view").removeClass('show').addClass("hide");
            } else {
                $(".wifi-set-error").removeClass('hide').addClass("show");
                $(".wifi-view").removeClass('show').addClass("hide");
            }
        })
        // $(".mask").removeClass('show').addClass("hide");
        $(".wifi-view").removeClass('show').addClass("hide");
    })
    // 点击WiFi弹窗取消
    $(".cancel").on('click', function () {
        $(".mask").removeClass('show').addClass("hide");
        $(".wifi-view").removeClass('show').addClass("hide");
    })
    // 点击WiFi设置成功弹窗按钮
    $(".iKnowOk").on("click", function () {
        $(".mask").removeClass('show').addClass("hide");
        $(".wifi-set-ok").removeClass('show').addClass("hide");
    })
    $(".iKnowError").on("click", function () {
        $(".mask").removeClass('show').addClass("hide");
        $(".wifi-set-error").removeClass('show').addClass("hide");
    })
    // 遮罩滑动界面禁止
    $(".mask").on('touchmove', function (event) {
        event.preventDefault();
    })
    // 点击上传
    $(".update").on('click', function(){
        $.post('/api/update_file', function (res) {
            console.log(res);
        })
    })
    // renderBase(simulateDataBase);
    // renderWarning(simulateDataWarning);
    // renderSetting(simulateDataSetting);
    // renderAbout(simulateDataAbout);
    // setUser(simulateDataUser);
});
function renderBase(data) {
    // var data = JSON.parse(str);
    for (var key in data) {
        if (data[key] instanceof Array === true) { // 判断是否为数组
            for (var i = 0; i < data[key].length; i++) {
                td = i + 2;
                $('.' + key + ' td:nth-child(' + td + ')').text(data[key][i])
            }
        } else {
            $('.' + key + ' td:nth-child(3)').text(data[key])
        }
    }
}
function renderSetting(data) {
    // var data = JSON.parse(str);
    for (var key in data) {
        $('.' + key).val(data[key]);
    }
}
function renderWarning(data) {
    // var data = JSON.parse(data);
    for (var key in data) {
        var val = Number(data[key]);
        var val2 = val.toString(2);
        var renderArray = [];
        for (var i = 0; i < val2.length; i++) { //遍历字符串
            renderArray.push(val2[i]);
        }
        renderArray.reverse();
        console.log('渲染数组：' + renderArray);
        for (var j = 0; j < renderArray.length; j++) {
            var h = j + 1;
            if (renderArray[j] == '1') {
                $('.' + key + ' p:nth-child(' + h + ')').addClass('warningCircle')
            } else {
                $('.' + key + ' p:nth-child(' + h + ')').removeClass('warningCircle')
            }
        }
    }
}
function renderAbout(data) {
    // var data = JSON.parse(str);
    for (var key in data) {
        $('.' + key + ' td:nth-child(2)').text(data[key])
    }
}
function setUser(data) {
    // var data = JSON.parse(str);
    for (var key in data) {
        $('.' + key).val(data[key]);
    }
}

function checkValue(className, min, max) {
    var limit = Number($("." + className).val());
    if (limit > max) {
        $("." + className).val(max);
    }
    if (limit < min) {
        $("." + className).val(min);
    }
}