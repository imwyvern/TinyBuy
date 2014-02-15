/*
 *	Description	:	A view to render order item.
 *	Name		:	orderItemView.js
 *	Author		:	Rathinho Zhang
 */

var app = app || {};

app.OrderItemView = Backbone.View.extend({
	tagName: 'li',

	template: _.template($("#orderItemView-template").html()),

	events: {
		'click .minus': 'minus',
		'click .add': 'add',
		'click .delete-btn': 'removeItem'
	},

	initialize: function() {
		if (!this.model.get('count')) {
			this.model.set('count', 1);
			this.model.set('total', parseInt(this.model.get('Material').price));
		}
	},

	render: function() {
		this.$el.html(this.template(this.model.toJSON()));
		if (this.model.get('count') > 1) {
			this.$el.find('.minus').removeClass('disabled');
		}
		return this;
	},

	minus: function() {
		var count = parseInt(this.$el.find('.amount').val());

		if (count > 2) {
			this.$el.find('.amount').val(count - 1);
			this.$el.find('.minus').removeClass('disabled');
		} else if (count == 2) {
			this.$el.find('.amount').val(count - 1);
			this.$el.find('.minus').addClass('disabled');
		} else {
			this.$el.find('.minus').addClass('disabled');
			return;
		}
		
		this.model.set('count', count - 1);
		this.model.set('total', this.model.get('total') - parseInt(this.model.get('Material').price));

		app.shoppingCart.set('item_count', app.shoppingCart.get('item_count') - 1);
		app.shoppingCart.set('item_total', app.shoppingCart.get('item_total') - parseInt(this.model.get('Material').price));

		this.updateView(-1);

	},

	add: function() {
		var count = parseInt(this.$el.find('.amount').val());
		this.$el.find('.amount').val(count + 1);

		if (count + 1 > 0) {			
			this.$el.find('.minus').removeClass('disabled');
		} else {
			this.$el.find('.minus').addClass('disabled');
		}

		this.model.set('count', count + 1);
		this.model.set('total', this.model.get('total') + parseInt(this.model.get('Material').price));

		app.shoppingCart.set('item_count', app.shoppingCart.get('item_count') + 1);
		app.shoppingCart.set('item_total', app.shoppingCart.get('item_total') + parseInt(this.model.get('Material').price));

		this.updateView(1);	
	},

	removeItem: function() {
		var cid = this.model.get('Cookbook').id;
		if ($('#item-'+ cid).find('.select-shadow').length > 0) {
			$('#item-'+ cid).find('.select-shadow').css('display', 'none');
		}

		if ($('#item-'+ cid).find('.select-shadow-no-img').length > 0) {
			$('#item-'+ cid).find('.select-shadow-no-img').css('display', 'none');
		}
		
		app.shoppingCart.get('items').remove(this.model);
		this.remove();

		if (app.shoppingCart.get('count') == 0) {
			$('#order-container').hide();
			$('#menu-container').show();
		}
	},

	updateView: function(inc) {
		this.$el.find('.item-amount').html(this.model.get('count'));
		this.$el.find('.item-total-price').html('￥'+this.model.get('total'));
	}
});