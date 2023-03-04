window.addEventListener('load', function () {
    // 1.获取元素
    let prev = this.document.querySelector('.prev');
    let next = this.document.querySelector('.next');
    let focus = this.document.querySelector('.focus');
    let focus_nav = this.document.querySelector('.focus-nav');

    // 1.鼠标经过轮播图，就让按钮显示出来 离开就隐藏
    focus.addEventListener('mouseenter', function () {
        prev.style.display = 'block';
        next.style.display = 'block';
        clearInterval(timer);
        timer = null; // 去除定时器变量
    });
    focus.addEventListener('mouseleave', function () {
        prev.style.display = 'none';
        next.style.display = 'none';
        clearInterval(timer);
        timer = setInterval(function () {
            next.click();
        }, 3500)
    });

    // 2.动态生成小圆圈 有几张图片几个小圆圈
    let ul = focus.querySelector('ul'); // 注意是focus，避免搞到别的ul了
    let ol = focus.querySelector('.circle');
    let focus_width = focus.offsetWidth; // 转换为Number
    let i;
    for (i = 0; i < ul.children.length; i++) {
        // 创建小li
        let li = this.document.createElement('li');

        // 记录当前小li的索引号，通过自定义属性可以哦
        li.setAttribute('index', i);
        //把小li插入ol 
        ol.appendChild(li);

        // 4.小圈圈排他思想 可以边生成边绑定事件
        li.addEventListener('mouseover', function () {
            // 排他思想，先不让其他玩意变色，再让我变色
            for (let i = 0; i < ol.children.length; i++) {
                ol.children[i].className = '';
            }
            this.className = 'selected';

            // 5.点击小圆圈，移动图片
            // 移动距离 小圆圈的索引号 乘以图片的宽度 负值哦
            // 移动到某个小圈的时候，获取其索引号
            let index = this.getAttribute('index');
            // 将索引号赋值给num，按下右侧按钮的num起点就是小圆圈所在的index
            // 总之，index记录当前li的下标
            num = index;
            circle = index;
            animate(ul, -index * focus_width);
        })
    }
    // 实现动态变化框框长度，少一个圈减20px
    focus_nav.style.width = focus_nav.offsetWidth - 20 * (8 - i) + 'px';
    // 始终保持变化框居中
    let nav_width = focus_nav.offsetWidth; // 此处获取的是Number型，如果上面的width获取的是String
    focus_nav.style.left = (focus_width - nav_width) / 2 + 'px';
    // 使得小圆圈均匀分布
    let liAll = focus_nav.querySelectorAll('li');
    for (let j = 0; j < liAll.length; j++) {
        liAll[j].style.marginLeft = ((nav_width - 24) - (i * 10)) / i / 2 + 'px';
        liAll[j].style.marginRight = ((nav_width - 24) - (i * 10)) / i / 2 + 'px';
    }

    // 把ol里面第一个li设置为selected
    ol.children[0].className = 'selected';

    // 6.克隆第一张图片，放到ul最后面
    // 此处便不必担心小圆圈会多了，因为前面已经生成完了小圆圈
    // 此处与懒加载矛盾，故删除，所以要修改复制的地址
    let first = ul.children[0].cloneNode(true);
    first.innerHTML = "<a href=" + "#" + "><img src=" + first.children[0].children[0].dataset['lazySrc'] + " alt=" + "阿伟你又在看二刺猿了嚯" + "></a>";
    ul.appendChild(first);

    // 7.点击一次右侧按钮，图片滚动一张
    let num = 0;
    let circle = 0;
    next.addEventListener('click', function () {
        // 如果找到了最后复制的一张照片，此时，ul快速恢复到left=0的情况
        // 然后紧接着num++，继续播放，障眼法
        if (ul.children.length - 1 === num) {
            ul.style.left = 0;
            num = 0;
        }
        num++;
        animate(ul, -num * focus_width);

        // 8.点击右侧按钮，小圆圈跟着一起变化， 可以声明一个变量再控制小圆圈的播放
        circle++;
        // 如果circle等于8，表明走了到克隆的照片，直接使其为0
        if (ul.children.length - 1 === circle) {
            circle = 0;
        }
        circleChange();
    })
    // 8.点击左侧按钮，图片滚动
    prev.addEventListener('click', function () {
        // 如果找到了最后复制的一张照片，此时，ul快速恢复到left=0的情况
        // 然后紧接着num++，继续播放，障眼法
        if (0 === num) {
            num = ul.children.length - 1;
            ul.style.left = -num * focus_width + 'px';
        }
        num--;
        animate(ul, -num * focus_width);

        // 8.点击右侧按钮，小圆圈跟着一起变化， 可以声明一个变量再控制小圆圈的播放
        circle--;
        // 如果circle等于8，表明走了到克隆的照片，直接使其为0
        if (circle < 0) {
            circle = ol.children.length - 1;
        }
        circleChange();
    })

    function circleChange() {
        for (let i = 0; i < ol.children.length; i++) {
            ol.children[i].className = '';
        }
        ol.children[circle].className = 'selected';
    }

    // 10.自动播放轮播图
    let timer = this.setInterval(function () {
        next.click();
    }, 3500)

    // 分类栏右侧的图片
    let ddUl = $(".dd ul");
    let ddUlLi = $(".dd ul li");
    // 1.鼠标经过小li
    ddUlLi.mouseover(function () {
        let catePart = $(".cate_top .cate_part");
        // 2.得到当前小li的索引号
        let index = $(this).index(); // 由于伪数组，可以得到索引号
        // 5.让cate_top显示
        $(".cate_top").show();
        // 3.让对应索引号的图片显示出来
        catePart.eq(index).show();
        // 4.让其他的图片隐藏起来
        catePart.eq(index).siblings().hide();
    })



    ddUl.mouseover(function () {
        $("#bottom").show();
    })

    ddUl.mouseout(function () {
        // 5.让cate_top隐藏
        $("#bottom").hide();
    })

    ddUlLi.mouseout(function () {
        let cate_top = $(".cate_top");
        let cate_part = $(".cate_part");
        // 2.得到当前小li的索引号
        let index = $(this).index(); // 由于伪数组，可以得到索引号
        let flag = 0;
        // 6.如果也离开了catetop就隐藏
        cate_top.mouseover(function () {
            flag = 1;
            // 5.让cate_top显示
            cate_top.show();
            // 3.让对应索引号的图片显示出来
            cate_part.eq(index).show();
            // 4.让其他的图片隐藏起来
            cate_part.eq(index).siblings().hide();
        })

        cate_top.mouseout(function () {
            // 5.让cate_top隐藏
            cate_top.hide();
            // 3.让对应索引号的图片显示隐藏
            cate_part.eq(index).hide();
        })

        if (0 === flag) {
            // 5.让cate_top隐藏
            $(".cate_top").hide();
            // 3.让对应索引号的图片显示隐藏
            $(".cate_top .cate_part").eq(index).hide();
        }
    })

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
    // 核心思路：检测用户是否按下了 s 键，如果按下s键，就把光标定在搜索框里面
    // 利用keyCode进行判断
    // 搜索框获取焦点： 使用js 的focus()方法
    // 此处建议keyup而不是keyon，因为后者会把s输入到搜索框里面
    document.addEventListener('keyup', function (e) {
        if (e.keyCode === 83) {
            input.focus();
        }
    });

    // 底层图片出现操作
    // 鼠标经过小li，会发生两步操作
    $(".recom_bd ul a li").mouseenter(function () {
        // 1.当前小li变为317px，同时，里面的小图片淡出，大图片淡入
        // 并且修改宽度
        // 记得加上stop
        $(this).stop().animate({
            width: 396
        }).find(".small").stop().fadeOut().siblings(".big").stop().fadeIn();
        // 2.其余图片的大小都是145px，小图片淡入，大图片淡出
        // 并且修改宽度
        let liArray = $(this).parent().siblings("a").find("li");
        liArray.stop().animate({
            width: 198.2
        }).find(".small").stop().fadeIn().siblings(".big").stop().fadeOut();
    })

    // 电梯导航
    // 当点击某个模块，由于滚动事件会轮流变色
    // 利用节流阀、互斥锁使得点击时，不执行轮流变色
    let flag = true;
    $(window).scroll(function () {
        let topLen = $(".recom").offset().top - 75;
        if ($(document).scrollTop() >= topLen) {
            $(".comebackTop").fadeIn();
            $(".elevator").addClass("elevator_fixed");
        } else {
            $(".comebackTop").fadeOut();
            $(".elevator").removeClass("elevator_fixed");
        }
        // 页面滚动到某个区域，对应位置变色，记得if的先后顺序
        // 听我说，谢谢你
        if (flag) {
            let elevatorItem = $(".elevator_item");
            if ($(document).scrollTop() >= $(".floor").offset().top - 30) {
                elevatorItem.eq(3).find(".elevator_item_content").addClass("style_easy_blue");
                elevatorItem.eq(3).siblings(".elevator_item").find(".elevator_item_content").removeClass("style_easy_blue");
            } else if ($(document).scrollTop() >= $(".rotate").offset().top - 30) {
                elevatorItem.eq(2).find(".elevator_item_content").addClass("style_easy_blue");
                elevatorItem.eq(2).siblings(".elevator_item").find(".elevator_item_content").removeClass("style_easy_blue");
            } else if ($(document).scrollTop() >= $(".hot").offset().top - 30) {
                elevatorItem.eq(1).find(".elevator_item_content").addClass("style_easy_blue");
                elevatorItem.eq(1).siblings(".elevator_item").find(".elevator_item_content").removeClass("style_easy_blue");
            } else if ($(document).scrollTop() >= $(".recom").offset().top - 30) {
                elevatorItem.eq(0).find(".elevator_item_content").addClass("style_easy_blue");
                elevatorItem.eq(0).siblings(".elevator_item").find(".elevator_item_content").removeClass("style_easy_blue");
            } else {
                $(".elevator_item_content").removeClass("style_easy_blue"); // 去除蓝色
            }
        }
    })
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
        flag = false; // 互斥锁
        // 获取当前li的index，得到去往的位置
        let nowIndex = $(this).index();
        let currentClass; // 听我说，谢谢你
        switch (nowIndex) {
            case 0:
                currentClass = ".recom";
                break;
            case 1:
                currentClass = ".hot";
                break;
            case 2:
                currentClass = ".rotate";
                break;
            case 3:
                currentClass = ".floor";
                break;
            case 5:
                currentClass = "TOP";
                break;
            default:
                currentClass = "nothing";
        }
        if (currentClass !== "nothing") {
            if (currentClass === "TOP") {
                $("body, html").stop().animate({
                    scrollTop: 0
                });
                $(".elevator_item_content").removeClass("style_easy_blue"); // 去除蓝色
                return;
            }
            let currentHeight = $(currentClass).offset().top - 20;
            // 页面滚动效果
            $("body, html").stop().animate({
                scrollTop: currentHeight
            }, function () {
                flag = true; // 开锁
            });
        }
        // 让当前点击的出现蓝色
        $(this).find(".elevator_item_content").addClass("style_easy_blue");
        $(this).siblings(".elevator_item").find(".elevator_item_content").removeClass("style_easy_blue");
    })
})

$(function () {
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
                    let goodsNum = $("#goods-num");
                    $("#notLogin").remove();
                    $("#user-message").css("display", "block");
                    $("#user-line").css("display", "block");
                    $("#nickname").html(nickname);
                    goodsNum.html(goodsNum);
                    goodsNum.addClass("count");
                }
            }
        }
    }
    GetRequest();
})
