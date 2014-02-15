/*
 *	Description	:	A view to render shopping cart.
 *	Name		:	shoppingCartView.js
 *	Author		:	Rathinho Zhang
 */

var app = app || {};

app.ShoppingCartView = Backbone.View.extend({

	template: _.template($("#shoppingCart-template").html()),

	events: {
		'click': 'enterShoppingCart'
	},

	render: function() {
		this.$el.html(this.template(this.model.toJSON()));
		return this;
	},

	enterShoppingCart: function() {
		// 进入购入车
		$('.container').css('display', 'none');

		var orderContainer = $('#order-container');
		if (orderContainer.length > 0) {
			orderContainer.remove();
			var orderContainer = new app.OrderView({model: this.model});
		} else {
			var orderContainer = new app.OrderView({model: this.model});
		}
	}
});