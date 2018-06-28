function handleSuccess(data, tag) {
    $.each(data, function(key, value){
        // todo: test this when the api actually works
        $("<div/>", {html: value}).appendTo(tag);
        // $("handleErrorData").appendTo(tag);
    });
}

function handleError(jqXHR, textStatus, errorThrown, tag) {
    // todo: remove before prod
    console.log(errorThrown);

    $("<p/>", {html: "We were unable to load the requested smart contract.<br>Please try again."}).appendTo(tag);
}


function loadContract(url, tag) {
    $.ajax({
        dataType: "json",
        url: url,
        crossDomain: true,
        success: function success(data) {
            handleSuccess(data, tag);
        },
        error: function error(jqXHR, textStatus, errorThrown) {
            handleError(jqXHR, textStatus, errorThrown, tag);
        }
    });
}

function showContract(tag) {
    if ($(tag).length === 0) return;

    let contentTag = tag + " .smart-contract-content";

    let queryString = require("query-string");
    let parsedUrl = queryString.parse(location.search);
    let contractAddress = parsedUrl["contract"];

    if (typeof contractAddress === 'undefined') {
        $("<p/>", {html: "Please enter the smart contract's address"}).appendTo(contentTag);
        return;
    }

    let addressInput = tag + " #smart-contract-address";
    $(addressInput).val(contractAddress);

    let apiURL = "http://46.101.117.31:80/api/contract_state/";
    let fullURL = apiURL + contractAddress;

    loadContract(fullURL, contentTag);
}

export {showContract};
