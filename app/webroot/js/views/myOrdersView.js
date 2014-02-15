/*
 *	Description	:	A view to render my orders.
 *	Name		:	myOrdersView.js
 *	Author		:	Rathinho Zhang
 */

var app = app || {};

app.MyOrdersView = Backbone.View.extend({
	className: 'container',

	id: 'myOrders-container',

	template: _.template($("#myOrdersView-template").html()),

	events: {
		'click .next': 'next',
		'click .history-loader': 'loadHistory'
	},

	initialize: function() {
		$(window).scrollTop(0);
		var that = this;

		var now = new Date();
		this.cur_date = parseInt(now.getFullYear() + "" + sc.normalizeNumber(now.getMonth() + 1) + "" + sc.normalizeNumber(now.getDate()));
		this.cur_time = now.getHours();

		$.ajax({
			url: $('base').attr('src') + 'orders/' + this.cur_date + '.json',

			success: function(data) {
				that.rt_data = data.rt_obj.data;
				that.date = data.rt_obj.date;
				that.code = data.rt_obj.code;

				$(".main-container").append(that.render().el);
				sc.dropdown('myOrders-container', '.user');
			},

			error: function() {
				console.log("error");
			}
		});
	},

	render: function() {
		this.$el.html(this.template());

		if (this.code != 2) {
			this.parseOrder();
		}

		return this;
	},

	next: function() {
		// if ($("#menu-container").length > 0) {
		// 	this.$el.hide();
		// 	$("#menu-container").show();
		// } else {
		// 	window.location.reload();
		// }
		window.location.reload();
	},

	loadHistory: function() {
		var that = this;

		if (this.code != 2) {
			$.ajax({
				url: $('base').attr('src') + 'orders/' + that.date + ".json",

				success: function(data) {
					that.rt_data = data.rt_obj.data;
					that.date = data.rt_obj.date;
					that.code = data.rt_obj.code;

					if (that.code != 2) {
						that.parseOrder();
					}
				},

				error: function() {
					console.log("error");
				}
			});
		}
	},

	parseOrder: function() {
		if (this.code != 1 && this.code != 2) {
			if (this.rt_data.cart || this.rt_data.tuan) {
				var oneDayOrderView = new app.OneDayOrderView();
				this.$el.find('.myOrderList').append(oneDayOrderView.render().el);
			}

			if (this.rt_data.cart) {
				var order = new app.Order(this.rt_data.cart);
				var status = " 处理中";
				// 服务器传过来的数据是订单日期减去1，那么配送日期应该加2
				var deliver_date = this.getDateStr(this.date, 2);
				if (this.cur_date > deliver_date) {
					status = " 已配送";
				} else if (this.cur_date == deliver_date) {
					if (this.cur_time < 6) {
						status = " 采购中";
					} else if (this.cur_time >= 6 && this.cur_time < 16) {
						status = " 已采购";
					} else if (this.cur_time >= 16 && this.cur_time < 19) {
						status = " 配送中";
					} else if (this.cur_time >= 19) {
						status = " 已配送";
					}
				}
				order.set('order_status', (this.getDateStr(this.date, 1)) + status);
				order.set('cart_id', this.rt_data.cart_id);
				order.set('cart_total', this.rt_data.cart_total);

				var itemOrderView = new app.ItemOrderView({
					model: order,
					status: status
				});

				oneDayOrderView.$el.find('.orderResult-form').append(itemOrderView.render().el);

				for (var i = 0; i < this.rt_data.cart.length; i++) {
					var item = new app.Item(this.rt_data.cart[i]);
					item.set('count', parseInt(item.get('Cart').count));
					item.set('total', item.get('count') * parseInt(item.get('Material').price));
					item.set('total', item.get('Material').price);

					var resultItemView = new app.ResultItemView({
						model: item

					});
					itemOrderView.$el.find('ul').append(resultItemView.render().el);
				};
			}

			if (this.rt_data.tuan) {
				var parsedObj = this.divideTuan(this.rt_data.tuan);
				for (var k in parsedObj) {
					oneDayOrderView.$el.find('.orderResult-form').append("<div class=\"dotted-divider\"></div>");

					// 服务器传过来的数据是订单日期减去1，那么配送日期应该加2
					var status = " 处理中";
					var deliver_date = parsedObj[k][0].Tutetuan.deliver_date;//this.getDateStr(this.date, 2);
					if (this.cur_date > deliver_date) {
						status = " 已配送";
					} else if (this.cur_date == deliver_date) {
						if (this.cur_time < 6) {
							status = " 采购中";
						} else if (this.cur_time >= 6 && this.cur_time < 16) {
							status = " 已采购";
						} else if (this.cur_time >= 16 && this.cur_time < 19) {
							status = " 配送中";
						} else if (this.cur_time >= 19) {
							status = " 已配送";
						}
					}
					var order = new app.Order(this.rt_data.tuan);
					order.set('tuan_id', this.rt_data.tuan_id);
					order.set('order_status', (this.getDateStr(this.date, 1)) + status);
					order.set('tuan_total', parsedObj[k].total);

					var tuanOrderView = new app.TuanOrderView({
						model: order,
						status: status
					});

					oneDayOrderView.$el.find('.orderResult-form').append(tuanOrderView.render().el);

					for (var i = 0; i < parsedObj[k].length; i++) {
						// var tuan = new app.Tuan(this.rt_data.tuan[i]);
						// tuan.set('count', parseInt(tuan.get('TutetuanCart').number));
						// tuan.set('total', tuan.get('count') * parseInt(tuan.get('Tutetuan').price));

						// var resultTuanView = new app.ResultTuanView({
						// 	model: tuan
						// });
						// tuanOrderView.$el.find('ul').append(resultTuanView.render().el);
						var tuan = new app.Tuan(parsedObj[k][i]);
						tuan.set('count', parseInt(tuan.get('TutetuanCart').number));
						tuan.set('total', tuan.get('count') * parseInt(tuan.get('Tutetuan').price));
						tuan.set('total', tuan.get('Tutetuan').price);

						var resultTuanView = new app.ResultTuanView({
							model: tuan
						});
						tuanOrderView.$el.find('ul').append(resultTuanView.render().el);
					};
				}

			}
		}
	},

	getDateStr: function(date, AddDayCount) {
		date = "" + date;
		var year = date.substr(0, 4);
		var month = date.substr(4, 2);
		var day = date.substr(6, 2);
		var dd = new Date(year, month, day);
		dd.setDate(dd.getDate() + AddDayCount); //获取AddDayCount天后的日期
		var y = dd.getFullYear();
		var m = dd.getMonth(); //获取当前月份的日期
		if (m < 10) {
			m = "0" + m;
		}
		var d = dd.getDate();
		if (d < 10) {
			d = "0" + d;
		}
		return parseInt(y + "" + m + "" + d);
	},

	divideTuan: function(tuan) {		
		var idArr = new Array();
		var rt_obj = {};

		for (var i = 0; i < tuan.length; i++) {
			if (idArr.indexOf(tuan[i].Tutetuan.id) == -1) {
				idArr.push(tuan[i].Tutetuan.id);
				rt_obj["tuan_" + tuan[i].Tutetuan.id] = new Array();
				rt_obj["tuan_" + tuan[i].Tutetuan.id].total = 0;
				rt_obj["tuan_" + tuan[i].Tutetuan.id].push(tuan[i]);
			} else {
				rt_obj["tuan_" + tuan[i].Tutetuan.id].push(tuan[i]);
			}

			rt_obj["tuan_" + tuan[i].Tutetuan.id].total += parseInt(tuan[i].TutetuanCart.number) * parseInt(tuan[i].Tutetuan.price);
		}	

		return rt_obj;
	}
});

app.OneDayOrderView = Backbone.View.extend({
	template: _.template($('#oneDayOrderView-template').html()),

	render: function() {
		this.$el.html(this.template());

		return this;
	}
});

app.ItemOrderView = Backbone.View.extend({
	template: _.template($('#itemOrderView-template').html()),

	events: {
		'click .cancelOrder': 'cancelOrder'
	},

	initialize: function(options) {
		if (options != undefined) {
			this.status = options.status;
		}
	},

	render: function() {
		this.$el.html(this.template(this.model.toJSON()));

		if (this.status && this.status.trim() == "已配送") {
			this.$el.find('.cancelOrder').remove();
		}

		return this;
	},

	cancelOrder: function() {
		var that = this;
		var cart_id = this.model.get('cart_id');

		if (that.status.trim() == "处理中" || that.status.trim() == "采购中") {
			var confirm = new app.OrderConfirmPopupView({
				msg: '确定取消订单吗？'
			}, {
				url: $('base').attr('src') + 'orders/delete/' + cart_id,
				method: 'post',
				success: function(data) {
					var data = eval('(' + data + ')');
					if (data.code == 1) {
						var popup = new app.OrderInfoPopupView({
							msg: data.msg
						});
						$('#myOrders-container').append(popup.render().el);
					} else {
						if (data.msg == "订单删除成功") {
							var popup = new app.OrderInfoPopupView({
								msg: data.msg
							});
							$('#myOrders-container').append(popup.render().el);
							that.$el.remove();
						} else {
							var popup = new app.OrderInfoPopupView({
								msg: data.msg
							});
							$('#myOrders-container').append(popup.render().el);
						}
					}
				},
				error: function(data) {
					console.log(data);
				}
			});
			$('#myOrders-container').append(confirm.render().el);
		} else if (that.status.trim() == "已采购") {
			var confirm = new app.OrderConfirmPopupView({
				msg: '您的订单我们已采购',
				tips: '现在取消会造成我们的损失',
				yesLabel: '取消订单',
				noLabel: '保留订单'
			}, {
				url: $('base').attr('src') + 'orders/delete/' + cart_id,
				method: 'post',
				success: function(data) {
					var data = eval('(' + data + ')');
					if (data.code == 1) {
						var popup = new app.OrderInfoPopupView({
							msg: data.msg
						});
						$('#myOrders-container').append(popup.render().el);
					} else {
						if (data.msg == "订单删除成功") {
							var popup = new app.OrderInfoPopupView({
								msg: data.msg
							});
							$('#myOrders-container').append(popup.render().el);
							that.$el.remove();
						} else {
							var popup = new app.OrderInfoPopupView({
								msg: data.msg
							});
							$('#myOrders-container').append(popup.render().el);
						}
					}
				},
				error: function(data) {
					console.log(data);
				}
			});
			$('#myOrders-container').append(confirm.render().el);
		} else if (that.status.trim() == "配送中") {
			var popup = new app.OrderInfoPopupView({
				msg: '您的订单已经开始配送'
			});
			$('#myOrders-container').append(popup.render().el);
		} else if (that.status.trim() == "已配送") {
			var popup = new app.OrderInfoPopupView({
				msg: '订单已经配送成功，不能取消'
			});
			$('#myOrders-container').append(popup.render().el);
		}
	}
});

app.TuanOrderView = Backbone.View.extend({
	template: _.template($('#tuanOrderView-template').html()),

	events: {
		'click .cancelOrder': 'cancelOrder'
	},

	initialize: function(options) {
		if (options != undefined) {
			this.status = options.status;			
		}
	},

	render: function() {
		this.$el.html(this.template(this.model.toJSON()));

		if (this.status && this.status.trim() == "已配送") {
			this.$el.find('.cancelOrder').remove();
		}

		return this;
	},

	cancelOrder: function() {
		var that = this;
		var tuan_id = this.model.get('tuan_id');

		if (that.status.trim() == "采购中" || that.status.trim() == "处理中") {
			var confirm = new app.OrderConfirmPopupView({
				msg: '确定取消订单吗？'
			}, {
				url: $('base').attr('src') + 'orders/delete/' + tuan_id,
				method: 'post',
				success: function(data) {
					var data = eval('(' + data + ')');
					if (data.code == 1) {
						var popup = new app.OrderInfoPopupView({
							msg: data.msg
						});
						$('#myOrders-container').append(popup.render().el);
					} else {
						if (data.msg == "订单删除成功") {
							var popup = new app.OrderInfoPopupView({
								msg: data.msg
							});
							$('#myOrders-container').append(popup.render().el);
							that.$el.remove();
						} else {
							var popup = new app.OrderInfoPopupView({
								msg: data.msg
							});
							$('#myOrders-container').append(popup.render().el);
						}
					}
				},
				error: function(data) {
					console.log(data);
				}
			});
			$('#myOrders-container').append(confirm.render().el);
		} else if (that.status.trim() == "已采购") {
			var confirm = new app.OrderConfirmPopupView({
				msg: '您的订单我们已采购',
				tips: '现在取消会造成我们的损失',
				yesLabel: '取消订单',
				noLabel: '保留订单'
			}, {
				url: $('base').attr('src') + 'orders/delete/' + cart_id,
				method: 'post',
				success: function(data) {
					var data = eval('(' + data + ')');
					if (data.code == 1) {
						var popup = new app.OrderInfoPopupView({
							msg: data.msg
						});
						$('#myOrders-container').append(popup.render().el);
					} else {
						if (data.msg == "订单删除成功") {
							var popup = new app.OrderInfoPopupView({
								msg: data.msg
							});
							$('#myOrders-container').append(popup.render().el);
							that.$el.remove();
						} else {
							var popup = new app.OrderInfoPopupView({
								msg: data.msg
							});
							$('#myOrders-container').append(popup.render().el);
						}
					}
				},
				error: function(data) {
					console.log(data);
				}
			});
			$('#myOrders-container').append(confirm.render().el);
		} else if (that.status.trim() == "配送中") {
			var popup = new app.OrderInfoPopupView({
				msg: '您的订单已经开始配送'
			});
			$('#myOrders-container').append(popup.render().el);
		} else if (that.status.trim() == "已配送") {
			var popup = new app.OrderInfoPopupView({
				msg: '订单已经配送成功，不能取消'
			});
			$('#myOrders-container').append(popup.render().el);
		}
	}
});