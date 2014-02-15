/*
 *	Description	:	A view to render login form.
 *	Name		:	loginView.js
 *	Author		:	Rathinho Zhang
 */

var app = app || {};

app.ForgetView = Backbone.View.extend({
	className: 'container',

	id: 'forget-container',

	template: _.template($("#forgetPasswordView-template").html()),

	events: {
		'click #getPassword': 'submit',
		'click .back': 'back'
	},

	initialize: function() {
		$('.main-container').append(this.render().el);
	},

	render: function() {
		this.$el.html(this.template());

		return this;
	},

	submit: function() {
		var that = this;
		$.ajax({
			url: $('base').attr('src') + 'home/forget/' + that.getUuid(),

			method: 'post',

			data: {
				'username': $('#forget-container input[name=account]').val(),
				'email': $('#forget-container input[name=email]').val()
			},

			success: function(data) {
				var dataObj = eval("(" + data + ")");
				var popupView = new app.OrderInfoPopupView({msg: dataObj.message});
				that.$el.append(popupView.render().el);
			},

			error: function(data) {
				console.log(data);
				console.log('login failed');
			}
		});
	},

	back: function() {
		this.$el.remove();
		$('#login-container').show();
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