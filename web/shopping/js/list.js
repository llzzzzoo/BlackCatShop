window.addEventListener('DOMContentLoaded', function () {
    // 下拉菜单的操作
    //获取元素
    let r_nav = document.querySelector('.r_nav');
    let lis = r_nav.children;//得到小li

    for (let i = 0; i < lis.length; i++) {
        let droplist = lis[i].children[0];
        lis[i].onmouseover = function () {
            this.children[0].children[1].style.display = 'block';
        }
        if (droplist !== undefined) {
            droplist.onmouseout = function () {
                this.children[1].style.display = 'none';
            }
        }
    }

    // input的样式操作
    let input = document.querySelector('input');

    input.onfocus = function () {
        if (this.value === '嘉然今天吃什么')
            this.value = '';
        //获得焦点需要把文字框里面的颜色变黑
        this.style.color = '#333';
    }

    input.onblur = function () {
        if (this.value === '') {
            this.value = '嘉然今天吃什么';
        }
        this.style.color = '#62676e';
    }

    // 不同时间段不同问候语
    //1.得到当前小时数
    let date = new Date();
    let hour = date.getHours();
    //2.判断小时数改变文字信息
    if (hour < 10) {
        $(".time_compliment").text('早上好呀');
    } else if (hour < 14) {
        $(".time_compliment").text('中午好呀');
    } else if (hour < 18) {
        $(".time_compliment").text('下午好呀');
    } else {
        $(".time_compliment").text('晚上好呀');
    }

    // 核心思路：检测用户是否按下了 s 键，如果按下s键，就把光标定在搜索框里面
    // 利用keyCode进行判断
    // 搜索框获取焦点： 使用js 的focus()方法
    // 此处建议keyup而不是keyon，因为后者会把s输入到搜索框里面
    document.addEventListener('keyup', function (e) {
        if (e.keyCode === 83) {
            input.focus();
        }
    });

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
            for(let i = 0,len = paramsArr.length;i < len;i++){
                // 再通过 = 将每一个参数分割为 key:value 的形式
                let arr = paramsArr[i].split('=')
                obj[arr[0]] = arr[1];
            }
            // 登录过之后，验证cookie是否存在，并做出相应前端样式的改变
            // 技术限制，只能以这种方式后台前台同时验证
            if(obj["loginStatus"] === "success"){
                let loginStatus = false;
                let userNo = "null";
                let username = "null";
                let password = "null";
                let nickname = "null";
                let goodsNum = 0;
                let shopNum = 0;
                let cookiesArr = document.cookie.split(";");
                for(let i = 0;i < cookiesArr.length;i++){
                    let temp = cookiesArr[i].split("=");
                    // 要加trim去除空格
                    switch (temp[0].trim()){
                        case "loginStatus":
                            loginStatus = true;
                            break;
                        case "userNo":
                            userNo = temp[1];
                            break;
                        case "username":
                            username = temp[1];
                            break;
                        case "password":
                            password = temp[1];
                            break;
                        case "nickname":
                            nickname = temp[1];
                            break;
                        case "goodsNum":
                            goodsNum = temp[1];
                            break;
                        case "shopNum":
                            shopNum = temp[1];
                            break;
                        default:
                    }
                    console.log(temp[0] + ": " + temp[1]);
                    console.log();
                }
                if(loginStatus === true){
                    $("#notLogin").remove();
                    $("#user-message").css("display", "block");
                    $("#user-line").css("display", "block");
                    $("#nickname").html(nickname);
                    $("#goods-num").html(goodsNum);
                    $("#goods-num").addClass("count");
                }
            }
        }
    }
    GetRequest();
});