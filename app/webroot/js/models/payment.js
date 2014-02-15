/*
 *	Description	:	A model to store information of payment method.
 *	Name		:	payment.js
 *	Author		:	Rathinho Zhang
 */

var app = app || {};

app.Payment = Backbone.Model.extend({
	defaults: {
		online: {
			name: 'online',
			label: '在线支付',
			status: false
		},

		cool: {
			name: 'cool',
			label: '货到付款',
			status: false
		}
	},

	initialize: function() {
		// console.log("A payment model has been created!");
	}
});