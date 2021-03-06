$(function () {
    //验证码登录
    var domSmsForm = $("#smsLogin-form"), // form - html dom object.;
            btnSubmitSms = $("#btnSubmitSms"),
            urlCheckCode = domSmsForm.attr('data-url-checkCode'),
            actionSmsUrl = domSmsForm.attr('data-url-action'),
            returnSmsUrl = domSmsForm.attr('data-url-return');
    // 手机号码验证
    $.validator.addMethod("isMobile", function (value, element) {
        var length = value.length;
        var mobile = /^(13[0-9]{9})|(18[0-9]{9})|(14[0-9]{9})|(17[0-9]{9})|(15[0-9]{9})$/;
        return this.optional(element) || (length == 11 && mobile.test(value));
    }, "请填写正确的手机号码");

    btnSubmitSms.click(function () {
        J.showMask('加载中...');
        var bool = validatorSms.form();
        if (bool) {
            var captchaCode = $('#UserDoctorMobileLoginForm_captcha_code').val();
            var formdata = domSmsForm.serializeArray();
            $.ajax({
                type: 'post',
                url: urlCheckCode + '?co_code=' + captchaCode,
                data: formdata,
                success: function (data) {
                    //console.log(data);
                    if (data.status == 'ok') {
                        ajaxSubmitSmsForm();
                    } else {
                        J.hideMask();
                        $('#UserDoctorMobileLoginForm_captcha_code-error').remove();
                        $('#captchaCode').after('<div id="UserDoctorMobileLoginForm_captcha_code-error" class="error">' + data.error + '</div>');
                        $('#UserDoctorMobileLoginForm_captcha_code').focus();
                    }
                }
            });
        } else {
            J.hideMask();
        }
    });
    //登陆页面表单验证模块
    var validatorSms = domSmsForm.validate({
        //focusInvalid: true,
        rules: {
            'UserDoctorMobileLoginForm[username]': {
                required: true,
                isMobile: true
            },
            'UserDoctorMobileLoginForm[captcha_code]': {
                required: true
            },
            'UserDoctorMobileLoginForm[verify_code]': {
                required: true,
                digits: true,
                maxlength: 6,
                minlength: 6
            }
        },
        messages: {
            'UserDoctorMobileLoginForm[username]': {
                required: "请输入手机号码",
                isMobile: '请输入正确的中国手机号码!'
            },
            'UserDoctorMobileLoginForm[captcha_code]': {
                required: "请输入图形验证码"
            },
            'UserDoctorMobileLoginForm[verify_code]': {
                required: "请输入短信验证码",
                digits: "请输入正确的短信验证码",
                maxlength: "请输入正确的短信验证码",
                minlength: "请输入正确的短信验证码"
            }
        },
        errorElement: "div",
        errorPlacement: function (error, element) {                             //错误信息位置设置方法  
            element.parents('div.input').find("div.error").remove();
            element.parents('div.input').find("div.errorMessage").remove();
            error.appendTo(element.parents('div.input'));                        //这里的element是录入数据的对象  
        }
    });
    function ajaxSubmitSmsForm() {
        var formdata = domSmsForm.serializeArray();
        var dataArray = structure_formdata('UserDoctorMobileLoginForm', formdata);
        var encryptContext = do_encrypt(dataArray, pubkey);
        var param = {param: encryptContext};
        $.ajax({
            type: 'post',
            url: actionSmsUrl,
            data: param,
            success: function (data) {
                //console.log(data);
                if (data.status == 'ok') {
                    location.href = returnSmsUrl;
                } else {
                    domSmsForm.find('div.error').remove();
                    for (error in data.errors) {
                        var errorMsg = data.errors[error];
                        var inputKey = '#UserDoctorMobileLoginForm_' + error;
                        $(inputKey).parents('div.inputBorder').after("<div class='error'>" + errorMsg + "</div>");
                        J.hideMask();
                    }
                }
            },
            error: function (XmlHttpRequest, textStatus, errorThrown) {
                //enableBtn(btnSubmit);
                console.log(XmlHttpRequest);
                console.log(textStatus);
                console.log(errorThrown);
            },
        });
    }


    //密码登录
    var domPawForm = $("#pawLogin-form"), // form - html dom object.;
            btnSubmitPaw = $("#btnSubmitPaw"),
            actionPawUrl = domSmsForm.attr('data-url-action'),
            returnPawUrl = domSmsForm.attr('data-url-return');
    // 手机号码验证
    $.validator.addMethod("isMobile", function (value, element) {
        var length = value.length;
        var mobile = /^(13[0-9]{9})|(18[0-9]{9})|(14[0-9]{9})|(17[0-9]{9})|(15[0-9]{9})$/;
        return this.optional(element) || (length == 11 && mobile.test(value));
    }, "请填写正确的手机号码");
    // 密码验证
    $.validator.addMethod("isPassword", function (value, element) {
        var mobile = /^[a-zA-Z0-9_]+$/;
        return this.optional(element) || (mobile.test(value));
    }, "请填写字母、数字或下划线");

    btnSubmitPaw.click(function () {
        J.showMask('加载中...');
        var bool = validator.form();
        if (bool) {
            ajaxSubmitPawForm();
        } else {
            J.hideMask();
        }
    });
    //登陆页面表单验证模块
    var validator = domPawForm.validate({
        //focusInvalid: true,
        rules: {
            'UserLoginForm[username]': {
                required: true,
                isMobile: true
            },
            'UserLoginForm[password]': {
                required: true,
                isPassword: true,
                minlength: 4
            }
        },
        messages: {
            'UserLoginForm[username]': {
                required: "请输入手机号码",
                isMobile: '请输入正确的中国手机号码!'
            },
            'UserLoginForm[password]': {
                required: "请输入密码",
                minlength: "密码至少4位"
            }
        },
        errorElement: "div",
        errorPlacement: function (error, element) {                             //错误信息位置设置方法  
            element.parents('div.input').find("div.error").remove();
            element.parents('div.input').find("div.errorMessage").remove();
            error.appendTo(element.parents('div.input'));                        //这里的element是录入数据的对象  
        }
    });
    function ajaxSubmitPawForm() {
        var formdata = domPawForm.serializeArray();
        var dataArray = structure_formdata('UserLoginForm', formdata);
        var encryptContext = do_encrypt(dataArray, pubkey);
        var param = {param: encryptContext};
        $.ajax({
            type: 'post',
            url: actionPawUrl,
            data: param,
            success: function (data) {
                //console.log(data);
                if (data.status == 'ok') {
                    location.href = returnPawUrl;
                } else {
                    domSmsForm.find('div.error').remove();
                    for (error in data.errors) {
                        var errorMsg = data.errors[error];
                        var inputKey = '#UserLoginForm_' + error;
                        $(inputKey).parents('div.inputBorder').after("<div class='error'>" + errorMsg + "</div>");
                        J.hideMask();
                    }
                }
            },
            error: function (XmlHttpRequest, textStatus, errorThrown) {
                //enableBtn(btnSubmit);
                console.log(XmlHttpRequest);
                console.log(textStatus);
                console.log(errorThrown);
            },
        });
    }

});

