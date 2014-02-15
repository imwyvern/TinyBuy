/*
 *	Description	:	A model to store information of a user.
 *	Name		:	user.js
 *	Author		:	Rathinho Zhang
 */

var app = app || {};

app.User = Backbone.Model.extend({
	defaults: {
		wechatId: "",
		name: "",
		address: "",
		phone: "",
		remark: ""
	},

	initialize: function() {
		// console.log("A user model has been created!");

		this.on("invalid", function(model, error) {
			console.log(error);
		});
	},

	validate: function(attrs) {
		
	}
});
