$(document).ready(function() {
    $('#textInput').on("keyup", function(e) {

        //only happen if space, tab, or enter
        if ((e.keyCode == 32) || (e.keyCode == 9) || (e.keyCode == 13)) {

            var sel = rangy.saveSelection();

            //unwrap
            $('.object').contents().unwrap();
            $('.function').contents().unwrap();
            $('.if').contents().unwrap();
            $('.elseif').contents().unwrap();
            $('.else').contents().unwrap();
            $('.while').contents().unwrap();
            $('.end').contents().unwrap();

            //grab text and add a class to the words
            var text = $('#textInput').html();
            text = text.replace(/\bobject\b/ig, '<span class="object">object</span>');
            text = text.replace(/\bfunction\b/ig, '<span class="function">function</span>');
            text = text.replace(/\bif\b/ig, '<span class="if">if</span>');
            text = text.replace(/\belseif\b/ig, '<span class="elseif">elseif</span>');
            text = text.replace(/\belse\b/ig, '<span class="else">else</span>');
            text = text.replace(/\bwhile\b/ig, '<span class="while">while</span>');
            text = text.replace(/\bend\b/ig, '<span class="end">end</span>');

            //replace the html div
            $('#textInput').html(text);

            //restore cursor
            rangy.restoreSelection(sel);
        }


    });

    function processFile(e) {
        var file = e.target.result,
                results;
        if (file && file.length) {
            $('#textInput').html(file);

            $('.object').contents().unwrap();
            $('.function').contents().unwrap();
            $('.if').contents().unwrap();
            $('.elseif').contents().unwrap();
            $('.else').contents().unwrap();
            $('.while').contents().unwrap();
            $('.end').contents().unwrap();

            //grab text and add a class to the words
            var text = $('#textInput').html();
            text = text.replace(/\bobject\b/ig, '<span class="object">object</span>');
            text = text.replace(/\bfunction\b/ig, '<span class="function">function</span>');
            text = text.replace(/\bif\b/ig, '<span class="if">if</span>');
            text = text.replace(/\belseif\b/ig, '<span class="elseif">elseif</span>');
            text = text.replace(/\belse\b/ig, '<span class="else">else</span>');
            text = text.replace(/\bwhile\b/ig, '<span class="while">while</span>');
            text = text.replace(/\bend\b/ig, '<span class="end">end</span>');
            //replace the html div
            $('#textInput').html(text);

        }
    }

    $('#files').change(function() {
        if (!window.FileReader) {
            alert('Your browser is not supported')
        }
        var input = $('#files').get(0);

        // Create a reader object
        var reader = new FileReader();
        if (input.files.length) {
            var textFile = input.files[0];
            reader.readAsText(textFile);
            $(reader).on('load', processFile);
        } else {
            alert('Please upload a file before continuing')
        }
    });

    $("#textInput").on("click", function() {
        $(this).attr("contentEditable", true);
        $(this).focus();
    });

    $('#textInput').keydown(function(e) {
        //change tab to 4 spaces
        if (e.keyCode == 9) {
            var sel = rangy.saveSelection();
            insertTextAtCursor('    ');
            rangy.restoreSelection(sel);
            if (e.preventDefault) {
                e.preventDefault()
            }
        }

    });
});


//function to insert text at the cursors
function insertTextAtCursor(text) {
    var sel, range, html;
    if (window.getSelection) {
        sel = window.getSelection();
        if (sel.getRangeAt && sel.rangeCount) {
            range = sel.getRangeAt(0);
            range.deleteContents();
            range.insertNode(document.createTextNode(text));
        }
    } else if (document.selection && document.selection.createRange) {
        document.selection.createRange().text = text;
    }
}

function save() {

    document.getElementById('textInput').contentEditable = false;
    var note = $('#textInput').html();
    note = note.replace(/(<div><br>)*<\/div>/g, '\n');
    note = note.replace(/<div>/g, '');
    /* replaces some html entities */
    note = note.replace(/&nbsp;/g, ' ');
    note = note.replace(/&amp;/g, '&');
    note = note.replace(/&lt;/g, '<');
    note = note.replace(/&gt;/g, '>');
    note = note.replace(/<br>/g, '\n');

    document.getElementById('saveButton').setAttribute(
            'href',
            'data:Content-type: text/plain, ' + escape(note)
            );

}
