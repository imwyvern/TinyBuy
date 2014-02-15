/*
 *	Description	:	A model to store information of goods item.
 *	Name		:	item.js
 *	Author		:	Rathinho Zhang
 */

var app = app || {};

app.Item = Backbone.Model.extend({
	defaults: {
		id: "",
		cookbook: "",
		material: "",
		count: 0,
		total: 0
	},

	initialize: function() {
		// console.log("a new item has been created!");
		this.set('id', this.get('Material').id);

		this.on("invalid", function(model, error) {
			console.log(error);
		});
	},

	validate: function(attrs) {
		// if (typeof attrs.price !== "number") {
		// 	return "price must be a number";
		// } else if (typeof attrs.price === "number" && attrs.price < 0) {
		// 	return "price can not be less than zero";
		// } else if (typeof attrs.amount !== "number") {
		// 	return "amount must be a number";
		// } else if (typeof attrs.amount === "number" && attrs.amount < 0) {
		// 	return "amount can't be less than zero";
		// }
	}
});