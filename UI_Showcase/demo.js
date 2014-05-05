$(function() {
    var widgetNames = ["slider", "progressbar", "menubar", "button", "dialog", "checkbox",
                       "accordion", "tree", "carousel", "tabs", "tooltip", "autocomplete", "datepicker"];
    var loadedWidgets = {};
    var coreWidgets = ["slider", "button", "checkbox", "tooltip", "tabs", "datepicker", "autocomplete", "accordion", "menubar"];

    // update last modifed information
    var months= ["January","February","March","April","May","June","July","August","September","October","November","December"];
    var lastMod = new Date(document.lastModified);
    $("#timeStamp").html(lastMod.getDate() + " " + months[lastMod.getMonth()] + " " + lastMod.getFullYear());
    $(document.body).append($("<span id='statusUpdater' aria-live='polite' class='ui-helper-hidden-accessible'></span>"));

    // Allow tab to be selected through deep linking
    var selectedTabId = 0
    var query = document.location.search;
    var fragmentId = document.location.hash;
    if (query) {
        var match = query.match(/(\\?|&)tabId=([^&]+)(\\&|$)/i);
        if (match && match[2]) {
            if (!isNaN(match[2]))
                selectedTabId = match[2];
            else
                selectedTabId = jQuery.inArray(match[2], widgetNames);
            if (selectedTabId == -1)
                selectedTabId = 0;
        }
    }
    else if (fragmentId) {
        var match = fragmentId.match(/^#goto_(.+)$/i);
        if (match && match[1]) {
            if (!isNaN(match[1]))
                selectedTabId = match[1];
            else
                selectedTabId = jQuery.inArray(match[1], widgetNames);
            if (selectedTabId == -1)
                selectedTabId = 0;
        }

    }

    //experimental: GLobal focusin handler that assigns focus classnames

    $(document).focusin(function(event){
    	$(event.target).addClass("ui-global-focus");
    })
    .focusout(function(event){
    	$(event.target).removeClass("ui-global-focus");
    });

    //Load main tabs
    $("#demoTabs").tabs({labelledBy: "tabsLbl", selected : selectedTabId});

    //show event doesn't fire for selected tab on creation, so manually trigger the handler
    createTabPanelContents($("#demoTabs > .ui-tabs-panel").eq(selectedTabId));

    setTimeout(function() {
        //createSliders($("#slider"));
    }, 500);


    $('#demoTabs').bind('tabsactivate', function(event, ui) {
        createTabPanelContents($(ui.newPanel));
        if ($(ui.oldPanel).attr("id") == "tooltip")
            $(".toggleTooltips :ui-tooltip").tooltip("close");
    });

    $('#demoTabs > .ui-tabs-panel').each(function() {

        if (jQuery.inArray(this.id, coreWidgets) == -1)
            return;
        var widgetControls = $(this).find(".widgetControls").andSelf().last();
        widgetControls
            .prepend($("<button class='enabled'>Disable "+ this.id+"</button>").button().click(
                function(){
                    var btn = $(this);
                    if (btn.hasClass("enabled")) {
                        toggleEnabledInPanel(btn.closest(".ui-tabs-panel"), false);
                        $("#statusUpdater").text(btn.text().replace(/disable/i, "") +  " disabled");
                        btn.toggleClass("enabled").button("option", "label", btn.text().replace(/Disable/i, "Enable"));
                    }
                    else {
                        toggleEnabledInPanel(btn.closest(".ui-tabs-panel"), true);
                        $("#statusUpdater").text(btn.text().replace(/enable/i, "") +  " enabled");
                        btn.toggleClass("enabled").button("option", "label", btn.text().replace(/Enable/i, "Disable"));
                    }

                }))
        .prepend($("<button class='created'>Destroy "+ this.id+"</button>").button().click(
            function(){
                var btn = $(this);
                if (btn.hasClass("created")) {
                    destroyInPanel(btn.closest(".ui-tabs-panel"));
                    $("#statusUpdater").text(btn.text().replace(/destroy/i, "") +  " destroyed");
                    btn.toggleClass("created").button("option", "label", btn.text().replace(/Destroy/i, "Create"));
                }
                else {
                    createTabPanelContents(btn.closest(".ui-tabs-panel"), true);
                    $("#statusUpdater").text(btn.text().replace(/create/i, "") +  " created");
                    btn.toggleClass("created").button("option", "label", btn.text().replace(/Create/i, "Destroy"));

                }
            }));
    });

    function createTabPanelContents(panel, skipLoadedCheck) {
        if (!panel || panel.length == 0)
            return;
        var widgetId = $(panel).attr("id");
        document.location.hash = "#goto_" + widgetId;
        if (!widgetId || (loadedWidgets[widgetId] & !skipLoadedCheck) || $.inArray(widgetId, widgetNames) == -1)
            return;

        switch(widgetId) {
        	case "accordion":
        		autoCreateInPanel(panel);
        		var chk = $("<input id='toggleCollapsible' class='destroyMe' type='checkbox'/>");
        		chk.click(function(e){
        			console.log(event.target);
        			$("#sampleAccordion").accordion("option","collapsible", event.target.checked);
        		});
        		chk.appendTo(panel.find(".widgetControls:eq(0)")).after("<label class='destroyMe' for='toggleCollapsible'>Allow all accordion sections to be collapsed at the same time</label>");
        	break;
        	case "slider":
                createSliders(panel);
                break;
            case "progressbar":
                createProgressBars(panel);
                break;
            case "button":
                $("#repeat").addClass("hiddenFieldset")
                createButtons(panel);
                break;
            case "menubar":
                $("#sampleMenubar").menubar({
                	menuIcon : true,
                	select : function(event, ui){
                	$("#menubarStatusUpdater").text("'" + ui.item.text() + "' menubar item selected");
                	}});
                //VERY experimental: Moving focus back when accessing menu by shortcut
                /*
                $(document).bind("keyup", function(event){
                 if (event.keyCode == 77 & event.shiftKey && event.altKey) {
                     if (event.target.nodeType != 1 || !$(event.target).is(":focusable"))
                         $("#sampleMenubar").data("returnFocusTo", null)
                     else
                         $("#sampleMenubar").data("returnFocusTo", event.target)
                    var tabId = $.inArray("menubar", widgetNames);
                    if (tabId != -1) {
                        $("#demoTabs").tabs("select", tabId);
                        $("#sampleMenubar").find("a[tabindex=0]").get(0).focus();
                    }
                 }
                })*/
                $("#sampleMenubar").after($("<p aria-live='polite' id='menubarStatusUpdater'>&nbsp;</p>"));
                break;
            case "dialog":
                createDialog(panel);
                break;
            case "tree":
                $('#sampleTree').jstree({plugins : ["themes", "html_data", "ui", "hotkeys"]});

                break;
            case "carousel":
                $('#mycarousel1').jcarousel({
                    animation: 500,
                    itemSelectedCallback : itemSelectedCallback
                });
                break;
            case "tooltip":
                autoCreateInPanel(panel);
                $("<input type='checkbox' id='tooltipToggler'/>").appendTo("#tooltipButtonAnchor")
                	.after("<label for='tooltipToggler'>Toggle tooltips for static elements</label>");

                $("#tooltipToggler").click(function() {
                    if ($(this).is(":checked")) {
                		$(".toggleTooltips :ui-tooltip").tooltip("open");
                	}
	                else {
	                	$(".toggleTooltips :ui-tooltip").tooltip("close");
	                }
                });
                break;
            case "tabs":
                $("#sampleTabs").tabs({labelledBy: "tabsDemoLbl"});
                break;
            case "autocomplete":
                createAutoComplete(panel);
                break;
            case "datepicker":
    			$( "#datepicker1" ).datepicker( {
    				select: function( event, ui ) {
    					$( "#datepicker1" ).val( ui.date ).focus( 1 );
    				}
    			});

    			$( "#datepicker2" ).datepicker( {
    					select: function( event, ui ) {
    						$( "#dp2-output" ).text( "selected date: " + ui.date );
    				}
    			});
            	break;

            default: //No special logic required, simply call component's method on demo objects in tab poanel
                autoCreateInPanel(panel);
        }
        loadedWidgets[widgetId] = true;
    }

    function autoCreateInPanel(panel) {
        var widgetId = panel.attr("id");
        var elements = panel.find(".demoWidget");
        if (typeof elements[widgetId] == "function")
            elements[widgetId]();
    }

    function destroyInPanel(panel) {
        if (!panel || panel.length === 0)
            return;
        var widgetId = panel.attr("id");
        if (!widgetId || $.inArray(widgetId, coreWidgets) == -1)
            return;

        switch (widgetId) {
        	case "accordion":
        		autoDestroyInPanel(panel);
        		panel.find(".destroyMe").remove();
        	break;
            case "slider":
                autoDestroyInPanel(panel);
                destroySliders(panel);
                break;
            case "menubar":
                autoDestroyInPanel(panel);
                $("#menubarStatusUpdater").remove();
                break;
            case "button":
            	$("#toolbar").find(":ui-button").unbind("click");
            	autoDestroyInPanel(panel);
            	$("#buttonStatusUpdater").remove();
                $("#repeat").buttonset("destroy");
                $("#repeat").removeClass("hiddenFieldset");
                $("#toolbar").removeClass("ui-widget-header").removeClass("ui-corner-all");
                break;
            case "autocomplete":
                autoDestroyInPanel(panel);
                $( "#tags-2" ).unbind();
                break;
            case "tooltip":
                $("#tooltipToggler").remove();
                autoDestroyInPanel(panel);
                break;
            default:
                autoDestroyInPanel(panel);
                break;
        }
    }

    function autoDestroyInPanel(panel) {
        var widgetId = panel.attr("id");
        var elements = panel.find(".demoWidget");
        if (typeof elements[widgetId] == "function")
            elements[widgetId]("destroy");
    }

    function toggleEnabledInPanel(panel, enable) {
        var widgetId = panel.attr("id");

        switch (widgetId) {
            case "button":
                autoToggleEnabled(panel, enable);
                $("#repeat :radio").button(enable ? "enable" : "disable");
                break;
            case "tabs":
                $("#sampleTabs").tabs(enable ? "enable" : "disable", 1);
                break;
            case "autocomplete":
                if (enable)
                    $(":ui-autocomplete").removeAttr("disabled");
                else
                    $(":ui-autocomplete").attr("disabled", "disabled");

                break;
            default:
                autoToggleEnabled(panel, enable);
                break;
        }
    }

    function autoToggleEnabled(panel, enable) {
        var elements = panel.find(".demoWidget");
        var widgetId = panel.attr("id");
        if (typeof elements[widgetId] == "function")
            elements[widgetId](enable ? "enable" : "disable");
    }

    //SLIDER

    function createSliders(panel)  {
        //single slider
          $(panel).find(".fallback").hide();

          $("#singleSlider1").slider({unittext : "MB",
              label : "price",
              unittext: "$",
              slide: function(event, ui) {
              updateSliderLabels(ui, ["#slider1Val"]);
                  },
              change : function(event, ui) {
                      updateSliderLabels(ui, ["#slider1Val"]);
                  }
          });

          setTimeout( function() {
              $(panel).find(".sliderValue").show();
              updateSliderLabels({value : $("#singleSlider1").slider("value"), handle : $("#singleSlider1").find(".ui-slider-handle").eq(0)}, ["#slider1Val"]);
              updateSliderLabels({value : $("#singleSlider1").slider("value"), handle : $("#singleSlider1").find(".ui-slider-handle").eq(0)}, ["#slider1Val"]);
          }, 100);

          // range slider
          var rangeSlider = $("#rangeSlider1")
          .slider({
              range: true,
              min: 0,
              max: 500,
              values: [75, 300],
              unittext: "$",
              label: "price range",
              slide: function(event, ui) {
              updateSliderLabels(ui, ["#slider2ValMin", "#slider2ValMax"]);
              },
              change : function(event, ui) {
                  updateSliderLabels(ui, ["#slider2ValMin", "#slider2ValMax"]);
              }
          });
          setTimeout(function() {
              var sliderValues = rangeSlider.slider("values");
              updateSliderLabels({value : sliderValues[0], values : sliderValues, handle : rangeSlider.find(".ui-slider-handle").eq(0)}, ["#slider2ValMin", "#slider2ValMax"]);
              updateSliderLabels({value : sliderValues[1], values : sliderValues, handle : rangeSlider.find(".ui-slider-handle").eq(1)}, ["#slider2ValMin", "#slider2ValMax"]);
              // need to do this twice for some reason, va;ue is not properly positioned otherwise
              updateSliderLabels({value : sliderValues[0], values : sliderValues, handle : rangeSlider.find(".ui-slider-handle").eq(0)}, ["#slider2ValMin", "#slider2ValMax"]);
              updateSliderLabels({value : sliderValues[1], values : sliderValues, handle : rangeSlider.find(".ui-slider-handle").eq(1)}, ["#slider2ValMin", "#slider2ValMax"]);
          }, 100);
    }

    function updateSliderLabels(ui, valueLabels) {
        if (!ui.values)
            ui.values = [ui.value];
        // need to be able to determine which of the handles actually changes
        var index = $.inArray(ui.value, ui.values);
        var myAlign = index == 0 ? "right" : "left";
        var atAlign = index == 0 ? "left" : "right";
            $(valueLabels[index])
                .position({
                    my: myAlign + " bottom",
                    at : atAlign + " top",
                    of: ui.handle
                    })
                .text("$" + ui.value);
            return;
   }

    function destroySliders(panel)  {
        panel.find(".fallback").show();
        panel.find("demoWidget").slider("destroy");
        panel.find(".sliderValue").hide();
    }

    //POGRESSBAR

    function createProgressBars(panel) {
        $(panel).find('#progressTrigger').button()
            .click(function() {
                $("#progressMsg").remove();
                var progressBar = $("#sampleProgressBar")
                .progressbar({
                     value: 0,
                     labelledBy: "progressMsg"
                 });
                var progressDialog = $("#progressDialog")
                .append("<p id='progressMsg' aria-live='true'>Your file is being downloaded...</p>")
                .dialog({autoOpen : true,
                    modal : true,
                    title :  "progress",
                    resizable : false,
                    draggable : false,
                    dialogClass : "noCloseBtn",
                    width : 500,
                    beforeClose : function() {
                    if ($("#sampleProgressBar").progressbar('value') != 100)
                        return false;}
                })

                var progressUpdater;

                setTimeout(function() {
                    $("#sampleProgressBar").progressbar('value', 0);
                    progressUpdater = setInterval(function() {
                        if ($("#sampleProgressBar").progressbar('value') == 100) {
                            clearInterval(progressUpdater);
                            $("#progressDialog").dialog("close");
                            $('#progressTrigger').focus();
                        }
                        $("#sampleProgressBar").progressbar('value', $("#sampleProgressBar").progressbar('value') + 2);
                        }, 250);
                }, 100);
            });
    }

    // BUTTON
    function createButtons(panel) {
        $('#beginning').button({
            text: false,
            icons: {
                primary: 'ui-icon-seek-start'
            }
        });
        $('#rewind').button({
            text: false,
            icons: {
                primary: 'ui-icon-seek-prev'
            }
        });
        $('#play').button({
            text: false,
            icons: {
                primary: 'ui-icon-play'
            }
        })
        $('#stop').button({
            text: false,
            icons: {
                primary: 'ui-icon-stop'
            }
        })
        .click(function() {
            $('#play').button('option', {
                label: 'play',
                icons: {
                    primary: 'ui-icon-play'
                }
            });
        });
        $('#forward').button({
            text: false,
            icons: {
                primary: 'ui-icon-seek-next'
            }
        });
        $('#end').button({
            text: false,
            icons: {
                primary: 'ui-icon-seek-end'
            }
        });
        $("#shuffle").button();
        $("#repeat").buttonset();
        $("#toolbar").after($("<p aria-live='polite' id='buttonStatusUpdater'>&nbsp;</p>"));
        $("#toolbar").find(":ui-button").click(function(e) {
        	var msg = "'" + $(this).button("option", "label") + "' was activated";
        	$("#buttonStatusUpdater").text(msg)

        	if (this.id == "play") {
                var options;
                if ($(this).text() == 'play') {
                    options = {
                        label: 'pause',
                        icons: {
                            primary: 'ui-icon-pause'
                        }
                    };
                } else {
                    options = {
                        label: 'play',
                        icons: {
                            primary: 'ui-icon-play'
                        }
                    };
                }
                $(this).button('option', options);
        	}
        });
    }

    // DIALOG;

    function createDialog(panel) {
        $("#sampleDialog").dialog({
            draggable : true,
            resizable : true,
            minHeight: 350,
            minWidth: 270,
            close : function(e){
                $('#dialogTrigger').focus()
                }
            ,autoOpen : false,
            describedBy : "dialogDescription",
            modal : true,
            buttons: { "Ok": function() { $(this).dialog("close"); }}});
        $('#dialogTrigger').button()
        .click(function() {
            $("#sampleDialog").dialog("open")
                .find(":input").eq(0).focus();
                return false;
            });
    }

    // HELPER FUNCTIONS

    // carousel

    function itemSelectedCallback(carousel, item, index) {
        item = $(item);
        var src = item.find("img").attr("src");
        var alt = item.find("img").attr("alt");
        if (src) {
            $("#viewerImg").attr("src", src);
        }
        if (alt) {
            $("#viewerImg").attr("alt", alt);
        }
    }




    // AUTOCOMPLETE

      function split( val ) {
          return val.split( /,\s*/ );
      }

      function extractLast( term ) {
          return split( term ).pop();
      }

      function createAutoComplete(panel) {
          var availableTags = [
			"Afghanistan",
			"Albania",
			"Algeria",
			"American Samoa",
			"Andorra",
			"Angola",
			"Anguilla",
			"Antigua &amp; Barbuda",
			"Argentina",
			"Armenia",
			"Aruba",
			"Australia",
			"Austria",
			"Azerbaijan",
			"Bahamas",
			"Bahrain",
			"Bangladesh",
			"Barbados",
			"Belarus",
			"Belgium",
			"Belize",
			"Benin",
			"Bermuda",
			"Bhutan",
			"Bolivia",
			"Bonaire",
			"Bosnia &amp; Herzegovina",
			"Botswana",
			"Brazil",
			"British Indian Ocean Ter",
			"Brunei",
			"Bulgaria",
			"Burkina Faso",
			"Burundi",
			"Cambodia",
			"Cameroon",
			"Canada",
			"Canary Islands",
			"Cape Verde",
			"Cayman Islands",
			"Central African Republic",
			"Chad",
			"Channel Islands",
			"Chile",
			"China",
			"Christmas Island",
			"Cocos Island",
			"Colombia",
			"Comoros",
			"Congo",
			"Cook Islands",
			"Costa Rica",
			"Cote D'Ivoire",
			"Croatia",
			"Cuba",
			"Curacao",
			"Cyprus",
			"Czech Republic",
			"Denmark",
			"Djibouti",
			"Dominica",
			"Dominican Republic",
			"East Timor",
			"Ecuador",
			"Egypt",
			"El Salvador",
			"Equatorial Guinea",
			"Eritrea",
			"Estonia",
			"Ethiopia",
			"Falkland Islands",
			"Faroe Islands",
			"Fiji",
			"Finland",
			"France",
			"French Guiana",
			"French Polynesia",
			"French Southern Ter",
			"Gabon",
			"Gambia",
			"Georgia",
			"Germany",
			"Ghana",
			"Gibraltar",
			"Great Britain",
			"Greece",
			"Greenland",
			"Grenada",
			"Guadeloupe",
			"Guam",
			"Guatemala",
			"Guinea",
			"Guyana",
			"Haiti",
			"Hawaii",
			"Honduras",
			"Hong Kong",
			"Hungary",
			"Iceland",
			"India",
			"Indonesia",
			"Iran",
			"Iraq",
			"Ireland",
			"Isle of Man",
			"Israel",
			"Italy",
			"Jamaica",
			"Japan",
			"Jordan",
			"Kazakhstan",
			"Kenya",
			"Kiribati",
			"Korea North",
			"Korea South",
			"Kuwait",
			"Kyrgyzstan",
			"Laos",
			"Latvia",
			"Lebanon",
			"Lesotho",
			"Liberia",
			"Libya",
			"Liechtenstein",
			"Lithuania",
			"Luxembourg",
			"Macau",
			"Macedonia",
			"Madagascar",
			"Malaysia",
			"Malawi",
			"Maldives",
			"Mali",
			"Malta",
			"Marshall Islands",
			"Martinique",
			"Mauritania",
			"Mauritius",
			"Mayotte",
			"Mexico",
			"Midway Islands",
			"Moldova",
			"Monaco",
			"Mongolia",
			"Montserrat",
			"Morocco",
			"Mozambique",
			"Myanmar",
			"Nambia",
			"Nauru",
			"Nepal",
			"Netherland Antilles",
			"Netherlands (Holland, Europe)",
			"Nevis",
			"New Caledonia",
			"New Zealand",
			"Nicaragua",
			"Niger",
			"Nigeria",
			"Niue",
			"Norfolk Island",
			"Norway",
			"Oman",
			"Pakistan",
			"Palau Island",
			"Palestine",
			"Panama",
			"Papua New Guinea",
			"Paraguay",
			"Peru",
			"Philippines",
			"Pitcairn Island",
			"Poland",
			"Portugal",
			"Puerto Rico",
			"Qatar",
			"Republic of Montenegro",
			"Republic of Serbia",
			"Reunion",
			"Romania",
			"Russia",
			"Rwanda",
			"St Barthelemy",
			"St Eustatius",
			"St Helena",
			"St Kitts-Nevis",
			"St Lucia",
			"St Maarten",
			"St Pierre &amp; Miquelon",
			"St Vincent &amp; Grenadines",
			"Saipan",
			"Samoa",
			"Samoa American",
			"San Marino",
			"Sao Tome &amp; Principe",
			"Saudi Arabia",
			"Senegal",
			"Seychelles",
			"Sierra Leone",
			"Singapore",
			"Slovakia",
			"Slovenia",
			"Solomon Islands",
			"Somalia",
			"South Africa",
			"Spain",
			"Sri Lanka",
			"Sudan",
			"Suriname",
			"Swaziland",
			"Sweden",
			"Switzerland",
			"Syria",
			"Tahiti",
			"Taiwan",
			"Tajikistan",
			"Tanzania",
			"Thailand",
			"Togo",
			"Tokelau",
			"Tonga",
			"Trinidad &amp; Tobago",
			"Tunisia",
			"Turkey",
			"Turkmenistan",
			"Turks &amp; Caicos Is",
			"Tuvalu",
			"Uganda",
			"Ukraine",
			"United Arab Emirates",
			"United Kingdom",
			"United States of America",
			"Uruguay",
			"Uzbekistan",
			"Vanuatu",
			"Vatican City State",
			"Venezuela",
			"Vietnam",
			"Virgin Islands (Brit)",
			"Virgin Islands (USA)",
			"Wake Island",
			"Wallis &amp; Futana Is",
			"Xenos Country",
			"X-World",
			"Yemen",
			"Zaire",
			"Zambia",
			"Zimbabwe"

           ];
           $( "#tags-1" ).autocomplete({
               source: availableTags
           });

           return;
           $( "#tags-2" )
          // don't navigate away from the field on tab when selecting an item
          .bind( "keydown", function( event ) {
              if ( event.keyCode === $.ui.keyCode.TAB &&
                      $( this ).data( "autocomplete" ).menu.active ) {
                  event.preventDefault();
              }
          })
          .autocomplete({
              minLength: 0,
              source: function( request, response ) {
                  // delegate back to autocomplete, but extract the last term
                  response( $.ui.autocomplete.filter(
                      availableTags, extractLast( request.term ) ) );
              },
              focus: function() {
                  // prevent value inserted on focus
                  return false;
              },
              select: function( event, ui ) {
                  var terms = split( this.value );
                  // remove the current input
                  terms.pop();
                  // add the selected item
                  terms.push( ui.item.value );
                  // add placeholder to get the comma-and-space at the end
                  terms.push( "" );
                  this.value = terms.join( ", " );
                  return false;
              }
          });
      }
});


