(function( $ ) {
    var settings;
    var currentCard;
    var prevCard = [];
    
    // Plugin definition.
    $.fn.decisionTree = function( options ) {
        var elem = $( this );
        settings = $.extend( {}, $.fn.decisionTree.defaults, options );
        
        elem.addClass(settings.containerClass);
        renderRecursive(settings.data, elem, "dctree-first");
        
        $('.dctree-prev').on('click', function() {
            showCard(prevCard.pop(), true);
        });

        currentCard = $('#dctree-first');
        currentCard.show();
    };
    
    
    $.fn.decisionTree.defaults = {
        data: null,
        animationSpeed: "slow",
        animation: "fade",
        containerClass: "lcc-tree",
        cardClass: "lcc-tree-card",
        messageClass: "lcc-tree-card-content"
    };
    
    function renderRecursive(data, elem, id) {
        var container = $('<div></div>')
            .addClass(settings.cardClass);
        var message = $('<div></div>').addClass(settings.messageClass).append(data.message);
        container.append(message);
        
        if (id != null) {
            container.attr('id', id)
        }
        
        if (typeof data.decisions != "undefined") {
            var decisions = $('<div></div>').addClass('lcc-tree-card-actions');
            for(var i=0; data.decisions.length > i; i++) {
                var decision = data.decisions[i];
                var genId = guid();
                var grid = $('<div></div>');
                var answer = $('<button type="button"></button>')
                    .addClass("btn btn-primary dctree-answer-" + i)
                    .append(decision.answer)
                    .on('click', function() {
                        getNextCard(this);
                    })
                    .attr('data-dctree-targetid', genId);
                if (typeof decision.class != "undefined") {
                    answer.addClass(decision.class);
                }
                grid.append(answer);
                decisions.append(grid);
                renderRecursive(decision, elem, genId);
            }
            container.append(decisions);
        }
        
            
        if (id != 'dctree-first') {
            var controls = $('<div></div>').addClass('lcc-tree-controls');
            controls.append($('<a href="javascript:;" class="dctree-prev">Back</a>'));
            container.append(controls);
        }
        
        elem.append(container);
    }
    
    function getNextCard(elem)
    {
        var e = $(elem);
        currentCard = e.parents('.' + settings.cardClass)[0];
        prevCard.push(currentCard.id);
        var nextCard = e.attr('data-dctree-targetid');    
        showCard(nextCard);
    }
    
    function showCard(id, backward)
    {
        var nextCard = $("#" + id);
        
        if (settings.animation == 'slide') {
            $(currentCard).slideUp(settings.animationSpeed, function(){
                nextCard.slideDown(settings.animationSpeed);
            });
        } else if (settings.animation == 'fade') {
            $(currentCard).fadeOut(settings.animationSpeed, function(){
                nextCard.fadeIn(settings.animationSpeed);
            });
        } else if (settings.animation == 'slide-left') {
            var left = {left: "-100%"};
            var card = $(currentCard);

            if (backward) {
                left = {left: "100%"};
            }
            card.animate(left, settings.animationSpeed, function(){
                card.hide();
            });

            if (nextCard.css('left') == "-100%" || nextCard.css('left') == "100%") {
                left.left = 0;
                nextCard.show().animate(left, settings.animationSpeed);
            } else {
                nextCard.fadeIn(settings.animationSpeed);
            }
        }
        
        currentCard = nextCard;
    }
    
    function guid() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
            return v.toString(16);
        });
    }
 
// End of closure.
 
})( jQuery );

// Council tax - Changes to circumstances

var owninghomeleeds =  '<p>Use our change of address form to tell us about this change.</p> <a href="https://youraccount.leeds.gov.uk/publicaccesslive/selfservice/services/changeofaddress/form.htm?_flowId=services%2Fchangeofaddress%2Fform&_flowExecutionKey=e2s1" class="btn btn-primary btn-arrow">Tell us about your change</a> <h2>What you\'ll pay</h2><p>You will need to pay council tax for your new home from your completion date.</p> <details class="details"><summary>If your new build home doesn\'t have a council tax band</summary><div class="details__container"><p>We won\'t be able to send your bill until your property has a council tax band.</p><p>Tell us about your change of address and we will ask the Valuation Office Agency to band your new home.</p><p>Once it has a band, we will send your bill. We will backdate your bill to your completion date.</p></div></details>';
var rentinghomeleeds = '<p>Use our change of address form to tell us about this change.</p> <a href="https://youraccount.leeds.gov.uk/publicaccesslive/selfservice/services/changeofaddress/form.htm?_flowId=services%2Fchangeofaddress%2Fform&_flowExecutionKey=e2s1" class="btn btn-primary btn-arrow">Tell us about your change</a> <h2>What you\'ll pay</h2> <p>You will need to pay council tax for your new home from when your tenancy starts.</p>';
var withinleedsmessageone = '<p>We need to talk to you about this change. Call our council tax service to tell us you are moving.</p> <div class="text-block"><p>0113 222 4404 <br>(Monday to Friday, 9am to 5pm)</p></div>';

var data = {
    message: '<h2>Are you a full time student?</h2>',
    decisions: [
        {
            answer: 'Yes',
            message: '<p>Use our student discount application form to tell us about your change of address.</p> <a href="https://www.leeds.gov.uk/council-tax/discounts-and-exemptions/students" class="btn btn-primary btn-arrow">Tell us about your change</a>',                                         
        },
        {
            answer: 'No',
            message: '<h2>Are you paying council tax in Leeds for the first time?</h2>',
            decisions: [
                {
                    answer: 'Yes',
                    message: '<h2>Will you be renting or owning your new home in Leeds?</h2>',
                    decisions: [
                        {
                            answer: 'Owning',
                            message: owninghomeleeds
                        },
                        {
                            answer: 'Renting',
                            message: rentinghomeleeds
                        }
                    ]
                },
                {
                    answer: 'No',
                    message: '<h2>Do you get council tax support or housing benefits in Leeds?</h2>',
                    decisions: [
                        {
                            answer: 'Yes',
                            message: '<p>Tell us about your change of address by post or in person.</p> <p>Visit our <a href="https://www.leeds.gov.uk/council-tax/discounts-and-exemptions/council-tax-support/report-a-change">report a change page</a> to find out more.</p>',
                        },
                        {
                            answer: 'No',
                            message: '<h2>Where are you moving?</h2>',
                            decisions: [
                                {
                                    answer: 'Into Leeds',
                                    message: '<h2>Will you be renting or owning your new home in Leeds?</h2>',
                                    decisions: [
                                        {
                                            answer: 'Owning',
                                            message: owninghomeleeds
                                        },
                                        {
                                            answer: 'Renting',
                                            message: rentinghomeleeds
                                        }
                                    ]
                                },
                                {
                                    answer: 'Out of Leeds',
                                    message: '<h2>Tell us about the property you are leaving. Will anyone that you have been living with be staying there?</h2><p>For example housemates, family or friends.</p>',
                                    decisions: [
                                        {
                                            answer: 'Yes',
                                            message: '<p>We need to talk to you about this change. Call our council tax service to tell us you are moving.</p><div class="text-block"><p>0113 222 4404 <br><span class="font-xsmall">(Monday to Friday, 9am to 5pm)</span></p></div>'
                                        },
                                        {
                                            answer: 'No',
                                            message: '<h2>Are you moving from a property you owned or rented?</h2>',
                                            decisions: [
                                                {
                                                    answer: 'Owned',
                                                    message: '<h2>What is happening to the property you are leaving?</h2>',
                                                    decisions: [
                                                        {
                                                            answer: 'I\'ve sold it',
                                                            message: '<p>Use our change of address form to tell us about this change.</p> <a href="https://youraccount.leeds.gov.uk/publicaccesslive/selfservice/services/changeofaddress/coastart.htm;jsessionid=F84F38DA6B711D68A0F974C949F76F46" class="btn btn-primary btn-arrow">Tell us about your change</a> <h2>What you\'ll pay</h2> <p>You will need to pay council tax until your completion date.</p> <p>You will need to tell your new council that you are moving.</p>'
                                                        },
                                                        {
                                                            answer: 'I\'m letting it out',
                                                            message: '<p>Use our change of address form to tell us about this change.</p>  <a href="https://youraccount.leeds.gov.uk/publicaccesslive/selfservice/services/changeofaddress/coastart.htm;jsessionid=F84F38DA6B711D68A0F974C949F76F46" class="btn btn-primary btn-arrow">Tell us about your change</a> <h2>What you\'ll pay</h2> <p>You will need to pay the council tax for your old home until your tenant moves in.</p> <p>You will need to tell your new council that you are moving.</p>'
                                                        }, 
                                                        {
                                                            answer: 'It\'s empty',
                                                            message: '<p>Use our change of address form to tell us about this change.</p> <a href="https://youraccount.leeds.gov.uk/publicaccesslive/selfservice/services/changeofaddress/coastart.htm;jsessionid=F84F38DA6B711D68A0F974C949F76F46" class="btn btn-primary btn-arrow">Tell us about your change</a> <h2>What you\'ll pay</h2> <p>If you are leaving a property that you own and nobody else is moving in, you will still need to pay council tax for it.</p> <p>In some cases you might be able to apply for an exemption.</p> <p>If you would like to discuss this change further call us on:</p> <div class="text-block"><p>0113 222 4404 <br><span class="font-xsmall">(Monday to Friday, 9am to 5pm)</span></p></div><p>You will need to tell your new council that you are moving.</p>'
                                                        }
                                                    ]
                                                },
                                                {
                                                    answer: 'Rented',
                                                    message: '<p>Use our change of address form to tell us about this change.</p> <a href="https://youraccount.leeds.gov.uk/publicaccesslive/selfservice/services/changeofaddress/coastart.htm;jsessionid=F84F38DA6B711D68A0F974C949F76F46" class="btn btn-primary btn-arrow">Tell us about your change</a> <h2>What you\'ll pay</h2><p>You will need to pay council tax for your old home until either your tenancy ends or a new tenant moves in.</p><p>You will need to tell your new council that you are moving.</p>'
                                                }
                                            ]
                                        }
                                    ]
                                },
                                {
                                    answer: 'Within Leeds',
                                    message: '<h2>Tell us about the property you are leaving. Will anyone that you have been living with be staying there?</h2> <p>For example housemates, family or friends.</p>',
                                    decisions: [
                                        {
                                            answer: 'Yes',
                                            message: withinleedsmessageone
                                        },
                                        {
                                            answer: 'No',
                                            message: '<h2>Tell us about the property you are moving into. Will you be living with someone who is already paying council tax for the address?</h2>',
                                            decisions: [
                                                {
                                                    answer: 'Yes',
                                                    message: '<h2>Do you want to be added to the council tax bill at the new address?<h2>',
                                                    decisions: [
                                                        {
                                                            answer: 'Yes',
                                                            message: withinleedsmessageone
                                                        },
                                                        {
                                                            answer: 'No',
                                                            message: '<h2>Are you moving from a property you owned or rented?</h2>',
                                                            decisions: [
                                                                {
                                                                    answer: 'Rented',
                                                                    message: '<p>Use our change of address form to tell us about this change.</p> <a href="https://youraccount.leeds.gov.uk/publicaccesslive/selfservice/services/changeofaddress/coastart.htm;jsessionid=F84F38DA6B711D68A0F974C949F76F46" class="btn btn-primary btn-arrow">Tell us about your change</a> <h2>What you\'ll pay</h2><p>You will need to pay council tax for your old home until either your tenancy ends or a new tenant moves in.</p>'
                                                                },
                                                                {
                                                                    answer: 'Owned',
                                                                    message: '<h2>What is happening to the property you are leaving?</h2>',
                                                                    decisions: [
                                                                        {
                                                                            answer: 'I\'ve sold it',
                                                                            message: '<p>Use our change of address form to tell us about this change.</p><a href="https://youraccount.leeds.gov.uk/publicaccesslive/selfservice/services/changeofaddress/coastart.htm;jsessionid=F84F38DA6B711D68A0F974C949F76F46" class="btn btn-primary btn-arrow">Tell us about your change</a><h2>What you\'ll pay</h2><p>You will need to pay council tax for your old home until your completion date.</p>'
                                                                        },
                                                                        {
                                                                            answer: 'I\'m letting it out',
                                                                            message: '<p>Use our change of address form to tell us about this change.</p><a href="https://youraccount.leeds.gov.uk/publicaccesslive/selfservice/services/changeofaddress/coastart.htm;jsessionid=F84F38DA6B711D68A0F974C949F76F46" class="btn btn-primary btn-arrow">Tell us about your change</a><h2>What you\'ll pay</h2><p>You will need to pay the council tax for your old home until your tenant moves in.</p>'
                                                                        },
                                                                        {
                                                                            answer: 'It\'s empty',
                                                                            message: '<p>Use our change of address form to tell us about this change.</p><a href="https://youraccount.leeds.gov.uk/publicaccesslive/selfservice/services/changeofaddress/coastart.htm;jsessionid=F84F38DA6B711D68A0F974C949F76F46" class="btn btn-primary btn-arrow">Tell us about your change</a><h2>What you\'ll pay</h2><p>If you are leaving a property that you own and nobody else is moving in, you will still need to pay council tax for it.</p><p>In some cases you might be able to apply for an <a href="https://www.leeds.gov.uk/council-tax/discounts-and-exemptions">exemption</a>.</p><p>If you would like to discuss this change further call us on:</p><div class="text-block"><p>0113 222 4404 <br><span class="font-xsmall">(Monday to Friday, 9am to 5pm)</span></p></div>'
                                                                        }
                                                                    ]
                                                                }
                                                            ]
                                                        }
                                                    ]
                                                },
                                                {
                                                    answer: 'No',
                                                    message: '<h2>Are you moving from a property you rented or owned?</h2>',
                                                    decisions: [
                                                        {
                                                            answer: 'Rented',
                                                            message: '<h2>Will you be renting or owning your new home in Leeds?</h2>',
                                                            decisions: [
                                                                {
                                                                    answer: 'Rent',
                                                                    message: '<p>Use our change of address form to tell us about this change.</p> <a href="https://youraccount.leeds.gov.uk/publicaccesslive/selfservice/services/changeofaddress/coastart.htm;jsessionid=F84F38DA6B711D68A0F974C949F76F46" class="btn btn-primary btn-arrow">Tell us about your change</a><h2>What you\'ll pay</h2><p>You will receive a closing bill for your old home and an opening bill for your new home.</p><h3>For your new home</h3><p>You will need to pay council tax for your new home from when your tenancy starts.</p><h3>For your old home</h3><p>You will need to pay council tax for your old home until either your tenancy ends or a new tenant moves in.</p>'
                                                                },
                                                                {
                                                                    answer: 'Own',
                                                                    message: '<p>Use our change of address form to tell us about this change.</p><a href="https://youraccount.leeds.gov.uk/publicaccesslive/selfservice/services/changeofaddress/coastart.htm;jsessionid=F84F38DA6B711D68A0F974C949F76F46" class="btn btn-primary btn-arrow">Tell us about your change</a><h2>What you\'ll pay</h2><p>You will receive a closing bill for your old home and an opening bill for your new home.</p><h3>For your new home</h3><p>You will need to pay council tax for your new home from your completion date.</p><details class="details"><summary>If your new build home doesn\'t have a council tax band</summary><div class="details__container"><p>We won\'t be able to send your bill until your property has a council tax band.</p><p>Tell us about your change of address and we will ask the Valuation Office Agency to band your new home.</p><p>Once it has a band we will send your bill. We will backdate your bill to your completion date.</p></div></details><h3>For your old home</h3><p>You will need to pay council tax for your old home until either your tenancy ends or a new tenant moves in.</p>'
                                                                }
                                                            ]
                                                        },
                                                        {
                                                            answer: 'Owned',
                                                            message: '<h2>What is happening to the property you are leaving?</h2>',
                                                            decisions: [
                                                                {
                                                                    answer: 'I\'ve sold it',
                                                                    message: '<h2>Will you be renting or owning your new home in Leeds?</h2>',
                                                                    decisions: [
                                                                        {
                                                                            answer: 'Renting',
                                                                            message: '<p>Use our change of address form to tell us about this change.</p><a href="https://youraccount.leeds.gov.uk/publicaccesslive/selfservice/services/changeofaddress/coastart.htm;jsessionid=F84F38DA6B711D68A0F974C949F76F46" class="btn btn-primary btn-arrow">Tell us about your change</a><h2>What you\'ll pay</h2><p>You will receive a closing bill for your old home and an opening bill for your new home.</p><h3>For your new home</h3><p>You will need to pay council tax at your new home from when your tenancy starts.</p><h3>For your old home</h3><p>You will need to pay the council tax for your old home until your completion date.</p>'
                                                                        },
                                                                        {
                                                                            answer: 'Owning',
                                                                            message: '<p>Use our change of address form to tell us about this change.</p><a href="https://youraccount.leeds.gov.uk/publicaccesslive/selfservice/services/changeofaddress/coastart.htm;jsessionid=F84F38DA6B711D68A0F974C949F76F46" class="btn btn-primary btn-arrow">Tell us about your change</a><h2>What you\'ll pay</h2><p>You will receive a closing bill for your old home and an opening bill for your new home.</p><h3>For your new home</h3><p>You will need to pay council tax for your new home from your completion date.</p><details class="details"><summary>If your new build home doesn\'t have a council tax band</summary><div class="details__container"><p>We won\'t be able to send your bill until your property has a council tax band.</p><p>Tell us about your change of address and we will ask the Valuation Office Agency to band your new home.</p><p>Once it has a band we will send your bill. We will backdate your bill to your completion date.</p></div></details><h3>For your old home</h3><p>You will need to pay the council tax for your old home until your completion date.</p>'
                                                                        }
                                                                    ]
                                                                },
                                                                {
                                                                    answer: 'I\'m letting it out',
                                                                    message: '<h2>Will you be renting or owning your new home in Leeds?</h2>',
                                                                    decisions: [
                                                                        {
                                                                            answer: 'Renting',
                                                                            message: '<p>Use our change of address form to tell us about this change.</p><a href="https://youraccount.leeds.gov.uk/publicaccesslive/selfservice/services/changeofaddress/coastart.htm;jsessionid=F84F38DA6B711D68A0F974C949F76F46" class="btn btn-primary btn-arrow"> Tell us about your change</a><h2>What you\'ll pay</h2><p>You will receive a closing bill for your old home and an opening bill for your new home.</p><h3>For your new home</h3><p>You will need to pay council tax at your new home from when your tenancy starts.</p><h3>For your old home</h3><p>You will need to pay the council tax for your old home until you have a tenant.</p>'
                                                                        },
                                                                        {
                                                                            answer: 'Owning',
                                                                            message: '<p>Use our change of address form to tell us about this change.</p><a href="https://youraccount.leeds.gov.uk/publicaccesslive/selfservice/services/changeofaddress/coastart.htm;jsessionid=F84F38DA6B711D68A0F974C949F76F46" class="btn btn-primary btn-arrow">Tell us about your change</a><h2>What you\'ll pay</h2><p>You will receive a closing bill for your old home and an opening bill for your new home.</p><h3>For your new home</h3><p>You will need to pay council tax for your new home from your completion date.</p><details class="details"><summary>If your new build home doesn\'t have a council tax band</summary><div class="details__container"><p>We won\'t be able to send your bill until your property has a council tax band.</p><p>Tell us about your change of address and we will ask the Valuation Office Agency to band your new home.</p><p>Once it has a band we will send your bill. We will backdate your bill to your completion date.</p></div></details><h3>For your old home</h3><p>You will need to pay the council tax for your old home until you have a tenant.</p>'
                                                                        }
                                                                    ]
                                                                },
                                                                {
                                                                    answer: 'It\'s empty',
                                                                    message: '<h2>Will you be renting or owning your new home in Leeds?<h2>',
                                                                    decisions: [
                                                                        {
                                                                            answer: 'Renting',
                                                                            message: '<p>Use our change of address form to tell us about this change.</p><a href="https://youraccount.leeds.gov.uk/publicaccesslive/selfservice/services/changeofaddress/coastart.htm;jsessionid=F84F38DA6B711D68A0F974C949F76F46" class="btn btn-primary btn-arrow">Tell us about your change</a><h2>What you\'ll pay</h2><h3>For your new homee</h3><p>You will need to pay council tax at your new home from when your tenancy starts.</p> <h3>For your empty property</h3><p>If you are leaving a property that you own and nobody else is moving in, you will still need to pay council tax for it.</p> <p>In some cases you might be able to apply for an <a href="https://www.leeds.gov.uk/council-tax/discounts-and-exemptions">exemption</a>.</p><p>If you would like to discuss this change further call us on:</p><div class="text-block"><p>0113 222 4404 <br><span class="font-xsmall">(Monday to Friday, 9am to 5pm)</span></p></div>',
                                                                        },
                                                                        {
                                                                            answer: 'Owning',
                                                                            message: '<p>Use our change of address form to tell us about this change.</p><a href="https://youraccount.leeds.gov.uk/publicaccesslive/selfservice/services/changeofaddress/coastart.htm;jsessionid=F84F38DA6B711D68A0F974C949F76F46" class="btn btn-primary btn-arrow">Tell us about your change</a><H2>What you\'ll pay</H2><h3>For your new home</h3><p>You will need to pay council tax for your new home from your completion date.</p><details class="details"><summary>If your new build home doesn\'t have a council tax band</summary><div class="details__container"><p>We won\'t be able to send your bill until your property has a council tax band.</p><p>Tell us about your change of address and we will ask the Valuation Office Agency to band your new home.</p><p>Once it has a band we will send your bill. We will backdate your bill to your completion date.</p></div></details><h3>For your empty property</h3><p>If you are leaving a property that you own and nobody else is moving in, you will still need to pay council tax for it.</p><p>In some cases you might be able to apply for an <a href="https://www.leeds.gov.uk/council-tax/discounts-and-exemptions">exemption</a>.</p><p>If you would like to discuss this change further call us on:</p><div class="text-block"><p>0113 222 4404 <br><span class="font-xsmall">(Monday to Friday, 9am to 5pm)</span></p></div>',
                                                                        }
                                                                    ]
                                                                }
                                                            ]
                                                        }
                                                    ]
                                                }
                                            ]
                                        }
                                    ]
                                }
                            ]
                        }
                    ]
                }
            ]
        }
    ]
};

jQuery(document).ready(function() {
    jQuery('.lcc-council-tax-tree').decisionTree({data: data});
});