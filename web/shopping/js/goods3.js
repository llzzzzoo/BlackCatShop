$(function (){
    // 划过返回顶部的按钮
    let disPlaytimer;
    function updateDisplay() {
        disPlaytimer = setTimeout(function () {
            $(".slider_bar").css("display", "none");
        }, 130) // 设置为130为了解决滑动快速上移图案文字重合问题
    }
    let con = document.querySelector('.slider_bar');
    $(".comebackTop").hover(function () {
        clearTimeout(disPlaytimer);
        $(".slider_bar").css("display", "block");
        animate(con, 58, function () {
            $(".comeTop_icon").html("");
        });
    }, function () {
        animate(con, 0, function () {
            $(".comeTop_icon").html("");
        });
        updateDisplay();
    })
    // 滚动到指定的位置
    $(".elevator_item").click(function () {
            $("body, html").stop().animate({
                scrollTop: 0
            });
        }
    )

    let numberInc = $(".number-inc");
    let numberDec = $(".number-dec");
    // 增加商品数量
    numberInc.click(function () {
        // 得到当前input的输入值
        let n = $(this).siblings(".goods-input").children(".goods-input-o").val();
        if ("200" === n) {
            $(this).css("cursor", "not-allowed");
            return false;
        }
        n++;
        $(this).siblings(".goods-input").children(".goods-input-o").val(n);
    })
    // 减少商品数量
    numberDec.click(function () {
        // 得到当前input的输入值
        let n = $(this).siblings(".goods-input").children(".goods-input-o").val();
        if ("1" === n) {
            $(this).css("cursor", "not-allowed");
            return false;
        }
        n--;
        $(this).siblings(".goods-input").children(".goods-input-o").val(n);
    })

    // 输入框输入
    $(".goods-input-o").change(function () {
        // 得到当前文本框的值，再乘以数量
        let n = $(this).val();
        // 防止溢出范围
        if (n < 1) {
            n = 1;
        } else if (n > 200) {
            n = 200;
        }
        $(this).val(n);

        let p = $(this).parents(".goods-quantity").siblings(".td-price").find(".price-content").html();
        p = p.substr(1); // 截断符号
        let price = (p * n).toFixed(2); // 保留两位小数
        $(this).parents(".goods-quantity").siblings(".td-sum").find(".sum-price-o").html("￥" + price);
        updateNumAndMoney();
    })

    // 判断数量，免得出问题
    numberInc.mouseover(function () {
        if ("200" === $(this).siblings(".goods-input").find(".goods-input-o").val()) {
            $(this).css("cursor", "not-allowed");
        } else {
            $(this).css("cursor", "pointer");
        }
    })
    numberDec.mouseover(function () {
        if ("1" === $(this).siblings(".goods-input").find(".goods-input-o").val()) {
            $(this).css("cursor", "not-allowed");
        } else {
            $(this).css("cursor", "pointer");
        }
    })

    // input的样式操作
    let input = document.querySelector('input');

    // 核心思路：检测用户是否按下了 s 键，如果按下s键，就把光标定在搜索框里面
    // 利用keyCode进行判断
    // 搜索框获取焦点： 使用js 的focus()方法
    // 此处建议keyup而不是keyon，因为后者会把s输入到搜索框里面
    document.addEventListener('keyup', function (e) {
        if (e.keyCode === 83) {
            input.focus();
        }
    });

    // 下拉菜单的操作
    //获取元素
    let r_nav = document.querySelector('.r_nav');
    let lis = r_nav.children; //得到小li

    for (let i = 0; i < lis.length; i++) {
        let droplist = lis[i].children[0];
        if (droplist === undefined || droplist.className !== 'droplist') continue;
        lis[i].onmouseover = function () {
            this.children[0].children[1].style.display = 'block';
        }
        droplist.onmouseout = function () {
            this.children[1].style.display = 'none';
        }

    }

    $(".colornav-item").on("click", function (){
        let colorType = $(this).find(".colornav-label").html();
        $(".colornav-color-type").html(colorType);
    })

    // 放大镜效果
    let preview_img = document.querySelector('.preview_img');
    let mask = document.querySelector('.mask');
    let big = document.querySelector('.big');
    let bigImg = document.querySelector('.bigImg');

    // 1.当鼠标经过preview_img的时候，隐藏 mask遮挡层 和 big大盒子
    preview_img.addEventListener('mouseover', function () {
        mask.style.display = 'block';
        big.style.display = 'block';
    });
    preview_img.addEventListener('mouseout', function () {
        mask.style.display = 'none';
        big.style.display = 'none';
    })
    // 盒子跟随鼠标移动
    preview_img.addEventListener('mousemove', function (e) {
        // 1、先计算出鼠标在盒子的坐标
        // 2、此处注意看盒子的父盒子是否有定位，因为offset需要看定位
        let x = e.pageX - this.offsetLeft;
        let y = e.pageY - this.offsetTop;
        let maskX = x - mask.offsetWidth / 2; // maskX/Y的坐标可以等价为mask左上角顶点的在父盒子的坐标(根据最后赋值的结果来看)
        let maskY = y - mask.offsetHeight / 2;
        let maskXMax = preview_img.offsetWidth - mask.offsetWidth; // mask水平最大移动距离
        let maskYMax = preview_img.offsetHeight - mask.offsetHeight; // mask竖直最大移动距离

        if (maskX <= 0) {
            maskX = 0; // 左边相贴的时候(即将移出去)，保持此坐标
        } else if (maskX >= maskXMax) {
            maskX = maskXMax; // 图片右侧相贴的时候，就保持这个距离了
        }
        if (maskY <= 0) {
            maskY = 0; // 上边相贴的时候(即将移出去)，保持此坐标
        } else if (maskY >= maskYMax) {
            maskY = maskYMax; // 图片下侧相贴的时候，就保持这个距离了
        }
        mask.style.left = maskX + 'px'; // -mask.offset / 2（盒子宽高的一半）为了居中效果
        mask.style.top = maskY + 'px';

        // 大图移动的距离 = 大图的最大移动距离 * 遮挡层移动距离 / 遮挡层最大移动距离
        let bigXMax = bigImg.offsetWidth - big.offsetWidth; // 大图片水平最大移动距离
        let bigX = bigXMax * maskX / maskXMax; // 大图片水平移动距离
        let bigYMax = bigImg.offsetHeight - big.offsetHeight; // 大图片竖直最大移动距离
        let bigY = bigYMax * maskY / maskYMax; // 大图片竖直移动距离

        bigImg.style.left = -1 * bigX + 'px';
        bigImg.style.top = -1 * bigY + 'px';
    })


    // 电梯导航
    $(window).scroll(function () {
        let topLen = $(".goods-info").offset().top;
        if ($(document).scrollTop() >= topLen) {
            $(".comebackTop").fadeIn();
            $(".elevator").addClass("elevator_fixed");
        } else {
            $(".comebackTop").fadeOut();
            $(".elevator").removeClass("elevator_fixed");
        }
    })

    // 加入购物车，传递下标和数量信息
    $(".w").on("click", ".button-block", function (){
        let goodsNo = $(".goods-info").attr("id");// 下标
        let goodsQuantity = $(".goods-input-o").val();// 数量
        let date = new Date();
        let milliSeconds = date.getMilliseconds(); // 防止去缓存访问，实现每一次都去服务器访问
        let xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function (){
            if(this.readyState === 4 && this.status === 200) {
                window.location.assign("skipToCart.html");
            }
        }
        // 开启通道
        xhr.open("POST", "/BlackCatShop/goods/addToCart?"+milliSeconds, true);
        // 设置请求头(重要，模拟form表单，必须在打开通道之前设置)
        xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        // 发送请求
        xhr.send("goodsNo=" + goodsNo + "&goodsQuantity=" + goodsQuantity);
    })

    // 得到当前界面url的参数
    function GetRequest() {
        // 登录过之后，验证cookie是否存在，并做出相应前端样式的改变
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
                    break;case "userNo":userNo = temp[1];
                    break;case "username":username = temp[1];
                    break;case "password":password = temp[1];
                    break;case "nickname":nickname = temp[1];
                    break;case "goodsNum":goodsNum = temp[1];
                    break;case "shopNum":shopNum = temp[1];
                    break;default:
            }
        }
        $("#notLogin").remove();
        $("#user-message").css("display", "block");
        $("#user-line").css("display", "block");
        $("#nickname").html(nickname);
    }
    GetRequest();
})