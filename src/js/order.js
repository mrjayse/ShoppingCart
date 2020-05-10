'use strict';

var order = (function($) {

    var ui = {
        $orderForm: $('#order-form'),
        $messageCart: $('#order-message'),
        $orderBtn: $('#order-btn'),
        $alertValidation: $('#alert-validation'),
        $alertOrderDone: $('#alert-order-done'),
        $orderMessageTemplate: $('#order-message-template'),
        $fullSumma: $('#full-summa')
    };

    function init() {
        _renderMessage();
        _checkCart();
        _bindHandlers();
    }

    function _renderMessage() {
        let template = _.template(ui.$orderMessageTemplate.html()),
            data;
        cart.update();
        data = {
            count: cart.getCountAll(),
            summa: cart.getSumma()
        };
        ui.$messageCart.html(template(data));
    }

    function _checkCart() {
        if (cart.getCountAll() === 0) {
            ui.$orderBtn.attr('disabled', 'disabled');
        }
    }

    function _bindHandlers() {
        ui.$orderForm.on('click', '.js-close-alert', _closeAlert);
        ui.$orderForm.on('submit', _submitForm);
    }

    function _submitForm(){
        if (_validate() == true){
            let easy = document.getElementById('alert-order-done')
            alert(easy.textContent)
            
        }
        else {
            let warning = document.getElementById('alert-validation')
            alert(warning.textContent)
        }
    }

    function _closeAlert(e) {
        $(e.target).parent().addClass('hidden');
    }

    function _validate() {
        var formData = ui.$orderForm.serializeArray(),
            name = _.find(formData, {name: 'name'}).value,
            email = _.find(formData, {name: 'email'}).value,
            isValid = (name !== '') && (email !== '');
        return isValid;
    }

    function _orderError(responce) {
        console.error('responce', responce);
    }

    return {
        init: init
    }

})(jQuery);