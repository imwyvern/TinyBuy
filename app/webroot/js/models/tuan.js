/*
 *	Description	:	A model to store information of tutetuan item.
 *	Name		:	tuan.js
 *	Author		:	Rathinho Zhang
 */

var app = app || {};

app.Tuan = Backbone.Model.extend({
	defaults: {
		Tutetuan: "",
		count: 0,
		total: 0
	},

	initialize: function() {
		this.set('id', this.get('Tutetuan').id);

		this.on("invalid", function(model, error) {
			console.log(error);
		});
	},

	validate: function(attrs) {
	}
});