function animation(ele, obj, fn) {
    clearInterval(ele.timerId);
    ele.timerId = setInterval(function () {
        let flag = true;
        for (let key in obj) {
            let attr = key;
            let begin = parseInt(getComputedStyle(ele)[attr]);
            let target = parseInt(obj[attr]);
            if (attr == 'zIndex' || attr == 'backgroundColor') {
                begin = target;
            } else if (attr == 'opacity') {
                //由于透明度的初始值需要精确到小数型,初始值和结束值都需要*100；
                let begin = parseFloat(getComputedStyle(ele)[attr]) * 100;
                let target = obj[attr];
                target *= 100;
                //获取步长,实行缓动;
                let step = (target - begin) / 10;
                step = step > 0 ? Math.ceil(step) : Math.floor(step);
                begin += step;
                if (begin != target) {
                    flag = false;
                }
                //透明度需要再除以100再设置;
                ele.style[attr] = begin / 100;

            } else {
                let step = (target - begin) / 10;
                step = step > 0 ? Math.ceil(step) : Math.floor(step);
                begin += step;
                if (begin != target) {
                    flag = false;
                }
                ele.style[attr] = begin + 'px';
            }
        }
        if (flag) {
            clearInterval(ele.timerId);
            fn && fn();
        }
    }, 50)
}