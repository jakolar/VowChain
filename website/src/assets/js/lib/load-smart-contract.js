let vowAttributePhrases = {
    'sexual_fidelity': 'You [value] agreed to sexual exclusivity.',
    'share_medical_records': 'You [value] agreed to mutual sharing of your mediacal records.',
    'support_each_other': 'You [value] agreed to support each other.',
    'relationship_duration_months': function (duration) {
        if (duration === 0) return 'You have agreed to indefinite duration of this relationship.';
        return 'You have agreed to terminate your relationship after ' + duration + " months.";
    }
};

function phraseFromBool(value) {
    if (value === true) {
        return 'have';
    }
    return 'have not';
}

function handleSuccess(data, tag) {
    $.each(data, function(key, value){
        let phrasedValue = vowAttributePhrases[key];

        let formattedValue;
        if (typeof phrasedValue === 'function') formattedValue = phrasedValue.call(this, value);
        else formattedValue = phrasedValue.replace('[value]', phraseFromBool(value));

        $('<p/>', {html: formattedValue}).appendTo(tag);
    });
}

function handleError(jqXHR, textStatus, errorThrown, tag) {
    // todo: remove before prod
    console.log(errorThrown);

    $('<p/>', {html: 'We were unable to load the requested smart contract.<br>Please try again.'}).appendTo(tag);
}


function loadContract(url, tag) {
    $.ajax({
        dataType: 'json',
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

    let queryString = require('query-string');
    let parsedUrl = queryString.parse(location.search);
    let contractAddress = parsedUrl['contract'];

    if (typeof contractAddress === 'undefined') {
        $("<p/>", {html: 'Please enter the smart contract\'s address'}).appendTo(contentTag);
        return;
    }

    let addressInput = tag + ' #smart-contract-address';
    $(addressInput).val(contractAddress);

    let apiURL = 'http://46.101.117.31:80/api/contract_state/';
    let fullURL = apiURL + contractAddress;

    loadContract(fullURL, contentTag);
}

export {showContract};
