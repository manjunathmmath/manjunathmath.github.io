var activeWheel;
window.onload = function () {
    $('#wheel-month').append($('#monthMenu .wheel-data'));
    $currentwidth = $('#monthMenu').width();
    var healthMenu = new wheelnav('monthMenu');
    healthMenu.clockwise = false;
    healthMenu.sliceInitPathFunction = healthMenu.slicePathFunction;
    healthMenu.titleRotateAngle = 0;
    healthMenu.spreaderInTitle = 'imgsrc:/images/marker.png';
    healthMenu.spreaderOutTitle = 'imgsrc:/images/marker.png';
    healthMenu.spreaderInTitleWidth = 100;
    healthMenu.spreaderOutTitleWidth = 100;
    healthMenu.spreaderPathInAttr = {
        fill: 'none',
        'stroke-width': 0,
        cursor: 'default'
    };
    healthMenu.spreaderPathOutAttr = {
        fill: 'none',
        'stroke-width': 0,
        cursor: 'default'
    };
    healthMenu.spreaderTitleInAttr = {
        cursor: 'default'
    };
    healthMenu.spreaderTitleOutAttr = {
        cursor: 'default'
    };
    healthMenu.spreaderEnable = true;
    healthMenu.slicePathFunction = slicePath().PieSlice;
    healthMenu.slicePathCustom = slicePath().PieSliceCustomization();
    healthMenu.slicePathCustom.titleRadiusPercent = 0.60;
    healthMenu.sliceSelectedAttr = {
        fill: '#8dc63f',
        opacity: '1'
    };
    healthMenu.lineSelectedAttr = {
        fill: '#ffffff',
        opacity: '1'
    };
    healthMenu.titleSelectedAttr = {
        fill: '#000000',
        opacity: '1'
    };
    healthMenu.animatetime = 300;
    healthMenu.animateeffect = 'linear';
    healthMenu.sliceSelectedTransformFunction = sliceTransform().MoveMiddleTransform;
    healthMenu.titleAttr = {
        fill: '#fff'
    };
    healthMenu.createWheel();
    activeWheel = healthMenu;
    activeWheel.navItems[activeWheel.selectedNavItemIndex].navigateFunction.call();
    $("ul.tab li").on("click", function (event) {
        if ($("section.info-panel > ul.tab > li").hasClass("active")) {
            $("section.info-panel > ul.tab > li").removeClass("active");
            $(".tab-content-container > section").removeClass("active");
        }
        $(this).toggleClass("active");
        $("section[data-panel-index='" + $(this).attr('data-tabindex') + "']").addClass("active");
    }); 

    var active = "slide-from-left";

    setTimeout(function () {
        $("section[data-study-wheel='month']").addClass(active);
    }, 100);

    $("a[data-study-link]").on("click", function () {
        switch ($(this).attr('data-study-link')) {
            case 'month':
                activeWheel = healthMenu;
                break;
        }

        activeWheel.navItems[activeWheel.selectedNavItemIndex].navigateFunction.call();

        $('.dropdown > a').html($(this).html());
        $("section.area-of-study > ul > li > a").removeClass("active");
        $(this).addClass('active');
        $("section[data-study-wheel]").removeClass(active);
        $("section[data-study-wheel='" + $(this).attr('data-study-link') + "']").addClass(active);
        $('.area-of-study .dropdown').removeClass('active');

        return false;
    });

    var rndSlice = -1;
    var rndSlice2 = -1;
    $('#spinWheel1, #spinWheel2').click(function () {
        while (rndSlice == rndSlice2) {
            rndSlice = Math.floor(Math.random() * activeWheel.navItemCount);
        }
        rndSlice2 = rndSlice;
        activeWheel.navigateWheel(rndSlice);
        activeWheel.navItems[activeWheel.selectedNavItemIndex].navigateFunction.call();
    });

    $('.next, .left').click(function () {
        if (activeWheel.selectedNavItemIndex == activeWheel.navItemCount - 1) {
            activeWheel.navigateWheel(0);
            activeWheel.navItems[activeWheel.selectedNavItemIndex].navigateFunction.call();
        } else {
            activeWheel.navigateWheel(activeWheel.selectedNavItemIndex + 1);
            activeWheel.navItems[activeWheel.selectedNavItemIndex].navigateFunction.call();
        }
    });

    $('.previous, .right').click(function () {
        if (activeWheel.selectedNavItemIndex == 0) {
            activeWheel.navigateWheel(activeWheel.navItemCount - 1);
            activeWheel.navItems[activeWheel.selectedNavItemIndex].navigateFunction.call();
        } else {
            activeWheel.navigateWheel(activeWheel.selectedNavItemIndex - 1);
            activeWheel.navItems[activeWheel.selectedNavItemIndex].navigateFunction.call();
        }
    });

    $('.area-of-study .dropdown').click(function () {
        $(this).toggleClass('active');
    });
    $(".next").trigger("click")
};

function swapProgramData() {
    var program, programFull, salary, whyChoose, addInfo, link;
    var dataObj;
    setTimeout(function () {
        switch (activeWheel.holderId) {
            case 'monthMenu':
                dataObj = $('#wheel-month .wheel-data')[activeWheel.selectedNavItemIndex];
                break;
        }

        $.when(getImagesFromFolder()).done(function (data) {
            console.log("data--"+data);
            $('section.info-panel').html(getImages(data, activeWheel.selectedNavItemIndex + 1));
            $('#aniimated-thumbnials').lightGallery({
                thumbnail: true,
                animateThumb: false,
                showThumbByDefault: false
            });
            // Animated thumbnails
            var $animThumb = $('#aniimated-thumbnials');
            if ($animThumb.length) {
                $animThumb.justifiedGallery({
                    border: 6
                }).on('jg.complete', function () {
                    $animThumb.lightGallery({
                        thumbnail: true
                    });
                });
            };

        });
    }, 200);
}
