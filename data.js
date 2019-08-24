var Months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
]

var data = []
var wheel = {}

wheel.category = 'month';
wheel.data = []

$.each(Months, function (index, month) {
    var temData = {}
    temData.navitemtext = month;
    temData.name = month;
    temData.fullName = month;
    temData.addtlInfo = [];
    var tempAddtlInfo = {}
    wheel.data.push(temData)
});

data.push(wheel);
generateWheelMarkup()

function generateWheelMarkup() {
    var htmlMarkup = ''
    htmlMarkup += ''
    $.each(data, function (index, item) {
        htmlMarkup += '<section id="wheel" data-study-wheel="' + item.category + '">'
        htmlMarkup += '<div id="monthMenu" data-wheelnav data-wheelnav-navangle="0" data-wheelnav-slicepath="Pieslice" data-wheelnav-navangle="30" data-wheelnav-colors="#006648,#298043,#41ad49,#009a6d" data-wheelnav-init>'

        $.each(item.data, function (dindex, ditem) {
            htmlMarkup += '<div data-wheelnav-navitemtext="' + ditem.navitemtext + '" onclick="swapProgramData();"></div>'
            htmlMarkup += '<div class="wheel-data">'
            htmlMarkup += '</div>'
        });

        htmlMarkup += '</div>'
        htmlMarkup + '</section>'
        $("#wheel-div").html(htmlMarkup)
    });
}

var folder = "Sheehan/thumbs/";
var actualFolder = "Sheehan/"

function getImagesFromFolder() {
    return $.ajax({
        url: folder,
        success: function (data) {}
    });
}

function getImages(data, month) {
    var fileExt = [];
    fileExt[0] = ".png";
    fileExt[1] = ".jpg";
    fileExt[2] = ".gif";
    var imgNotFound = false
    var imgMarkup = ''
    imgMarkup += '<div class="demo-gallery mrb50">'
    imgMarkup += '<div id="aniimated-thumbnials" class="list-unstyled">'
    $(data).find("a").attr("href", function (i, val) {
        if (val.match(/\.(jpe?g|png|gif|mp4)$/)) {
            if (val != '' && (val.indexOf('IMG') != -1)) {

                var actImage = val
                var imageName = actImage.split("_");
                var delimterEx = '_'
                if (imageName.length == 1) {
                    imageName = actImage.split("-");
                    delimterEx = "-"
                }
                var imageMonth = imageName[1].substring(4, 6)
                if (imageMonth == month) {
                    imgNotFound = true;
                    var ext = imageName[3].split(".")
                    var name = imageName[0] + delimterEx + imageName[1] + delimterEx + imageName[2] + "." + ext[1]
                    imgMarkup += '<a class="" href="' + actualFolder + name + '">'
                    imgMarkup += '<img class="img-responsive" src="' + folder + val + '" />'
                    imgMarkup += '<div class="demo-gallery-poster">'
                    imgMarkup += '<img src="light/dist/img/zoom.png">'
                    imgMarkup += '</div>'
                    imgMarkup += '</a>'
                }
            }
        }
    });

    if (!imgNotFound) {
        imgMarkup += '<a class="" href="images/IMG-20171228-WA0003.jpg">'
        imgMarkup += '<img class="img-responsive" src="images/IMG-20171228-WA0003.jpg" />'
        imgMarkup += '<div class="demo-gallery-poster">'
        imgMarkup += '<img src="light/dist/img/zoom.png">'
        imgMarkup += '</div>'
        imgMarkup += '</a>'
    }
    imgMarkup += '</div>'
    imgMarkup += '</div>'
    return imgMarkup;
}