$.fn.enterKey = function (fnc) {
    return this.each(function () {
        $(this).keypress(function (ev) {
            var keycode = (ev.keyCode ? ev.keyCode : ev.which);
            if (keycode == '13') {
                fnc.call(this, ev);
            }
        })
    })
}

$.fn.invisible = function () {
    return this.each(function () {
        $(this).css("display", "none");
    });
};
$.fn.visible = function () {
    return this.each(function () {
        $(this).css("display", "flex");
    });
};

const BASE_URL = 'https://raw.githubusercontent.com/slaviboy/Compose-Icons-Site/master/img/'
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
    const xhr = new XMLHttpRequest();
    xhr.open("GET", url, true)
    xhr.responseType = "blob"
    xhr.onload = function () {
        const urlCreator = window.URL || window.webkitURL;
        const imageUrl = urlCreator.createObjectURL(this.response);
        const tag = document.createElement('a')
        tag.href = imageUrl
        tag.download = fileName
        document.body.appendChild(tag)
        tag.click()
        document.body.removeChild(tag)
    }
    xhr.send()
}

$("a").click(function (evt) {
    evt.preventDefault()
})


let iconsData = []
let sortedIconsData = []
let currentSelectedPage = 0
const itemsPerPage = 96
let numberOfPages = 58
const sortOptions = {
    isRegular: false,
    isBold: false,
    isSolid: false,
    isStraight: false,
    isRounded: false,
    isBrands: false
}
let sortText = ""
let clickedIconData = null

function areAllSortOptionsDisabled() {
    let enabledSortOptions = 0
    for (const key in sortOptions) {
        if (sortOptions[key] == false) {
            enabledSortOptions++
        }
    }
    return (enabledSortOptions == Object.keys(sortOptions).length)
}

function getIconData() {
    $.getJSON("./json/icons.json", function (iconsJSON) {
        for (const key in iconsJSON) {
            iconsData = iconsJSON.data
        }
        getSortedIconsData()
        populateList(0)
    });
}
getIconData()

function setSelectedPage(page) {
    if (page >= 0 && page < numberOfPages) {
        $("#icon-info")
            .invisible()
        currentSelectedPage = page
        populateList(currentSelectedPage)
    }
}

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
        const page = $(this).val() - 1
        setSelectedPage(page)
    })
    $("#prevButton").click(function () {
        setSelectedPage(currentSelectedPage - 1)
    })
    $("#nextButton").click(function () {
        setSelectedPage(currentSelectedPage + 1)
    })
    $("#firstButton").click(function () {
        setSelectedPage(0)
    })
    $("#lastButton").click(function () {
        setSelectedPage(numberOfPages - 1)
    })
    $("#search-button").click(function () {
        sortText = $("#search-field").val()
        updateIcons()
    })
    $("#search-field").enterKey(function () {
        sortText = $("#search-field").val()
        updateIcons()
    })
    $("#search-close-button").click(function () {
        $("#search-field")
            .val("")
        sortText = $("#search-field").val()
        updateIcons()
    })
    $("#weight-regular").click(function () {
        sortOptions.isRegular = this.checked
        updateIcons()
    })
    $("#weight-bold").click(function () {
        sortOptions.isBold = this.checked
        updateIcons()
    })
    $("#weight-solid").click(function () {
        sortOptions.isSolid = this.checked
        updateIcons()
    })
    $("#corner-straight").click(function () {
        sortOptions.isStraight = this.checked
        updateIcons()
    })
    $("#corner-rounded").click(function () {
        sortOptions.isRounded = this.checked
        updateIcons()
    })
    $("#brands").click(function () {
        sortOptions.isBrands = this.checked
        updateIcons()
    })
}

$(document).ready(function () {
    setButtonsListeners()
})

function updateIcons() {
    $("#icon-info")
        .invisible()
    getSortedIconsData()
    currentSelectedPage = 0
    populateList(currentSelectedPage)
}

function getSortedIconsData() {

    let sortedIconsDataFromOptions = []
    const allSortOptionsDisabled = areAllSortOptionsDisabled()
    let addedIconData = 0
    if (allSortOptionsDisabled) {
        sortedIconsDataFromOptions = iconsData
    } else {
        const allWeightSortOptionsDisabled = (
            sortOptions.isRegular == false &&
            sortOptions.isBold == false &&
            sortOptions.isSolid == false
        )
        const allCornerSortOptionsDisabled = (
            sortOptions.isStraight == false &&
            sortOptions.isRounded == false
        )
        for (i = 0; i < iconsData.length; i++) {
            const iconData = iconsData[i]
            const iconMatchSortOptions = (
                (allWeightSortOptionsDisabled || (
                    (sortOptions.isRegular == (iconData.data_weight == "regular") && sortOptions.isRegular) ||
                    (sortOptions.isBold == (iconData.data_weight == "bold") && sortOptions.isBold) ||
                    (sortOptions.isSolid == (iconData.data_weight == "solid") && sortOptions.isSolid)
                )) &&
                (allCornerSortOptionsDisabled || (
                    (sortOptions.isStraight == (iconData.data_corner == "straight") && sortOptions.isStraight) ||
                    (sortOptions.isRounded == (iconData.data_corner == "rounded") && sortOptions.isRounded)
                ))
            ) &&
                (!sortOptions.isBrands || (sortOptions.isBrands == (iconData.data_prefix == "brands") && sortOptions.isBrands))

            if (iconMatchSortOptions) {
                addedIconData++
                sortedIconsDataFromOptions.push(iconData)
            }
        }
    }

    if (sortText.length == 0) {
        sortedIconsData = sortedIconsDataFromOptions
    } else {
        const sortedIconsDataFromText = []
        sortedIconsDataFromOptions.forEach((iconData, i) => {
            if (iconData.data_tags.indexOf(sortText) != -1) {
                sortedIconsDataFromText.push(iconData)
            }
        })
        sortedIconsData = sortedIconsDataFromText
    }

    numberOfPages = Math.ceil(sortedIconsData.length / itemsPerPage)
    $("#pagination-total")
        .html(numberOfPages)

}


function onIconItemClicked(that) {

    const k = parseInt($(that).attr('id').replace(/^\D+/g, ''))
    clickedIconData = sortedIconsData[k]
    $("#icon-info")
        .visible()
    $("#icon-type")
        .html(clickedIconData.data_class.replaceAll("-", "_"))
    $("#uicons__detail-icon-name")
        .html(capitalizeFirstLetter(clickedIconData.data_name) + " free icon font")
    $("#uicons__detail-img")
        .attr('src', BASE_URL + clickedIconData.data_id + '.svg')

    const tags = clickedIconData.data_tags.split(",")
    $("#tags")
        .children()
        .remove()
    tags.forEach(tag => {
        $("#tags")
            .append(
                $('<li>')
                    .append(
                        $('<a>')
                            .attr('href', '#!')
                            .attr('class', 'tag--related regular')
                            .html(tag)
                    )
            )
    })

    const iconInfo = $("#icon-info")
    $("#icon-info")
        .remove()
    iconInfo
        .insertAfter("#" + $(that).attr('id'))

        
    $("#close-icon-info").click(function () {
        $("#icon-info").invisible()
    })
    $("#copy").click(function () {
        copyToClipboard()
    })

    const similarIconsData = iconsData.filter(checkedIconData =>
        checkedIconData.data_name == clickedIconData.data_name
    )
    if (similarIconsData.length == 6) {
        $("#similar-icons-text").visible()
        $("#similar-icons").visible()
        similarIconsData.forEach((similarIconData, j) => {
            const iconDom = $(`#similar-icons-${similarIconData.data_prefix}`)
            const parent = iconDom.parent()
            if (similarIconData.data_id == clickedIconData.data_id) {
                parent.addClass("active")
            } else {
                parent.removeClass("active")
            }
            parent.parent().click(function () {
                clickedIconData = similarIconData
                $("#icon-type")
                    .html(clickedIconData.data_class.replaceAll("-", "_"))
                $("#uicons__detail-img")
                    .attr('src', BASE_URL + similarIconData.data_id + '.svg')

                similarIconsData.forEach((otherIconData, j) => {
                    const iconDom = $(`#similar-icons-${otherIconData.data_prefix}`)
                    const parent = iconDom.parent()
                    if (otherIconData.data_id == similarIconData.data_id) {
                        parent.addClass("active")
                    } else {
                        parent.removeClass("active")
                    }
                })
            })
            iconDom.attr('src', BASE_URL + similarIconsData[j].data_id + '.svg')
        })
    }
    else {
        $("#similar-icons-text").invisible()
        $("#similar-icons").invisible()
    }

}

function populateList(pageIndex) {

    // tab -> &emsp;
    // empty space -> &ensp;
    // pcr-app visible
    // $("html, body").animate({ scrollTop: $(document).height() }, 1000)

    $("#pagination-page")
        .val(pageIndex + 1)

    $(".uicons--results")
        .children()
        .not("#icon-info")
        .remove()

    let start = pageIndex * itemsPerPage
    let end = (pageIndex + 1) * itemsPerPage
    for (i = start; i < end; i++) {
        if (i < sortedIconsData.length) {
            const iconData = sortedIconsData[i]
            $(".uicons--results").append(
                $('<li>')
                    .attr('id', 'result-' + (i))
                    .addClass("fadein")
                    .unbind('click')
                    .click(function () {
                        onIconItemClicked(this)
                    })
                    .append(
                        $('<a>')
                            .attr('href', '#!')
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
                                    .attr('src', BASE_URL + iconData.data_id + '.svg')
                                    .attr('class', 'block lzy lazyload--done')
                                    .attr('width', '26')
                            )
                    )
            )
        }
    }
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function copyToClipboard() {
    const string = `
    Icon(
        modifier = Modifier
            .width(15.dp)
            .height(15.dp),
        type = R.drawable.${clickedIconData.data_class.replaceAll("-", "_")},
        color = Color(0xFF00FF00)
    )
    `
    navigator.clipboard.writeText(string)
}