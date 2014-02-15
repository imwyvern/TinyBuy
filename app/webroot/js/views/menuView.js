/*
 *	Description	:	A view to render list of items.
 *	Name		:	menuView.js
 *	Author		:	Rathinho Zhang
 */

var app = app || {};

app.MenuView = Backbone.View.extend({
	className: 'container',

	id: 'menu-container',

	template: _.template($("#menuView-template").html()),

	events: {
		'click #vegetable': 'showVegetables',
		'click #meat': 'showMeat',
		'click #soup': 'showSoup',
		'click #speciality': 'showSpeciality'
	},

	hasPic: false,

	initialize: function() {
		// $(window).scrollTop(0);
		// $.ui.scrollToTop('menu-container');
		$(".main-container").append(this.render().el);
		sc.dropdown("menu-container",".user");
		sc.togglePic(".togglePic");
	},

	render: function() {
		this.$el.html(this.template("this.model.toJSON()"));
		return this;
	},

	setPic: function(hasPic) {
		this.hasPic = hasPic;
	},

	renderList: function(kind) {
		var list = items[kind];

		if (list) {
			var currentCollection = new app.ItemCollection();
			var mainId;

			for (var i = 0; i < list.length; i++) {
				if (kind != 3) {
					var item = new app.Item(list[i]);
					item.set('date', getDeliveryDate(item, kind));
					currentCollection.add(item);
				} else {
					var	tuan = new app.Tuan(list[i]);
					tuan.set('date', getDeliveryDate(tuan, kind) );
					currentCollection.add(tuan);
				}
				mainId = "items-" + kind;
			}

			if (kind == 0 || kind == 1 || kind == 2) {
				var itemListView = new app.ItemListView({model: currentCollection, id: mainId, hasPic: this.hasPic});	// 创建菜单列表视图	
			} else if (kind == 3) {
				var tuanListView = new app.TuanListView({model: currentCollection, id: mainId, hasPic: this.hasPic});	// 创建土特团列表视图
			}
		} else {
			// var emptyCollection = new app.ItemCollection();
			// var emptyListView = new app.ItemListView({model: emptyCollection});
			return ;
		}

		

		function getDeliveryDate (item, kind) {
			var timestamp;
			var dayArr = ['零', '一', '二', '三', '四', '五', '六', '日'];

			if (kind == "0" || kind == "1" || kind == "2") {
				timestamp = new Date();	// 获取当天时间
				var nextTimestamp = new Date(timestamp.getTime() + 86400000);
				var month = nextTimestamp.getMonth() + 1,
					date = nextTimestamp.getDate(),
					day = nextTimestamp.getDay();

				return month + "月" + date + "日";//周" + dayArr[day];
			} else if (kind == "3") {
				timestamp = new Date(parseInt(item.get('Tutetuan').time) * 1000);

				var month = timestamp.getMonth() + 1,
					date = timestamp.getDate(),
					day = timestamp.getDay();

				return month + "月" + date + "日";//周" + dayArr[day];
			}
		};
	},

	handleJSON: function(data, kind) {
		// data为空时渲染一个空白页面
		if (data === undefined) {
			var emptyCollection = new app.ItemCollection();
			var emptyListView = new app.ItemListView({model: emptyCollection});
			return;
		}

		var currentCollection = new app.ItemCollection();
		var mainId;

		// 加载所有菜谱并保存到相应类别的collection中
		for (var i = 0; i < data.length; i++) {			
			if (kind == "0") {
				var item = new app.Item(data[i]);
				item.set('date', getDeliveryDate(item, "0") );
				app.vegetableCollection.add(item);
				mainId = "items-0";
				currentCollection = app.vegetableCollection;
			} else if (kind == "1") {
				var item = new app.Item(data[i]);
				item.set('date', getDeliveryDate(item, "1") );
				app.meatCollection.add(item);
				mainId = "items-1";
				currentCollection = app.meatCollection;
			} else if (kind == "2") {
				var item = new app.Item(data[i]);
				item.set('date', getDeliveryDate(item, "2") );
				app.soupCollection.add(item);
				mainId = "items-2";
				currentCollection = app.soupCollection;
			} else if (kind == "3") {
				var	tuan = new app.Tuan(data[i]);
				tuan.set('date', getDeliveryDate(tuan, "3") );
				app.specialityCollection.add(tuan);
				mainId = "items-3";
				currentCollection = app.specialityCollection;
			}
		}

		if (kind == "0" || kind == "1" || kind == "2") {
			var itemListView = new app.ItemListView({model: currentCollection, id: mainId, hasPic: this.hasPic});	// 创建菜单列表视图	
		} else if (kind == "3") {
			var tuanListView = new app.TuanListView({model: currentCollection, id: mainId, hasPic: this.hasPic});	// 创建土特团列表视图
		}


		function getDeliveryDate (item, kind) {
			var timestamp;
			var dayArr = ['零', '一', '二', '三', '四', '五', '六', '日'];

			if (kind == "0" || kind == "1" || kind == "2") {
				timestamp = new Date();	// 获取当天时间
				var nextTimestamp = new Date(timestamp.getTime() + 86400000);
				var month = nextTimestamp.getMonth() + 1,
					date = nextTimestamp.getDate(),
					day = nextTimestamp.getDay();

				return month + "月" + date + "日";//周" + dayArr[day];
			} else if (kind == "3") {
				timestamp = new Date(parseInt(item.get('Tutetuan').time) * 1000);

				var month = timestamp.getMonth() + 1,
					date = timestamp.getDate(),
					day = timestamp.getDay();

				return month + "月" + date + "日";//周" + dayArr[day];
			}
		};
	},

	showVegetables: function() {
		$('.types ul li').removeClass('active');
		$('#vegetable').addClass('active');		//	为当前标签加上 active
		$('.items').hide();		//  隐藏其他类别的列表
		$('.tuans').hide();
		$(window).scrollTop(0);
		// 第一次点击tab时加载数据并插入到dom中，之后直接通过display来控制显示
		if ($('#items-0').length > 0) {
			$('#items-0').show();
		} else {
			this.renderList(0);
			// // ajax请求数据，回调函数为handleJSON();
			// $('.loader-mask').show();
			// $.ajax({
			// 	url: $("base").attr("src")+'items.json?kind=0',
			// 	method: 'get',
				
			// 	success: function(data){
			// 		var data = data.rt_obj.data;
			// 		setTimeout(function() {
			// 			$('.loader-mask').fadeOut(function() {
			// 				app.menuView.handleJSON(data, "0");
			// 			});
			// 		}, 100);
			// 	},
			// 	error: function(data){
			// 		console.log(data);
			// 	}
			// });
		}		
	},

	showMeat: function() {
		$('.types ul li').removeClass('active');
		$('#meat').addClass('active');
		$('.items').hide();
		$('.tuans').hide();
		$(window).scrollTop(0);
		if ($('#items-1').length > 0) {
			$('#items-1').show();
		} else {
			this.renderList(1);
			// $('.loader-mask').show();
			// $.ajax({
			// 	url: $("base").attr("src")+'items.json?kind=1',
			// 	method: 'get',
				
			// 	success: function(data){
			// 		var data = data.rt_obj.data;
			// 		setTimeout(function() {
			// 			$('.loader-mask').fadeOut(function() {
			// 				app.menuView.handleJSON(data, "1");
			// 			});
			// 		}, 100);
			// 	},
			// 	error: function(data){
			// 		console.log(data);
			// 	}
			// });
		}		
	},

	showSoup: function() {
		$('.types ul li').removeClass('active');
		$('#soup').addClass('active');
		$('.items').hide();
		$('.tuans').hide();
		$(window).scrollTop(0);
		if ($('#items-2').length > 0) {
			$('#items-2').show();
		} else {
			this.renderList(2);
			// $('.loader-mask').show();
			// $.ajax({
			// 	url: $("base").attr("src")+'items.json?kind=2',
			// 	method: 'get',
				
			// 	success: function(data){
			// 		var data = data.rt_obj.data;
			// 		setTimeout(function() {
			// 			$('.loader-mask').fadeOut(function() {
			// 				app.menuView.handleJSON(data, "2");
			// 			});
			// 		}, 100);
			// 	},
			// 	error: function(data){
			// 		console.log(data);
			// 	}
			// });
		}		
	},

	showSpeciality: function() {
		$('.types ul li').removeClass('active');
		$('#speciality').addClass('active');
		$('.items').hide();
		$(window).scrollTop(0);
		if ($('#items-3').length > 0) {
			$('#items-3').show();
		} else {
			this.renderList(3);
			// $('.loader-mask').show();
			// $.ajax({
			// 	url: $("base").attr("src")+'tuans.json',
			// 	method: 'get',
				
			// 	success: function(data){
			// 		console.log(data);
			// 		var data = data.rt_obj.data;
			// 		setTimeout(function() {
			// 			$('.loader-mask').fadeOut(function() {
			// 				app.menuView.handleJSON(data, "3");
			// 				console.log(data);
			// 			});
			// 		}, 100);
			// 	},
			// 	error: function(data){
			// 		console.log(data);
			// 	}
			// });
		}		
	}
});