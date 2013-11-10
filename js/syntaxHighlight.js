$(document).ready(function() {
    $('#textInput').on("keyup", function(e) {
        if (e.keyCode == 32) {
            var sel = rangy.saveSelection();

            $('.Derp').contents().unwrap();
            var text = $('#textInput').html();
            console.log(text);
            text = text.replace(/\bif\b/ig, '<span class="Derp">if</span>');
            $('#textInput').html(text);
            rangy.restoreSelection(sel);
        }

    });

    $('#textInput').keydown(function(e) {

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

function insertTextAtCursor(text) {
    var sel, range, html;
    if (window.getSelection) {
        sel = window.getSelection();
        if (sel.getRangeAt && sel.rangeCount) {
            range = sel.getRangeAt(0);
            range.deleteContents();
            range.insertNode( document.createTextNode(text) );
        }
    } else if (document.selection && document.selection.createRange) {
        document.selection.createRange().text = text;
    }
}