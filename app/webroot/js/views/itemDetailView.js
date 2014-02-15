/*
 *	Description	:	A view to render detailed information of an item.
 *	Name		:	itemDetailView.js
 *	Author		:	Rathinho Zhang
 */

var app = app || {};

app.ItemDetailView = Backbone.View.extend({
	className: 'container',

	id: 'itemsdetail-container',

	template: _.template($('#itemDetailView-template').html()),

	events: {
		'click .back': 'back',
		'click .addItem': 'add'
	},

	initialize: function(options) {
		this.parent = options.parent;
		$(window).scrollTop(0);
		$('.main-container').append(this.render().el);
		sc.dropdown('itemsdetail-container', '.user');

		this.$el.append(new app.ShoppingCartView({model: app.shoppingCart}).render().el);

		if (app.shoppingCart.get('count') > 0) {
			// 添加到购物车..
			if (this.$el.find('.shopping-cart').css('display') === 'none') {
				this.$el.find('.shopping-cart').css('display', 'block');
			}
		}
	},

	render: function() {
		this.$el.html(this.template(this.model.toJSON()));

		return this;
	},

	add: function() {
		if (app.shoppingCart.get('items').get(this.model.get('Material').id)) {
			var popup = new app.OrderInfoPopupView({msg: "已加入购物车，请前往购物车查看"});
			this.$el.append(popup.render().el);
		} else {
			this.parent.select();
		}
	},

	back: function() {
		this.$el.remove();
		// this.$el.find('.shopping-cart').css('display', 'none');
		$('#menu-container').css('display', 'block');
	}
});