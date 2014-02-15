/*
 *	Description	:	A model to store information of transfee and discounts.
 *	Name		:	extra.js
 *	Author		:	Rathinho Zhang
 */

var app = app || {};

app.Extra = Backbone.Model.extend({
	defaults: {
		transfee: "",
		discounts: ""
	},

	initialize: function() {
		console.log("An extra model has been created!");
	}
});