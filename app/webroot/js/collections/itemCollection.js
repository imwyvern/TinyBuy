/*
 *	Description	:	A collection to store items.
 *	Name		:	itemCollection.js
 *	Author		:	Rathinho Zhang
 */

var app = app || {};

app.ItemCollection = Backbone.Collection.extend({
	model: app.Item,
});