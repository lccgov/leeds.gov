(function (global, $) {
    "use strict";
    var LCC = global.LCC || {};
    LCC.Modules = LCC.Modules || {};
    
    LCC.Modules.BinsPrint = function () { 
        this.start = function (element) {

            element.on('click', function () {

                var timestamp = new Date().getUTCMilliseconds();
                var newWindow = open("", timestamp, 'width=auto,height=auto,menubar=yes,scrollbars=yes,resizable=yes');


                jQuery.get("/Style Library/PrintableCalender.html", function (data) {
                    var blackBinText = document.getElementById("divBlackBin");
                    var brownBinText = document.getElementById("divBrownBin");
                    var greenBinText = document.getElementById("divGreenBin");
                    var blueBinText = document.getElementById("divBlueBin");
                    if (blackBinText !== null && blackBinText !== undefined) {
                        data = data.replace("_blackBinData", blackBinText.innerHTML);
                    }
                    else {
                        data = data.replace("id='divBlackBin'", "id='divBlackBin' style='display:none'");
                    }
                    if (brownBinText !== null && brownBinText !== undefined) {
                        data = data.replace("_brownBinData", brownBinText.innerHTML);
                    }
                    else {
                        data = data.replace("id='divBrownBin'", "id='divBrownBin' style='display:none'");
                    }

                    if (greenBinText !== null && greenBinText !== undefined) {
                        data = data.replace("_greenBinData", greenBinText.innerHTML);
                    }
                    else {
                        data = data.replace("id='divGreenBin'", "id='divGreenBin' style='display:none'");
                    }
                    if (blueBinText !== null && blueBinText !== undefined) {
                        data = data.replace("_blueBinData", blueBinText.innerHTML);
                    }
                    else {
                        data = data.replace("id='divBlueBin'", "id='divBlueBin' style='display:none'");
                    }

                    var hostUrl = document.location.protocol + "//" + document.location.host;
                    var url = hostUrl + "/_catalogs/masterpage/public/images/";
                    data = data.replace(/..\/images\//g, url);

                    newWindow.document.body.innerHTML = data;
                    newWindow.focus();
                
                });

            });
        }

    };

    
    global.LCC = LCC;
})(window, jQuery);