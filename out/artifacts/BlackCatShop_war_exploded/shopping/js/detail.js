window.addEventListener('load', function () {
    let preview_img = this.document.querySelector('.preview_img');
    let mask = this.document.querySelector('.mask');
    let big = this.document.querySelector('.big');
    let bigImg = this.document.querySelector('.bigImg');

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

})