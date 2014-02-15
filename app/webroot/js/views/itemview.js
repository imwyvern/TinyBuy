/*
 *	Description	:	A view to render information of goods item.
 *	Name		:	itemview.js
 *	Author		:	Rathinho Zhang
 */

var app = app || {};

app.ItemView = Backbone.View.extend({
	className: 'item',

	template: _.template($('#item-template').html()),

	events: {
		'click .item-image': 'select',
		'click .select-shadow': 'unselect',
		'click .single-item-info': 'showDetail',
	},

	render: function() {
		this.$el.html(this.template(this.model.toJSON()));
		this.$el.attr('id', 'item-' + this.model.get('Cookbook').id);
		// this.imgLazyLoad();
		return this;
	},

	select: function() {
		this.$el.find('.select-shadow').css('display', 'block');

		// 添加到购物车..
		if ($('.shopping-cart').css('display') === 'none') {
			$('.shopping-cart').css('display', 'block');
		}	

		app.shoppingCart.get('items').add(this.model);
		app.shoppingCart.get('items').date = this.model.get('date');
	},

	unselect: function() {
		this.$el.find('.select-shadow').css('display', 'none');

		// 从购物车中删除..		
		app.shoppingCart.get('items').remove(this.model);
		
		if (app.shoppingCart.get('items').length == 0 && app.shoppingCart.get('tuans').length == 0) {
			$('.shopping-cart').css('display', 'none');
		}
	},

	imgLazyLoad: function() {
		var $img = this.$el.find('.item-image > img');
		var url = $img.attr('lazy-src');
		var priority = this.model.get('Cookbook').priority;

		if (url !== undefined) {
			var img = new Image();
			img.onload = function() {
				$img.attr('src', url);
				$img.css({'width': '100%', 'height': '110px', 'margin-top': '0'});

				if (priority == '1' || priority == '2') {
					$img.css('height', '180px');
				}
			}

			img.src = url;
		}
	},

	showDetail: function() {
		// 切换到商品详细页面
		var that = this;

		$.ajax({
			url: $('base').attr('src') + 'items/' + this.model.get('Cookbook').id + '.json',

			success: function(data) {
				var item = new app.Item(data.rt_obj.data);
				$(".container").css('display', 'none');
				var itemDetailView = new app.ItemDetailView({model: item, parent: that});
			},

			error: function(data) {
				console.log(data);
			}
		});
	}
});


app.ItemViewWithoutImg = Backbone.View.extend({
	className: 'item',

	template: _.template($('#item-template-no-img').html()),

	events: {
		'click .item-image': 'select',
		'click .select-shadow-no-img': 'unselect',
		'click .single-item-info': 'showDetail'
	},

	render: function() {
		this.$el.html(this.template(this.model.toJSON()));
		this.$el.attr('id', 'item-' + this.model.get('Cookbook').id);
		this.imgLazyLoad();
		return this;
	},

	select: function() {
		this.$el.find('.select-shadow-no-img').css('display', 'block');

		// 添加到购物车..
		if ($('.shopping-cart').css('display') === 'none') {
			$('.shopping-cart').css('display', 'block');
		}	

		app.shoppingCart.get('items').add(this.model);
	},

	unselect: function() {
		this.$el.find('.select-shadow-no-img').css('display', 'none');

		// 从购物车中删除..		
		app.shoppingCart.get('items').remove(this.model);
		
		if (app.shoppingCart.get('items').length == 0) {
			$('.shopping-cart').css('display', 'none');
		}
	},

	imgLazyLoad: function() {
		var $img = this.$el.find('.item-image > img');
		var url = $img.attr('lazy-src');
		var priority = this.model.get('Cookbook').priority;

		if (url !== undefined) {
			var img = new Image();
			img.onload = function() {
				$img.attr('src', url);
				$img.css({'width': '100%', 'height': '110px', 'margin-top': '0'});

				if (priority == '1' || priority == '2') {
					$img.css('height', '180px');
				}
			}

			img.src = url;
		}
	},

	showDetail: function() {
		// 切换到商品详细页面
		var that = this;

		$.ajax({
			url: $('base').attr('src') + 'items/' + this.model.get('Cookbook').id + '.json',

			success: function(data) {
				var item = new app.Item(data.rt_obj.data);
				$(".container").css('display', 'none');
				var itemDetailView = new app.ItemDetailView({model: item, parent: that});
			},

			error: function(data) {
				console.log(data);
			}
		});
	}
});