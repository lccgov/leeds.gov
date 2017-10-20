(function (global, $) {
    "use strict";
    var LCC = global.LCC || {};
    LCC.Modules = LCC.Modules || {};

    LCC.Modules.ContactUsForm = function (settings) {

        ko.validation.init({  
            registerExtenders: true,  
            messagesOnModified: true,  
            insertMessages: true,  
            parseInputAttributes: true,  
            errorClass:'form-control-error',  
            errorMessageClass:'error-message',  
            messageTemplate: null,
            decorateInputElement: true,
            errorElementClass: 'form-group-error'

        }, true); 
        ko.validation.insertValidationMessage = function (element) {
            var span = document.createElement('SPAN');
            span.className = "error-message";
            element.parentNode.insertBefore(span, element);
            return span;
        };

        var self = this;
        this.view = {};
        this.view.fields = {};
        self.settings = settings;

        if(self.settings.nameEnabled) {
            this.view.fields.Name = ko.observable().extend({ required: true, minLength: 2, maxLength:50});
            if(self.settings.name) {
                this.view.fields.Name = self.settings.name;
            }
        }
        //this.view.fields.Name.extend({ validatable: false });
        if(self.settings.commentsEnabled) {
            this.view.fields.Comments = ko.observable().extend({ required: true, minLength: 2, maxLength:1000, message: 'Please enter comments between 1 and 1000 characters'});
            if(self.settings.comments) {
                this.view.fields.Comments = self.settings.comments;
            }
        }
        if(self.settings.emailEnabled) {
            this.view.fields.Email = ko.observable().extend({required: true, email: true});
            if(self.settings.email) {
                this.view.fields.Email = self.settings.email;
            }
        }

        self.view.errors = ko.validation.group(this, {
            deep: true,
            observable: true
        });

        self.view.testValidate = function(data, event) {
            var target = event.target || event.srcElement
            target.preventDefault();
            event.preventDefault();
            if(self.view.errors().length > 0) {
                self.view.errors.showAllMessages();
                return false;
            }

            return true;
        };

        self.isValid = function() {
            if(self.view.errors().length > 0) {
                self.view.errors.showAllMessages();                
                return false;
            }

            return true;
        };

        this.bindData = function (elementId) {
            console.log('binding element' + elementId);
            var bindingScope = document.getElementById(elementId);
            ko.applyBindings(self.view, bindingScope);
            return true;
        };

        
        //}

        return {
            bindData: function (elementId) {
                self.bindData(elementId);
            },
            isValid: function() {
                return self.isValid();
            }
        }

    };


    // LCC.ContactForm = new LCC.Modules.ContactUsForm('nameId');
    // LCC.ContactForm.bindData("Contact-US");

    global.LCC = LCC;
})(window, jQuery);