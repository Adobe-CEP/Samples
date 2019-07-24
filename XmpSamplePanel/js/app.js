/*  
 * ADOBE INC.
 * Copyright 2014 Adobe Inc.
 * All Rights Reserved.
 * 
 * NOTICE:  Adobe permits you to use, modify, and distribute this file in accordance with the 
 * terms of the Adobe license agreement accompanying it.  If you have received this file from a 
 * source other than Adobe, then your use, modification, or distribution of it requires the prior 
 * written permission of Adobe.
 * 
 * ---
 * 
 * This file contains the application logic that binds the XMPBridge calls to HTML DOM events.
 * It makes use of the jQuery javascript library that is commonly used in web applications and
 * provides a powerful way to work with the HTML DOM.
 * 
 * The data binding scans the html elements for data-property attributes which indicates that
 * this particular node shall be bound to the referenced xmp property. If the attribute was detected
 * on an input field, the property is also considered writeable. 
 * 
 * sample usage:
 * 	
 * 	<div data-property="title" data-namespace-ref="NS_DC"></div>
 * 	<textarea data-property="description" data-namespace-ref="NS_DC"></textarea>
 * 	<input type="text" data-property="author" data-namespace="http://purl.org/dc/elements/1.1/" />
 * 
 */
$(document).ready(function () {

	/**
	 * Helper function that extracts all mandatory information needed to reference an XMP property 
	 * from a given HTML node and constructs a simple data object based on that.
	 */
	function getFieldInfo(elem, callback) {
		var $elem = $(elem);

		var field = {
			elem: $elem,
			property: $elem.attr('data-property'),
			namespace: $elem.attr('data-namespace'),
			value: $elem.val()
		};

		if ($elem.attr('data-namespace-ref')) {

			// if namespace-ref is present it needs to be resolved to a valid URI via XMPBridge.
			XMPBridge.toNamespaceURI($elem.attr('data-namespace-ref'), function (namespaceURI) {
				field.namespace = namespaceURI;
				callback(field);
			});

		} else {
			callback(field);
		}
	}

	/**
	 * We're registering our data binding code for execution once the XMPBridge is ready to use.
	 * This prevents us to access any property before the ExtendScript library is initialized 
	 * properly.
	 */
	XMPBridge.onInit(function (state) {

		if (!state.isError) {

			$("#main").show();

			// retrieve a descriptive name for the active target item�(e.g. active document, footage, ...)
			XMPBridge.getTargetName(function (targetName) {

				// stored in an arbitrary HTML element with id="target-name"
				$('#target-name').html(targetName);

			});

			// all html nodes having a "data-property" attribute will be considered for data binding.
			var $fields = $("[data-property]");

			$fields.each(function () {
				getFieldInfo(this, function (field) {

					XMPBridge.read(field.namespace, field.property, function (value) {

						// form fields are initialized with the property's current value ...
						if (field.elem.is('input,textarea')) {
							field.elem.val(value);

							// ... for other elements we just replace the node's inner HTML.
						} else {
							field.elem.html(value);
						}

					});

				});
			});

			// if the form is being submitted, we update the metadata and write it back into the application DOM.
			$("form").submit(function () {

				// only process writeable property fields.
				$fields.filter('input,textarea').each(function () {
					getFieldInfo(this, function (field) {
						XMPBridge.write(field.namespace, field.property, field.value);
					});
				});

				// commit the changes so they're reflected by the application DOM.
				XMPBridge.commit();

			});

		} else {

			$("#message .text").html(state.statusMessage).parent().fadeIn();

		}

	});


});
