window.addEventListener('DOMContentLoaded', function () {
    // input的样式操作
    let inputAll = document.querySelectorAll('.inp');

    /*
        果咩，暂时想不到好方法了
    */
    let promptArr = [];
    promptArr = ['请输入手机号', '请输入验证码', '请输入字母或数字，长度6-14位', '请保证长度在6-14位', '请重新输入一次密码'];
    for (let i = 0; i < inputAll.length; i++) {
        inputAll[i].onfocus = function (){
            this.placeholder = ' ';
        }
        inputAll[i].onblur = function (){
            this.placeholder = promptArr[i];
        }
    }

    $(".psw_show_hide").on("click", function (){
        let psw = $("#psw");
        if(psw.prop("type") === "password"){
            psw.prop("type", "text");
            $(this).html("&#xe901;");
        } else if(psw.prop("type") === "text"){
            psw.prop("type", "password");
            $(this).html("&#xe902;");
        }
    })

    // 手机单号输入内容时，给其添加键盘响应事件
    // 同时把input里面的value获取过来赋值给 上面的盒子作为内容
    // 如果手机号为空，就把上面的盒子隐藏起来
    let con = document.querySelector('.con');
    let phoneNum = document.querySelector('#phone_num');

    // 此处不要使用keydown，因为keydown事件响应的时候是你按下一个键的时候
    // 按下键(keydown)->键盘内容输入到表格->键弹起(keyup)
    // keydown 响应了，但是内容还没输入进去呢，它读个屁
    phoneNum.addEventListener('keyup', function () {
        // 有内容显示，没内容none掉
        if ('' === this.value) {
            con.style.display = 'none';
        } else {
            con.style.display = 'block';
            con.innerHTML = this.value;
        }
    });

    // 失去焦点，隐藏盒子
    // 获得焦点，再显示
    phoneNum.addEventListener('blur', function () {
        con.style.display = 'none';
    });
    phoneNum.addEventListener('focus', function () {
        if ('' !== this.value) {
            con.style.display = 'block';
        }
    });

    function checkProtocol(){
        let btn = $(".btn");
        if($(this).prop("checked") === true){
            btn.removeClass("btn_disabled");
            btn.addClass("btn_used");
        } else{
            btn.removeClass("btn_used");
            btn.addClass("btn_disabled");
        }
    }
    // 根据是否选择协议决定是否能继续注册
    $("#checkProtocol").on("click", checkProtocol);
    checkProtocol();

    // 过滤输入
    function setInputFilter(textbox, inputFilter) {
        ["input", "keydown", "keyup", "mousedown", "mouseup", "select", "contextmenu", "drop", "focusout"].forEach(function(event) {
            textbox.addEventListener(event, function() {
                if (inputFilter(this.value)) {
                    // Accepted value
                    this.oldValue = this.value;
                    this.oldSelectionStart = this.selectionStart;
                    this.oldSelectionEnd = this.selectionEnd;
                } else if (this.hasOwnProperty("oldValue")) {
                    // Rejected value - restore the previous one
                    this.reportValidity();
                    this.value = this.oldValue;
                    this.setSelectionRange(this.oldSelectionStart, this.oldSelectionEnd);
                } else {
                    // Rejected value - nothing to restore
                    this.value = "";
                }
            });
        });
    }
    setInputFilter(document.getElementById("phone_num"), function(value) {
        return /^\d*$/.test(value);
    });
    setInputFilter(document.getElementById("verified_code"), function(value) {
        return /^\d*$/.test(value);
    });
    setInputFilter(document.getElementById("nickname"), function(value) {
        return /^[0-9a-zA-Z]*$/.test(value); // 限制输入为汉字、字母和数字
    });
    setInputFilter(document.getElementById("psw"), function(value) {
        return /^[0-9a-zA-Z!@#$%^&*_+=]*$/.test(value); // 限制输入为汉字、字母和数字
    });
    setInputFilter(document.getElementById("psw_again"), function(value) {
        return /^[0-9a-zA-Z!@#$%^&*_+=]*$/.test(value); // 限制输入为汉字、字母和数字
    });


    let nickname = $("#nickname");
    function checkUsernameLength(){
        let flag = false;
        let nicknamePrompt = $("#nicknamePrompt");
        //根据长度进行判断
        if (nickname.val().length < 6 || nickname.val().length > 14) {
            nicknamePrompt.removeClass("success");
            nicknamePrompt.addClass("error");
            nicknamePrompt.html("&#xe9fb;  长度需保证在6-14位");
            flag = false;
        }else {
            nicknamePrompt.removeClass("error");
            nicknamePrompt.addClass("success");
            nicknamePrompt.html("&#xe9eb; 用户名格式正确");
            flag = true;
        }
        return flag;
    }

    // 检查用户名的长度
    nickname.on("keyup", checkUsernameLength);

    function checkPswLength(jQEle){
        let flag = false;
        //根据长度进行判断
        if (psw.val().length < 6 || psw.val().length > 14) {
            jQEle.removeClass("success");
            jQEle.addClass("error");
            jQEle.html("&#xe9fb;  长度需保证在6-14位");
            flag = false;
        }else {
            jQEle.removeClass("error");
            jQEle.addClass("success");
            jQEle.html("&#xe9eb; 密码格式正确");
            flag = true;
        }
        return flag;
    }

    function checkPswStrength(jQEle){
        let val=  jQEle.val();
        let level = 0; // 初始等级为0
        if (val.match(/[a-zA-Z]/g)) { level++; } // 验证是否包含字母
        if (val.match(/[0-9]/g)) { level++; } // 验证是否包含数字
        if (val.match(/[!@#$%^&*_+=]/g)) { level++; } // 验证是否包含字母，数字，字符
        if (val.length < 6) { level = 0; } // 如果密码长度小于6位，等级为1
        if (level > 3) { level = 3; }
        return level;
    }
    let psw = $("#psw");
    function checkPsw(){
        let pswPrompt = $("#pswPrompt");
        let flag = checkPswLength(pswPrompt);
        let pswLevel = checkPswStrength(psw);
        let barIn = $(".bar_in");
        switch (pswLevel){
            case 0:  barIn.css("width", "0%");
                break;
            case 1:  barIn.css("width", "33%");
                break;
            case 2:  barIn.css("width", "66%");
                break;
            case 3:  barIn.css("width", "100%");
                break;
            default:
        }
        return flag;
    }
    // 根据密码输入的安全程度，对进度条做出相应的变化
    psw.on("keyup", checkPsw);

    let pswAgagin = $("#psw_again");
    function checkPswRepeat(){
        let pswAgain = pswAgagin.val();
        let pswPrompt = $("#pswPrompt");
        let pswAgainPrompt = $("#pswAgainPrompt");
        if (pswAgain !== psw.val()) {
            pswAgainPrompt.removeClass("success");
            pswAgainPrompt.addClass("error");
            pswAgainPrompt.html("&#xe9fb;  前后密码不一致");
            return false;
        }else {
            if(psw.val() === ''){
                pswPrompt.removeClass("success");
                pswPrompt.addClass("error");
                pswPrompt.html("&#xe9fb;  请输入密码");
            } else {
                pswAgainPrompt.removeClass("error");
                pswAgainPrompt.addClass("success");
                pswAgainPrompt.html("&#xe9eb; 两次密码一致");
            }
            return true;
        }
    }
    // 检测前后密码输入是否一致`
    pswAgagin.on("keyup", checkPswRepeat);

    function isPhoneRight(){
        let myreg=/^[1][345789][0-9]{9}$/;
        let str = $("#phone_num").val();
        return myreg.test(str);
    }

    // 判断手机号格式是否正确的函数
    function checkPhone(){
        let phoneNumPrompt = $("#phoneNumPrompt");
        if (isPhoneRight() === true) {
            phoneNumPrompt.removeClass("error");
            phoneNumPrompt.addClass("success");
            phoneNumPrompt.html("&#xe9eb; 手机格式正确");
            return true;
        }else {
            phoneNumPrompt.removeClass("success");
            phoneNumPrompt.addClass("error");
            phoneNumPrompt.html("&#xe9fb; 手机号格式不正确，请重新输入");
            return false;
        }
    }

    // 检测手机号是否符合格式
    phoneNum.addEventListener("keyup", checkPhone);


    // 输入回车键相当于按下完成注册
    $(document).on('keyup',function(e) {
        if(e.which === 13) {
            // 相当于点击了一次完成注册
            $(".btn").trigger("click");
        }
    });

    // 当按下同意协议才能点击完成注册才能反应
    $(".btn").on("click", function (){
        if($("#checkProtocol").prop("checked") === true){
            if(checkPswRepeat() && checkPhone() && checkPswLength($("#pswPrompt"))){
                // 提交表单
                $("#register_form").submit();
                // 为了让用户back页面时复选框处于选中、注册按钮可选中，需这样设计
                $("#checkProtocol").css("check", false);
            }
        }
    })

    /**
     * 关于浏览器注册界面的状态码
     * 100: 前后密码不一致
     * 101: 密码长度不对
     * 102: 密码符号错误
     * 200: 手机号格式错误
     * 201: 手机号注册过
     * 300: 昵称长度不对
     * 301: 昵称符号不对
     * 302: 昵称注册过
     */
    // 得到当前界面url的参数
    function GetRequest() {
        let url = location.search; //获取url中"?"符后的字串
        // 判断登录状态
        if (url.indexOf("?") !== -1) { //判断是否有参数
            let urlStr = url.split('?')[1];
            // 创建空对象存储参数
            let obj = {};
            // 再通过 & 将每一个参数单独分割出来
            let paramsArr = urlStr.split('&')
            for (let i = 0, len = paramsArr.length; i < len; i++) {
                // 再通过 = 将每一个参数分割为 key:value 的形式
                let arr = paramsArr[i].split('=')
                obj[arr[0]] = arr[1];
            }
            // 通过地址栏得到注册时遇到问题的编号
            let pswAgainPrompt = $("#pswAgainPrompt");
            let pswPrompt = $("#pswPrompt");
            let phoneNumPrompt = $("#phoneNumPrompt");
            let nicknamePrompt = $("#nicknamePrompt");
            switch (obj["registerProblem"]){
                case "100":
                    pswAgainPrompt.removeClass("success");
                    pswAgainPrompt.addClass("error");
                    pswAgainPrompt.html("&#xe9fb;  前后密码不一致");
                    break;
                case "101":
                    pswPrompt.removeClass("success");
                    pswPrompt.addClass("error");
                    pswPrompt.html("&#xe9fb;  长度需保证在6-14位");
                    break;
                case "102":
                    pswPrompt.removeClass("success");
                    pswPrompt.addClass("error");
                    pswPrompt.html("&#xe9fb;  输入的符号有误");
                    break;
                case "200":
                    phoneNumPrompt.removeClass("success");
                    phoneNumPrompt.addClass("error");
                    phoneNumPrompt.html("&#xe9fb; 手机号格式不正确，请重新输入");
                    break;
                case "201":
                    phoneNumPrompt.removeClass("success");
                    phoneNumPrompt.addClass("error");
                    phoneNumPrompt.html("&#xe9fb; 该手机号已被注册过");
                    break;
                case "300":
                    //根据长度进行判断
                    nicknamePrompt.removeClass("success");
                    nicknamePrompt.addClass("error");
                    nicknamePrompt.html("&#xe9fb;  长度需保证在6-14位");
                    break;
                case "301":
                    nicknamePrompt.removeClass("success");
                    nicknamePrompt.addClass("error");
                    nicknamePrompt.html("&#xe9fb;  用户名不合法");
                    break;
                case "302":
                    nicknamePrompt.removeClass("success");
                    nicknamePrompt.addClass("error");
                    nicknamePrompt.html("&#xe9fb;  用户名已被注册");
                    break;
                default :
            }
        }
    }
    GetRequest();
});