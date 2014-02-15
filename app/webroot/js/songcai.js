/*
 * songcai.js
 * 
 * (c) 2013-2014 Rathinho, Lie Nong Co,Ltd.
 * Author: Rathinho
 *
 */

// Global namespace
var sc = sc || {},
	app = app || {},
	flag = 0;			// flag => 0:Not Logined / 2:Logined


app.config = {
	loginSuccessText: '^_^登录成功',
	loginFailedText: '^_^用户名或密码错误，请重新登录',
	registerSuccessText: '注册成功, 3秒后自动登录',
	userNameErrorText: '用户名不能为空',
	passwordErrorText: '密码长度不符合要求（6-20位）',
	repeatedPasswordErrorText: '两次输入的密码不一致',
	emailErrorText: '邮箱地址不正确',
	itemInShoppingCartText: '已加入购物车，请前往购物车查看',
	orderCancelWarningText: '确定取消订单吗？',
	noHistory: '没有别的订单啦~'
};

// Get status of flag
function get_flag() {
	var arrStr = document.cookie.split("; ");
	for (var i = 0; i < arrStr.length; i++) {
		var temp = arrStr[i].split("=");
		if (temp[0] == 'wechat_id')
			flag = flag + 1;
		if (temp[0] == 'uuid')
			flag = flag + 1;
	}
	return flag;
}

// Set user information
function set_user() {
	$.ajax({
		url: 'customers/index',
		success: function(data) {
			eval("data=" + data);
			console.log(data);
			if (data.code === 0) {
				if(data.data.Customer){
                    $("#username").val(data.data.Customer.name);
                    $("#tel").val(data.data.Customer.phone);
                    $("#company").val(data.data.Customer.company_id);
                    $("#addr").val(data.data.Customer.location);
                }
			}
		}
	});
}


/**********************		Assitant Functions      *********************/

// Logical control of Dropdown Menu
sc.dropdown = function(containerId, element) {
	$("#" + containerId).find(element).bind("click", function() {
		var isBlock = $("#menu-dropdown").css("display");

		if (isBlock === "block") {
			$("#menu-dropdown").hide();
			$("#menu-shadow").hide();
		} else {
			$("#menu-dropdown").show();
			$("#menu-shadow").show();
		}

		if (get_flag() === 0) {
			$("#myOrder").hide();
			$("#addUser").show();
			$("#logout > a").text("登录");
		} else {
			$("#myOrder").show();
			$("#addUser").hide();
			$("#logout > a").text("退出登录");
		}
	});
};

// Normalize the numbers: 1 => 01
sc.normalizeNumber = function(number) {
	if (number < 10) {
		number = '0' + number;
	}
	return number;
};

// Toggle status of display mode: 'yes' => show pictures / 'no' => hide pictures
sc.togglePic = function(element) {
	$(element).bind('click', function() {
		//document.cookie = "pic_status=no";
		setCookie("pic_status", "no", 100);
		window.location.reload();
	});
};

// Get Wechat Id
sc.getWechatId = function() {
	var arrStr = document.cookie.split("; ");
	for (var i = 0; i < arrStr.length; i++) {
		var temp = arrStr[i].split("=");
		if (temp[0] == 'wechat_id')
			return unescape(temp[1]);
	}
	return undefined;
};

// Get User Id
sc.getUuid = function() {
	var arrStr = document.cookie.split("; ");
	for (var i = 0; i < arrStr.length; i++) {
		var temp = arrStr[i].split("=");
		if (temp[0] == 'uuid')
			return unescape(temp[1]);
	}
	return undefined;
};

// Scroll To The Top
sc.goTop = function() {
	$(window).scrollTop(2);
};

// Remove the ajax loader
sc.removeLoader = function() {
	$('.loader-mask').remove();
};

// Controller of 'goTop' button
sc.scrollPos = function() {
	if ($(window).scrollTop() > 100) {
		$(".go_top").show();
	} else {
		$(".go_top").hide();
	}
};

// User Experience Optimization
sc.optimizations = function() {
	// Optimize user experience of clicking the Header
	$("#home-header").bind("touchmove", {}, function(e) {
		e.preventDefault();
	});

	// Fix bug of viscous scrolling
	$(window).scrollTop(2);

	// Prevent default event of click 
	document.onclick = function(e) {
		e.preventDefault();
	};
};

// Hide default footer of wechat
sc.hideWechatToolBar = function() {
	document.addEventListener('WeixinJSBridgeReady', function onBridgeReady() {
		WeixinJSBridge.call('hideToolbar');
	});
};

// Resize the Item View to improve user experience
sc.resizeItems = function() {
	if (app.priceNewLine) {
		$('.item').each(function() {
			var $this = $(this);
			$this.find('.item-price').removeClass('fr').removeClass('fl').addClass('block');

			if ($this.hasClass('large')) {
				$this.find('.item-price').eq(1).removeClass('fl').addClass('fr');

				var priceWidth = $this.find('.item-price').eq(0).width() + $this.find('.item-price').eq(1).width();

				if ($(window).width() * 0.95 < priceWidth + 120) {
					$this.find('.item-detail').addClass('fl').addClass('block');
				}
			}
		});
	}
};


/*********************************** Main *********************************/
$(function() {
	// Hide wechat toolbar
	sc.hideWechatToolBar();
	
	// Load info of index
	$.ajax({
		url: 'home/items',
		method: 'get',
		success: function(data) {
			data = $.parseJSON(data);

			// console.log(data);

			// Create some global objects
			app.categories = data.category;
			app.items = data.item;
			app.companies = data.company;
			app.times = data.time;
			var length = app.categories.length;

			// Check whether info of 'groupon' has been sent to front-end
			if (data.showGroupon && data.groupon) {
				app.showGroupon = data.showGroupon;
				app.groupon = data.groupon;

				var index = 'item_' + app.groupon.id;
				var JSon = "{\""+index+"\":"+JSON.stringify(data.tuanItems)+"}";
				app.grouponItems = $.parseJSON(JSon);
			}

			// Create Menu view
			app.menuView = new app.MenuView();

			// Set Display Mode
			app.menuView.setPic(true);

			// Create ShoppingCart Model
			app.shoppingCart = new app.Order();

			// Create collections of items and groupons
			app.CtgOneCollection = new app.ItemCollection();
			app.CtgTwoCollection = new app.ItemCollection();
			app.CtgThreeCollection = new app.ItemCollection();
			app.GrouponCollection = new app.ItemCollection();

			// Create ShoppingCart View and append it to Menu View
			app.shoppingCartV = new app.ShoppingCartView({model: app.shoppingCart});
			$("#menu-container").append(app.shoppingCartV.render().el);


			// Render every tabs 
			app.menuView.renderList("item_" + app.categories[0].id);
			if (length > 0) {
				$("#CtgOne").text(app.categories[0].name);
				$("#CtgOne").attr("data", app.categories[0].id);
			}
			if (length > 1) {
				$("#CtgTwo").text(app.categories[1].name);
				$("#CtgTwo").attr("data", app.categories[1].id);
			} else {
				$("#CtgTwo").hide();
			}
			if (length > 2) {
				$("#CtgThree").text(app.categories[2].name);
				$("#CtgThree").attr("data", app.categories[2].id);
			} else {
				$("#CtgThree").hide();
			}
			if (length > 3) {
				$("#CtgFour").text(app.categories[3].name);
				$("#CtgFour").attr("data", app.categories[3].id);
			} else {
				$("#CtgFour").hide();
			}

			// Check whether 'Groupon' tab will be shown
			if (!data.showGroupon) {
				$("#Groupon").hide();
			} else {
				$('#CtgFour').hide();
				$("#Groupon").show();
				$("#Groupon").text("团购").attr('data', app.groupon.id).attr('data-groupon', '1');
			}
			
			// Resize the Item View to improve user experience
			sc.resizeItems();

			// Remove ajax-loader
			sc.removeLoader();
		},
		error: function(data) {
			//showAlert("");
		}
	});

	// Click 'go_top' button to scroll to the Top
	$(".go_top").click(function() {
		sc.goTop();
	});

	// Add listener to 'scroll' and 'resize' events to control the display of 'go_top' button
	$(window).on('scroll', sc.scrollPos);
	$(window).on('resize', sc.scrollPos);

	// Click to hide shadow
	$("#menu-shadow").bind("click", function() {
		var isBlock = $('#menu-dropdown').css('display');
		if (isBlock == "block") {
			$("#menu-dropdown").hide();
			$("#menu-shadow").hide();
		}
	});

	// Click to show info of personal Orders
	$("#myOrder").bind('click', function() {
		$(".container").css('display', 'none');

		// If 'Not Logined', display Login View, else display MyOrder View.
		if (!sc.getUuid() && !sc.getWechatId()) {
			$("#menu-shadow").click();
			$(".container").hide();
			var loginView = new app.LoginView({
				backTo: "menu-container"
			});
			$(".main-container").append(loginView.render().el);
		} else if ($("#myOrders-container").length > 0) {
			$("#myOrders-container").show();
		} else {
			app.myOrderView = new app.MyOrdersView();
		}

		// Hide shadow
		$("#menu-shadow").click();
	});

	// Click to show Register View
	$("#addUser").click(function() {
		$("#menu-shadow").click();
		$(".container").hide();
		var registerView = new app.RegisterView({
			backTo: "menu-container"
		});
		$(".main-container").append(registerView.render().el);
	});

	// Click to Logout
	$("#logout").click(function() {
		if (flag === 0) {
			$("#menu-shadow").click();
			$(".container").hide();
			var loginView = new app.LoginView({
				backTo: "menu-container"
			});
			$(".main-container").append(loginView.render().el);
		} else {
			setCookie("wechat_id", "", -1);
			setCookie("uuid", "", -1);
			var popup = new app.OrderInfoPopupView({
				msg: "退出登录成功！"
			});
			$("#menu-dropdown").append(popup.render().el);

			setTimeout(function() {
				window.location.reload();
			}, 1500);
		}
	});

	// Optimize user experience
	sc.optimizations();
});