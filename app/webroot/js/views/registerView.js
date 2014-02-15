/*
 *	Description	:	A view to render login form.
 *	Name		:	loginView.js
 *	Author		:	Rathinho Zhang
 */

var app = app || {};

app.RegisterView = Backbone.View.extend({
	className: 'container',

	id: 'register-container',

	template: _.template($("#registerView-template").html()),

	events: {
		'click #register': 'register',
		'click .back': 'back'
	},

	initialize: function(options) {
		if (options && options.backTo) {
			this.backTo = options.backTo;
		}

		$('.main-container').append(this.render().el);

		//$(window).resize(function() {
		//	$(window).scrollTop(214);
		//});
	},

	render: function() {
		this.$el.html(this.template());

		return this;
	},

	register: function() {
		var that = this;
		if (that.inputValidate()) {
			console.log('validate success');
			$.ajax({
				url: $('base').attr('src') + 'home/register/' + that.getUuid(),
				
				type: 'post',

				data: {
					'username': that.$el.find('input[name=account]').val(),
					'password': that.$el.find('input[name=password]').val(),
					'email': that.$el.find('input[name=email]').val()
				},

				success: function(data) {
					var data = eval('(' + data + ')');

					if (data.code == 0) {
						var popupView = new app.OrderInfoPopupView({msg: '注册成功, 3秒后自动登录'});
						that.$el.append(popupView.render().el);
						setTimeout(function() {
							that.$el.remove();
							user_status = "CUSTOMER";
							//document.cookie = "wechat_id=" + current_user;
							setCookie("wechat_id", current_user, 100);
							$("#" + that.backTo).show();
						}, 3000);
					} else if (data.code == 1) {
						var popupView = new app.OrderInfoPopupView({msg: data.msg});
						that.$el.append(popupView.render().el);
					} else if (data.code == 2) {
						var popupView = new app.OrderInfoPopupView({msg: data.msg});
						that.$el.append(popupView.render().el);
					}
				},

				error: function() {
					console.log('ajax error');
				}
			});
		}
		// } else {
		// 	var popup = new app.OrderInfoPopupView({msg: '密码或邮箱地址不符合要求'});
		// 	that.$el.append(popup.render().el);
		// }
	},

	back: function() {
		var that = this;
 		that.$el.remove();
 		$('#' + that.backTo).show();
 	},

	inputValidate: function() {
		var that = this;
		var un = that.$el.find('input[name=account]').val(),
			pw = that.$el.find('input[name=password]').val(),
			repw = that.$el.find('input[name=repassword]').val(),
			email = that.$el.find('input[name=email]').val();

		var pwPattern = /^(\w){6,20}$/,
			emailPattern = /^(\w)+(\.\w+)*@(\w)+((\.\w+)+)$/;
		if (un == "") {
			var popup = new app.OrderInfoPopupView({msg: '用户名不能为空'});
			that.$el.append(popup.render().el);
			return false;
		} else if (!pwPattern.exec(pw)) {
			var popup = new app.OrderInfoPopupView({msg: '密码长度不符合要求（6-20位）'});
			that.$el.append(popup.render().el);
			return false;
		} else if (pw !== repw) {
			var popup = new app.OrderInfoPopupView({msg: '两次输入的密码不一致'});
			that.$el.append(popup.render().el);
			return false;
		} else if (!emailPattern.exec(email)) {
			var popup = new app.OrderInfoPopupView({msg: '邮箱地址不正确'});
			that.$el.append(popup.render().el);
			return false;
		} else if (pwPattern.exec(pw) && emailPattern.exec(email) && (pw === repw)) {
			return true;
		}
		return false;
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
});