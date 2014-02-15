/*
 *	Description	:	A view to render popup window.
 *	Name		:	popupView.js
 *	Author		:	Rathinho Zhang
 */

var app = app || {};

app.OrderInfoPopupView = Backbone.View.extend({
	className: 'popup',

	id: 'orderInfo-popup',

	template: _.template($("#orderInfoPopupView-template").html()),

	events: {
		'click button': 'close'
	},

	initialize: function(options) {
		this.msg = options.msg;
	},

	render: function() {
		this.$el.html(this.template());
		this.$el.find('.popup-header').append(this.msg);

		var that = this;
		setTimeout(function(){
			that.close();
		}, 2000);
		return this;
	},

	close: function() {
		this.$el.remove();
	}
});

app.OrderConfirmPopupView = Backbone.View.extend({
	className: 'popup',

	id: 'orderConfirm-popup',

	template: _.template($("#orderConfirmPopupView-template").html()),

	events: {
		'click #yes': 'submit',
		'click #no': 'close',
	},

	initialize: function(options, ajaxSetting) {
		if (options != undefined) {
			if (options.msg) this.msg = options.msg;
			if (options.tips) this.tips = options.tips;
			if (options.yesLabel) this.yesLabel = options.yesLabel;
			if (options.noLabel) this.noLabel = options.noLabel;
		}

		if (ajaxSetting != undefined) {
			this.ajaxSetting = ajaxSetting;
		}
	},

	render: function() {
		this.$el.html(this.template());

		if (this.msg) 
			this.$el.find('.popup-header').append(this.msg);

		if (this.tips) 
			this.$el.find('.popup-tips').append(this.tips);

		if (this.yesLabel) 
			this.$el.find('#yes').html(this.yesLabel);

		if (this.noLabel) 
			this.$el.find('#no').html(this.noLabel);

		return this;
	},

	submit: function() {
		var that = this;
		$.ajax(that.ajaxSetting);

		this.$el.remove();
	},

	close: function() {
		this.$el.remove();
	}
});