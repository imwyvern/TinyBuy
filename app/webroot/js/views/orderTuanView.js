/*
 *	Description	:	A view to render order item of Tutetuan.
 *	Name		:	orderTuanView.js
 *	Author		:	Rathinho Zhang
 */

var app = app || {};

app.OrderTuanView = Backbone.View.extend({
	tagName: 'li',

	template: _.template($("#orderTuanView-template").html()),

	events: {
		'click .minus': 'minus',
		'click .add': 'add',
		'click .delete-btn': 'removeItem'
	},

	initialize: function() {
		if (!this.model.get('count')) {
			this.model.set('count', 1);
			this.model.set('total', parseInt(this.model.get('Tutetuan').price));
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
		this.model.set('total', this.model.get('total') - parseInt(this.model.get('Tutetuan').price));

		app.shoppingCart.set('tuan_count', app.shoppingCart.get('tuan_count') - 1);
		app.shoppingCart.set('tuan_total', app.shoppingCart.get('tuan_total') - parseInt(this.model.get('Tutetuan').price));

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
		this.model.set('total', this.model.get('total') + parseInt(this.model.get('Tutetuan').price));

		app.shoppingCart.set('tuan_count', app.shoppingCart.get('tuan_count') + 1);
		app.shoppingCart.set('tuan_total', app.shoppingCart.get('tuan_total') + parseInt(this.model.get('Tutetuan').price));

		this.updateView(1);	
	},

	removeItem: function() {
		var cid = this.model.get('Tutetuan').id;
		if ($('#tuan-'+ cid).find('.select-shadow').length > 0) {
			$('#tuan-'+ cid).find('.select-shadow').css('display', 'none');
		}

		if ($('#tuan-'+ cid).find('.select-shadow-no-img').length > 0) {
			$('#tuan-'+ cid).find('.select-shadow-no-img').css('display', 'none');
		}
		app.shoppingCart.get('tuans').remove(this.model);
		this.remove();

		if (app.shoppingCart.get('count') == 0) {
			$('#order-container').hide();
			$('#menu-container').show();
		}
	},

	updateView: function(inc) {
		this.$el.find('.tuan-amount').html(this.model.get('count'));
		this.$el.find('.tuan-total-price').html('￥'+this.model.get('total'));
	}
});