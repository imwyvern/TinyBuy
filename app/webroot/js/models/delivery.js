/*
 *	Description	:	A model to store information of delivery.
 *	Name		:	delivery.js
 *	Author		:	Rathinho Zhang
 */

var app = app || {};

app.Delivery = Backbone.Model.extend({
	defaults: {
		way: "",
		time: "",
	},

	initialize: function() {
		console.log("A delivery model has been created!");
	}
});