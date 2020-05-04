'use strict';

var cart = (function($) {
    var cartData,
        opts = {};

    function init(options) {
        _initOptions(options);
        updateData();
        if (opts.renderCartOnInit) {
            renderCart();
        }
        if (opts.renderMenuCartOnInit) {
            renderMenuCart();
        }
        _bindHandlers();
    }

    function _initOptions(options) {
        var defaultOptions = {
            renderCartOnInit: true,
            renderMenuCartOnInit: true,
            elAddToCart: '.js-add-to-cart',
            attrId: 'data-id',
            attrName: 'data-name',
            attrPrice: 'data-price',
            attrDelta: 'data-delta',
            elCart: '#cart',
            elTotalCartCount: '#total-cart-count',
            elTotalCartSumma: '#total-cart-summa',
            elCartItem: '.js-cart-item',
            elCartCount: '.js-count',
            elCartSumma: '.js-summa',
            elChangeCount: '.js-change-count',
            elRemoveFromCart: '.js-remove-from-cart'
        };
        _.defaults(options || {}, defaultOptions);
        opts = _.clone(options);
    }

    function _bindHandlers() {
        _onClickAddBtn();
        _onClickChangeCountInCart();
        _onClickRemoveFromCart();
    }

    function updateData() {
        cartData = JSON.parse(localStorage.getItem('cart')) || [];
        return cartData;
    }

    function getData() {
        return cartData;
    }

    function saveData() {
        localStorage.setItem('cart', JSON.stringify(cartData));
        return cartData;
    }

    function clearData() {
        cartData = [];
        saveData();
        return cartData;
    }

    function getById(id) {
        return _.findWhere(cartData, {id: id});
    }

    function add(item) {
        var oldItem;
        updateData();
        oldItem = getById(item.id);
        if(!oldItem) {
            cartData.push(item);
        } else {
            oldItem.count = oldItem.count + item.count;
        }
        saveData();
        return item;
    }

    function remove(id) {
        updateData();
        cartData = _.reject(cartData, function(item) {
            return item.id === id;
        });
        saveData();
        return cartData;
    }

    function changeCount(id, delta) {
        var item;
        updateData();
        item = getById(id);
        if(item) {
            item.count = item.count + delta;
            if (item.count < 1) {
                remove(id);
            }
            saveData();
        }
        return _.findWhere(cartData, {id: id}) || {};
    }
    function getCount() {
        return _.size(cartData);
    }

    function getCountAll() {
        return _.reduce(cartData, function(sum, item) {return sum + item.count}, 0);
    }

    function getSumma() {
        return _.reduce(cartData, function(sum, item) {return sum + item.count * item.price}, 0);
    }

    function renderCart() {
        var template = _.template($('#cart-template').html()),
            data = {
                goods: cartData
            };
        $(opts.elCart).html(template(data));
        renderTotalCartSumma();
    }

    function renderMenuCart() {
        var countAll = getCountAll();
        $(opts.elTotalCartCount).html(countAll !== 0 ? countAll : '');
    }

    function renderTotalCartSumma() {
        $(opts.elTotalCartSumma).html(getSumma());
    }

    function findCartElemById(id) {
        return $(opts.elCartItem + '[' + opts.attrId + '="'+id+'"]');
    }

    function _onClickAddBtn() {
        $('body').on('click', opts.elAddToCart, function(e) {
            var $this = $(this);
            add({
                id: +$this.attr(opts.attrId),
                name: $this.attr(opts.attrName),
                price: +$this.attr(opts.attrPrice),
                count: 1
            });
            renderMenuCart();
            alert('Товар добавлен в корзину');
        });
    }

    function _onClickChangeCountInCart() {
        $('body').on('click', opts.elChangeCount, function(e) {
            var $this = $(this),
                id = +$this.attr(opts.attrId),
                delta = +$this.attr(opts.attrDelta),
                $cartElem = findCartElemById(id),
                cartItem = changeCount(id, delta);
            if (cartItem.count) {
                $cartElem.find(opts.elCartCount).html(cartItem.count);
                $cartElem.find(opts.elCartSumma).html(cartItem.count * cartItem.price);
            } else {
                $cartElem.remove();
            }
            renderMenuCart();
            renderTotalCartSumma();
        });
    }

    function _onClickRemoveFromCart() {
        $('body').on('click', opts.elRemoveFromCart, function(e) {
            if(!confirm('Удалить товар из корзины?')) return false;
            var $this = $(this),
                id = +$this.attr(opts.attrId),
                $cartElem = findCartElemById(id);
            remove(id);
            $cartElem.remove();
            renderMenuCart();
            renderTotalCartSumma();
        });
    }

    return {
        init: init,
        update: updateData,
        getData: getData,
        save: saveData,
        clearData: clearData,
        getById: getById,
        add: add,
        remove: remove,
        changeCount: changeCount,
        getCount: getCount,
        getCountAll: getCountAll,
        getSumma: getSumma
    }

})(jQuery);
