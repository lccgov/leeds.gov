/*-----------------------------
 * address-search
 * knockout component for using GIS locator hub to search for an address using a given postcode
 * 
 * Usage:
 * <div data-module="address-search">
    <address-search params="addresscallback: $root.AddressSelectedCallback"></address-search>
    <input id="addressLookup" type="button" data-bind="click: ShowDetails(), css: { disabled: !addressSelected() }, disable: !addressSelected()" class="btn btn-primary btn-small" value="Show Details" />
    <h2 data-bind="text: address, visible: showDetails()"></h2>
    </div>
 * 
-------------------------------*/
(function (global, $) {
    "use strict";
    var LCC = global.LCC || {};
    LCC.Modules = LCC.Modules || {};
    LCC.Settings = LCC.Settings || {};
    
    LCC.Modules.AddressSearch = function () { 
        var self = this;

        this.start = function (element) {
            console.log("Address search started");

            
ko.components.register('address-select', {
    viewModel: function(params) {
        var self = this;
        self.selectItems = params.values;
        self.selectId = params.id;
        self.parentId = params.parentId;
        self.Callback = params.callback;

        this.selectAddress = function(data, event) {
            //console.log("picked an address: " + data.selectId);
            //console.log("current address: " + this.selectItems()[event.originalEvent.srcElement.selectedIndex].Description);
            if(event.originalEvent.srcElement.selectedIndex >0) {
            var selectedItem = this.selectItems()[event.originalEvent.srcElement.selectedIndex-1];
            self.Callback(data.selectId, selectedItem.RecordId, selectedItem.HasChildren, selectedItem.Description);
            }
            else {
            	self.Callback(data.selectId, null, false, false);
            }
        }
    },
    template: '<label class="form-label" for="addressSelect">Select an address</label>\
           <select id="addressSelect" class="form-control address-select" name="addressSelect" data-bind="attr: { \'data-parent\': parentId, \'id\': selectId, \'data-cache\': selectId }, options: selectItems, optionsText: \'Description\', optionsValue:\'recordId\', optionsCaption: \'Select an address...\', event:{ change:selectAddress }">\
              <option value="" data-bind=" attr: { id: $data.recordId }, value:$data.recordId,text: $data.Description"></option>\
           </select>'
});

function Address(name, selectItems, parentId) {
    this.name = name;
    this.selectItems = ko.observableArray(selectItems || null);
    this.parentId = parentId;
}

ko.components.register('address-search', {
	viewModel: function(params) {
    var self = this;
	
    self.Addresscallback = params.addresscallback;
    
    self.addresses = ko.observableArray();
    self.postcode = ko.observable("LS12 1AW");

    self.searchAddress = function() {
        self.addresses([]);
        self.lookupAddress(null, null);
    }


    self.lookupAddress = function(cacheId, itemId) {
        console.log("looking up address " + this.postcode());

        jQuery.when(this.getByPostcode(this.postcode(), cacheId, itemId))
            .then(function(results) {
                //self.products.push(new Product(cacheId));
                self.updateOrCreateSelect(results.CacheIdentifier, results.PickListItems, cacheId);
            });
    }

    this.getByPostcode = function(postcode, cacheId, itemId) {
        var dfd = jQuery.Deferred();

        var url = "https://gis2.leeds.gov.uk/LocatorHub/Rest/Match/%7B0c670bf6-cdb4-4d76-92e4-582ee87e6936%7D/ADDRESS?format=jsonp&method=jsonpCallback&CacheID=" + cacheId;
        jQuery.ajax({
                dataType: 'jsonp',
                jsonpCallback: 'jsonpCallback',
                url: url,
                data: {
                    query: postcode,
                    pickeditem: itemId
                }
            })
            .done(function(response) {
                dfd.resolve(response);
            })
            .fail(function(jqXHR, textStatus) {
                console.log(textStatus);
                dfd.reject(textStatus);
            });

        return dfd.promise();
    }

    self.Callback = function(cacheId, recordId, hasChildren, selectedAddress) {

        self.addresses(self.removeAddressByParent(self.addresses(), 'parentId', cacheId));

        if (hasChildren) {
            self.lookupAddress(cacheId, recordId);
            self.Addresscallback(null, self.postcode);
        } else {
            //console.log("Final Address: " + selectedAddress);
            self.Addresscallback(selectedAddress, self.postcode);
        }
    }

    self.updateOrCreateSelect = function(cacheId, items, parentId) {
        self.addresses.push(new Address(cacheId, items, parentId));
    }

    self.removeAddressByParent = function(arr, attr, value) {
        var i = arr.length;
        while (i--) {
            if (arr[i] && arr[i].hasOwnProperty(attr) && (arguments.length > 2 && arr[i][attr] === value)) {

                arr.splice(i, 1);

            }
        }
        return arr;
    }

    self.findAddressByParent = function(arr, value) {
        var o;

        for (var i = 0, iLen = arr.length; i < iLen; i++) {
            o = arr[i];

            for (var p in o) {
                if (o.hasOwnProperty(p) && o[p] == value) {
                    return o;
                }
            }
        }
    }
	},
    template: '<div id="lh-locatorhub" class="jquery-locatorhub-container form-group-button">\
    <div class="form-group ">\
        <label class="form-label" for="postcode">Enter your postcode <span class="form-hint">For example, ‘LS6 2SB’.</span></label>\
        <input id="postcode" class="jquery-locatorhub-searchtext  form-control" data-bind="value: postcode" type="text" />\
    </div>\
    <div class="form-group">\
        <label class="sr-only" for="addressLookup">Lookup Address</label>\
        <input id="addressLookup" type="button" data-bind="click: searchAddress" class="jquery-locatorhub-searchbutton btn btn-secondary btn-small" value="Lookup Address" />\
    </div>\
</div>\
<div class="form-group" data-bind="foreach: addresses">\
    <address-select params="callback: $parent.Callback, values: selectItems, id: name, parentId: parentId"></address-select>\
</div>'
});


var vm = function () {
	var self = this;
    self.addressSelected = ko.observable(false);
    self.showDetails = ko.observable(false);
    self.address = ko.observable();
    
    self.ShowDetails = function() {
    	self.showDetails(true);
    }
    
    self.AddressSelectedCallback = function(address, postcode) {
    	console.log("Address: " + address);
        console.log("postcode: " + postcode());
        self.address(address);
        self.addressSelected(address);
        self.showDetails(false);
    }
};

//ko.applyBindings(new MyViewModel());
//var bindingScope = document.getElementById(elementId);
ko.applyBindings(new vm(), element[0]);

        }
    }
})(window, jQuery);