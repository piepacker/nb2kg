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
  Original Kernel message format:
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

{
  "parent_header": {
    "session": "632ad5181b6236f308e9521417cb7095",
    "username": "",
    "date": "2019-07-27T22:12:26.049890",
    "msg_id": "7d8ee63c97a66554dfb9b0b2185586c1",
    "version": "5.2",
    "msg_type": "execute_request"
  },
  "channel": "iopub",
  "header": {
    "session": "744992ca-3e32-48db-8598-e673c139ea9e",
    "username": "username",
    "date": "2019-07-27T22:12:26.051210",
    "msg_id": "d751b057-8a71-40eb-bc78-7a614589cf34",
    "version": "5.0",
    "msg_type": "status"
  },
  "metadata": {},
  "msg_id": "d751b057-8a71-40eb-bc78-7a614589cf34",
  "content": {
    "execution_state": "busy"
  },
  "buffers": [],
  "msg_type": "status"
}
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

var _activeKernel = undefined
var getActiveKernel = () => {
    return _activeKernel
}
var setActiveKernel = (krnl) => {
    _activeKernel = krnl
}

// Main
define([
    'base/js/namespace',
    '@jupyterlab/services',
    "notebook/js/cell",
    "notebook/js/actions",
    "codemirror/keymap/sublime",
    "codemirror/lib/codemirror",
], function(IPython, services, cell, actions, sublime, CodeMirror) {
    // TODO: fix this
    sleep(300).then(() => {
        km = new services.KernelManager({
            serverSettings: services.ServerConnection.makeSettings({
                baseUrl: "http://0.0.0.0:9889/",
                wsUrl: "ws://0.0.0.0:9889/",
            })
        })

        var kernelSetInfo = () => {
            kernel = getActiveKernel()
            if (kernel == undefined) {
                $('#kernel-info').text('Piepacker is inactive')
            } else {
                $('#kernel-info').text("Piepacker is active: {0}".format(kernel.id))
            }
        }

        var extraActions = {
            'jupyter-notebook': {
                'insert-cell-below': {
                    overwrite: false,
                    handler: function(env) {
                        var newCell = env.notebook.get_selected_cell();
                        newCell.code_mirror.setOption('keyMap', 'sublime')
                        newCell.code_mirror.setOption('lineNumbers', true)
                        kernel = getActiveKernel()
                        if (kernel == undefined) {
                            return
                        }
                        newCell.code_mirror.setOption('extraKeys', {
                            "Shift-Enter": function(cm) {
                                execute_cell_and_select_below()
                            }
                        });
                    }
                }
            }
        }
        Object.keys(extraActions).forEach((namespace) => {
            Object.keys(extraActions[namespace]).forEach((actionName) => {
                var existingAction = IPython.actions._actions["{0}:{1}".format(namespace, actionName)]
                var newAction = extraActions[namespace][actionName]
                var action = () => {
                    // existing action performed first, new action performed next
                    if (!newAction.overwrite) {
                        existingAction.handler(IPython)
                    }
                    newAction.handler(IPython)
                }
                IPython.actions.register(action, actionName, namespace)
            })
        })

        var disable_shortcuts = () => {
            IPython.keyboard_manager.command_shortcuts.remove_shortcut('shift-enter')
            IPython.keyboard_manager.edit_shortcuts.remove_shortcut('shift-enter')
        }
        
        var enable_shortcuts = () => {
            IPython.keyboard_manager.command_shortcuts.add_shortcut('shift-enter', 'jupyter-notebook:run-cell-and-select-next', false)
            IPython.keyboard_manager.edit_shortcuts.add_shortcut('shift-enter', 'jupyter-notebook:run-cell-and-select-next', false)
        }
        
        var execute_cell_and_select_below = function () {
            kernel = getActiveKernel()
            var notebook = IPython.notebook
            var indices = notebook.get_selected_cells_indices();
            var cell_index;
            if (indices.length > 1) {
                console.error("exec multiple cells: not supported");
                return;
            }
            var cell = notebook.get_selected_cell();
            var code = cell.get_text()
            cell.output_area.clear_output();
            // // Execute and handle replies on the kernel.
            var future = kernel.requestExecute({ code: code });
            // // record each IOPub message
            future.onIOPub = function(msg) {
                cell.output_area.handle_output(msg)
            };
            future.onReply = function(reply) {
                console.log('Got execute reply {0}'.format(reply));
            };
            future.done.then(function() {
                console.log('done!');
            });
        
            // If we are at the end always insert a new cell and return
            cell_index = notebook.find_cell_index(cell);
            if (cell_index === (notebook.ncells()-1)) {
                notebook.command_mode();
                notebook.insert_cell_below();
                notebook.select(cell_index+1);
                var nextCell = notebook.get_selected_cell();
                nextCell.code_mirror.setOption('extraKeys', {
                    "Shift-Enter": function(cm) {
                        execute_cell_and_select_below(notebook, kernel)
                    }
                });
                nextCell.code_mirror.setOption('keyMap', 'sublime')
                nextCell.code_mirror.setOption('lineNumbers', true)
                notebook.edit_mode();
                notebook.scroll_to_bottom();
                notebook.set_dirty(true);
                return;
            }
        
            notebook.command_mode();
            notebook.select(cell_index+1);
            notebook.focus_cell();
            notebook.set_dirty(true);
        };

        // var startNewKernel = services.Kernel.startNew;
        var kernelOptions = {
            name: 'python',
        };

        IPython._target = '_self';
        
        // cell initial setup
        cell.Cell.options_default.cm_config.keyMap = 'sublime';
        var cells = IPython.notebook.get_cells()
        for(var i=0; i< cells.length; i++){
            cells[i].code_mirror.setOption('keyMap', 'sublime');
            cells[i].code_mirror.setOption('lineNumbers', true);
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
        
        $('#piepacker-toggle').click(function(){
            if($(this).prop("checked") == true){
                km.startNew(kernelOptions).then(function(krnl) {
                    setActiveKernel(krnl)
                    console.log('Kernel started:', krnl)
                    kernelSetInfo()
                    cells = IPython.notebook.get_cells()
                    for(var i = 0; i < cells.length; i++) {
                        cells[i].code_mirror.setOption('extraKeys', {
                            "Shift-Enter": function(cm) {
                                execute_cell_and_select_below()
                            }
                        });
                    }
                    disable_shortcuts()
                })
            }
            else if($(this).prop("checked") == false){
                kernel = getActiveKernel()
                if (kernel == undefined) {
                    return
                }
                services.Kernel.shutdown(kernel.id).then(function() {
                    kernelSetInfo()
                    cells = IPython.notebook.get_cells()
                    for(var i = 0; i < cells.length; i++) {
                        cells[i].code_mirror.setOption('extraKeys', {})
                    }
                    enable_shortcuts()
                })
                setActiveKernel(undefined)
            }
        });
    })
    // should use events instead of 300ms
    // events.on('app_initialized.DashboardApp', function(){
    //     console.log("dashboard initialized")
    // });
    // events.on('app_initialized.NotebookApp', function(){
    //     console.log("notebook initialized")
    // });
});
