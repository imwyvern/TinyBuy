/*
 *	Description	:	A view to render information of tuangou item.
 *	Name		:	tuanView.js
 *	Author		:	Rathinho Zhang
 */

var app = app || {};

app.TuanView = Backbone.View.extend({
	className: 'tuan',

	template: _.template($('#tuan-template').html()),

	events: {
		'click .tuan-image': 'select',
		'click .select-shadow': 'unselect',
		'click .single-tuan-info': 'showDetail'
	},

	render: function() {
		this.$el.html(this.template(this.model.toJSON()));
		this.$el.attr('id', 'tuan-' + this.model.get('Tutetuan').id);
		this.imgLazyLoad();
		return this;
	},

	select: function() {
		this.$el.find('.select-shadow').css('display', 'block');

		// 添加到购物车..
		if ($('.shopping-cart').css('display') === 'none') {
			$('.shopping-cart').css('display', 'block');
		}	

		app.shoppingCart.get('tuans').add(this.model);
	},

	unselect: function() {
		this.$el.find('.select-shadow').css('display', 'none');

		// 从购物车中删除..		
		app.shoppingCart.get('tuans').remove(this.model);
		
		if (app.shoppingCart.get('items').length == 0 && app.shoppingCart.get('tuans').length == 0) {
			$('.shopping-cart').css('display', 'none');
		}
	},

	imgLazyLoad: function() {
		var $img = this.$el.find('.tuan-image > img');
		var url = $img.attr('lazy-src');

		if (url !== undefined) {
			var img = new Image();
			img.onload = function() {
				$img.attr('src', url);
				$img.css({'width': '100%', 'height': '180px', 'margin-top': '0'});
			}

			img.src = url;
		}
	},

	showDetail: function() {
		// 切换到商品详细页面
		var that = this;
		
		$.ajax({
			url: $('base').attr('src') + 'tuans/' + this.model.get('Tutetuan').id + '.json',

			success: function(data) {
				var item = new app.Tuan(data.rt_obj.data);
				$(".container").css('display', 'none');
				var tuanDetailView = new app.TuanDetailView({model: item, parent: that});
			},

			error: function(data) {
				console.log(data);
			}
		});
	}
});


app.TuanViewWithoutImg = Backbone.View.extend({
	className: 'tuan',

	template: _.template($('#tuan-template-no-img').html()),

	events: {
		'click .tuan-image': 'select',
		'click .select-shadow-no-img': 'unselect',
		'click .single-tuan-info': 'showDetail'
	},

	render: function() {
		this.$el.html(this.template(this.model.toJSON()));
		this.$el.attr('id', 'tuan-' + this.model.get('Tutetuan').id);
		this.imgLazyLoad();
		return this;
	},

	select: function() {
		this.$el.find('.select-shadow-no-img').css('display', 'block');

		// 添加到购物车..
		if ($('.shopping-cart').css('display') === 'none') {
			$('.shopping-cart').css('display', 'block');
		}	

		app.shoppingCart.get('tuans').add(this.model);
	},

	unselect: function() {
		this.$el.find('.select-shadow-no-img').css('display', 'none');

		// 从购物车中删除..		
		app.shoppingCart.get('tuans').remove(this.model);
		
		if (app.shoppingCart.get('tuans').length == 0) {
			$('.shopping-cart').css('display', 'none');
		}
	},

	imgLazyLoad: function() {
		var $img = this.$el.find('.tuan-image > img');
		var url = $img.attr('lazy-src');

		if (url !== undefined) {
			var img = new Image();
			img.onload = function() {
				$img.attr('src', url);
				$img.css({'width': '100%', 'height': '180px', 'margin-top': '0'});
			}

			img.src = url;
		}
	},

	showDetail: function() {
		// 切换到商品详细页面
		var that = this;
		
		$.ajax({
			url: $('base').attr('src') + 'tuans/' + this.model.get('Tutetuan').id + '.json',

			success: function(data) {
				console.log(data);
				var item = new app.Tuan(data.rt_obj.data);
				$(".container").css('display', 'none');
				var tuanDetailView = new app.TuanDetailView({model: item, parent: that});
			},

			error: function(data) {
				console.log(data);
			}
		});
	}
});