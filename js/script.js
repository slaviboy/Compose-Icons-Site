const iconObjects = []

function extractJSON() {
    $(".uicons--results")
        .children()
        .find("a")
        .each(function (index) {
            iconObjects.push({
                data_track_arguments: $(this).attr("data-track-arguments"),
                data_id: $(this).attr("data-id"),
                data_name: $(this).attr("data-name"),
                data_tags: $(this).attr("data-tags"),
                data_teamid: $(this).attr("data-teamid"),
                data_corner: $(this).attr("data-corner"),
                data_weight: $(this).attr("data-weight"),
                data_prefix: $(this).attr("data-prefix"),
                data_class: $(this).attr("data-class")
            })
        })
    return JSON.stringify(iconObjects)
}

const iconsJSON = extractJSON()

function forceDownload(url, fileName) {

    var xhr = new XMLHttpRequest();
    xhr.open("GET", url, true);
    xhr.responseType = "blob";
    xhr.onload = function () {
        var urlCreator = window.URL || window.webkitURL;
        var imageUrl = urlCreator.createObjectURL(this.response);
        var tag = document.createElement('a');
        tag.href = imageUrl;
        tag.download = fileName;
        document.body.appendChild(tag);
        tag.click();
        document.body.removeChild(tag);
    }
    xhr.send();
}




let iconsData = []
let currentSelectedPage = 0
let itemsPerPage = 96
let numberOfPages = 58

function getIconData() {
    $.getJSON("./json/icons.json", function (iconsJSON) {
        for (const key in iconsJSON) {
            iconsData = iconsData.concat(iconsJSON[key])
        }
        populateList(0)
    });
}
getIconData()



function setButtonsListeners() {
    $("#download").click(function () {

        const svgURLs = []
        $(".uicons--results")
            .children()
            .find("a")
            .each(function (index) {
                svgURLs.push({
                    data_id: $(this).attr("data-id"),
                    data_svg: $(this).attr("data-svg")
                })
            })
        svgURLs.forEach((svgURL, i) => {
            console.log(i + '   ' + svgURL.data_svg)
            forceDownload(
                svgURL.data_svg,
                svgURL.data_id + '.svg'
            )
        })
    })
    $("#pagination-page").keyup(function () {
        currentSelectedPage = $(this).val() - 1
        populateList(currentSelectedPage)
    })
    $("#prevButton").click(function () {
        currentSelectedPage--
        populateList(currentSelectedPage)
    })
    $("#nextButton").click(function () {
        currentSelectedPage++
        populateList(currentSelectedPage)
    })
    $("#firstButton").click(function () {
        currentSelectedPage = 0
        populateList(currentSelectedPage)
    })
    $("#lastButton").click(function () {
        currentSelectedPage = numberOfPages - 1
        populateList(currentSelectedPage)
    })
}
setButtonsListeners()


function populateList(pageIndex) {

    $("html, body").animate({ scrollTop: $(document).height() }, 1000);

    $("#pagination-page")
        .val(pageIndex + 1) 

    $(".uicons--results")
        .children()
        .remove()

    let start = pageIndex * itemsPerPage
    let end = (pageIndex + 1) * itemsPerPage
    for (i = start; i < end; i++) {
        if (i < iconsData.length) {
            const iconData = iconsData[i]
            $(".uicons--results").append(
                $('<li>')
                    .attr('id', 'result-' + (i - start))
                    .addClass("fadein")
                    .append(
                        $('<a>')
                            .attr('href', '#')
                            .attr('class', 'track')
                            .attr('data-track-arguments', iconData.data_track_arguments)
                            .attr('data-id', iconData.data_id)
                            .attr('data-name', iconData.data_name)
                            .attr('data-tags', iconData.data_tags)
                            .attr('data-teamid', iconData.data_teamid)
                            .attr('data-corner', iconData.data_corner)
                            .attr('data-weight', iconData.data_weight)
                            .attr('data-prefix', iconData.data_prefix)
                            .attr('data-class', iconData.data_class)
                            .append(
                                $('<img>')
                                    .attr('src', '../img/' + pageIndex + '/' + iconData.data_id + '.svg')
                                    .attr('class', 'block lzy lazyload--done')
                                    .attr('width', '26')
                            )
                    )
            )
        }
    }
}