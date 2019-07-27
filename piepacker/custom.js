// leave at least 2 line with only a star on it below, or doc generation fails
/**
 *
 *
 * Placeholder for custom user javascript
 * mainly to be overridden in profile/static/custom/custom.js
 * This will always be an empty file in IPython
 *
 * User could add any javascript in the `profile/static/custom/custom.js` file.
 * It will be executed by the ipython notebook at load time.
 *
 * Same thing with `profile/static/custom/custom.css` to inject custom css into the notebook.
 *
 *
 * The object available at load time depend on the version of IPython in use.
 * there is no guaranties of API stability.
 *
 * The example below explain the principle, and might not be valid.
 *
 * Instances are created after the loading of this file and might need to be accessed using events:
 *     define([
 *        'base/js/namespace',
 *        'base/js/events'
 *     ], function(IPython, events) {
 *         events.on("app_initialized.NotebookApp", function () {
 *             IPython.keyboard_manager....
 *         });
 *     });
 *
 * __Example 1:__
 *
 * Create a custom button in toolbar that execute `%qtconsole` in kernel
 * and hence open a qtconsole attached to the same kernel as the current notebook
 *
 *    define([
 *        'base/js/namespace',
 *        'base/js/events'
 *    ], function(IPython, events) {
 *        events.on('app_initialized.NotebookApp', function(){
 *            IPython.toolbar.add_buttons_group([
 *                {
 *                    'label'   : 'run qtconsole',
 *                    'icon'    : 'icon-terminal', // select your icon from http://fortawesome.github.io/Font-Awesome/icons
 *                    'callback': function () {
 *                        IPython.notebook.kernel.execute('%qtconsole')
 *                    }
 *                }
 *                // add more button here if needed.
 *                ]);
 *        });
 *    });
 *
 * __Example 2:__
 *
 * At the completion of the dashboard loading, load an unofficial javascript extension
 * that is installed in profile/static/custom/
 *
 *    define([
 *        'base/js/events'
 *    ], function(events) {
 *        events.on('app_initialized.DashboardApp', function(){
 *            require(['custom/unofficial_extension.js'])
 *        });
 *    });
 *
 * __Example 3:__
 *
 *  Use `jQuery.getScript(url [, success(script, textStatus, jqXHR)] );`
 *  to load custom script into the notebook.
 *
 *    // to load the metadata ui extension example.
 *    $.getScript('/static/notebook/js/celltoolbarpresets/example.js');
 *    // or
 *    // to load the metadata ui extension to control slideshow mode / reveal js for nbconvert
 *    $.getScript('/static/notebook/js/celltoolbarpresets/slideshow.js');
 *
 *
 * @module IPython
 * @namespace IPython
 * @class customjs
 * @static
 */

 /**
  Kernel message format:
  "{
  "header": {
    "date": "2019-07-27T15:52:38.066373",
    "username": "username",
    "msg_type": "stream",
    "session": "b5028f92-355a-4927-aeaa-65f4ffb7696b",
    "msg_id": "9e39d8bc-b3d2-474f-85a3-9e719f4f21ce",
    "version": "5.0"
  },
  "metadata": {},
  "msg_type": "stream",
  "channel": "iopub",
  "content": {
    "text": "hello 3\n",
    "name": "stdout"
  },
  "buffers": [],
  "msg_id": "9e39d8bc-b3d2-474f-85a3-9e719f4f21ce",
  "parent_header": {
    "date": "2019-07-27T15:52:38.051303",
    "username": "username",
    "msg_type": "execute_request",
    "session": "E2111629A58647AE82FEE1DD3EB08A37",
    "msg_id": "F2694ED9FDDA4652A5DB7A449F293A95",
    "version": "5.0"
  }
}"
  */

MathJax.Hub.Config({
        "HTML-CSS": {
            /*preferredFont: "TeX",*/
            /*availableFonts: ["TeX", "STIX"],*/
            styles: {
                scale: 100,
                ".MathJax_Display": {
                    "font-size": "100%",
                }
            }
        }
    });

require.config({
    paths: {
      'jquery': 'https://code.jquery.com/jquery-2.2.4.min',
      '@jupyterlab/services': 'https://unpkg.com/@jupyterlab/services@^0.48/dist/index',
    }
});

// Helper Functions 

var kernelSetInfo = (kernel) => {
    if (kernel == undefined) {
        $('#kernel-info').text('Piepacker is inactive')
    } else {
        $('#kernel-info').text("Piepacker is active: {0}".format(kernel.id))
    }
}
const sleep = (milliseconds) => {
    return new Promise(resolve => setTimeout(resolve, milliseconds))
}

if (!String.prototype.format) {
    String.prototype.format = function() {
      var args = arguments;
      return this.replace(/{(\d+)}/g, function(match, number) {
        return typeof args[number] != 'undefined'
          ? args[number]
          : match
        ;
      });
    };
}

var disable_shortcuts = () => {
    IPython.keyboard_manager.command_shortcuts.remove_shortcut('shift-enter')
    IPython.keyboard_manager.edit_shortcuts.remove_shortcut('shift-enter')
}

var enable_shortcuts = () => {
    IPython.keyboard_manager.command_shortcuts.add_shortcut('shift-enter', 'jupyter-notebook:run-cell-and-select-next', false)
    IPython.keyboard_manager.edit_shortcuts.add_shortcut('shift-enter', 'jupyter-notebook:run-cell-and-select-next', false)
}

// Main
define([
    'base/js/events',
    'base/js/namespace',
    '@jupyterlab/services',
    "codemirror/keymap/sublime",
    "codemirror/lib/codemirror",
    "notebook/js/cell",
], function(events, IPython, services, sublime, CodeMirror, cell) {
    // km.KeyboardManager.prototype.disable_shortcuts = function() {
    //     this.disable();
    // }
    // km.KeyboardManager.disable_shortcuts()
    events.on('app_initialized.DashboardApp', function(){
        console.log("dashboard initialized")
    });
    events.on('app_initialized.NotebookApp', function(){
        console.log("notebook initialized")
        var startNewKernel = services.Kernel.startNew;
        var kernelOptions = {
          name: 'python'
        };
        var kernel = undefined;
      
        // TODO: fix this
        sleep(300).then(() => {
            IPython._target = '_self';
            
            // sublime keymap
            cell.Cell.options_default.cm_config.keyMap = 'sublime';
            var cells = IPython.notebook.get_cells();
            for(var cl=0; cl< cells.length; cl++){
                cells[cl].code_mirror.setOption('keyMap', 'sublime');
            }
            // Create top header
            $('#header-container').prepend(
                '<div><img class="logo" src="/custom/piepacker-logo.png" style="width:78px;max-height:32px"></img></div>'
            )
            $('#notebook-container').prepend( 
                '<div id="piepacker-toggle-container">' + 
                '<div id="kernel-info">Kernel not active</div>' +
                '<div class="toggle-box"><label class="switch">' +
                    '<input type="checkbox" id="piepacker-toggle"><span class="slider round"></span>' +
                '</div></label></div>'
            )          
                
            // line numbers
            for(var i=0; i< cells.length; i++){
                cells[i].code_mirror.setOption('lineNumbers', true);
            }
            $('#piepacker-toggle').click(function(){
                if($(this).prop("checked") == true){
                    startNewKernel(kernelOptions).then(function(krnl) {
                        kernel = krnl
                        console.log('Kernel started:', krnl)
                        kernelSetInfo(kernel)
                        for(var i = 0; i < cells.length; i++) {
                            cells[i].code_mirror.setOption('extraKeys', {
                                "Shift-Enter": function(cm) {
                                    cell = IPython.notebook.get_selected_cell()
                                    var code = cell.get_text()
                                    cell.output_area.clear_output();
                                    // // Execute and handle replies on the kernel.
                                    var future = kernel.requestExecute({ code: code });
                                    // // record each IOPub message
                                    future.onIOPub = function(msg) {
                                        alert(msg)
                                    };
                                }
                            });
                        }
                        disable_shortcuts()
                    })
                }
                else if($(this).prop("checked") == false){
                    services.Kernel.shutdown(kernel.id).then(function() {
                        kernelSetInfo()
                        for(var i = 0; i < cells.length; i++) {
                            cells[i].code_mirror.setOption('extraKeys', {})
                        }
                        enable_shortcuts()
                    })
                }
            });
            
            // $('.input_prompt').each((i, e) => {
            //     var button = document.createElement("button")
            //     button.innerHTML = "Run in piepacker"
            //     $(e).append(button)
            //     button.addEventListener ("click", function() {
            //         alert("sending code '" + cells[i].get_text() + "' to piepacker");
            //     });
            // })
        })
    });
});
