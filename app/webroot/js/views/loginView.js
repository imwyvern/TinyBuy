/*
 *	Description	:	A view to render login form.
 *	Name		:	loginView.js
 *	Author		:	Rathinho Zhang
 */

var app = app || {};

app.LoginView = Backbone.View.extend({
	className: 'container',

	id: 'login-container',

	template: _.template($("#loginView-template").html()),

	events: {
		'click #login': 'login',
		'click #forget': 'getPassword',
		'click #signin': 'signIn',
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

	login: function() {
		var that = this;
		$(".login-tips").hide();
		$.ajax({
			url: $('base').attr('src') + 'home/login/' + that.getUuid(),

			method: 'post',

			data: {
				'username': $('input[name=account]').val(),
				'password': $('input[name=password]').val()
			},

			success: function(data) {
				var rt_obj = eval('(' + data + ')');

				if (rt_obj.code == 0) {
					//document.cookie = "wechat_id=" + current_user;	// set cookie
					setCookie("wechat_id", current_user, 100);
					that.$el.remove();
					$("#" + that.backTo).show();
                    $(".toolbar").css("left", 0);
				} else if (rt_obj.code == 2) {
					if (that.$el.find('.warning').length > 0) {
						
					} else {
						that.$el.find('.login-header').after("<p class=\"warning\">^_^用户名或密码错误，请重新输入</p>");
					}
				}
			},

			error: function(data) {
				console.log('login failed');
			}
		});
 	},

	getPassword: function() {
		this.$el.hide();
		var forgetView = new app.ForgetView();
		$(".main-container").append(forgetView.render().el);
	},

	signIn: function() {

	},

	back: function() {
		var that = this;
 		that.$el.remove();
 		$('#' + that.backTo).show();
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
