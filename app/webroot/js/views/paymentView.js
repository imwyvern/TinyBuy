/*
 *	Description	:	A view to render payment information.
 *	Name		:	paymentView.js
 *	Author		:	Rathinho Zhang
 */

var app = app || {};

app.PaymentView = Backbone.View.extend({
	className: 'payment',

	template: _.template($("#paymentView-template").html()),

	events: {
		'click #online-payment': 'selectOnline',
		'click #cool-payment': 'selectCool'
	},

	initialize: function() {
		//$(window).resize(function() {
		//	$(window).scrollTop(67);
		//});
	},

	render: function() {
		this.$el.html(this.template(this.model.toJSON()));

		return this;
	},

	selectOnline: function() {
		var popup = new app.OrderInfoPopupView({msg: '努力开发中，会在近期上线哦~ ^_^'});
		this.$el.append(popup.render().el);
	},

	selectCool: function(){
		this.$el.find('.radio').removeClass('selected');
		this.$el.find('#cool-payment > .radio').addClass('selected');
	}
});