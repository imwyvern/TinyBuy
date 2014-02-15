/*
 *	Description	:	A view to render delivery information.
 *	Name		:	deliveryView.js
 *	Author		:	Rathinho Zhang
 */

var app = app || {};

app.DeliveryView = Backbone.View.extend({
	className: 'container',

	id: 'delivery-container',

	template: _.template($("#deliveryView-template").html()),

	events: {
		'click .back': 'back',
		'click .next': 'next',
	},

	initialize: function() {
		$(window).scrollTop(0);
		$(".main-container").append(this.render().el);

		var payment = new app.Payment();
		var paymentView = new app.PaymentView({model: payment});

		this.$el.find('.confirmation-form').after(paymentView.render().el);
		sc.dropdown('delivery-container', ".user");
	},

	render: function() {
		this.$el.html(this.template(this.model.toJSON()));

		return this;
	},

	back: function() {
		this.$el.css('display', 'none');

		$('#order-container').css('display', 'block');
	},

	next: function() {
		var that = this;
		var pass = true;

		if (this.userInfoChanged) {
			pass = this.updateUserInfo();
		}

		if (current_user === sc.getWechatId()) {
			if (pass) {
				var postData = this.extractData();

				$.ajax({
					url: $('base').attr('src') + 'orders/add/' + new Date().getTime(),

					method: 'post',

					data: postData,

					success: function(data) {
						var data = eval("("+data+")");

						that.$el.css('display', 'none');

						if (data.data.cart_id) {
							app.shoppingCart.set('cart_id', data.data.cart_id);
						} else {
							app.shoppingCart.set('cart_id', "");					
						}

						if (data.data.tuan_id) {
							app.shoppingCart.get('tuans').forEach(function(tuan) {
								tuan.set('tuan_id', data.data.tuan_id);
							});
						} else {
							app.shoppingCart.get('tuans').forEach(function(tuan) {
								tuan.set('tuan_id', "");
							});
						}

						var orderResultView = new app.OrderResultView({model: app.shoppingCart});
					},

					error: function(data) {
						console.log(data);
					}
				});
			}
		} else if (current_user && user_status == "NEW_USER"){
			that.$el.hide();
			app.registerView = new app.RegisterView({backTo: "delivery-container"});
		} else if (current_user && user_status == "CUSTOMER") {
			that.$el.hide();
			app.loginView = new app.LoginView({backTo: "delivery-container"});
		} else if (current_user == undefined) {
			var pop = new app.OrderInfoPopupView({msg: '错误的用户，请重新关注小农女送菜^_^'});
			that.$el.append(pop.render().el);
		}
	},

	updateUserInfo: function() {
		var that = this;
		var telPattern = /^1[3|4|5|8][0-9]{9}$/;
		var tel = that.$el.find('input[name=tel]').val(),
			username = that.$el.find('input[name=username]').val(),
			addr = that.$el.find('input[name=addr]').val();


		if (telPattern.exec(tel) && username != "" && addr != "") {
			$.ajax({
				url: $('base').attr('src') + 'customers/edit/' + this.getUuid(),

				method: 'post',

				data: {
					'Customer': {
						'wechat_id': that.getWechatId(),
						'name': that.$el.find('input[name=username]').val(),
						'phone': that.$el.find('input[name=tel]').val(),
						'location': that.$el.find('select[name=district]').val() +"-"+ that.$el.find('input[name=addr]').val(),
						'remark': that.$el.find('input[name=note]').val()
					}
				},

				success: function(data) {
					that.userInfoChanged = true;
				},

				error: function() {
					console.log('error');
				}
			});

			return true;
		} else if (username == "") {
			that.$el.find('input[name=username]').css('color', 'red');
			that.$el.find('input[name=username]').focus();

			that.$el.find('input[name=username]').bind('change', function() {
				$(this).css('color', 'black');
				$(this).unbind('change');
			});
			return false;
		} else if (!telPattern.exec(tel)){
			that.$el.find('input[name=tel]').css('color', 'red');
			that.$el.find('input[name=tel]').focus();

			that.$el.find('input[name=tel]').bind('change', function() {
				$(this).css('color', 'black');
				$(this).unbind('change');
			});
			return false;
		} else if (addr == "") {
			that.$el.find('input[name=addr]').css('color', 'red');
			that.$el.find('input[name=addr]').focus();

			that.$el.find('input[name=addr]').bind('change', function() {
				$(this).css('color', 'black');
				$(this).unbind('change');
			});
			return false;
		}	
	},

	getUuid: function() {
		return (function() {
			var search = window.location.search;
			var arrStr = search.substr(1, search.length).split('&');

			for (var i = 0; i < arrStr.length; i++) {
				var temp = arrStr[i].split('=');

				if (temp[0] == 'code') {
					return unescape(temp[1]);
				}
			}
		})();
	},

	getWechatId: function() {
		return (function() {
			var arrStr = document.cookie.split("; ");
			for (var i = 0; i < arrStr.length; i++) {
				var temp = arrStr[i].split("=");

				if (temp[0] == 'wechat_id')
					return unescape(temp[1]);
			}
		})();
	},

	userInfoChanged: function() {
		return true;
	},

	extractData: function() {
		var order = app.shoppingCart;

		var data = {
			Cart: [],
			Tuan: [],
		};

		order.get('items').forEach(function(item) {
			var arr = {};

			arr.cookbook_id = item.get('Cookbook').id;
			arr.material_id = item.get('Material').id;
			arr.count = item.get('count');

			data.Cart.push(arr);
		});

		order.get('tuans').forEach(function(tuan) {
			var arr = {};

			arr.id = tuan.get('Tutetuan').id;
			arr.count = tuan.get('count');

			data.Tuan.push(arr);
		});

		return data;
	}
});