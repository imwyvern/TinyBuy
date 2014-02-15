/*
 *	Description	:	A view to render list of tuans.
 *	Name		:	tuanListview.js
 *	Author		:	Rathinho Zhang
 */

var app = app || {};

app.TuanListView = Backbone.View.extend({
	className: 'tuans',

	hasPic: false,

	initialize: function(options) {
		this.count = 0;
		this.hasPic = options.hasPic;
		$(".main").append(this.render().el);
	},

	render: function() {
		var that = this;
		var length = this.model.length;
		var models = this.model.models;
		var bigCount = 0;

		for (var i = 0; i < length; i++) {
			if (that.hasPic) {
				var tuanView = new app.TuanView({model: models[i]});
				var $el = $(tuanView.render().el);
				$el.addClass('large');
				$el.find('.select-shadow').addClass('large');

				that.$el.append($el);
			} else {
				var tuanView = new app.TuanViewWithoutImg({model: models[i]});
				var $el = $(tuanView.render().el);
				$el.addClass('large');
				$el.find('.select-shadow-no-img').addClass('large');

				that.$el.append($el);
			}
		};
		// for (var i = 0; i < length; i++) {
		// 	if (models[i].get('Cookbook').priority == "1" || models[i].get('Cookbook').priority == "2") {
		// 		bigCount++;
		// 	}

		// 	if ((bigCount == 0 && that.count < 4) || (bigCount == 1 && that.count < 3) || (bigCount == 2 && that.count < 4) || (bigCount == 3 && that.count < 3)) {
		// 		if (that.hasPic) {
		// 			var itemview = new app.ItemView({
		// 				model: models[i]
		// 			});
		// 			var $el = $(itemview.render().el);

		// 			if (models[i].get('Cookbook').priority == "1" || models[i].get('Cookbook').priority == "2") {
		// 				$el.addClass('large');
		// 				$el.find('.select-shadow').addClass("large");
		// 			}					
		// 		} else {
		// 			var itemview = new app.ItemViewWithoutImg({
		// 				model: models[i]
		// 			});
		// 			var $el = $(itemview.render().el);

		// 			if (models[i].get('Cookbook').priority == "1" || models[i].get('Cookbook').priority == "2") {
		// 				$el.addClass('large');
		// 				// $el.find('.select-shadow-no-img').addClass("large");
		// 			}
		// 		}

		// 		that.$el.append($el);
		// 		that.count++;
		// 	}
		// }

		// // 监听窗口滚动事件，在滚动到底部时加载更多菜谱
		// $(window).scroll(function() {
		// 	var $body = $("body");

		// 	if (($(window).height() + $(window).scrollTop()) >= $body.height()) {
		// 		$("#page_tag_load").show();
		// 		setTimeout(insertMoreItem, 1000);
		// 	}
		// });

		// var insertMoreItem = function() {
		// 	var $main = $("#" + that.id);

		// 	// 每次滚动加载4个菜谱
		// 	for (var i = 0; i < 4 && that.count < length; i++) {
		// 		if (that.hasPic) {
		// 			var itemView = new app.ItemView({
		// 				model: models[that.count]
		// 			});
		// 		} else {
		// 			var itemView = new app.ItemViewWithoutImg({
		// 				model: models[that.count]
		// 			});
		// 		}
				
		// 		$main.append(itemView.render().el);

		// 		// 判断priority是否大于0，若是则显示为large
		// 		if (models[that.count].get('Cookbook').priority == "1" || models[that.count].get('Cookbook').priority == "2") {
		// 			$("#item-" + item.get('Cookbook').id).addClass('large');
		// 			$("#item-" + item.get('Cookbook').id).find('.select-shadow').addClass("large");
		// 		}

		// 		that.count++;
		// 		console.log(that.count);
		// 	};

		// 	// 隐藏“加载中..”
		// 	$("#page_tag_load").hide();
		// }

		return this;
	}
});