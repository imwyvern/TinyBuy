/*
 *	Description	:	A model to store information of an order.
 *	Name		:	order.js
 *	Author		:	Rathinho Zhang
 */

var app = app || {};

app.Order = Backbone.Model.extend({
	defaults: {
		id: "",
		time: "",
		count: 0,
		total: 0,
		item_count: 0,
		item_total: 0,
		tuan_count: 0,
		tuan_total: 0,
		items: null,
		tuans: null,
	},

	initialize: function() {
		var that = this;
		var items = new app.ItemCollection();
		var tuans = new app.ItemCollection();
		this.set('items', items);
		this.set('tuans', tuans);

		this.on('invalid', function(model, error) {
			console.log(error);
		});

		// 为订单的菜品集合添加add事件监听
		this.get('items').on('add', function(model) {
			model.set('count', 1);
			model.set('total', parseInt(model.get('Material').price));
			that.set('item_count', that.get('item_count') + model.get('count'));
			that.set('item_total', that.get('item_total') + model.get('count') * parseInt(model.get('Material').price));
			that.set('count', that.get('item_count') + that.get('tuan_count'));
			that.set('total', that.get('item_total') + that.get('tuan_total'));
		});

		// 为订单的菜品集合添加remove事件监听
		this.get('items').on('remove', function(model) {
			that.set('item_count', that.get('item_count') - model.get('count'));
			that.set('item_total', that.get('item_total') - model.get('count') * parseInt(model.get('Material').price));
			that.set('count', that.get('item_count') + that.get('tuan_count'));
			that.set('total', that.get('item_total') + that.get('tuan_total'));
		});

		// 为订单的团购菜品集合添加add事件监听
		this.get('tuans').on('add', function(model) {
			model.set('count', 1);
			model.set('total', parseInt(model.get('Tutetuan').price));
			that.set('tuan_count', that.get('tuan_count') + model.get('count'));
			that.set('tuan_total', that.get('tuan_total') + model.get('count') * parseInt(model.get('Tutetuan').price));
			that.set('count', that.get('item_count') + that.get('tuan_count'));
			that.set('total', that.get('item_total') + that.get('tuan_total'));
		});

		// 为订单的团购菜品集合添加remove事件监听
		this.get('tuans').on('remove', function(model) {
			that.set('tuan_count', that.get('tuan_count') - model.get('count'));
			that.set('tuan_total', that.get('tuan_total') - model.get('count') * parseInt(model.get('Tutetuan').price));
			that.set('count', that.get('item_count') + that.get('tuan_count'));
			that.set('total', that.get('item_total') + that.get('tuan_total'));
		});

		this.on('change:item_count', function() {
			that.set('count', that.get('item_count') + that.get('tuan_count'));
			// $('.items-total-amount').html(that.get('item_count'));
		});

		this.on('change:item_total', function() {
			that.set('total', that.get('item_total') + that.get('tuan_total'));
			$('.items-total-price').html(that.get('item_total'));
		});

		this.on('change:tuan_count', function() {
			that.set('count', that.get('item_count') + that.get('tuan_count'));
			// $('.tuans-total-amount').html(that.get('tuan_count'));
		});

		this.on('change:tuan_total', function() {
			that.set('total', that.get('item_total') + that.get('tuan_total'));
			$('.tuans-total-price').html(that.get('tuan_total'));
		});

		// 为订单的菜品数目添加change事件监听
		this.on('change:count', function(data) {
			$('.total-amount').each(function() {
				$(this).html(that.get('count'));
			});

			if (data.get('count') <= 0) {
				app.shoppingCartV.$el.hide();
			} else {
				app.shoppingCartV.$el.show();
			}
		});

		// 为订单的总价格添加change事件监听
		this.on('change:total', function() {
			$('.total-price').each(function() {
				$(this).html(that.get('total'));
			});
		});
	},

	validate: function(attrs) {
		if (typeof attrs.count !== 'number') {
			return "count must be a number";
		} else if (typeof attrs.count === 'number' && attrs.count < 0) {
			return "count can not be less than zero";
		}
	}
});