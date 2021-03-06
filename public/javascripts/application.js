// Place your application-specific JavaScript functions and classes here
// This file is automatically included by javascript_include_tag :defaults

// Function to apply additional styles to the application after it is already loaded.
function applyAdditionalStyles() {
  jQuery( 'input:text, input:password' ).addClass( 'ui-widget-content ui-corner-all' );
}

// Function to handle the errors throw by the AJAX requests.
function ajaxErrorHandler( data ) {
  if ( typeof( data.error ) === 'function' ) {
    data.error( data.jqXHR, data.textStatus, data.errorThrown );
  } else {
    var dialog = jQuery( '#dialog' );
    
    if ( dialog.length < 1 ) {
      dialog = jQuery( '<div id="dialog" style="display:none;"></div>' );
    }
    
    dialog.html( data.errorThrown ).dialog( {
      title : 'Error',
      resizable : false
    } );
  }
  applyAdditionalStyles();
}

// Function to handle the mousedown event on the buttons.
function buttonMouseDownHandler( eventObject ) {
  if ( typeof( eventObject.data.url ) !== 'string' ) {
    var href = this.getAttribute( 'href' );
    
    if ( typeof( href ) === 'string' ) {
      eventObject.data.url = href;
    } else {
      //throw 'Please declare a valid URL or add an "href" attribute to the object.';
    }
  }
  
  if ( typeof( eventObject.data.callback ) === 'function' ) {
    eventObject.data.callback( eventObject );
  } else if ( eventObject.data.hasMenuItems ) {
    menuButtonMouseDownHandler( eventObject );
  } else if ( typeof( eventObject.data.url ) === 'string' ) {
    var data = jQuery.extend( true, { }, eventObject.data.data );
    
    if ( eventObject.data.isAJAX === true ) {
      data.isAJAX = true;
    } else if ( eventObject.data.isADialog === true ) {
      data.isADialog = true;
    }
    
    for ( key in eventObject.data.attributes ) {
      data[ key ] = this.getAttribute( eventObject.data.attributes[ key ] );
    }
    
    if ( eventObject.data.isAJAX || eventObject.data.isADialog ) {
      jQuery.ajax( {
        url : eventObject.data.url,
        data : data,
        type : eventObject.data.type,
        success : function( data, textStatus, jqXHR ) {
          if ( typeof( eventObject.data.success ) === 'function' ) {
            eventObject.data.success( data, textStatus, jqXHR );
          } else {
            if ( textStatus === 'success' ) {
              if ( eventObject.data.isAJAX ) {
                var selector = ( typeof( eventObject.data.selector ) === 'string' ) ? eventObject.data.selector : '#content';
                
                jQuery( selector ).html( data );
              } else { // eventObject.data.isADialog
                var dialog = jQuery( '#dialog' );
                
                if ( dialog.length < 1 ) {
                  dialog = jQuery( '<div id="dialog" style="display:none;"></div>' );
                }
                
                dialog.html( data ).dialog( eventObject.data.options );
              }
            }
          }
	  applyAdditionalStyles();
        },
        error : function( jqXHR, textStatus, errorThrown ) {
          var data = jQuery.extend( true, { }, eventObject.data, {
            jqXHR : jqXHR,
            textStatus : textStatus,
            errorThrown : errorThrown.toString()
          } );
          
          ajaxErrorHandler( data );
        }
      } );
    } else { // eventObject.data.actAsLink
      var params = '';
      
      if ( !jQuery.isEmptyObject( data ) ) {
        var rquery = /\?/;
        params = ( rquery.test( eventObject.data.url ) ? '&' : '?' ) + jQuery.param( data, jQuery.ajaxSettings.traditional );
      }
      
      if ( params.search( /_method=delete/i ) >= 0 ) {
        jQuery( '<form method="post" action="' + eventObject.data.url + params + '"><input name="_method" value="delete" /><input name="authenticity_token" value="' + authenticityToken + '" /></form>' ).trigger( 'submit' );
      } else {
        window.location.href = eventObject.data.url + params;
      }
    }
  }
}

// Function to hide all the visible menu items.
function hideMenuItems() {
  jQuery( '#menu_items > ul:visible' ).menu( 'option' ).hide();
}

// Function to handle the mousedown event on the menu buttons.
function menuButtonMouseDownHandler( eventObject ) {
  if ( eventObject.data.hasMenuItems ) {
    var menuItems = jQuery( '#menu_items_for_menu' + eventObject.data.id );
    
    if ( menuItems.length > 0 ) {
      if ( menuItems.is( ':visible' ) ) {
        
      } else {
        eventObject.stopPropagation();
        menuItems.show();
      }
    } else {
      jQuery.ajax( {
        url : eventObject.data.url,
        dataType : 'script',
        success : function( data, textStatus, jqXHR ) {
          
        },
        error : function( jqXHR, textStatus, errorThrown ) {
          var data = jQuery.extend( true, { }, eventObject.data, {
            jqXHR : jqXHR,
            textStatus : textStatus,
            errorThrown : errorThrown.toString()
          } );
          
          ajaxErrorHandler( data );
        }
      } );
    }
  } else {
    buttonMouseDownHandler( eventObject );
  }
}