/*
 *	Description	:	A view to render result of order submitting.
 *	Name		:	orderResultView.js
 *	Author		:	Rathinho Zhang
 */

var app = app || {};

app.OrderResultView = Backbone.View.extend({
	className: 'container',

	id: 'orderResult-container',

	template: _.template($("#orderResultView-template").html()),

	events: {
		'click .next': 'nextOrder'
	},

	initialize: function(options) {
		$(window).scrollTop(0);
		$(".main-container").append(this.render().el);
		sc.dropdown('orderResult-container', ".user");

		var date = new Date();
		$(".date").html((date.getMonth() + 1) + "月" + date.getDate() + "日 " + date.getHours() + ":" + date.getMinutes());
	},

	render: function() {
		this.$el.html(this.template(this.model.toJSON()));

		var that = this;

		// 渲染订单中每个条目
		var items = this.model.get('items');
		if (items.length > 0) {
			var itemsList = new app.ItemsResultView({model: this.model});
			that.$el.find(".orderResultList-container").append(itemsList.render().el);

			items.forEach(function(item) {
				var resultItemView = new app.ResultItemView({model: item});
				that.$el.find('#item-order-list').find('ul').append(resultItemView.render().el);
			});
		}
		var tuans = this.model.get('tuans');
		if (tuans.length > 0) {			
			tuans.forEach(function(tuan) {
				var itemsList = new app.TuansResultView({model: tuan});
				that.$el.find(".orderResultList-container").append(itemsList.render().el);
				var resultTuanView = new app.ResultTuanView({model: tuan});
				itemsList.$el.find('#tuan-order-list').find('ul').append(resultTuanView.render().el);
			});
		}

		if (items.length === 0) {
			this.$el.find('#items-order-result').css('display', 'none');
		}

		if (tuans.length === 0) {
			this.$el.find('#tuans-order-result').css('display', 'none');
		}

		return this;
	},

	nextOrder: function() {
		window.location.reload();
	}
});

app.ItemsResultView = Backbone.View.extend({
	template: _.template($('#itemsResultView-template').html()),

	events: {
		'click .cancelOrder': 'cancelOrder'
	},

	render: function() {
		this.$el.html(this.template(this.model.toJSON()));

		return this;
	},

	cancelOrder: function() {
		var that = this;
		var cart_id = this.model.get('cart_id');
		
		var confirm = new app.OrderConfirmPopupView({msg: '确定取消订单吗？'}, {
			url: $('base').attr('src') + 'orders/delete/' + cart_id,
			method: 'post',
			success: function(data) {
				console.log(data);
				var data = eval('(' + data + ')');
				if (data.code == 1) {
					var popup = new app.OrderInfoPopupView({msg: data.msg});
					$('#orderResult-container').append(popup.render().el);
				} else {
					if (data.msg == "订单删除成功") {
						var popup = new app.OrderInfoPopupView({msg: data.msg});
						$('#orderResult-container').append(popup.render().el);
						that.$el.remove();						
					} else {
						var popup = new app.OrderInfoPopupView({msg: data.msg});
						$('#orderResult-container').append(popup.render().el);
					}
				}
			},
			error: function(data) {
				console.log(data);
			}
		});

		$('#orderResult-container').append(confirm.render().el);
	}
});

app.TuansResultView = Backbone.View.extend({
	template: _.template($('#tuansResultView-template').html()),

	events: {
		'click .cancelOrder': 'cancelOrder'
	},
	
	render: function() {
		this.$el.html(this.template(this.model.toJSON()));

		return this;
	},

	cancelOrder: function() {
		var that = this;
		var tuan_id = this.model.get('tuan_id');
		
		var confirm = new app.OrderConfirmPopupView({msg: '确定取消订单吗？'}, {
			url: $('base').attr('src') + 'orders/delete/' + tuan_id,
			method: 'post',
			success: function(data) {
				console.log(data);
				var data = eval('(' + data + ')');
				if (data.code == 1) {
					var popup = new app.OrderInfoPopupView({msg: data.msg});
					$('#orderResult-container').append(popup.render().el);
				} else {
					if (data.msg == "订单删除成功") {
						var popup = new app.OrderInfoPopupView({msg: data.msg});
						$('#orderResult-container').append(popup.render().el);
						that.$el.remove();						
					} else {
						var popup = new app.OrderInfoPopupView({msg: data.msg});
						$('#orderResult-container').append(popup.render().el);
					}
				}
			},
			error: function(data) {
				console.log(data);
			}
		});

		$('#orderResult-container').append(confirm.render().el);
	}
});

app.ResultItemView = Backbone.View.extend({
	tagName: 'li',

	template: _.template($('#resultItemView-template').html()),

	render: function() {
		this.$el.html(this.template(this.model.toJSON()));

		return this;
	}
});

app.ResultTuanView = Backbone.View.extend({
	tagName: 'li',

	template: _.template($('#resultTuanView-template').html()),

	render: function() {
		this.$el.html(this.template(this.model.toJSON()));

		return this;
	}
});