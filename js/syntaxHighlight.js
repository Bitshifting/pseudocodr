$(document).ready(function() {
    $('#textInput').on("keyup", function(e) {
        
        //only happen if space, tab, or enter
        if ((e.keyCode == 32) || (e.keyCode == 9) || (e.keyCode == 13)) {
            
            var sel = rangy.saveSelection();

            //unwrap
            $('.object').contents().unwrap();
            $('.if').contents().unwrap();
            $('.elseif').contents().unwrap();
            $('.else').contents().unwrap();
            $('.while').contents().unwrap(); 
            $('.end').contents().unwrap();
            
            //grab text and add a class to the words
            var text = $('#textInput').html();
            text = text.replace(/\bobject\b/ig, '<span class="object">object</span>');
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
            range.insertNode( document.createTextNode(text) );
        }
    } else if (document.selection && document.selection.createRange) {
        document.selection.createRange().text = text;
    }
}