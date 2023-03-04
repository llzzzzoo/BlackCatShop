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
                for(let i = 0; i < cookiesArr.length; i++){
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
})

window.addEventListener('load', function () {
    // input的样式操作
    let input = document.querySelector('input');
    // 静态父类或元素
    let itemList = $(".itemList");
    let selectAllBox = $(".select-AllBox");
    // 核心思路：检测用户是否按下了 s 键，如果按下s键，就把光标定在搜索框里面
    // 利用keyCode进行判断
    // 搜索框获取焦点： 使用js 的focus()方法
    // 此处建议keyup而不是keyon，因为后者会把s输入到搜索框里面
    document.addEventListener('keyup', function (e) {
        if (e.keyCode === 83) {
            input.focus();
        }
    });

    // 全部商品数目的功能
    function getNum() {
        let allItemLength = $(".item-content").length;
        $(".switch-cart").html("全部商品（全部" + allItemLength + "）");
    }

    /**
     * 拆分字符串
     */
    function splitStr(str){
        let info = [];
        // 拆分字符串 通过 & 将每一个参数单独分割出来
        let paramsArr = str.split('&')
        for(let i = 0,len = paramsArr.length;i < len;i++){
            // 再通过 = 将每一个参数分割为 key:value 的形式
            info[i] = paramsArr[i];
        }
        return info;
    }

    /**
     * 将某个用户购物车的数据打印出来
     */
    function refresh() {
        let date = new Date();
        let milliSeconds = date.getMilliseconds(); // 防止去缓存访问，实现每一次都去服务器访问
        let xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function () {
            if(this.readyState === 4 && this.status === 200) {
                // 将JSONArray的值赋给变量
                let jsonArr = JSON.parse(this.responseText);
                let shop = JSON.parse(jsonArr[0]);
                let goods = JSON.parse(jsonArr[1]);
                let goodsQuantity = JSON.parse(jsonArr[2]);
                let isSelected = JSON.parse(jsonArr[3]);
                let goodsIndex = JSON.parse(jsonArr[4]);
                let html = "";
                // 先搭建店铺框架
                for (let shopIndex = shop.length - 1; shopIndex >= 0; shopIndex--) {
                    html += "<div class='cart-tbody' data-index='" + shopIndex + "' id='shop"+ shopIndex +"'>";
                    html += "    <div class='shop'>";
                    html += "        <div class='cart-checkbox'>";
                    html += "            <input type='checkbox' class='checkShop'>";
                    html += "        </div>";
                    html += "        <span class='shop-info'>";
                    html += "                <a href='#' class='shop-name style_touch_deepblue'>"+ shop[shopIndex] +"</a>";
                    html += "            </span>";
                    html += "    </div>";
                    html += "    <div style='clear:both;'></div>";
                    // 找到店铺是当前店铺的，插入到后面
                    for (let oneGoodsIndex = goodsIndex.length - 1; oneGoodsIndex >= 0 ; oneGoodsIndex--) {
                        if(goods[oneGoodsIndex]["goodsShop"] === shop[shopIndex]){
                            let no = goods[oneGoodsIndex]["goodsNo"];
                            let name = goods[oneGoodsIndex]["goodsName"];
                            let pic = goods[oneGoodsIndex]["goodsPic"];
                            let details = goods[oneGoodsIndex]["goodsDetails"];
                            let unitPrice = parseFloat(goods[oneGoodsIndex]["goodsUnitPrice"]).toFixed(2);
                            let num = goodsQuantity[oneGoodsIndex];
                            let selectedStatus = isSelected[oneGoodsIndex];
                            // 此处要处理信息，把&分割开
                            let infoArr = splitStr(details);
                            // 总价
                            let totalPrice = (unitPrice * parseFloat(num)).toFixed(2);
                            html += "<div class='item-content' id='item"+ no +"'>";
                            html += "    <ul>";
                            html += "        <li class='td td-check'>";
                            html += "            <div class='item-down'>";
                            html += "                <div class='p-checkbox'>";
                            html += "                    <div class='cart-checkbox'>";
                            // 判断是否处于选中状态
                            if(selectedStatus === "1"){
                                html += "                        <input type='checkbox' name='checkItem' class='one-checkbox' data-index='"+ shopIndex +"' checked>";
                            } else{
                                html += "                        <input type='checkbox' name='checkItem' class='one-checkbox' data-index='"+ shopIndex +"'>";
                            }
                            html += "                    </div>";
                            html += "                </div>";
                            html += "            </div>";
                            html += "        </li>";
                            html += "        <li class='td td-item'>";
                            html += "            <div class='item-down'>";
                            html += "                <div class='goods-item'>";
                            html += "                    <div class='pic'>";
                            html += "                        <a href='#' title='"+ name +"'>";
                            html += "                            <img src='"+ pic +"'";
                            html += "                                 alt='"+ name +"'>";
                            html += "                        </a>";
                            html += "                    </div>";
                            html += "                    <div class='msg'>";
                            html += "                        <div class='p-name'>";
                            html += "                            <a href='#' class='item-title style_touch_deepblue'";
                            html += "                               title='"+ name +"'>";
                            html += "                                &nbsp;"+ name +"</a>";
                            html += "                        </div>";
                            html += "                        <div class='p-extend'>";
                            html += "                        <span class='service'>";
                            html += "                            <span class='service-icon'></span>";
                            html += "                            <span class='service-text'>选服务</span>";
                            html += "                        </span>";
                            html += "                        </div>";
                            html += "                    </div>";
                            html += "                </div>";
                            html += "            </div>";
                            html += "        </li>";
                            html += "        <li class='td td-info'>";
                            html += "            <div class='item-pros'>";
                            for (let infoIndex = 0; infoIndex < infoArr.length; infoIndex++) {
                                if(infoArr[infoIndex] !== "null") {
                                    html += "                <div class='item-allInfo'>" + infoArr[infoIndex] + "</div>";
                                    html += "                <p class='item-detail'>" + infoArr[infoIndex] + "</p>";
                                }
                            }
                            html += "            </div>";
                            html += "        </li>";
                            html += "        <li class='td td-price'>";
                            html += "            <div class='item-down'>";
                            html += "                <div class='item-price'>";
                            html += "                    <div class='price-content'>￥"+ unitPrice +"</div>";
                            html += "                </div>";
                            html += "            </div>";
                            html += "        </li>";
                            html += "        <li class='td td-quantity'>";
                            html += "            <div class='item-down'>";
                            html += "                <div class='cart-number'>";
                            html += "                    <button class='cart-number-dec'>";
                            html += "                        <i class='cart-number-downIcon'>";
                            html += "                        </i>";
                            html += "                    </button>";
                            html += "                    <div class='cart-input'>";
                            html += "                        <input type='text' class='cart-input-o' min='1' max='200'";
                            html += "                               value='"+ num +"'";
                            html += "                               onInput=value=value.replace(/[^\\d]/g,'')>";
                            html += "                    </div>";
                            html += "                    <button class='cart-number-inc'>";
                            html += "                        <i class='cart-number-addIcon'>";
                            html += "                        </i>";
                            html += "                    </button>";
                            html += "                </div>";
                            html += "            </div>";
                            html += "        </li>";
                            html += "        <li class='td td-sum'>";
                            html += "            <div class='item-down'>";
                            html += "                <div class='sum-price'>";
                            html += "                    <strong class='sum-price-o'>￥"+ totalPrice +"</strong>";
                            html += "                </div>";
                            html += "            </div>";
                            html += "        </li>";
                            html += "        <li class='td td-act'>";
                            html += "            <div class='item-down'>";
                            html += "                <a href='#' title='移入收藏夹' class='style_touch_deepblue'>移入收藏夹</a>";
                            html += "                <a href='javascript:void(0);'";
                            html += "                   class='remove-item style_touch_deepblue'>删除</a>";
                            html += "            </div>";
                            html += "        </li>";
                            html += "    </ul>";
                            html += "    <div style='clear:both;'></div>";
                            html += "</div>";
                        }
                    }
                    html += "</div>";
                }
                $(".itemList").html(html);
                getNum();
                modifyAttr();
            }
        }
        // 开启通道
        xhr.open("GET", "/BlackCatShop/shoppingCart/getAllGoods?" + milliSeconds, true);
        // 发送请求
        xhr.send();
    }
    function modifyAttr(){
        if ($(".one-checkbox:checked").length === $(".one-checkbox").length && $(".one-checkbox").length !== 0) {
            selectAllBox.prop("checked", true);
        } else {
            selectAllBox.prop("checked", false);
        }

        $(".cart-tbody").each(function (index, domEle) {
            if ($("#shop" + index + " .one-checkbox:checked").length === 0) {
                $("#shop" + index + " .checkShop").prop("checked", false);
            } else {
                $("#shop" + index + " .checkShop").prop("checked", true);
            }
        })
        $(".one-checkbox").each(function (index, domEle) {
            if ($(domEle).prop("checked")) {
                // 让所有商品添加类名
                $(domEle).parents(".item-content").addClass("check-cart-item");
            } else {
                // 否则移除
                $(domEle).parents(".item-content").removeClass("check-cart-item");
            }
        })
    }
    refresh();

    // 放大效果
    itemList.on("mouseenter", ".item-detail",function () {
        let itemAllInfo = $(".item-allInfo");
        let s_index = $(".item-detail").index($(this));
        itemAllInfo.css("top", $(this).offset().top - 50);
        itemAllInfo.eq(s_index).show();
    })
    itemList.on("mouseleave", ".item-detail",function () {
        let h_index = $(".item-detail").index($(this));
        $(".item-allInfo").eq(h_index).hide();
    })

    function updateNumAndMoney() {
        // 修改选中的数量和总的金额
        let selected_items = 0;
        let num = 0;
        let price = 0;
        let one_item_money = 0;
        let totalMoney = 0;
        $(".one-checkbox:checked").each(function (index, domEle) {
            selected_items += parseInt($(domEle).parents(".td-check").siblings(".td-quantity").find(".cart-input-o").val());
            num = parseInt($(domEle).parents(".td-check").siblings(".td-quantity").find(".cart-input-o").val());
            price = parseFloat($(domEle).parents(".td-check").siblings(".td-price").find(".price-content").text().substr(1));
            one_item_money = num * price;
            totalMoney += parseFloat(one_item_money);
        })
        $("#selectedItemsCount").html(selected_items);
        $(".cart-sum .price").text("￥" + totalMoney.toFixed(2));
    }


    // 下滑固定banner
    // 1.当下滑的offsetTop等于当前界面的总高度-固定的底部高度时，即固定
    let floatBar = $(".float-bar");
    function judgeFloatBar() {
        // 不能用if-else不然就会卡在复原上
        // 1.固定点位
        if (floatBar.offset().top > $(document).height() - 551) {
            floatBar.css("position", "static");
        }
        // 2.还原
        if ($(window).scrollTop() + $(window).height() < $(document).height() - 479) {
            floatBar.css("position", "fixed");
        }
    }
    judgeFloatBar();
    $(this.document).scroll(judgeFloatBar);

    // 店铺检查子商品是否删完，若删完，自行删除
    function getNowStatus() {
        $(".shop").each(function (index, domEle) {
            let len = $(domEle).parents(".cart-tbody").find(".item-content").length;
            if (0 === len) $(domEle).parents(".cart-tbody").remove();
        })
    }

    // 检查全选
    function getCheckedStatus() {
        let lenChecked = selectAllBox.parents(".cart-main").siblings(".itemList").find(".cart-tbody").length;
        if (0 === lenChecked) selectAllBox.prop("checked", false);
    }

    function getShopIndex(jQEle) {
        return jQEle.parents(".item-content").parents(".cart-tbody").find(".shop-name").html();
    }

    function getGoodsIndex(jQEle) {
        return jQEle.parents(".item-content").prop("id").slice(4);
    }

    function getGoodsQuantity(jQEle) {
        return jQEle.parents(".item-content").find(".cart-input-o").val();
    }

    /**
     * 把全部的物品的信息传递到后台去
     * 信息：数量，选中状态
     */
    function recordAllGoodsInformation() {
        // 1.先遍历一遍商品，当处于选中状态时进入下一步，否则跳过
        // 2.将选中商品的数量传到后台，后台进行此物品总价的计算
        // 3.将全部商品的价格返还给前台
        let checkBox = $(".one-checkbox");
        if(checkBox.length === 0){
            alert("请选择您要购买的物品");
            return;
        }
        checkBox.each(function (index, domEle) {
            let goodsNo = getGoodsIndex($(domEle)); // 得到商品的编号
            let goodsQuantity = getGoodsQuantity($(domEle));
            let isSelected = $(domEle).prop("checked")
            let date = new Date();
            let milliSeconds = date.getMilliseconds(); // 防止去缓存访问，实现每一次都去服务器访问
            let xhr = new XMLHttpRequest();
            xhr.onreadystatechange = function (){
            }
            // 开启通道
            xhr.open("POST", "/BlackCatShop/shoppingCart/recordGoodsInformation?"+milliSeconds, true);
            // 设置请求头(重要，模拟form表单，必须在打开通道之前设置)
            xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
            // 发送请求
            xhr.send("goodsNo=" + goodsNo + "&goodsQuantity=" + goodsQuantity + "&isSelected=" + isSelected);
        })
    }

    function recordOneShopGoodsInformation(jQElem) {
        // 1.先遍历一遍商品，当处于选中状态时进入下一步，否则跳过
        // 2.将选中商品的数量传到后台，后台进行此物品总价的计算
        // 3.将全部商品的价格返还给前台
        let checkBoxChecked = jQElem.parents(".cart-tbody").find(".one-checkbox");
        if(checkBoxChecked.length === 0){
            alert("请选择您要购买的物品");
            return;
        }
        checkBoxChecked.each(function (index, domEle) {
            let goodsNo = getGoodsIndex($(domEle)); // 得到商品的编号
            let goodsQuantity = getGoodsQuantity($(domEle));
            let isSelected = $(domEle).prop("checked")
            let date = new Date();
            let milliSeconds = date.getMilliseconds(); // 防止去缓存访问，实现每一次都去服务器访问
            let xhr = new XMLHttpRequest();
            xhr.onreadystatechange = function (){
            }
            // 开启通道
            xhr.open("POST", "/BlackCatShop/shoppingCart/recordGoodsInformation?"+milliSeconds, true);
            // 设置请求头(重要，模拟form表单，必须在打开通道之前设置)
            xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
            // 发送请求
            xhr.send("goodsNo=" + goodsNo + "&goodsQuantity=" + goodsQuantity + "&isSelected=" + isSelected);
        })
    }

    function recordOneGoodsInformation(jQElem) {
        // 1.先遍历一遍商品，当处于选中状态时进入下一步，否则跳过
        // 2.将选中商品的数量传到后台，后台进行此物品总价的计算
        // 3.将全部商品的价格返还给前台
        let goodsNo = getGoodsIndex(jQElem); // 得到商品的编号
        let goodsQuantity = getGoodsQuantity(jQElem);
        let isSelected = jQElem.prop("checked")
        let date = new Date();
        let milliSeconds = date.getMilliseconds(); // 防止去缓存访问，实现每一次都去服务器访问
        let xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function (){
        }
        // 开启通道
        xhr.open("POST", "/BlackCatShop/shoppingCart/recordGoodsInformation?"+milliSeconds, true);
        // 设置请求头(重要，模拟form表单，必须在打开通道之前设置)
        xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        // 发送请求
        xhr.send("goodsNo=" + goodsNo + "&goodsQuantity=" + goodsQuantity + "&isSelected=" + isSelected);
    }

    // 全选功能
    // 1.全选 全不选功能
    // 就是把全选按钮的属性赋值给小的按钮就好了
    // 利用change
    selectAllBox.on("change", function (){
        if (0 === $(".one-checkbox").length) {
            alert("当前购物车并无商品哦！");
            $(this).prop("checked", false);
            return;
        }
        $(".one-checkbox,.checkShop").prop("checked", $(this).prop("checked"));
        selectAllBox.prop("checked", $(this).prop("checked"));
        if ($(this).prop("checked")) {
            // 让所有商品添加类名
            $(".item-content").addClass("check-cart-item");
        } else {
            // 否则移除
            $(".item-content").removeClass("check-cart-item");
        }
        updateNumAndMoney();
        recordAllGoodsInformation();
    })


    // 2. 如果被选中的小框等于总的个数，就相当于全选 此时要把全选按钮选上
    // 4. 如果被选中的小框等于店铺下的个数，店铺的全选选上
    itemList.on("change", ".one-checkbox", function (){
        if ($(".one-checkbox:checked").length === $(".one-checkbox").length) {
            selectAllBox.prop("checked", true);
        } else {
            selectAllBox.prop("checked", false);
        }

        // 设置index和id
        // 当某个tbody的全部checkbox全部没有选中，则令其shop为未选中，否则为选中
        let index = $(this).attr("data-index");
        if ($("#shop" + index + " .one-checkbox:checked").length === 0) {
            $("#shop" + index + " .checkShop").prop("checked", false);
        } else {
            $("#shop" + index + " .checkShop").prop("checked", true);
        }
        if ($(this).prop("checked")) {
            // 让选中商品添加类名
            $(this).parents(".item-content").addClass("check-cart-item");
        } else {
            // 否则移除
            $(this).parents(".item-content").removeClass("check-cart-item");
        }
        updateNumAndMoney();
        recordOneGoodsInformation($(this));
    })

    // 3.处理店铺名字全部选中,然后全选选中
    itemList.on("change", ".checkShop", function (){
        $(this).parent().parent().parent().find(".one-checkbox").prop("checked", $(this).prop("checked"));

        if ($(this).prop("checked")) {
            // 让选中商品添加类名
            $(this).parents(".cart-tbody").find(".item-content").addClass("check-cart-item");
        } else {
            // 否则移除
            $(this).parents(".cart-tbody").find(".item-content").removeClass("check-cart-item");
        }
        updateNumAndMoney();
        recordOneShopGoodsInformation($(this));
    })

    /**
     * 增加或减少商品数量的函数
     * @param jQElem jQeury元素
     * @param status 当前减少还是增加
     */
    function addOrDec(jQElem, status){
        // 得到当前input的输入值
        let n = parseInt(jQElem.siblings(".cart-input").children(".cart-input-o").val());
        if (200 === n && status === 1) {
            jQElem.css("cursor", "not-allowed");
            return false;
        } else if(1 === n && status === -1){
            jQElem.css("cursor", "not-allowed");
            return false;
        }
        n = n + status;
        jQElem.siblings(".cart-input").children(".cart-input-o").val(n);

        // 计算金额
        let p = jQElem.parents(".td-quantity").siblings(".td-price").find(".price-content").html();
        p = p.substr(1); // 截断符号
        let price = (p * n).toFixed(2); // 保留两位小数
        jQElem.parents(".td-quantity").siblings(".td-sum").find(".sum-price-o").html("￥" + price);
        updateNumAndMoney();
    }

    /**
     * 判断当前的数目，做出样式的变化
     * @param jQElem jQuery元素
     * @param status 当前状态
     */
    function judgeNum(jQElem, status){
        if(status === 1) {
            if ("200" === jQElem.siblings(".cart-input").find(".cart-input-o").val()) {
                jQElem.css("cursor", "not-allowed");
            } else {
                jQElem.css("cursor", "pointer");
            }
        } else if(status === -1){
            if ("1" === $(this).siblings(".cart-input").find(".cart-input-o").val()) {
                $(this).css("cursor", "not-allowed");
            } else {
                $(this).css("cursor", "pointer");
            }
        }
    }

    // 增加商品数量
    itemList.on("click", ".cart-number-inc", function (){
        addOrDec($(this), 1);
        recordOneGoodsInformation($(this));
    })
    // 减少商品数量
    itemList.on("click", ".cart-number-dec", function (){
        addOrDec($(this), -1);
        recordOneGoodsInformation($(this));
    })

    // 判断数量，免得出问题
    itemList.on("mouseover", ".cart-number-inc", function (){
        judgeNum($(this), 1);
    })
    itemList.on("mouseover", ".cart-number-dec", function (){
        judgeNum($(this), -1);
    })

    // 输入框输入
    itemList.on("change", ".cart-input-o", function (){
        // 得到当前文本框的值，再乘以数量
        let n = $(this).val();
        // 防止溢出范围
        if (n < 1) {
            n = 1;
        } else if (n > 200) {
            n = 200;
        }
        $(this).val(n); // 赋值

        let p = $(this).parents(".td-quantity").siblings(".td-price").find(".price-content").html();
        p = p.substr(1); // 截断符号
        let price = (p * n).toFixed(2); // 保留两位小数
        $(this).parents(".td-quantity").siblings(".td-sum").find(".sum-price-o").html("￥" + price);
        updateNumAndMoney();
        recordOneGoodsInformation($(this));
    })

    $(".submit-button").click(function () {
        //
    })

    function delGoods(goodsNo, shopName){
        let xhr = new XMLHttpRequest();
        let date = new Date();
        let milliSeconds = date.getMilliseconds(); // 防止去缓存访问，实现每一次都去服务器访问
        xhr.onreadystatechange = function (){
            if(this.readyState === 4 && this.status === 200) {
                modifyAttr();
            }
        }
        // 开启通道
        xhr.open("POST", "/BlackCatShop/shoppingCart/delete?"+milliSeconds, true);
        // 设置请求头(重要，模拟form表单，必须在打开通道之前设置)
        xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        // 发送请求
        xhr.send("goodsNo=" + goodsNo + "&shopName=" + shopName);
    }

    // 删除商品
    // (1)删除当前的样品
    itemList.on("click", ".remove-item", function (){
        // 得到当前商品的id，实现页面跳转
        let goodsNo = getGoodsIndex($(this));
        let shopName = getShopIndex($(this));
        $(this).parents(".item-content").remove();
        getNum();
        updateNumAndMoney();
        getNowStatus();
        getCheckedStatus();
        delGoods(goodsNo, shopName);
    })

    // (2)删除复选框选中的
    $(".remove-itemChecked").on("click", function (){
        if (0 === $(".one-checkbox").length) {
            alert("当前购物车并无商品哦！");
            $(this).prop("checked", false);
            return;
        }
        // 要考虑到多选的情况，将所有被复选框选中的数据删除
        $(".one-checkbox:checked").each(function (index, domEle){
            setTimeout(function (){
                let goodsNo = getGoodsIndex($(domEle)); // 得到商品的编号
                let shopName = getShopIndex($(domEle)); // 得到商品的编号
                let xhr = new XMLHttpRequest();
                let date = new Date();
                let milliSeconds = date.getMilliseconds(); // 防止去缓存访问，实现每一次都去服务器访问
                xhr.onreadystatechange = function (){
                }
                // 开启通道
                xhr.open("POST", "/BlackCatShop/shoppingCart/delete?"+milliSeconds, true);
                // 设置请求头(重要，模拟form表单，必须在打开通道之前设置)
                xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
                // 发送请求
                xhr.send("goodsNo=" + goodsNo + "&shopName=" + shopName);
            }, 100)
            $(domEle).parents(".item-content").remove();
        })
        getNum();
        updateNumAndMoney();
        getNowStatus();
        getCheckedStatus();
    })

    // 电梯导航
    $(window).scroll(function () {
        let topLen = $(".cart-table-th").offset().top;
        if ($(document).scrollTop() >= topLen) {
            $(".comebackTop").fadeIn();
            $(".elevator").addClass("elevator_fixed");
        } else {
            $(".comebackTop").fadeOut();
            $(".elevator").removeClass("elevator_fixed");
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
        $("body, html").stop().animate({
            scrollTop: 0
        });
    }
    )
})