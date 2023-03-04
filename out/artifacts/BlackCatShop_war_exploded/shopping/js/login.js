window.addEventListener('DOMContentLoaded', function () {
    // input的样式操作
    let inputAll = document.querySelectorAll('.inp');

    /*
        果咩，暂时想不到好方法了
    */
    let promptArr = [];
    promptArr = ['请输入账号', '请输入密码', '请输入验证码'];
    for (let i = 0; i < inputAll.length; i++) {
        inputAll[i].onfocus = function (){
            this.placeholder = ' ';
        }
        inputAll[i].onblur = function (){
            this.placeholder = promptArr[i];
        }
    }

    // 账号输入内容时，给其添加键盘响应事件
    // 同时把input里面的value获取过来赋值给 上面的盒子作为内容
    // 如果手机号为空，就把上面的盒子隐藏起来
    let con = document.querySelector('.con');
    let username = document.querySelector('#username');

    // 此处不要使用keydown，因为keydown事件响应的时候是你按下一个键的时候
    // 按下键(keydown)->键盘内容输入到表格->键弹起(keyup)
    // keydown 响应了，但是内容还没输入进去呢，它读个屁
    username.addEventListener('keyup', function () {
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
    username.addEventListener('blur', function () {
        con.style.display = 'none';
    });
    username.addEventListener('focus', function () {
        if ('' !== this.value) {
            con.style.display = 'block';
        }
    });

    $(".psw_show_hide").on("click", function (){
        let psw = $("#pwd");
        if(psw.prop("type") === "password"){
            psw.prop("type", "text");
            $(this).html("&#xe901;");
        } else if(psw.prop("type") === "text"){
            psw.prop("type", "password");
            $(this).html("&#xe902;");
        }
    })

    // 输入回车键相当于按下完成登录
    $(document).on('keyup',function(e) {
        if(e.which === 13) {
            // 相当于点击了一次完成注册
            $(".btn").trigger("click");
        }
    });

    // 当按下同意协议才能点击完成注册才能反应
    $(".btn").on("click", function (){
        $("#user_login").submit();
    })

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

    setInputFilter(document.getElementById("username"), function(value) {
        return /^\d*$/.test(value);
    });

    // 得到当前界面的参数
    function GetRequest() {
        let url = location.search; //获取url中"?"符后的字串
        if (url.indexOf("?") !== -1) { //判断是否有参数
            let urlStr = url.split('?')[1];
            // 创建空对象存储参数
            let obj = {};
            // 再通过 & 将每一个参数单独分割出来
            let paramsArr = urlStr.split('&')
            for(let i = 0,len = paramsArr.length;i < len;i++){
                // 再通过 = 将每一个参数分割为 key:value 的形式
                let arr = paramsArr[i].split('=')
                obj[arr[0]] = arr[1];
            }
            // 判断登录状态
            if(obj["loginStatus"] === "fail"){
                let errorMessage = "<span class='error gapPrompt'>" + "&#xe9fb; 用户名或密码错误</span>";
                $("#usernameLine").append(errorMessage);
            }
        }
    }
    GetRequest();
});