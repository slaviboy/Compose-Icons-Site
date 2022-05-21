$.fn.enterKey = function(fnc) {
    return this.each(function() {
        $(this).keypress(function(ev) {
            var keycode = (ev.keyCode ? ev.keyCode : ev.which);
            if (keycode == '13') {
                fnc.call(this, ev);
            }
        })
    })
}
const iconObjects = []

function extractJSON() {
    $(".uicons--results")
        .children()
        .find("a")
        .each(function(index) {
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
    xhr.onload = function() {
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
    $.getJSON("./json/icons.json", function(iconsJSON) {
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
        currentSelectedPage = page
        populateList(currentSelectedPage)
    }
}

function setButtonsListeners() {
    $("#download").click(function() {

        const svgURLs = []
        $(".uicons--results")
            .children()
            .find("a")
            .each(function(index) {
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
    $("#pagination-page").keyup(function() {
        const page = $(this).val() - 1
        setSelectedPage(page)
    })
    $("#prevButton").click(function() {
        setSelectedPage(currentSelectedPage - 1)
    })
    $("#nextButton").click(function() {
        setSelectedPage(currentSelectedPage + 1)
    })
    $("#firstButton").click(function() {
        setSelectedPage(0)
    })
    $("#lastButton").click(function() {
        setSelectedPage(numberOfPages - 1)
    })
    $("#search-button").click(function() {
        sortText = $("#search-field").val()
        updateIcons()
    })
    $("#search-field").enterKey(function() {
        sortText = $("#search-field").val()
        updateIcons()
    })
    $("#search-close-button").click(function() {
        $("#search-field")
            .val("")
        sortText = $("#search-field").val()
        updateIcons()
    })
    $("#weight-regular").click(function() {
        sortOptions.isRegular = this.checked
        updateIcons()
    })
    $("#weight-bold").click(function() {
        sortOptions.isBold = this.checked
        updateIcons()
    })
    $("#weight-solid").click(function() {
        sortOptions.isSolid = this.checked
        updateIcons()
    })
    $("#corner-straight").click(function() {
        sortOptions.isStraight = this.checked
        updateIcons()
    })
    $("#corner-rounded").click(function() {
        sortOptions.isRounded = this.checked
        updateIcons()
    })
    $("#brands").click(function() {
        sortOptions.isBrands = this.checked
        updateIcons()
    })
}
setButtonsListeners()

function updateIcons() {
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

function populateList(pageIndex) {

    //$("html, body").animate({ scrollTop: $(document).height() }, 1000)

    $("#pagination-page")
        .val(pageIndex + 1)

    $(".uicons--results")
        .children()
        .remove()


    let start = pageIndex * itemsPerPage
    let end = (pageIndex + 1) * itemsPerPage
    for (i = start; i < end; i++) {
        if (i < sortedIconsData.length) {
            const iconData = sortedIconsData[i]
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
                        .attr('src', '../img/' + iconData.data_id + '.svg')
                        .attr('class', 'block lzy lazyload--done')
                        .attr('width', '26')
                    )
                )
            )
        }
    }
}