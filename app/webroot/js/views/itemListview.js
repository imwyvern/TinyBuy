/*
 *	Description	:	A view to render list of items.
 *	Name		:	itemListview.js
 *	Author		:	Rathinho Zhang
 */

var app = app || {};

app.ItemListView = Backbone.View.extend({
	className: 'items',

	hasPic: false,

	viewCollection: null,

	initialize: function(options) {
		this.count = 0;
		this.hasPic = options.hasPic;
		this.viewCollection = new Array();
		$(".main").append(this.render().el);

		this.scrollToLoad();	//开启滚动加载图片
	},

	render: function() {
		var that = this;
		var length = this.model.length;
		var models = this.model.models;

		for (var i = 0; i < length; i++) {			
			if (that.hasPic) {
				var itemview = new app.ItemView({
					model: models[i]
				});
				var $el = $(itemview.render().el);

				if (models[i].get('Cookbook').priority == "1" || models[i].get('Cookbook').priority == "2") {
					$el.addClass('large');
					$el.find('.select-shadow').addClass("large");
				}

				that.viewCollection.push(itemview);
			} else {
				var itemview = new app.ItemViewWithoutImg({
					model: models[i]
				});
				var $el = $(itemview.render().el);

				if (models[i].get('Cookbook').priority == "1" || models[i].get('Cookbook').priority == "2") {
					$el.addClass('large');
					$el.find('.select-shadow-no-img').addClass("large");
				}
				that.viewCollection.push(itemview);
			}

			that.$el.append($el);
		}

		return this;
	},

	scrollToLoad: function() {
		// 确定默认加载图片数
		var that = this;
		var winHeight = $(window).height(),		// 当前窗口高度
			headerHeight = $('#menu-container').find('.header').height();				//	顶部栏高度
			marqueeHeight = $('#menu-container').find('.marquee').height();			//	跑马字幕高度
			footerHeight = $('#menu-container').find('.toolbar').height();				//	底部栏高度
			listInViewHeight = winHeight - headerHeight - footerHeight;		//	菜单列表可视区域高度
		var bigCount = 0,			//	大图数量  
			displayCount = 0;		//	默认显示的图片数量
		var anchor = marqueeHeight;	//	锚点高度，触发lazyLoad

		// 计算大图数量
		for (var i = 0; i < this.viewCollection.length; i++) {
			if (this.viewCollection[i].$el.hasClass('large')) {
				bigCount += 1;
			} else {
				break;
			}
		};

		// 计算默认显示的图片数量
		while (true) {
			if (bigCount > 0) {
				anchor	+= (246 + 20);
				bigCount --;
				displayCount ++;
			} else {
				anchor += (200 + 20);
				displayCount += 2;
			}			

			if (anchor > listInViewHeight) {
				break;
			}
		}

		// 默认加载图片
		for (var i = 0; i < displayCount ; i++) {
			this.viewCollection[i].imgLazyLoad();
		};
		
		// 绑定滚动事件，动态加载图片
		$(window).scroll(function(){
			for (var i = displayCount ; i < that.viewCollection.length ; i++) {
				var height = that.viewCollection[i].$el.height();
				var loadNum = 1;
				if (height == 200) {
					loadNum = 2;
				}

				if ($(window).scrollTop() + listInViewHeight >= that.viewCollection[i].$el.offset().top + 51) {
					if (loadNum == 1) {
						that.viewCollection[i].imgLazyLoad();
						displayCount++;
					} else if (loadNum == 2) {
						that.viewCollection[i++].imgLazyLoad();
						displayCount++;
						if (that.viewCollection[i]) {
							that.viewCollection[i].imgLazyLoad();
							displayCount++;
						}
					}
				}
			}
		});
	}
});