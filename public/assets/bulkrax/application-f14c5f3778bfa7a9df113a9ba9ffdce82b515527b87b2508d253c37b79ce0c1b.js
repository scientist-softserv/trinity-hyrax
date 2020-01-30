$( document ).on('turbolinks:load ready', function() {
  $( "button" ).click(function() {
    $( "#error_trace" ).toggle();
  });
})
;
// Place all the behaviors and hooks related to the matching controller here.
// All this logic will automatically be available in application.js.
;
// Place all the behaviors and hooks related to the matching controller here.
// All this logic will automatically be available in application.js.

function prepBulkrax(event) {
  var refresh_button = $('.refresh-set-source')
  var base_url = $('#importer_parser_fields_base_url')
  var initial_base_url = base_url.val()
  var file_path_value = $('#importer_parser_fields_import_file_path').val()
  handleFileToggle(file_path_value)

  // handle refreshing/loading of external sets via button click
  $('body').on('click', '.refresh-set-source', function(e) {
    e.preventDefault()

    external_set_select = $("#importer_parser_fields_set")
    handleSourceLoad(refresh_button, base_url, external_set_select)
  })

  // handle refreshing/loading of external sets via blur event for the base_url field
  $('body').on('blur', '#importer_parser_fields_base_url', function(e) {
    e.preventDefault()

    // retrieve the latest base_url
    base_url = $('#importer_parser_fields_base_url')

    // ensure we don't make another query if the value is the same -- this can be forced by clicking the refresh button
    if (initial_base_url != base_url.val()) {
      external_set_select = $("#importer_parser_fields_set")
      handleSourceLoad(refresh_button, base_url, external_set_select)
      initial_base_url = base_url.val()
    }
  })

  // hide and show correct parser fields depending on klass setting
  $('body').on('change', '#importer_parser_klass', function(e) {
    handleParserKlass()
  })
  handleParserKlass()

  // observer for cloud files being added
  var form = document.getElementById('new_importer');
  if (form == null) {
    var form = document.getElementsByClassName('edit_importer')[0];
  }
  // only setup the observer on the new and edit importer pages
  if (form != null) {
    var config = { childList: true, attributes: true };
    var callback = function(mutationsList) {
      for(var mutation of mutationsList) {
        if (mutation.type == 'childList') {
          browseButton = document.getElementById('browse');
          var exp = /selected_files\[[0-9*]\]\[url\]/
          for (var node of mutation.addedNodes) {
            if (node.attributes != undefined) {
              var name = node.attributes.name.value
              if (exp.test(name)) {
                browseButton.innerHTML = 'Cloud Files Added';
                browseButton.style.backgroundColor = 'green';
                browseButton.after(document.createElement("br"), node.value.toString())
              }
            }
          }
        }
      }
    };
    var observer = new MutationObserver (callback);
    observer.observe (form, config);
  }
}

function handleFileToggle(file_path) {
  if (file_path === undefined || file_path.length === 0) {
    $('#file_path').hide()
    $('#file_upload').hide()
    $('#cloud').hide()
    $('#file_path input').attr('required', null)
    $('#file_upload input').attr('required', null)
  } else {
    $('#file_path').show()
    $('#file_upload').hide()
    $('#cloud').hide()
    $('#file_path input').attr('required', 'required')
    $('#file_upload input').attr('required', null)
  }

  $('#importer_parser_fields_file_style_upload_a_file').click(function(e){
    $('#file_path').hide()
    $('#file_upload').show()
    $('#cloud').hide()
    $('#file_path input').attr('required', null)
    $('#file_upload input').attr('required', 'required')
  })
  $('#importer_parser_fields_file_style_specify_a_path_on_the_server').click(function(e){
    $('#file_path').show()
    $('#file_upload').hide()
    $('#cloud').hide()
    $('#file_path input').attr('required', 'required')
    $('#file_upload input').attr('required', null)
  })
  $('#importer_parser_fields_file_style_add_cloud_file').click(function(e){
    $('#file_path').hide()
    $('#file_upload').hide()
    $('#cloud').show()
    $('#file_path input').attr('required', null)
    $('#file_upload input').attr('required', null)
  })
}

function handleParserKlass(){
  var parser_klass = $("#importer_parser_klass option:selected")

  
  if($('.foxml_fields').length > 0) {
    window.foxml_fields = $('.foxml_fields').detach()
  }
  

  if(parser_klass.length > 0 && parser_klass.data('partial') && parser_klass.data('partial').length > 0 ) {
    $('.parser_fields').append(window[parser_klass.data('partial')])
  }
  var file_path_value = $('#importer_parser_fields_import_file_path').val()
  handleFileToggle(file_path_value)
}

function handleSourceLoad(refresh_button, base_url, external_set_select) {
  if (base_url.val() == "") { // ignore empty base_url value
    return
  }

  var initial_button_text = refresh_button.html()

  refresh_button.html('Refreshing...')
  refresh_button.attr('disabled', true)

  $.post('/importers/external_sets', {
    base_url: base_url.val(),
  }, function(res) {
    if (!res.error) {
      genExternalSetOptions(external_set_select, res.sets) // sets is [[name, spec]...]
    } else {
      setError(external_set_select, res.error)
    }

    refresh_button.html(initial_button_text)
    refresh_button.attr('disabled', false)
  })
}

function genExternalSetOptions(selector, sets) {
  out = '<option value="">- Select One -</option>'

  out += sets.map(function(set) {
    return '<option value="'+set[1]+'">'+set[0]+'</option>'
  })

  selector.html(out)
  selector.attr('disabled', false)
}

function setError(selector, error) {
  selector.html('<option value="none">Error - Please enter Base URL and try again</option>')
  selector.attr('disabled', true)
}

$(document).on({'turbolinks:load': prepBulkrax, 'ready': prepBulkrax})
;
// This is a manifest file that'll be compiled into application.js, which will include all the files
// listed below.
//
// Any JavaScript/Coffee file within this directory, lib/assets/javascripts, vendor/assets/javascripts,
// or any plugin's vendor/assets/javascripts directory can be referenced here using a relative path.
//
// It's not advisable to add code directly here, but if you do, it'll appear at the bottom of the
// compiled file. JavaScript code in this file should be added after the last require_* statement.
//
// Read Sprockets README (https://github.com/rails/sprockets#sprockets-directives) for details
// about supported directives.
//


;
