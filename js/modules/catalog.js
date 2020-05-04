'use strict';

var catalog = (function($) {
    function init() {
        _render();
    }
    
    function _render() {
        var template = _.template($('#catalog-template').html()),
            $goods = $('#goods');

        $.getJSON('data/goods.json', function(data) {
            $goods.html(template({goods: data}));
        });
    }

    return {
        init: init
    }

})(jQuery);
