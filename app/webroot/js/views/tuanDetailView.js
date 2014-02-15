/*
 *	Description	:	A view to render detailed information of a tutetuan.
 *	Name		:	itemDetailView.js
 *	Author		:	Rathinho Zhang
 */

var app = app || {};

app.TuanDetailView = Backbone.View.extend({
	className: 'container',

	id: 'tuansdetail-container',

	template: _.template($('#tuanDetailView-template').html()),

	events: {
		'click .back': 'back',
		'click .addItem': 'add'
	},

	initialize: function(options) {
		this.parent = options.parent;
		$(window).scrollTop(0);
		this.model.set('date', getDeliveryDate(this.model));

		$('.main-container').append(this.render().el);
		sc.dropdown('tuansdetail-container', '.user');

		this.$el.append(new app.ShoppingCartView({model: app.shoppingCart}).render().el);

		if (app.shoppingCart.count > 0) {
			// 添加到购物车..
			if (this.$el.find('.shopping-cart').css('display') === 'none') {
				this.$el.find('.shopping-cart').css('display', 'block');
			}
		}

		function getDeliveryDate (model) {
			var timestamp;
			var dayArr = ['零', '一', '二', '三', '四', '五', '六', '日'];

			timestamp = new Date(parseInt(model.get('Tutetuan').time) * 1000);

			var month = timestamp.getMonth() + 1,
				date = timestamp.getDate(),
				day = timestamp.getDay();

			return month + "月" + date + "日周" + dayArr[day];
		};
	},

	render: function() {
		this.$el.html(this.template(this.model.toJSON()));

		return this;
	},

	add: function() {		
		if (app.shoppingCart.get('tuans').get(this.model.get('Tutetuan').id)) {

		} else {
			this.parent.select();
		}
	},

	back: function() {
		this.$el.css('display', 'none');

		$('#menu-container').css('display', 'block');
	}
});