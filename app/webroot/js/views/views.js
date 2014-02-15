// Global namespace
var app = app || {};
app.priceNewLine = false;

// Item View Class
app.ItemView = Backbone.View.extend({
	className: 'item',

	template: _.template($('#item-template').html()),

	events: {
		'click .item-image': 'select',
		'click .select-shadow': 'unselect',
		'click .single-item-info': 'showDetail',
	},

	render: function() {
		// Declaration
		var priority, itemPrice, costLength, priceLength, totalWidth, itemWidth;

		// Render Template
		this.$el.html(this.template(this.model.toJSON()));

		// Set item Id
		this.$el.attr('id', 'item-' + this.model.get('id'));

		// Set item priority and show tips label accordingly
		priority = this.model.get('priority');
		switch(priority) {
			case '1': 
				this.$el.find('.item-title').append("<span class=\"hotsale\">今日特价</span>");
				break;
			case '2':
				this.$el.find('.item-title').append("<span class=\"hotsale\">今日推荐</span>");
				break;
			default:
				break;
		}

		// Caculate the width of window and that of Item View,
		// Then set flag to decide whether optimization mode will
		// Be on or off.
		itemPrice = this.$el.find('.item-price'),
		costLength = itemPrice.eq(0).text().trim().length,
		priceLength = itemPrice.eq(1).text().trim().length,
		totalWidth = (costLength - 3 + priceLength - 4) * 8 + 98,
		itemWidth = $(window).width() * 0.45;

		if (itemWidth < totalWidth + 30) {
			app.priceNewLine = true;
		}
		
		return this;
	},

	select: function() {
		// Show select-shadow
		this.showShadow();

		// Add to the shopping cart accordingly
		if(this.model.get('groupon')) {
			app.shoppingCart.get('tuans').add(this.model);
			app.shoppingCart.get('tuans').date = this.model.get('date');
		} else {
			app.shoppingCart.get('items').add(this.model);
			app.shoppingCart.get('items').date = this.model.get('date')
		}

		// Show ShoppingCart View
		if ($('.shopping-cart').css('display') === 'none') {
			$('.shopping-cart').css('display', 'block');
		}
	},

	unselect: function() {
		// Hide select-shadow
		this.hideShadow();

		// Remove from the shoppingCart accordingly
		if(this.model.get('groupon')) {
			app.shoppingCart.get('tuans').remove(this.model);
		} else {	
			app.shoppingCart.get('items').remove(this.model);
		}

		// Hide shoppingCart View if the shopping cart is empty 
		if (app.shoppingCart.get('count') == 0) {
			$('.shopping-cart').css('display', 'none');
		}
	},

	showShadow: function() {
		this.$el.find('.select-shadow').css('display', 'block');
	},

	hideShadow: function() {
		this.$el.find('.select-shadow').css('display', 'none');
	},

	imgLazyLoad: function() {
		var that = this,
			$img = that.$el.find('.item-image > img'),
			url = $img.attr('lazy-src'),
			priority = that.model.get('priority');

		// Load picture
		if (url !== undefined) {
			var img = new Image();
			img.onload = function() {
				$img.attr('src', url);
				
				resizePic();
			};
			img.src = url;
		}

		// Resize the picture to fit in the Item View
		function resizePic() {
			var winWidth = $(window).width(),
				picHeight = winWidth * 0.45 * 0.618,
				shadow = that.$el.find('.select-shadow');

			if (priority == '1' || priority == '2') {
				picHeight = winWidth * 0.95 * 0.618;
			}

			// Resize picture
			$img.css({
				'width': '100%',
				'height': picHeight + 'px',
				'margin-top': '3px'
			});

			// Resize shadown
			shadow.css('height', picHeight + 'px');
			shadow.find('.shadow-label').css('line-height', picHeight + 'px');


			// resize picture when resizing the window
			$(window).resize(function() {
				var winWidth = $(window).width(),
					picHeight = winWidth * 0.45 * 0.618,
					shadow = that.$el.find('.select-shadow');

				if (priority == '1' || priority == '2') {
					picHeight = winWidth * 0.95 * 0.618;
				}

				// Resize picture
				$img.css({
					'width': '100%',
					'height': picHeight + 'px',
					'margin-top': '3px'
				});

				// Resize shadow
				shadow.css('height', picHeight + 'px');
				shadow.find('.shadow-label').css('line-height', picHeight + 'px');
			});
		}
	},

	showDetail: function() {
		// Show detailed info of Item
		$(".container").css('display', 'none');

		var that = this,
			itemDetailView = new app.ItemDetailView({
			model: that.model,
			parent: that
		});
	}
});

// Login View Class
app.LoginView = Backbone.View.extend({
	className: 'container',

	id: 'login-container',

	template: _.template($("#loginView-template").html()),

	events: {
		'click #login': 'login',
		'click #forget': 'getPassword',
		'click #reg': 'signIn',
		'click .back': 'back'
	},

	initialize: function(options) {
		if (options && options.backTo) {
			this.backTo = options.backTo;
		}

		$('.main-container').append(this.render().el);
		$('#login').attr('disabled', false);
	},

	render: function() {
		this.$el.html(this.template());

		return this;
	},

	login: function() {
		var that = this;
		$(".login-tips").hide();

		// Disable the login button, prevent submitting repeatedly
		$("#login").attr('disabled', true);

		// Submit by ajax
		$.ajax({
			url: $('base').attr('src') + 'home/login/',
			type: 'post',
			data: {
				'username': $('input[name=account]').val(),
				'password': $('input[name=password]').val()
			},

			success: function(data) {
				var rt_obj = eval('(' + data + ')');

				if (rt_obj.code === 0) {
					setCookie("wechat_id", rt_obj.wechat_id, 100);
					setCookie("uuid", rt_obj.uuid, 100);
					set_user();					
					that.$el.find('.login-header').after("<p class=\"warning-success\">"+ app.config.loginSuccessText +"</p>");
					
					setTimeout(function() {
						that.$el.remove();
						$("#" + that.backTo).show();

						if (get_flag() === 0) {
							$("#myOrder").hide();
							$("#my_order_divider").hide();
							$("#addUser").show();
							$("#logout > a").text("登录");
						} else {
							$("#myOrder").show();
							$("#my_order_divider").show();
							$("#addUser").hide();
							$("#logout > a").text("退出登录");
						}
					}, 1000);					
				} else if (rt_obj.code === 1002) {
					if (that.$el.find('.warning').length > 0) {
						that.$el.find('.warning').fadeOut().fadeIn().fadeOut().fadeIn();
					} else {
						that.$el.find('.login-header').after("<p class=\"warning\">"+ app.config.loginFailedText +"</p>");
					}

					$('#login').attr('disabled', false);
				}
			},

			error: function(data) {
				console.log('login failed');
			}
		});
	},

	getPassword: function() {
		this.$el.hide();

		var forgetView = new app.ForgetView();
		$(".main-container").append(forgetView.render().el);
	},

	signIn: function() {
		this.$el.hide();

		var registerView = new app.RegisterView({
			backTo: "login-container"
		});
		$(".main-container").append(registerView.render().el);
	},

	back: function() {
		var that = this;

		that.$el.remove();
		$('#' + that.backTo).show();

		sc.goTop();
	},
});


// Register View Class
app.RegisterView = Backbone.View.extend({
	className: 'container',

	id: 'register-container',

	template: _.template($("#registerView-template").html()),

	events: {
		'click #register': 'register',
		'click .back': 'back'
	},

	initialize: function(options) {
		if (options && options.backTo) {
			this.backTo = options.backTo;
		}

		$('.main-container').append(this.render().el);
		$("#register").attr("disabled", false);
	},

	render: function() {
		this.$el.html(this.template());

		return this;
	},

	register: function() {
		var that = this;		

		// Submit by ajax
		if (that.inputValidate()) {
			// Disable the register button, prevent submitting repeatedly
			$("#register").attr("disabled", true);

			$.ajax({
				url: $('base').attr('src') + 'home/register/',
				type: 'post',
				data: {
					'username': that.$el.find('input[name=account]').val(),
					'password': that.$el.find('input[name=password]').val(),
					'email': that.$el.find('input[name=email]').val()
				},

				success: function(data) {
					var data = eval('(' + data + ')'),
						popupView;

					if (data.code === 0) {
						setCookie("wechat_id", data.wechat_id, 100);
						setCookie("uuid", data.uuid, 100);
						set_user();
						popupView = new app.OrderInfoPopupView({
							msg: app.config.registerSuccessText
						});
						that.$el.append(popupView.render().el);
						setTimeout(function() {
							window.location.reload();
						}, 3000);
					} else if (data.code == 1 || data.code == 2) {
						popupView = new app.OrderInfoPopupView({
							msg: data.msg
						});
						that.$el.append(popupView.render().el);

						$("#register").attr("disabled", false);
					}
				},

				error: function() {
					console.log('ajax error');
				}
			});
		}
	},

	back: function() {
		var that = this;

		that.$el.remove();
		$('#' + that.backTo).show();

		sc.goTop();
	},

	inputValidate: function() {
		var that = this,
			un = that.$el.find('input[name=account]').val(),
			pw = that.$el.find('input[name=password]').val(),
			repw = that.$el.find('input[name=repassword]').val(),
			email = that.$el.find('input[name=email]').val(),
			pwPattern = /^(\w){6,20}$/,
			emailPattern = /^(\w)+(\.\w+)*@(\w)+((\.\w+)+)$/,
			popup;

		if (un == "") {
			popup = new app.OrderInfoPopupView({
				msg: app.config.userNameErrorText
			});
			that.$el.append(popup.render().el);
			return false;
		} else if (!pwPattern.exec(pw)) {
			popup = new app.OrderInfoPopupView({
				msg: app.config.passwordErrorText
			});
			that.$el.append(popup.render().el);
			return false;
		} else if (pw !== repw) {
			popup = new app.OrderInfoPopupView({
				msg: app.config.repeatedPasswordErrorText
			});
			that.$el.append(popup.render().el);
			return false;
		} else if (!emailPattern.exec(email)) {
			popup = new app.OrderInfoPopupView({
				msg: app.config.emailErrorText
			});
			that.$el.append(popup.render().el);
			return false;
		} else if (pwPattern.exec(pw) && emailPattern.exec(email) && (pw === repw)) {
			return true;
		}
		return false;
	},
});

// Reset Password
app.ForgetView = Backbone.View.extend({
	className: 'container',

	id: 'forget-container',

	template: _.template($("#forgetPasswordView-template").html()),

	events: {
		'click #getPassword': 'submit',
		'click .back': 'back'
	},

	initialize: function() {
		$('.main-container').append(this.render().el);
	},

	render: function() {
		this.$el.html(this.template());
		return this;
	},

	submit: function() {
		var that = this;

		$.ajax({
			url: $('base').attr('src') + 'home/forget/',
			type: 'post',
			data: {
				'username': $('#forget-container input[name=account]').val(),
				'email': $('#forget-container input[name=email]').val()
			},

			success: function(data) {
				var dataObj = eval("(" + data + ")"),
					popupView = new app.OrderInfoPopupView({
					msg: dataObj.message
				});
				that.$el.append(popupView.render().el);
			},

			error: function(data) {
				console.log('login failed');
			}
		});
	},

	back: function() {
		this.$el.remove();
		$('#login-container').show();
		sc.goTop();
	},
});

// ItemDetailView Class
app.ItemDetailView = Backbone.View.extend({
	className: 'container',

	id: 'itemsdetail-container',

	template: _.template($('#itemDetailView-template').html()),

	events: {
		'click .back': 'back',
		'click .addItem': 'add'
	},

	initialize: function(options) {
		this.parent = options.parent;
		$(window).scrollTop(2);

		$('.main-container').append(this.render().el);
		sc.dropdown('itemsdetail-container', '.user');

		this.$el.append(new app.ShoppingCartView({
			model: app.shoppingCart
		}).render().el);

		// Show ShoppingCart View if the shopping cart is not empty
		if (app.shoppingCart.get('count') > 0) {
			if (this.$el.find('.shopping-cart').css('display') === 'none') {
				this.$el.find('.shopping-cart').css('display', 'block');
			}
		}
	},

	render: function() {
		this.$el.html(this.template(this.model.toJSON()));

		return this;
	},

	add: function() {
		var popup;

		// Add to the shopping cart
		if (app.shoppingCart.get('items').get(this.model.get('id'))) {
			popup = new app.OrderInfoPopupView({
				msg: app.config.itemInShoppingCartText
			});
			this.$el.append(popup.render().el);
		} else {
			this.parent.select();
		}
	},

	back: function() {
		this.$el.remove();
		$('#menu-container').css('display', 'block');
		sc.goTop();
	}
});

// ItemListView Class
app.ItemListView = Backbone.View.extend({
	className: 'items',

	hasPic: false,

	viewCollection: null,

	initialize: function(options) {
		this.count = 0;
		this.hasPic = options.hasPic;
		this.viewCollection = new Array();
		$(".main").append(this.render().el);

		this.scrollToLoad(); //Set mode 'lazyLoadPicture'
	},

	render: function() {
		var that = this,
			length = this.model.length,
			models = this.model.models,
			i, itemview, $el;

		for (i = 0; i < length; i++) {
			if (that.hasPic) {
				itemview = new app.ItemView({
					model: models[i]
				});
				$el = $(itemview.render().el);

				if (models[i].get('priority') == "1" || models[i].get('priority') == "2") {
					$el.addClass('large');
					$el.find('.select-shadow').addClass("large");
				}				

				that.viewCollection.push(itemview);
			} else {
				itemview = new app.ItemViewWithoutImg({
					model: models[i]
				});
				$el = $(itemview.render().el);

				if (models[i].get('priority') == "1" || models[i].get('priority') == "2") {
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
		var that = this,
			winHeight = $(window).height(), // 当前窗口高度
			headerHeight = $('#menu-container').find('.header').height(), //	顶部栏高度
			marqueeHeight = $('#menu-container').find('.marquee').height(), //	跑马字幕高度
			footerHeight = $('#menu-container').find('.toolbar').height(), //	底部栏高度
			listInViewHeight = winHeight - headerHeight - footerHeight, //	菜单列表可视区域高度
			bigCount = 0, //	大图数量  
			displayCount = 0, //	默认显示的图片数量
			anchor = marqueeHeight, //	锚点高度，触发lazyLoad
			i;

		// Caculate the number of large pictures
		for (i = 0; i < this.viewCollection.length; i++) {
			if (this.viewCollection[i].$el.hasClass('large')) {
				bigCount += 1;
			} else {
				break;
			}
		};

		// Cacultate the number of default pictures
		while (true) {
			if (bigCount > 0) {
				anchor += (246 + 20);
				bigCount--;
				displayCount++;
			} else {
				anchor += (200 + 20);
				displayCount += 2;
			}

			if (anchor > listInViewHeight) {
				break;
			}
		}

		// Load default number of pictures
		for (i = 0; i < displayCount; i++) {
			if (this.viewCollection[i])
				this.viewCollection[i].imgLazyLoad();
		};

		// Add listener to scroll event
		$(window).scroll(function() {
			for (var i = displayCount; i < that.viewCollection.length; i++) {
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

// ShoppingCart View Class
app.ShoppingCartView = Backbone.View.extend({

	template: _.template($("#shoppingCart-template").html()),

	events: {
		'click': 'enterShoppingCart'
	},

	render: function() {
		this.$el.html(this.template(this.model.toJSON()));
		return this;
	},

	enterShoppingCart: function() {
		// If checkTime is true
		if (this.checkTime()) {
			$('.container').css('display', 'none');

			var orderContainer = $('#order-container');

			// Show orderView
			if (orderContainer.length > 0) {
				orderContainer.remove();
				orderContainer = new app.OrderView({
					model: this.model
				});
			} else {
				orderContainer = new app.OrderView({
					model: this.model
				});
			}
		}	
	},

	checkTime: function() {
		var now = Math.round(new Date().getTime() / 1000),
			popup;
        var flag = false;
        if(app.time == undefined){
            flag = true
        }
		for (var i in app.times) {
			if (now > parseInt(app.times[i].beg_time) && now < parseInt(app.times[i].end_time)) {
				flag = true;
			}
		}
        if(!flag){
            popup = new app.OrderInfoPopupView({
                msg: app.times[i].content
            });
            this.getCurrentContainer().append(popup.render().el);
        }
        return flag;
	},

	getCurrentContainer: function() {
		var rtContainer = null;
		
		// Find currently displayed container 
		$('.container').each(function() {
			if ($(this).css('display') === 'block') {
				rtContainer = $(this);
				return;
			}
		});

		return rtContainer;
	}
});

// Menu View Class
app.MenuView = Backbone.View.extend({
	className: 'container',

	id: 'menu-container',

	template: _.template($("#menuView-template").html()),

	events: {
		'click #CtgOne': 'showCatagory',
		'click #CtgTwo': 'showCatagory',
		'click #CtgThree': 'showCatagory',
		'click #CtgFour': 'showCatagory',
		'click #Groupon': 'showCatagory'
	},

	hasPic: false,

	initialize: function() {
		$(".main-container").append(this.render().el);
		sc.dropdown("menu-container", ".user");
		sc.togglePic(".togglePic");
	},

	render: function() {
		this.$el.html(this.template("this.model.toJSON()"));
		return this;
	},

	setPic: function(hasPic) {
		this.hasPic = hasPic;
	},

	renderList: function(kind, isGroupon) {
		var currentCollection, mainId, item, itemListView,
			list = app.items[kind];
		
		// If isGroupon is true, set grouponList to list
		if (isGroupon) {
			list = app.grouponItems[kind];
		}

		// If list is not null, render it
		if (list) {
			currentCollection = new app.ItemCollection();

			for (var i = 0; i < list.length; i++) {
				item = new app.Item(list[i]);
				item.set('date', getDeliveryDate(item, kind));			
				currentCollection.add(item);
				mainId = "items-" + kind;

				if (isGroupon) {
					item.set('groupon', true);
					mainId = "groupons-" + kind;
				}
			}

			// Creat ItemListView
			itemListView = new app.ItemListView({
				model: currentCollection,
				id: mainId,
				hasPic: this.hasPic
			});

		} else {
			return;
		}


		// Assistant Function to get Date of Delivery 
		function getDeliveryDate(item, kind) {
			var timestamp, nextTimestamp, month, date, day,
				dayArr = ['零', '一', '二', '三', '四', '五', '六', '日'];

			if (kind == "0" || kind == "1" || kind == "2") {
				 // Get current Date
				timestamp = new Date();

				nextTimestamp = new Date(timestamp.getTime() + 86400000);
				month = nextTimestamp.getMonth() + 1,
				date = nextTimestamp.getDate(),
				day = nextTimestamp.getDay();

				return month + "月" + date + "日";
			}
		};
	},

	showCatagory: function(e) {
		// Get id of current catagory
		var id = e.srcElement.id;

		// Set current catagory active and hide other catagories
		$('.types ul li').removeClass('active');
		$('#' + id).addClass('active');
		$('.items').hide();
		$(window).scrollTop(0);

		// Display current catagory
		if ($('#items-' + "item_" + $("#" + id).attr("data")).length > 0) {
			$('#items-' + "item_" + $("#" + id).attr("data")).show();
		} else if ($('#groupons-' + 'item_' + $('#' + id).attr('data')).length > 0) {
			$('#groupons-' + 'item_' + $('#' + id).attr('data')).show();
		} else {
			if (id === 'Groupon') {
				this.renderList("item_" + $("#" + id).attr("data"), true);
			} else {
				this.renderList("item_" + $("#" + id).attr("data"));
			}
			
			// Resize items of current catagory
			sc.resizeItems();
		}
	}
});

// OrderItemView Class
app.OrderItemView = Backbone.View.extend({
	tagName: 'li',

	template: _.template($("#orderItemView-template").html()),

	events: {
		'click .minus': 'minus',
		'click .add': 'add',
		'click .delete-btn': 'removeItem'
	},

	initialize: function() {
		if (!this.model.get('count')) {
			this.model.set('count', 1);
			this.model.set('total', parseInt(this.model.get('price')));
		}
	},

	render: function() {
		this.$el.html(this.template(this.model.toJSON()));

		if (this.model.get('count') > 1) {
			this.$el.find('.minus').removeClass('disabled');
		}
		return this;
	},

	minus: function() {
		var count = parseInt(this.$el.find('.amount').val());

		// button control
		if (count > 2) {
			this.$el.find('.amount').val(count - 1);
			this.$el.find('.minus').removeClass('disabled');
		} else if (count == 2) {
			this.$el.find('.amount').val(count - 1);
			this.$el.find('.minus').addClass('disabled');
		} else {
			this.$el.find('.minus').addClass('disabled');
			return;
		}

		// Set variables of this model
		this.model.set('count', count - 1);
		this.model.set('total', this.model.get('total') - parseInt(this.model.get('price')));

		// Minus from shopping cart
		if (this.model.get('groupon')) {
			app.shoppingCart.set('tuan_count', app.shoppingCart.get('tuan_count') - 1);
			app.shoppingCart.set('tuan_total', app.shoppingCart.get('tuan_total') - parseInt(this.model.get('price')));
		} else {
			app.shoppingCart.set('item_count', app.shoppingCart.get('item_count') - 1);
			app.shoppingCart.set('item_total', app.shoppingCart.get('item_total') - parseInt(this.model.get('price')));
		}

		// update orderView
		this.updateView(-1);
	},

	add: function() {
		var count = parseInt(this.$el.find('.amount').val());
		this.$el.find('.amount').val(count + 1);

		// button control
		if (count + 1 > 0) {
			this.$el.find('.minus').removeClass('disabled');
		} else {
			this.$el.find('.minus').addClass('disabled');
		}

		// Set variables of this model
		this.model.set('count', count + 1);
		this.model.set('total', this.model.get('total') + parseInt(this.model.get('price')));

		// Add to shopping cart
		if (this.model.get('groupon')) {
			app.shoppingCart.set('tuan_count', app.shoppingCart.get('tuan_count') + 1);
			app.shoppingCart.set('tuan_total', app.shoppingCart.get('tuan_total') + parseInt(this.model.get('price')));
		} else {
			app.shoppingCart.set('item_count', app.shoppingCart.get('item_count') + 1);
			app.shoppingCart.set('item_total', app.shoppingCart.get('item_total') + parseInt(this.model.get('price')));
		}

		// update orderView
		this.updateView(1);
	},

	removeItem: function() {
		var cid = this.model.get('id');

		// Hide select shadow
		if ($('#item-' + cid).find('.select-shadow').length > 0) {
			$('#item-' + cid).find('.select-shadow').css('display', 'none');
		}

		if ($('#item-' + cid).find('.select-shadow-no-img').length > 0) {
			$('#item-' + cid).find('.select-shadow-no-img').css('display', 'none');
		}

		// Remove from shopping cart
		app.shoppingCart.get('items').remove(this.model);
		this.remove();

		// Hide shoppingCart View if shopping cart is empty
		if (app.shoppingCart.get('count') == 0) {
			$('#order-container').hide();
			$('#menu-container').show();
		}
	},

	updateView: function(inc) {
		this.$el.find('.item-amount').html(this.model.get('count'));
		this.$el.find('.item-total-price').html('￥' + this.model.get('total'));
	}
});

// OrderView Class
app.OrderView = Backbone.View.extend({
	className: 'container',

	id: 'order-container',

	template: _.template($("#orderView-template").html()),

	events: {
		'click .back': 'back',
		'click .next': 'next'
	},

	initialize: function() {
		$(window).scrollTop(0);
		$(".main-container").append(this.render().el);
		sc.dropdown('order-container', ".user");
	},

	render: function() {
		this.$el.html(this.template(this.model.toJSON()));

		var that = this,	
			items = that.model.get('items'),
			groupons = this.model.get('tuans'),
			orderItemView;

		// Render OrderItemView of every item
		items.forEach(function(item) {
			orderItemView = new app.OrderItemView({
				model: item
			});
			that.$el.find('#item-list').find('ul').append(orderItemView.render().el);
		});

		// Hide order list if order list is empty
		if (items.length === 0) {
			this.$el.find('#item-list').css('display', 'none');
		}

		// Render OrderItemView of every groupon item		
		groupons.forEach(function(groupon) {
			var orderItemView = new app.OrderItemView({
				model: groupon
			});
			that.$el.find('#tuan-list').find('ul').append(orderItemView.render().el);
		});

		// Hide order list if order list is empty
		if (groupons.length === 0) {
			that.$el.find('#tuan-list').css('display', 'none');
		}

		return this;
	},

	back: function() {
		this.$el.css('display', 'none');
		$('#menu-container').css('display', 'block');
		sc.goTop();
	},

	next: function() {
		this.$el.css('display', 'none');

		// Show delivery View
		var deliveryContainer = $('#delivery-container');
		if (deliveryContainer.length > 0) {
			deliveryContainer.css('display', 'block');
		} else {
			app.UserInfo = new app.User();
			deliveryContainer = new app.DeliveryView({
				model: app.UserInfo
			});
		}

		sc.goTop();
	}
});

// Payment View class
app.PaymentView = Backbone.View.extend({
	className: 'payment',

	template: _.template($("#paymentView-template").html()),

	events: {
		'click #online-payment': 'selectOnline',
		'click #cool-payment': 'selectCool'
	},

	initialize: function() {

	},

	render: function() {
		this.$el.html(this.template(this.model.toJSON()));
		return this;
	},

	selectOnline: function() {
		var popup = new app.OrderInfoPopupView({
			msg: '^_^暂时只支持货到付款~'
		});
		this.$el.append(popup.render().el);
	},

	selectCool: function() {
		this.$el.find('.radio').removeClass('selected');
		this.$el.find('#cool-payment > .radio').addClass('selected');
	}
});


// Delivery View Class
app.DeliveryView = Backbone.View.extend({
	className: 'container',

	id: 'delivery-container',

	template: _.template($("#deliveryView-template").html()),

	events: {
		'click .back': 'back',
		'click .next': 'next',
	},

	initialize: function() {
		$(window).scrollTop(0);
		$(".main-container").append(this.render().el);

		// Render names of companies
		for (var i in app.companies) {
			var option = "<option value='" + app.companies[i].id + "'>" + app.companies[i].name + "</option>";
			$("select[name='company']").append(option);
		}

		// Render payment View and append it to current view
		var payment = new app.Payment(),
			paymentView = new app.PaymentView({
			model: payment
		});
		this.$el.find('.confirmation-form').after(paymentView.render().el);
		sc.dropdown('delivery-container', ".user");
		set_user();

		this.hideToolBar();
	},

	render: function() {
		this.$el.html(this.template(this.model.toJSON()));

		return this;
	},

	back: function() {
		this.$el.css('display', 'none');
		$('#order-container').css('display', 'block');
		sc.goTop();
	},

	next: function() {
		var that = this,
			pass = true,
			code = 0,
			postData;

		// Update user info
		if (this.userInfoChanged) {
			pass = this.updateUserInfo();
		}

		// If user has logged in , then submit order by ajax
		if (sc.getWechatId() && sc.getUuid()) {
			code = 0;
			if (pass) {
				postData = this.extractData();

				$.ajax({
					url: $('base').attr('src') + 'orders/add?ct=' + new Date().getTime(),
					type: 'post',
					data: postData,

					success: function(data) {
						var data = eval("(" + data + ")");					

						if (data.data.cart_id) {
							app.shoppingCart.set('cart_id', data.data.cart_id);
						} else {
							app.shoppingCart.set('cart_id', "");
						}

						if (data.data.tuan_id) {
							app.shoppingCart.set('tuan_id', data.data.tuan_id);
						} else {
							app.shoppingCart.set('tuan_id', '');
						}

						that.$el.css('display', 'none');

						var orderResultView = new app.OrderResultView({
							model: app.shoppingCart
						});

						sc.goTop();
					},

					error: function(data) {
						console.log(data);
					}
				});
			}
		} else if (sc.getWechatId() == undefined || sc.getUuid() == undefined) {
			that.$el.hide();
			app.loginView = new app.LoginView({
				backTo: "delivery-container"
			});

			sc.goTop();
		}
	},

	hideToolBar: function() {
		var toolbar = $('.toolbar'),
			originHeight, currentHeight;

		originHeight = $(window).height();		

		this.$el.find('input').focus(function() {
            $('.toolbar').hide();
        });

		$(window).on('resize', function(e) {
			currentHeight = $(window).height();
			
			if (currentHeight >= originHeight) {
				$('.toolbar').show();
			} else {
				$('.toolbar').hide();
			}

			originHeight = currentHeight;
		});
	},

	updateUserInfo: function() {
		var that = this,
			telPattern = /^1[3|4|5|8][0-9]{9}$/,
			tel = that.$el.find('input[name=tel]').val(),
			username = that.$el.find('input[name=username]').val(),
			company = that.$el.find('select[name=company]').val(),
			addr = that.$el.find('input[name=addr]').val();


		if (telPattern.exec(tel) && username != "" && addr != "") {
			$.ajax({
				url: $('base').attr('src') + 'customers/edit?ct=' + new Date().getTime(),

				type: 'post',

				data: {
					'Customer': {
						'wechat_id': that.getWechatId(),
						'name': that.$el.find('input[name=username]').val(),
						'phone': that.$el.find('input[name=tel]').val(),
						'company': that.$el.find('select[name=company]').val(),
						'location': that.$el.find('input[name=addr]').val(),
						'remark': that.$el.find('input[name=note]').val()
					}
				},

				success: function(data) {
					eval("data=" + data);
					that.userInfoChanged = true;
				},

				error: function() {
					console.log('error');
				}
			});

			return true;
		} else if (username == "") {
			that.$el.find('input[name=username]').css('color', 'red');
			that.$el.find('input[name=username]').focus();

			that.$el.find('input[name=username]').bind('change', function() {
				$(this).css('color', 'black');
				$(this).unbind('change');
			});
			return false;
		} else if (!telPattern.exec(tel)) {
			that.$el.find('input[name=tel]').css('color', 'red');
			that.$el.find('input[name=tel]').focus();

			that.$el.find('input[name=tel]').bind('change', function() {
				$(this).css('color', 'black');
				$(this).unbind('change');
			});
			return false;
		} else if (addr == "") {
			that.$el.find('input[name=addr]').css('color', 'red');
			that.$el.find('input[name=addr]').focus();

			that.$el.find('input[name=addr]').bind('change', function() {
				$(this).css('color', 'black');
				$(this).unbind('change');
			});
			return false;
		}
	},

	getUuid: function() {
		return (function() {
			var search = window.location.search,
				arrStr = search.substr(1, search.length).split('&'),
				temp;

			for (var i = 0; i < arrStr.length; i++) {
				temp = arrStr[i].split('=');

				if (temp[0] == 'code') {
					return unescape(temp[1]);
				}
			}
		})();
	},

	getWechatId: function() {
		return (function() {
			var arrStr = document.cookie.split("; ");
			for (var i = 0; i < arrStr.length; i++) {
				var temp = arrStr[i].split("=");

				if (temp[0] == 'wechat_id')
					return unescape(temp[1]);
			}
		})();
	},

	userInfoChanged: function() {
		return true;
	},

	extractData: function() {
		var order = app.shoppingCart;

		var data = {
			Cart: [],
			Tuan: []
		};

		order.get('items').forEach(function(item) {
			var arr = {};

			//			arr.cookbook_id = item.get('Cookbook').id;
			arr.item_id = item.get('id');
			arr.count = item.get('count');

			data.Cart.push(arr);
		});

		order.get('tuans').forEach(function(tuan) {
			var arr = {};

			arr.item_id = tuan.get('id');
			arr.count = tuan.get('count');

			data.Tuan.push(arr);
		});

		return data;
	}
});


// OrderResult View Class
app.OrderResultView = Backbone.View.extend({
	className: 'container',

	id: 'orderResult-container',

	template: _.template($("#orderResultView-template").html()),

	events: {
		'click .next': 'nextOrder'
	},

	initialize: function(options) {
		$(window).scrollTop(0);
		$(".main-container").append(this.render().el);
		sc.dropdown('orderResult-container', ".user");

		var date = new Date();
		$(".date").html((date.getMonth() + 1) + "月" + date.getDate() + "日 " + date.getHours() + ":" + date.getMinutes());
	},

	render: function() {
		this.$el.html(this.template(this.model.toJSON()));

		var that = this,
			items = this.model.get('items'),
			tuans = this.model.get('tuans'),
			itemsList, resultItemView, tuansList, resultTuanView;

		// Render every order of items
		if (items.length > 0) {
			itemsList = new app.ItemsResultView({
				model: this.model
			});
			that.$el.find(".orderResultList-container").append(itemsList.render().el);

			items.forEach(function(item) {
				resultItemView = new app.ResultItemView({
					model: item
				});
				that.$el.find('#item-order-list').find('ul').append(resultItemView.render().el);
			});
		}

		// Hide order list if order list is empty
		if (items.length === 0) {
			this.$el.find('#items-order-result').css('display', 'none');
		}


		// Render every order of groupons
		if (tuans.length > 0) {
			tuansList = new app.TuansResultView({
				model: this.model
			});
			that.$el.find(".orderResultList-container").append(tuansList.render().el);

			tuans.forEach(function(tuan) {
				resultTuanView = new app.ResultItemView({
					model: tuan
				});
				tuansList.$el.find('#tuan-order-list').find('ul').append(resultTuanView.render().el);
			});
		}

		// Hide order list if order list is empty
		if (tuans.length === 0) {
			this.$el.find('#tuans-order-result').css('display', 'none');
		}

		return this;
	},

	nextOrder: function() {
		window.location.reload();
	}
});


// ItemsResult View Class
app.ItemsResultView = Backbone.View.extend({
	template: _.template($('#itemsResultView-template').html()),

	events: {
		'click .cancelOrder': 'cancelOrder'
	},

	render: function() {
		this.$el.html(this.template(this.model.toJSON()));

		return this;
	},

	cancelOrder: function() {
		var that = this,
			cart_id = this.model.get('cart_id'),
			confirm = new app.OrderConfirmPopupView({
				msg: app.config.orderCancelWarningText
			}, {
				url: $('base').attr('src') + 'orders/delete/' + cart_id,
				type: 'post',
				success: function(data) {

					var data = eval('(' + data + ')'),
						popup;

					if (data.code == 1) {
						popup = new app.OrderInfoPopupView({
							msg: data.msg
						});
						$('#orderResult-container').append(popup.render().el);
					} else {
						if (data.msg == "订单删除成功") {
							popup = new app.OrderInfoPopupView({
								msg: data.msg
							});
							$('#orderResult-container').append(popup.render().el);
							that.$el.remove();
						} else {
							popup = new app.OrderInfoPopupView({
								msg: data.msg
							});
							$('#orderResult-container').append(popup.render().el);
						}
					}
				},
				error: function(data) {
					console.log(data);
				}
			});

		$('#orderResult-container').append(confirm.render().el);
	}
});


// TuansResult View Class
app.TuansResultView = Backbone.View.extend({
	template: _.template($('#tuansResultView-template').html()),

	events: {
		'click .cancelOrder': 'cancelOrder'
	},
	
	render: function() {
		this.$el.html(this.template(this.model.toJSON()));

		return this;
	},

	cancelOrder: function() {
		var that = this,
			tuan_id = this.model.get('tuan_id'),		
			confirm = new app.OrderConfirmPopupView({msg: app.config.orderCancelWarningText}, {
				url: $('base').attr('src') + 'orders/delete/' + tuan_id,
				type: 'post',
				success: function(data) {
					var data = eval('(' + data + ')');
					if (data.code == 1) {
						var popup = new app.OrderInfoPopupView({msg: data.msg});
						$('#orderResult-container').append(popup.render().el);
					} else {
						if (data.msg == "订单删除成功") {
							var popup = new app.OrderInfoPopupView({msg: data.msg});
							$('#orderResult-container').append(popup.render().el);
							that.$el.remove();						
						} else {
							var popup = new app.OrderInfoPopupView({msg: data.msg});
							$('#orderResult-container').append(popup.render().el);
						}
					}
				},
				error: function(data) {
					console.log(data);
				}
			});

		$('#orderResult-container').append(confirm.render().el);
	}
});


// ResultItem View Class
app.ResultItemView = Backbone.View.extend({
	tagName: 'li',

	template: _.template($('#resultItemView-template').html()),

	render: function() {
		this.$el.html(this.template(this.model.toJSON()));

		return this;
	}
});


// MyOrders View Class
app.MyOrdersView = Backbone.View.extend({
	className: 'container',

	id: 'myOrders-container',

	template: _.template($("#myOrdersView-template").html()),

	events: {
		'click .next': 'next',
		'click .history-loader': 'loadHistory'
	},

	initialize: function() {
		$(window).scrollTop(0);
		var that = this,
			now = new Date();

		// Get current date
		this.cur_date = parseInt(now.getFullYear() + "" + sc.normalizeNumber(now.getMonth() + 1) + "" + sc.normalizeNumber(now.getDate()));
		this.cur_time = now.getHours();

		// Load my orders list
		$.ajax({
			url: $('base').attr('src') + 'orders/' + this.cur_date + '.json',

			success: function(data) {
				that.rt_data = data.rt_obj.data;
				that.date = data.rt_obj.date;
				that.code = data.rt_obj.code;
				that.deliver_date = data.rt_obj.deliver_date;

				$(".main-container").append(that.render().el);
				sc.dropdown('myOrders-container', '.user');
			},

			error: function() {
				console.log("error");
			}
		});
	},

	render: function() {
		this.$el.html(this.template());

		if (this.code != 2) {
			this.parseOrder();
		}

		return this;
	},

	next: function() {
		window.location.reload();
	},

	loadHistory: function() {
		var that = this;

		if (this.code != 2) {
			$.ajax({
				url: $('base').attr('src') + 'orders/' + that.date + ".json",

				success: function(data) {
					that.rt_data = data.rt_obj.data;
					that.date = data.rt_obj.date;
					that.code = data.rt_obj.code;
					that.deliver_date = data.rt_obj.deliver_date;

					if (that.code != 2) {
						that.parseOrder();
					} else {
						$('.history-loader-text').text(app.config.noHistoryText);
					}
				},

				error: function() {
					console.log("error");
				}
			});
		}
	},

	parseOrder: function() {
		if (this.code != 1 && this.code != 2) {
			if (this.rt_data.cart) {
				var oneDayOrderView = new app.OneDayOrderView();
				this.$el.find('.myOrderList').append(oneDayOrderView.render().el);
			}

			if (this.rt_data.cart) {
				var order = new app.Order(this.rt_data.cart),
					status = " 处理中",
					deliver_date = this.deliver_date,
					item, itemOrderView, resultItemView;

				if (this.cur_date > deliver_date) {
					status = " 已配送";
				} else if (this.cur_date == deliver_date) {
					if (this.cur_time < 6) {
						status = " 采购中";
					} else if (this.cur_time >= 6 && this.cur_time < 16) {
						status = " 已采购";
					} else if (this.cur_time >= 16 && this.cur_time < 19) {
						status = " 配送中";
					} else if (this.cur_time >= 19) {
						status = " 已配送";
					}
				}
				order.set('order_status', (this.deliver_date) + status);
				order.set('cart_id', this.rt_data.cart_id);
				order.set('cart_total', this.rt_data.cart_total);

				itemOrderView = new app.ItemOrderView({
					model: order,
					status: status
				});

				oneDayOrderView.$el.find('.orderResult-form').append(itemOrderView.render().el);

				for (var i = 0; i < this.rt_data.cart.length; i++) {
					item = new app.Item(this.rt_data.cart[i]);
					item.set('count', parseInt(item.get('count')));
					item.set('total', item.get('count') * parseInt(item.get('price')));
					item.set('total', item.get('price'));

					resultItemView = new app.ResultItemView({
						model: item

					});
					itemOrderView.$el.find('ul').append(resultItemView.render().el);
				};
			}
		}
	},

	getDateStr: function(date, AddDayCount) {
		date = "" + date;
		var year = date.substr(0, 4),
			month = date.substr(4, 2),
			day = date.substr(6, 2),
			dd = new Date(year, month, day),
			y, m, d;

		dd.setDate(dd.getDate() + AddDayCount); //获取AddDayCount天后的日期
		y = dd.getFullYear();
		m = dd.getMonth(); //获取当前月份的日期

		if (m < 10) {
			m = "0" + m;
		}
		
		d = dd.getDate();
		if (d < 10) {
			d = "0" + d;
		}
		return parseInt(y + "" + m + "" + d);
	}
});

// OneDayOrder View Class
app.OneDayOrderView = Backbone.View.extend({
	template: _.template($('#oneDayOrderView-template').html()),

	render: function() {
		this.$el.html(this.template());

		return this;
	}
});

// ItemOrder View Class
app.ItemOrderView = Backbone.View.extend({
	template: _.template($('#itemOrderView-template').html()),

	events: {
		'click .cancelOrder': 'cancelOrder'
	},

	initialize: function(options) {
		if (options != undefined) {
			this.status = options.status;
		}
	},

	render: function() {
		this.$el.html(this.template(this.model.toJSON()));

		if (this.status && this.status.trim() == "已配送") {
			this.$el.find('.cancelOrder').remove();
		}

		return this;
	},

	cancelOrder: function() {
		var that = this,
			cart_id = this.model.get('cart_id'),
			confirm, popup;

		if (that.status.trim() == "处理中" || that.status.trim() == "采购中") {
			confirm = new app.OrderConfirmPopupView({
				msg: app.config.orderCancelWarningText
			}, {
				url: $('base').attr('src') + 'orders/delete/' + cart_id,
				type: 'post',
				success: function(data) {
					var data = eval('(' + data + ')');
					if (data.code == 1) {
						var popup = new app.OrderInfoPopupView({
							msg: data.msg
						});
						$('#myOrders-container').append(popup.render().el);
					} else {
						if (data.msg == "订单删除成功") {
							var popup = new app.OrderInfoPopupView({
								msg: data.msg
							});
							$('#myOrders-container').append(popup.render().el);
							that.$el.remove();
						} else {
							var popup = new app.OrderInfoPopupView({
								msg: data.msg
							});
							$('#myOrders-container').append(popup.render().el);
						}
					}
				},
				error: function(data) {
					console.log(data);
				}
			});
			$('#myOrders-container').append(confirm.render().el);
		} else if (that.status.trim() == "已采购") {
			confirm = new app.OrderConfirmPopupView({
				msg: '您的订单我们已采购',
				tips: '现在取消会造成我们的损失',
				yesLabel: '取消订单',
				noLabel: '保留订单'
			}, {
				url: $('base').attr('src') + 'orders/delete/' + cart_id,
				type: 'post',
				success: function(data) {
					var data = eval('(' + data + ')');
					if (data.code == 1) {
						var popup = new app.OrderInfoPopupView({
							msg: data.msg
						});
						$('#myOrders-container').append(popup.render().el);
					} else {
						if (data.msg == "订单删除成功") {
							var popup = new app.OrderInfoPopupView({
								msg: data.msg
							});
							$('#myOrders-container').append(popup.render().el);
							that.$el.remove();
						} else {
							var popup = new app.OrderInfoPopupView({
								msg: data.msg
							});
							$('#myOrders-container').append(popup.render().el);
						}
					}
				},
				error: function(data) {
					console.log(data);
				}
			});
			$('#myOrders-container').append(confirm.render().el);
		} else if (that.status.trim() == "配送中") {
			popup = new app.OrderInfoPopupView({
				msg: '您的订单已经开始配送'
			});
			$('#myOrders-container').append(popup.render().el);
		} else if (that.status.trim() == "已配送") {
			popup = new app.OrderInfoPopupView({
				msg: '订单已经配送成功，不能取消'
			});
			$('#myOrders-container').append(popup.render().el);
		}
	}
});

// TuanOrder View Class
app.TuanOrderView = Backbone.View.extend({
	template: _.template($('#tuanOrderView-template').html()),

	events: {
		'click .cancelOrder': 'cancelOrder'
	},

	initialize: function(options) {
		if (options != undefined) {
			this.status = options.status;			
		}
	},

	render: function() {
		this.$el.html(this.template(this.model.toJSON()));

		if (this.status && this.status.trim() == "已配送") {
			this.$el.find('.cancelOrder').remove();
		}

		return this;
	},

	cancelOrder: function() {
		var that = this,
			tuan_id = this.model.get('tuan_id'),
			confirm, popup;

		if (that.status.trim() == "采购中" || that.status.trim() == "处理中") {
			confirm = new app.OrderConfirmPopupView({
				msg: app.config.orderCancelWarningText
			}, {
				url: $('base').attr('src') + 'orders/delete/' + tuan_id,
				type: 'post',
				success: function(data) {
					var data = eval('(' + data + ')');
					if (data.code == 1) {
						var popup = new app.OrderInfoPopupView({
							msg: data.msg
						});
						$('#myOrders-container').append(popup.render().el);
					} else {
						if (data.msg == "订单删除成功") {
							var popup = new app.OrderInfoPopupView({
								msg: data.msg
							});
							$('#myOrders-container').append(popup.render().el);
							that.$el.remove();
						} else {
							var popup = new app.OrderInfoPopupView({
								msg: data.msg
							});
							$('#myOrders-container').append(popup.render().el);
						}
					}
				},
				error: function(data) {
					console.log(data);
				}
			});
			$('#myOrders-container').append(confirm.render().el);
		} else if (that.status.trim() == "已采购") {
			confirm = new app.OrderConfirmPopupView({
				msg: '您的订单我们已采购',
				tips: '现在取消会造成我们的损失',
				yesLabel: '取消订单',
				noLabel: '保留订单'
			}, {
				url: $('base').attr('src') + 'orders/delete/' + cart_id,
				type: 'post',
				success: function(data) {
					var data = eval('(' + data + ')');
					if (data.code == 1) {
						var popup = new app.OrderInfoPopupView({
							msg: data.msg
						});
						$('#myOrders-container').append(popup.render().el);
					} else {
						if (data.msg == "订单删除成功") {
							var popup = new app.OrderInfoPopupView({
								msg: data.msg
							});
							$('#myOrders-container').append(popup.render().el);
							that.$el.remove();
						} else {
							var popup = new app.OrderInfoPopupView({
								msg: data.msg
							});
							$('#myOrders-container').append(popup.render().el);
						}
					}
				},
				error: function(data) {
					console.log(data);
				}
			});
			$('#myOrders-container').append(confirm.render().el);
		} else if (that.status.trim() == "配送中") {
			popup = new app.OrderInfoPopupView({
				msg: '您的订单已经开始配送'
			});
			$('#myOrders-container').append(popup.render().el);
		} else if (that.status.trim() == "已配送") {
			popup = new app.OrderInfoPopupView({
				msg: '订单已经配送成功，不能取消'
			});
			$('#myOrders-container').append(popup.render().el);
		}
	}
});

// Popup View Class
app.OrderInfoPopupView = Backbone.View.extend({
	className: 'popup',

	id: 'orderInfo-popup',

	template: _.template($("#orderInfoPopupView-template").html()),

	events: {
		'click button': 'close'
	},

	initialize: function(options) {
		this.msg = options.msg;
	},

	render: function() {
		this.$el.html(this.template());
		this.$el.find('.popup-header').append(this.msg);
		$("#menu-shadow").show();

		var that = this;
		setTimeout(function() {
			that.close();
		}, 2000);
		return this;
	},

	close: function() {
		this.$el.remove();
		$("#menu-shadow").hide();
	}
});

// Confirmation Popup View Class
app.OrderConfirmPopupView = Backbone.View.extend({
	className: 'popup',

	id: 'orderConfirm-popup',

	template: _.template($("#orderConfirmPopupView-template").html()),

	events: {
		'click #yes': 'submit',
		'click #no': 'close',
	},

	initialize: function(options, ajaxSetting) {
		if (options != undefined) {
			if (options.msg) this.msg = options.msg;
			if (options.tips) this.tips = options.tips;
			if (options.yesLabel) this.yesLabel = options.yesLabel;
			if (options.noLabel) this.noLabel = options.noLabel;
		}

		if (ajaxSetting != undefined) {
			this.ajaxSetting = ajaxSetting;
		}
	},

	render: function() {
		this.$el.html(this.template());

		if (this.msg)
			this.$el.find('.popup-header').append(this.msg);

		if (this.tips)
			this.$el.find('.popup-tips').append(this.tips);

		if (this.yesLabel)
			this.$el.find('#yes').html(this.yesLabel);

		if (this.noLabel)
			this.$el.find('#no').html(this.noLabel);

		$("#menu-shadow").show();
		return this;
	},

	submit: function() {
		var that = this;
		$.ajax(that.ajaxSetting);

		this.$el.remove();
		$("#menu-shadow").hide();
	},

	close: function() {
		this.$el.remove();
		$("#menu-shadow").hide();
	}
});
