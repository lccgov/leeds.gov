(function (global, $) {
    "use strict";
    var LCC = global.LCC || {};
    LCC.Services = LCC.Services || {};
    LCC.Services.AddressService || {};

    LCC.Services.AddressService = function () {
        var self = this;

        self.gisServerUrl = "https://gis2.leeds.gov.uk";

        self.lookupAddressByPostcode = function (postcode, cacheId) {
            var dfd = jQuery.Deferred();
            
            var url = self.gisServerUrl + "/LocatorHub/Rest/Match/%7B0c670bf6-cdb4-4d76-92e4-582ee87e6936%7D/ADDRESS?format=jsonp&method=jsonpCallback&CacheID=" + cacheId;
            jQuery.ajax({
                dataType: 'jsonp',
                jsonpCallback: 'jsonpCallback',
                url: url,
                data: { query: postcode }
            })
            .done(function (response) {
                dfd.resolve(response);
            })
            .fail(function (jqXHR, textStatus) {
                console.log(textStatus);
                dfd.reject(textStatus);
            });

            return dfd.promise();
        }

        return {
            lookupAddressByPostcode: function (postcode) {
                return self.lookupAddressByPostcode(postcode);
            }
        }

    };
    
    global.LCC = LCC;
})(window,jQuery);