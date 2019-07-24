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

// require(["codemirror/keymap/sublime", "notebook/js/cell", "base/js/namespace"],
//     function(sublime_keymap, cell, IPython) {
//         // setTimeout(function(){ // uncomment line to fake race-condition
//         cell.Cell.options_default.cm_config.keyMap = 'sublime';
//         var cells = IPython.notebook.get_cells();
//         for(var cl=0; cl< cells.length ; cl++){
//             cells[cl].code_mirror.setOption('keyMap', 'sublime');
//         }
//  
//         // }, 1000)// uncomment  line to fake race condition 
//     } 
// );

// define(['base/js/namespace'], function(Jupyter){
//     Jupyter._target = '_self';
// });
//
//
// $(".header-container").remove()
// MathJax.Hub.Config({
//         "HTML-CSS": {
//             /*preferredFont: "TeX",*/
//             /*availableFonts: ["TeX", "STIX"],*/
//             styles: {
//                 scale: 100,
//                 ".MathJax_Display": {
//                     "font-size": "100%",
//                 }
//             }
//         }
//     });
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

var createKernel = (base_url) => {
    var kernelID = ""
    $.ajax({
        type: 'POST',
        url: "{0}/api/kernels".format(base_url),
        crossDomain: true,
        data: '{"name":"python"}',
        dataType: 'json',
        contentType: 'application/json',
        success: function(responseData, textStatus, jqXHR) {
            console.log("responseData {0}".format(responseData))
            console.log("textStatus {0}".format(textStatus))
            console.log("jqXHR {0}".format(jqXHR))

        },
        error: function (responseData, textStatus, errorThrown) {
            console.err("responseData {0}".format(responseData))
            console.err("textStatus {0}".format(textStatus))
            console.err("errorThrown {0}".format(errorThrown))
        }
    });
}

const sleep = (milliseconds) => {
  return new Promise(resolve => setTimeout(resolve, milliseconds))
}

sleep(500).then(() => {
    var cells = IPython.notebook.get_cells();
    $('.input_prompt').each((i, e) => {
        var button = document.createElement("button")
        button.innerHTML = "Run in piepacker"
        $(e).append(button)
        button.addEventListener ("click", function() {
            alert("sending code '" + cells[i].get_text() + "' to piepacker");
        });
    })
    createKernel("http://127.0.0.1:9889")
})

// I should be able to use an event trigger to load the script above, but instead
// I am using a sleep. TODO: fix this
// NOTE: I don't know why the example below does not produce an output
define([
    'base/js/events',
    'base/js/namespace'
], function(events, IPython) {
    console.log("init function")
    events.on('app_initialized.DashboardApp', function(){
        console.log("dashboard initialized")
    });
    events.on('app_initialized.NotebookApp', function(){
        console.log("notebook initialized")
        var cells = IPython.notebook.get_cells();
        console.log("cells in nb init=[" + cells + "]")
    });
});