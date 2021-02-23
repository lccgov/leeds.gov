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
                                                                            message: '<p>Use our change of address form to tell us about this change.</p><a href="https://youraccount.leeds.gov.uk/publicaccesslive/selfservice/services/changeofaddress/coastart.htm;jsessionid=F84F38DA6B711D68A0F974C949F76F46" class="btn btn-primary btn-arrow">Tell us about your change</a><h2>What you\'ll pay</h2><h3>For your new home</h3><p>You will need to pay council tax at your new home from when your tenancy starts.</p> <h3>For your empty property</h3><p>If you are leaving a property that you own and nobody else is moving in, you will still need to pay council tax for it.</p> <p>In some cases you might be able to apply for an <a href="https://www.leeds.gov.uk/council-tax/discounts-and-exemptions">exemption</a>.</p><p>If you would like to discuss this change further call us on:</p><div class="text-block"><p>0113 222 4404 <br><span class="font-xsmall">(Monday to Friday, 9am to 5pm)</span></p></div>',
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

// ----------- Noise nuisance decision tree
var nnrepeatedcontentone = '<p>Your case officer will give you regular updates every two weeks.</p> <p>If you have not had an update in more than two weeks or if you have new information about your report please contact your case officer or call 0113 222 4402 (9am until 5pm, Monday to Friday).</p>';
var nnrepeatedcontenttwo = '<p>After you report the noise issue to us we will aim to contact you within one week.</p><p>If it has been more than one week since you first reported the issue please call for an update.</p><div class="text-block"><p>0113 222 4402 (9am until 5pm)</p></div>';
var nnrepeatedcontentthree = '<p>After you report the noise issue to us we aim to contact you within one week.</p> <p>If it has been more than a week since you first reported the noise please call for an update.</p> <div class="text-block"><p>0113 378 5959 (9am until 5pm, Monday to Friday)</p></div>';
var nnrepeatedcontentfour = '<p>We will give you updates when they are available. If you have new information relating to your report please contact your case officer or call 0113 378 5959 (9am until 5pm, Monday to Friday).</p>';
var nnrepeatedcontentfive = '<p>Some people do not realise their everyday noises are a problem. They\'re probably not doing it on purpose.</p> \
<p>If it feels safe, try speaking to the person responsible and see if you can come to an agreement.</p> \
<p> If this does not work use our form to report the noise. We will aim to contact you within one week.</p> \
<p><a href="https://my.leeds.gov.uk/Pages/Form Pages/AntisocialBehaviourOrHateCrime.aspx">Report antisocial behaviour</a></p>';  
var nnrepeatedcontentsix = '<p>Contact the police on 101 to report the disturbance.</p>\
<p>If you would like to report this as antisocial behaviour use our  form.</p>\
<p>If you need urgent help between 6pm and 3:30am call 0113 376 0337.</p>\
<p><a href="https://my.leeds.gov.uk/Pages/Form Pages/AntisocialBehaviourOrHateCrime.aspx">Report antisocial behaviour</a></p>'; 
var nnrepeatedcontentseven = '<p>If someone is in immediate danger call 999.</p>';
var nnrepeatedcontenteight = '<p>The use of heavy machinery is permitted:</p>\
<ul class="list list-bullet">\
<li>8am to 6pm Monday to Friday</li>\
<li>8am to 1pm on Saturday</li>\
</ul>\
<p>In some cases we may have given permission for work to be carried out outside of these hours.</p>\
<p>We may be able to help if you feel that the noise is happening at unreasonable times.</p>\
<p>Use our form to report the noise and we will  aim to contact you within one week.</p>\
<p>So we can take action and provide you with feedback regarding this noise issue we will need you to share your details with us when you complete the form.</p>\
<p><a href="https://my.leeds.gov.uk/Pages/Form%20Pages/ReportNoisePollution.aspx">Report commercial noise</a></p>';
var nnrepeatedcontentnine = '<p>Noise from the day to day running of a business is not legally considered a noise nuisance.</p>\
<p>We may be able to help if you feel that the noise is happening at unreasonable times or is not related to the running of the business.</p>\
<p>Use our form to report the noise  and we will contact you within one week.</p>\
<p>So we can take action and provide you with feedback regarding this noise issue we will need you to share your details with us when you complete the form.</p>\
<p><a href="https://my.leeds.gov.uk/Pages/Form%20Pages/ReportNoisePollution.aspx">Report commercial noise</a></p>';
var nnrepeatedcontentten = '<p>Try speaking to the business owner to see if they can stop the alarm.</p>\
<p>If there is no answer or they\'re unable to to stop the alarm, call us to report the noise.</p>\
<div class="text-block"><p>0113 222 4402</p></div>\
<p>If you need urgent help between 6pm and 3:30am call</p>\
<div class="text-block"><p>0113 376 0337</p></div>';

var noisedecisiontree = {
    message: '<h2>Have you reported this noise issue before?</h2>',
    decisions: [
        {
            answer: 'Yes',
            message: '<h2>Where is the noise coming from?</h2>', 
            decisions: [
                {
                    answer: 'Vehicle',
                    message: '<h2>Have we been in contact about your report?</h2>',  
                    decisions: [
                        {
                            answer: 'Yes',
                            message: nnrepeatedcontentone,                                         
                        },
                        {
                            answer: 'No',
                            message: nnrepeatedcontenttwo,
                        }
                    ]                                        
                },
                {
                    answer: 'Street',
                    message: '<h2>Have we been in contact about your report?</h2>',  
                    decisions: [
                        {
                            answer: 'Yes',
                            message: nnrepeatedcontentone,                                         
                        },
                        {
                            answer: 'No',
                            message: nnrepeatedcontenttwo,
                        }
                    ]                                        
                },
                {
                    answer: 'House or Garden',
                    message: '<h2>Have we been in contact about your report?</h2>',  
                    decisions: [
                        {
                            answer: 'Yes',
                            message: nnrepeatedcontentone,                                         
                        },
                        {
                            answer: 'No',
                            message: nnrepeatedcontenttwo,
                        }
                    ]                                        
                },
                {
                    answer: 'Business',
                    message: '<h2>Have we been in contact about your report?</h2>',
                    decisions: [
                        {
                            answer: 'Yes',
                            message: nnrepeatedcontentfour,                                         
                        },
                        {
                            answer: 'No',
                            message: nnrepeatedcontentthree,
                        }
                    ] 
                }
                ,
                {
                    answer: 'Organised event',
                    message: '<h2>Have we been in contact about your report?</h2>',
                    decisions: [
                        {
                            answer: 'Yes',
                            message: nnrepeatedcontentfour,                                         
                        },
                        {
                            answer: 'No',
                            message: nnrepeatedcontentthree,
                        }
                    ] 
                },
                {
                    answer: 'Other',
                    message: '<p>Let us know about the noise by contacting us:</p> \
                    <p>8am to 6pm (Monday to Friday)</p> \
                    <div class="text-block">\
                        <p><a href="https://my.leeds.gov.uk/Pages/Form Pages/AntisocialBehaviourOrHateCrime.aspx">Report antisocial behaviour</a></p> \
                    </div> \
                    <p>6pm to 3:30am (7 days a week)</p> \
                    <div class="text-block"><p>0113 376 0337</p></div>',
                }
            ]                                        
        },
        {
            answer: 'No',
            message: '<h2>Where is the noise coming from?</h2>',
            decisions: [
                {
                    answer: 'Vehicle',
                    message: '<h2>What type of noise is it?</h2>',
                    decisions: [
                        {
                            answer: 'Alarm',
                            message: '<h2>Is a crime taking place?</h2>',
                            decisions: [
                                {
                                    answer: 'Yes',
                                    message: '<p>If somebody is trying to steal or damage a vehicle call 999.</p>',
                                },
                                {
                                    answer: 'No',
                                    message: '<p>If you know who owns the vehicle try speaking to them to see if they can turn off the alarm.</p> \
                                    <p>If you cannot get in contact, let us know about the noise by contacting us:</p> \
                                    <p>8am to 6pm (Monday to Friday)</p> \
                                    <div class="text-block"> \
                                        <p>0113 222 4402</p> \
                                    </div> \
                                    <p>6pm to 3:30am (7 days a week)</p> \
                                    <div class="text-block"> \
                                        <p>0113 376 0337</p> \
                                    </div><p>Any other time</p> \
                                    <div class="text-block"> \
                                        <p><a href="https://my.leeds.gov.uk/Pages/Form Pages/AntisocialBehaviourOrHateCrime.aspx">Complete our antisocial behaviour form</a></p> \
                                    </div>'
                                }
                            ]
                        },
                        {
                            answer: 'Ice cream van',
                            message: '<p>Ice cream vans are allowed to play chimes between 12pm and 7pm. We may be able to help if the ice cream van is breaking the <a href="https://www.gov.uk/government/publications/code-of-practice-on-noise-from-ice-cream-van-chimes"><span class="sr-only">Ice cream van</span> code of practice</a>.</p> \
                            <p>If the noise is happening outside of these hours you can use our form to report it and we will contact you within one week.</p> \
                            <p>So we can take action and provide you with feedback regarding this noise issue we will need you to share your details with us when you complete the form.</p> \
                            <p><a href="https://my.leeds.gov.uk/Pages/Form%20Pages/ReportNoisePollution.aspx">Report commercial noise</a></p>'
                        },
                        {
                            answer: 'Repair work',
                            message: nnrepeatedcontentfive,                         
                        },
                        {
                            answer: 'Revving engine',
                            message: nnrepeatedcontentfive,                            
                        },
                        {
                            answer: 'Motocross track',
                            message: '<h2>Is someone in immediate danger?</h2>',  
                            decisions: [
                                {
                                    answer: 'Yes',
                                    message: '<p>If someone is in immediate danger call 999.</p>',
                                },
                                {
                                    answer: 'No',
                                    message: '<h2>Is the site being used illegally?</h2>',
                                    decisions: [
                                        {
                                            answer: 'Legal site or business',
                                            message: '<p>Noise from the day to day running of a business is not legally considered a noise nuisance.</p>\
                                            <p>We may be able to help if you feel that the noise is happening at unreasonable times or is not related to the running of the business.</p>\                                  <p>Use our form to report the noise and we will contact you within one week.</p>\
                                            <p>So we can take action and provide you with feedback regarding this noise issue we will need you to share your details with us when you complete the form.</p>\
                                            <p><a href="https://my.leeds.gov.uk/Pages/Form%20Pages/ReportNoisePollution.aspx">Report commercial noise</a></p>',
                                        },
                                        {
                                            answer: 'Illegal site',
                                            message: '<p>Use our form to report the noise. We\'ll get back to you to let you know what we are doing about your complaint.</p> \
                                            <p>We will get in touch as quickly as we can depending on how serious the noise is. We aim to get back to everyone within one week.</p> \
                                            <p>If there is illegal activity then you can report this to the police on 101.</p> \
                                            <p>If you need urgent help between 6pm and 3:30am call 0113 376 0337.</p>\
                                            <p><a href="https://my.leeds.gov.uk/Pages/Form Pages/AntisocialBehaviourOrHateCrime.aspx">Report antisocial behaviour</a></p>',
                                        }
                                    ]
                                }
                            ]                          
                        },
                        {
                            answer: 'Road traffic noise',
                            message: '<h2>Is the noise general road noise or due to dangerous driving?</h2>',   
                            decisions: [
                                {
                                    answer: 'General road noise',
                                    message: '<p>Noise as a result of everyday living such as road traffic noise is not considered a nuisance.</p>\
                                    <p>You can find out more by reading the government\'s advice for <a href = "https://www.gov.uk/noise-pollution-road-train-plane">traffic and road noise</a>.</p>',
                                },
                                {
                                    answer: 'Dangerous driving',
                                    message: '<p>Dangerous driving should be reported to the police on 101.</p>',
                                }
                            ]                         
                        },
                    ]
                },
                {
                    answer: 'Street',
                    message: '<h2>What type of noise is it?</h2>',
                    decisions: [
                        {
                            answer: 'Road traffic noise',
                            message: '<h2>Is the noise general road noise or due to dangerous driving?</h2>',   
                            decisions: [
                                {
                                    answer: 'General road noise',
                                    message: '<p>Noise as a result of everyday living such as road traffic noise is not considered a nuisance.</p>\
                                    <p>You can find out more by reading the government\'s advice for <a href = "https://www.gov.uk/noise-pollution-road-train-plane">traffic and road noise</a>.</p>',
                                },
                                {
                                    answer: 'Dangerous driving',
                                    message: '<p>Dangerous driving should be reported to the police on 101.</p>',
                                }
                            ]  
                        },
                        {
                            answer: 'Children and young people',
                            message: '<h2>Is there damage to property?</h2>',
                            decisions: [
                                {
                                    answer: 'Yes',
                                    message: '<h2>Is someone in immediate danger?</h2>',
                                    decisions: [
                                        {
                                            answer: 'Yes',
                                            message: '<p>If someone is in immediate danger call 999.</p>',
                                        },
                                        {
                                            answer: 'No',
                                            message: '<p>Contact the police on 101. Use our form to report the antisocial behaviour to us.</p>\
                                            <p><a href="https://my.leeds.gov.uk/Pages/Form Pages/AntisocialBehaviourOrHateCrime.aspx">Report antisocial behaviour</a></p>',
                                        }
                                    ]
                                },
                                {
                                    answer: 'No',
                                    message: '<h2>Is someone being harrassed?</h2>',
                                    decisions: [
                                        {
                                            answer: 'Yes',
                                            message: '<h2>Is someone in immediate danger?</h2>',
                                            decisions: [
                                                {
                                                    answer: 'Yes',
                                                    message: '<p>If someone is in immediate danger call 999.</p>',
                                                },
                                                {
                                                    answer: 'No',
                                                    message: '<p>Contact the police on 101. Use our form to report the antisocial behaviour to us.</p>\
                                                    <p><a href="https://my.leeds.gov.uk/Pages/Form Pages/AntisocialBehaviourOrHateCrime.aspx">Report antisocial behaviour</a></p>',
                                                }
                                            ]
                                        },
                                        {
                                            answer: 'No',
                                            message: '<h2>Are they fighting or causing offensive behaviour?</h2>',
                                            decisions: [
                                                {
                                                    answer: 'Yes',
                                                    message: '<h2>Is someone in immediate danger?</h2>',
                                                    decisions: [
                                                        {
                                                            answer: 'Yes',
                                                            message: '<p>If someone is in immediate danger call 999.</p>',
                                                        },
                                                        {
                                                            answer: 'No',
                                                            message: '<p>Contact the police on 101. Use our form to report the antisocial behaviour to us.</p><p><a href="https://my.leeds.gov.uk/Pages/Form Pages/AntisocialBehaviourOrHateCrime.aspx">Report antisocial behaviour</a></p>',
                                                        }
                                                    ]
                                                },
                                                {
                                                    answer: 'No',
                                                    message: '<p>Noise as a result of everyday living such as children playing and household noise is not considered a nuisance.</p> \
                                                    <p>Some people do not realise their everyday noises are a problem. They\'re probably not doing it on purpose.</p> \
                                                    <p>If it feels safe, try speaking to the person responsible and see if you can come to an agreement.</p> \
                                                    <p>If you think the children are vulnerable or at risk then you can <a href="https://www.leeds.gov.uk/residents/health-and-social-care/keeping-children-safe/report-a-child-protection-concern">report a child protection concern to us</a>.</p> \
                                                    <p><a href="https://my.leeds.gov.uk/Pages/Form Pages/AntisocialBehaviourOrHateCrime.aspx">If the noise is causing a lot of disturbance, you can report it on our antisocial behaviour form.</a></p>',
                                                }
                                            ]
                                        }
                                    ]
                                }
                            ]
                        },
                        {
                            answer: 'Buskers',
                            message: '<p>We welcome activity that improves the experience and atmosphere of the city such as buskers.</p>\
                            <p>If you think a busker in Leeds is being too loud, please speak to them.</p> \
                            <p>If the problem continues, contact our <a href="https://www.leeds.gov.uk/business/commercial-opportunities/city-centre-advice-on-activities/cc">city centre management team<span class="sr-only"> to report problem buskers</span></a>.</p>',
                        },
                        {
                            answer: 'Machinery',
                            message: '<p>The use of heavy machinery is permitted between 8am and 6pm Monday to Friday and 8am to 1pm on Saturday.</p>\
                            <p>In some cases we may have given permission for work to be done outside of these hours.</p>\
                            <p>We may be able to help if you feel that the noise is happening at unreasonable times.</p>\
                            <p>Use our form to report the noise and we will aim to contact you within one week.</p>\
                            <p><a href="https://my.leeds.gov.uk/Pages/Form Pages/AntisocialBehaviourOrHateCrime.aspx">Report antisocial behaviour</a></p>',
                        },
                        {
                            answer: 'Bin collections',
                            message: '<h2>Is the bin collection for a home or a business?</h2>',
                            decisions: [
                                {
                                    answer: 'Home',
                                    message: '<p>Our bin collections take place from 7am Monday to Friday. You can\'t report a noise that is caused by the normal running of these collections.</p>\
                                    <p>If you have concerns about inappropriate behaviour by our bin crews you can use our form to report it.</p>\
                                    <p><a href="https://my.leeds.gov.uk/Pages/Form%20Pages/IssuewithaWasteCollectionCrew.aspx">Report a problem with your waste collection crew</a></p>',
                                },
                                {
                                    answer: 'Business',
                                    message: '<p>Bin collections for business are carried out by private companies. Please contact the company who are responsible for the noise.</p>\
                                    <p>You can also use our form to report the noise. We will aim to  contact you within one week.</p>\
                                    <p><a href="https://my.leeds.gov.uk/Pages/Form%20Pages/ReportNoisePollution.aspx">Report commercial noise</a></p>',
                                }
                            ]
                        },
                        {
                            answer: 'Street party',
                            message: '<h2>Is there damage to the property?</h2>',
                            decisions: [
                                {
                                    answer: 'Yes',
                                    message: '<h2>Is someone in immediate danger?</h2>',
                                    decisions: [
                                        {
                                            answer: 'Yes',
                                            message: nnrepeatedcontentseven,
                                        },
                                        {
                                            answer: 'No',
                                            message: nnrepeatedcontentsix,
                                        }
                                    ]
                                },
                                {
                                    answer: 'No',
                                    message: '<h2>Is someone being harassed?</h2>',
                                    decisions: [
                                        {
                                            answer: 'Yes',
                                            message: '<h2>Is someone in immediate danger?</h2>',
                                            decisions: [
                                                {
                                                    answer: 'Yes',
                                                    message: nnrepeatedcontentseven,
                                                },
                                                {
                                                    answer: 'No',
                                                    message: nnrepeatedcontentsix,
                                                }
                                            ]
                                        },
                                        {
                                            answer: 'No',
                                            message: '<h2>Are they fighting or causing offensive behaviour?</h2>',
                                            decisions: [
                                                {
                                                    answer: 'Yes',
                                                    message: '<h2>Is someone in immediate danger?</h2>',
                                                    decisions: [
                                                        {
                                                            answer: 'Yes',
                                                            message: nnrepeatedcontentseven,
                                                        },
                                                        {
                                                            answer: 'No',
                                                            message: nnrepeatedcontentsix,
                                                        }
                                                    ]
                                                },
                                                {
                                                    answer: 'No',
                                                    message: '<p>Let us know about the noise by contacting us:</p>\
                                                    <p>8am to 6pm (Monday to Friday)</p>\
                                                    <div class="text-block"><p>0113 222 4402</p></div>\
                                                    <p>6pm to 3:30am (7 days a week)</p>\
                                                    <div class="text-block"><p>0113 376 0337</p></div>\
                                                    <p>Any other time</p>\
                                                    <div class="text-block"><p>Report antisocial behaviour</p></div>',
                                                }
                                            ]
                                        }
                                    ]
                                }
                            ]
                        },
                    ]
                },
                {
                    answer: 'House or garden',
                    message: '<h2>What type of noise is it?</h2>',
                    decisions: [
                        {
                            answer: 'Loud music or a party',
                            message: '<h2>Is there damage to property?</h2>',
                            decisions: [
                                {
                                    answer: 'Yes',
                                    message: '<h2>Is someone in immediate danger?</h2>',
                                    decisions: [
                                        {
                                            answer: 'Yes',
                                            message: '<p>If someone is in immediate danger call 999.</p>',
                                        },
                                        {
                                            answer: 'No',
                                            message: '<p>Contact the police on 101 to report the disturbance.</p>\
                                            <p>If you would like to report this as antisocial behaviour use our  form.</p>\
                                            <p>If you need urgent help between 6pm and 3:30am call 0113 376 0337.</p>\
                                            <p><a href="https://my.leeds.gov.uk/Pages/Form Pages/AntisocialBehaviourOrHateCrime.aspx">Report antisocial behaviour</a></p>',
                                        }             
                                    ]
                                },
                                {
                                    answer: 'No',
                                    message: '<h2>Is someone being harrassed?</h2>',
                                    decisions: [
                                        {
                                            answer: 'Yes',
                                            message: '<h2>Is someone in immediate danger?</h2>',
                                            decisions: [
                                                {
                                                    answer: 'Yes',
                                                    message: '<p>If someone is in immediate danger call 999.</p>',
                                                } ,
                                                {
                                                    answer: 'No',
                                                    message: '<p>Contact the police on 101 to report the disturbance.</p>\
                                                    <p>If you would like to report this as antisocial behaviour use our  form.</p>\
                                                    <p>If you need urgent help between 6pm and 3:30am call 0113 376 0337.</p>\
                                                    <p><a href="https://my.leeds.gov.uk/Pages/Form Pages/AntisocialBehaviourOrHateCrime.aspx">Report antisocial behaviour</a></p>',
                                                }                                    
                                            ]
                                        },
                                        {
                                            answer: 'No',
                                            message: '<h2>Are they fighting or causing offensive behaviour?</h2>',
                                            decisions: [
                                                {
                                                    answer: 'Yes',
                                                    message: '<h2>Is someone in immediate danger?</h2>',
                                                    decisions: [
                                                        {
                                                            answer: 'Yes',
                                                            message: '<p>If someone is in immediate danger call 999.</p>',
                                                        },
                                                        {
                                                            answer: 'No',
                                                            message: '<p>Contact the police on 101 to report the disturbance.</p>\
                                                            <p>If you would like to report this as antisocial behaviour use our  form.</p>\
                                                            <p>If you need urgent help between 6pm and 3:30am call 0113 376 0337.</p>\
                                                            <p><a href="https://my.leeds.gov.uk/Pages/Form Pages/AntisocialBehaviourOrHateCrime.aspx">Report antisocial behaviour</a></p>',
                                                        }   
                                                    ]
                                                },
                                                {
                                                    answer: 'No',
                                                    message: '<p>Use our form to report the noise. We\'ll get back to you to let you know what we are doing about your complaint.</p>\
                                                    <p>We will get in touch as quickly as we can depending on how serious the noise is. We aim to get back to everyone within one week. </p>\
                                                    <p>If you need urgent help between 6pm and 3:30am call 0113 376 0337.</p>\
                                                    <p><a href="https://my.leeds.gov.uk/Pages/Form Pages/AntisocialBehaviourOrHateCrime.aspx">Report antisocial behaviour</a></p>'
                                                }                                     
                                            ]
                                        }                                        
                                    ]
                                }
                            ]
                        },
                        {
                            answer: 'Noise from washing machine and other appliances',
                            message: '<p>Noise from day to day activity such as flushing toilets, washing machines, vacuums, lawnmowers, doors and cupboards closing, is not considered a noise nuisance.</p>\
                            <p>Some people do not realise their everyday noises are a problem. They\'re probably not doing it on purpose.</p>\
                            <p>If it feels safe, try speaking to the person responsible and see if you can come to an agreement.</p>',
                        },
                        {
                            answer: 'Renovation or DIY work',
                            message: '<p>Some people do not realise their everyday noises are a problem. They\'re probably not doing it on purpose. \
                            <p>If it feels safe, try speaking to the person responsible and see if you can come to an agreement.</p> \
                            <p>If this does not work, use our form to report the noise. A case officer will contact you within one week.</p>\
                            <p>If you need urgent help between 6pm and 3:30am call 0113 376 0337.</p>\
                            <p><a href="https://my.leeds.gov.uk/Pages/Form Pages/AntisocialBehaviourOrHateCrime.aspx">Report antisocial behaviour</a></p>',
                        },
                        {
                            answer: 'TV noise',
                            message: '<p>Some people do not realise their everyday noises are a problem. They\'re probably not doing it on purpose. \
                            <p>If it feels safe, try speaking to the person responsible and see if you can come to an agreement.</p> \
                            <p>If this does not work, use our form to report the noise. A case officer will contact you within one week.</p>\
                            <p>If you need urgent help between 6pm and 3:30am call 0113 376 0337.</p>\
                            <p><a href="https://my.leeds.gov.uk/Pages/Form Pages/AntisocialBehaviourOrHateCrime.aspx">Report antisocial behaviour</a></p>',
                        },
                        {
                            answer: 'Shouting or verbal abuse',
                            message: '<h2>Is someone in immediate danger?</h2>',
                            decisions: [
                                {
                                    answer: 'Yes',
                                    message: '<p>If someone is in immediate danger call 999.</p>',
                                },
                                {
                                    answer: 'No',
                                    message: '<p>If you are worried about someone because they are experiencing or witnessing domestic abuse, you can <a href="https://www.leeds.gov.uk/Pages/If-you\'re-worried-about-someone-else.aspx">get help to support someone you know</a>.</p>\
                                    <p>Use our online form to report the noise and we\'ll contact you within 2 days.</p>\
                                    <p>If you need urgent help between 6pm and 3:30am call 0113 376 0337.</p>\
                                    <p><a href="https://my.leeds.gov.uk/Pages/Form Pages/AntisocialBehaviourOrHateCrime.aspx">Report antisocial behaviour</a></p>',
                                }                            
                            ]
                        },
                        {
                            answer: 'Alarm',
                            message: '<h2>Do you think a crime is taking place?</h2>',
                            decisions: [
                                {
                                    answer: 'Yes',
                                    message: '<p>If you think a crime is taking place call 999.</p>',
                                },
                                {
                                    answer: 'No',
                                    message: '<p>Try knocking on your neighbour\'s door to see if they can stop the alarm.</p>\
                                    <p>If there is no answer or they\'re unable to stop the alarm, contact us to report the noise:</p>\
                                    <p>8am to 6pm</p>\
                                    <div class="text-block"><p>0113 222 4402</p></div>\
                                    <p>6pm to 3:30am</p>\
                                    <div class="text-block"><p>0113 376 0337</p></div>\
                                    <p>3:30am to 8am</p>\
                                    <div class="text-block"><p><a href="">Report antisocial behaviour</a></p></div>\
                                    ',
                                }

                            ]
                        },
                        {
                            answer: 'Animal',
                            message: '<p>Some people do not realise their everyday noises are a problem. They\'re probably not doing it on purpose.</p>\
                            <p>The owner might not know that the animal is causing an issue. If it feels safe, try speaking to the owner of the animal and see if you can come to an agreement.</p>\
                            <p>If this does not work, use our form to report the noise. We will aim to contact you within one week.\
                            <p>If you need urgent help between 6pm and 3:30am call 0113 376 0337.</p>\
                            <p><a href="https://my.leeds.gov.uk/Pages/Form Pages/AntisocialBehaviourOrHateCrime.aspx">Report antisocial behaviour</a></p>',
                        },
                    ]
                },
                {
                    answer: 'Business',
                    message: '<h2>What type of business is it?</h2>',
                    decisions: [
                        {
                            answer: 'Farms, Kennels or pet shops',
                            message: '<h2>Is the noise due to construction work at the property?</h2>',
                            decisions: [
                                {
                                    answer: 'Yes',
                                    message: nnrepeatedcontenteight,
                                },
                                {
                                    answer: 'No',
                                    message: '<h2>Is the noise due to an alarm going off at the property?</h2>',
                                    decisions: [
                                        {
                                            answer: 'Yes',
                                            message: '<h2>Do you think a crime is happening?</h2>',
                                            decisions: [
                                                {
                                                    answer: 'Yes',
                                                    message: '<p>If you think a crime is taking place call 999.</p>'
                                                },
                                                {
                                                    answer: 'No',
                                                    message: nnrepeatedcontentten,
                                                }
                                            ]
                                        },
                                        {
                                            answer: 'No',
                                            message: nnrepeatedcontentnine,
                                        }
                                    ]
                                }
                            ]
                        },
                        {
                            answer: 'Shops, factories, warehouses and work yards',
                            message: '<h2>Is the noise due to construction work at the property?</h2>',
                            decisions: [
                                {
                                    answer: 'Yes',
                                    message: nnrepeatedcontenteight,
                                },
                                {
                                    answer: 'No',
                                    message: '<h2>Is the noise due to an alarm going off at the property?</h2>',
                                    decisions: [
                                        {
                                            answer: 'Yes',
                                            message: '<h2>Do you think a crime is happening?</h2>',
                                            decisions: [
                                                {
                                                    answer: 'Yes',
                                                    message: '<p>If you think a crime is taking place call 999.</p>'
                                                },
                                                {
                                                    answer: 'No',
                                                    message: nnrepeatedcontentten,
                                                }
                                            ]
                                        },
                                        {
                                            answer: 'No',
                                            message: nnrepeatedcontentnine,
                                        }
                                    ]
                                }
                            ]
                        },
                        {
                            answer: 'Pub, club or bar',
                            message: '<h2>Is the noise due to construction work at the property?</h2>',
                            decisions: [
                                {
                                    answer: 'Yes',
                                    message: nnrepeatedcontenteight,
                                },
                                {
                                    answer: 'No',
                                    message: '<h2>Is the noise due to an alarm going off at the property?</h2>',
                                    decisions: [
                                        {
                                            answer: 'Yes',
                                            message: '<h2>Do you think a crime is happening?</h2>',
                                            decisions: [
                                                {
                                                    answer: 'Yes',
                                                    message: '<p>If you think a crime is taking place call 999.</p>'
                                                },
                                                {
                                                    answer: 'No',
                                                    message: nnrepeatedcontentten,
                                                }
                                            ]
                                        },
                                        {
                                            answer: 'No',
                                            message: nnrepeatedcontentnine,
                                        }
                                    ]
                                }
                            ]
                        },
                        {
                            answer: 'Other',
                            message: '<h2>Is the noise due to construction work at the property?</h2>',
                            decisions: [
                                {
                                    answer: 'Yes',
                                    message: nnrepeatedcontenteight,
                                },
                                {
                                    answer: 'No',
                                    message: '<h2>Is the noise due to an alarm going off at the property?</h2>',
                                    decisions: [
                                        {
                                            answer: 'Yes',
                                            message: '<h2>Do you think a crime is happening?</h2>',
                                            decisions: [
                                                {
                                                    answer: 'Yes',
                                                    message: '<p>If you think a crime is taking place call 999.</p>'
                                                },
                                                {
                                                    answer: 'No',
                                                    message: nnrepeatedcontentten,
                                                }
                                            ]
                                        },
                                        {
                                            answer: 'No',
                                            message: nnrepeatedcontentnine,
                                        }
                                    ]
                                }
                            ]
                        },
                        {
                            answer: 'Building sites',
                            message: nnrepeatedcontenteight,
                        }
                    ]
                },
                {
                    answer: 'Organised event',
                    message: '<p>Some events are allowed to play loud music at certain times. Depending on the volume we may be able to help.</p>\
                    <p>Use our form to report the noise. We\'ll get back to you to let you know what we are doing about your complaint.</p>\
                    <p>We will get in touch as quickly as we can depending on how serious the noise is. We aim to get back to everyone within one week.</p>\
                    <p>So we can take action and provide you with feedback regarding this noise issue we will need you to share your details with us when you complete the form.</p>\
                    <p>If you need urgent help between 6pm and 3:30am call 0113 376 0337.</p>\
                    <p><a href="https://my.leeds.gov.uk/Pages/Form%20Pages/ReportNoisePollution.aspx">Report commercial noise</a></p>',
                },
                {
                    answer: 'Other',
                    message: '<p>Let us know about the noise by contacting us:</p> \
                    <p>8am to 6pm (Monday to Friday)</p> \
                    <div class="text-block">\
                        <p><a href="https://my.leeds.gov.uk/Pages/Form Pages/AntisocialBehaviourOrHateCrime.aspx">Report antisocial behaviour</a></p> \
                    </div> \
                    <p>6pm to 3:30am (7 days a week)</p> \
                    <div class="text-block"><p>0113 376 0337</p></div>',
                }                
            ]
        }
    ]
};

jQuery(document).ready(function() {
    jQuery('.lcc-council-tax-tree').decisionTree({data: data});
    jQuery('.lcc-noise-nuisance').decisionTree({data: noisedecisiontree});
});