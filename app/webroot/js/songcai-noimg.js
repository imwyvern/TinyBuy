/*
 * songcai.js
 */

var sc = sc || {};
var app = app || {};

(function(ex) {
	var dropdown = function(containerId, element) {
		$("#" + containerId).find(element).bind("click", function() {
			if (user_status == "NEW_USER") {
				$(".container").hide();
				var registerView = new app.RegisterView({backTo: "menu-container"});				
				$(".main-container").append(registerView.render().el);
			} else {
				var isBlock = $("#menu-dropdown").css("display");

				if (isBlock == "block") {
					$("#menu-dropdown").hide();
					$("#menu-shadow").hide();
				} else {
					$("#menu-dropdown").show();
					$("#menu-shadow").show();
				}
			}

			if (user_status == "CUSTOMER" && !sc.getWechatId()) {
				$("#logout > a").text("登录");
			} else {
				$("#logout > a").text("退出登录");
			}
		});		
	};

	ex.dropdown = dropdown;
})(sc);

(function(ex) {
	var normalizeNumber = function(number) {
		if (number < 10) {
			number = '0' + number;
		}
		return number;
	};

	ex.normalizeNumber = normalizeNumber;
})(sc);

(function(ex) {
	var togglePic = function(element) {
		$(element).click(function() {
			//document.cookie = "pic_status=yes";
			setCookie("pic_status", "yes", 100);
			window.location.reload(); 
		});
	};

	ex.togglePic = togglePic;
})(sc);

(function(ex) {
	var getWechatId = function() {
		var arrStr = document.cookie.split("; ");
		for (var i = 0; i < arrStr.length; i++) {
			var temp = arrStr[i].split("=");

			if (temp[0] == 'wechat_id')
				return unescape(temp[1]);
		}
	};

	ex.getWechatId = getWechatId;
})(sc);


$(function() {
	app.menuView = new app.MenuView();		// 创建菜单view
	app.menuView.setPic(false);
	app.shoppingCart = new app.Order();		// 创建购物车(订单)
	app.vegetableCollection = new app.ItemCollection();
	app.meatCollection = new app.ItemCollection();
	app.soupCollection = new app.ItemCollection();
	app.specialityCollection = new app.ItemCollection();
	app.shoppingCartV = new app.ShoppingCartView({model: app.shoppingCart});	// 创建购物车浮动框视图
	$("#menu-container").append(app.shoppingCartV.render().el);
	$('.loader-mask').remove();

	app.menuView.renderList(1);
	// $(".main").append("<div class='loader-mask'><img src='img/ajax-loader.gif' alt='loader'></div>");
	// $.ajax({
	// 	url: $("base").attr("src")+'items.json?kind=0',
	// 	method: 'get',
		
	// 	success: function(data){
	// 		var data = data.rt_obj.data;
			
	// 		$('.loader-mask').fadeOut(function() {
	// 			app.menuView.handleJSON(data, "0");
	// 		});
						
	// 	},
	// 	error: function(data){
	// 		console.log(data);
	// 	}
	// });
	


	// 菜单事件绑定
	$("#menu-shadow").bind("click", function() {
		$("#menu-dropdown").hide();
		$("#menu-shadow").hide();
	});

	$("#todayList").bind('click', function() {
		window.location.reload();
		// $("#menu-dropdown").css("display", "none");
		// $("#menu-shadow").css("display", "none");
		// $(".container").css('display', 'none');

		// $("#menu-container").css('display', 'block');
	});

	$("#myOrder").bind('click', function() {
		$(".container").css('display', 'none');
		
		if (user_status == "CUSTOMER" && !sc.getWechatId()) {
			$("#menu-shadow").click();
			$(".container").hide();
			var loginView = new app.LoginView({backTo: "menu-container"});
			$(".main-container").append(loginView.render().el);
		}
		else if ($("#myOrders-container").length > 0) {
			$("#myOrders-container").show();
		}	else {
			app.myOrderView = new app.MyOrdersView();
		}
		
		$("#menu-shadow").click();
	});

	// $("#myAccount").click(function() {

	// });

	$("#logout").click(function() {
		if (user_status == "CUSTOMER" && !sc.getWechatId()) {
			$("#menu-shadow").click();
			$(".container").hide();
			var loginView = new app.LoginView({backTo: "menu-container"});
			$(".main-container").append(loginView.render().el);
		} else {
			// 清除cookie
			//document.cookie = "wechat_id=" + ""; 
			setCookie("wechat_id", "", -1);
			var popup = new app.OrderInfoPopupView({msg: "退出登录成功！"});
			$("#menu-dropdown").append(popup.render().el);

			setTimeout(function() {
				$("#menu-shadow").click();
				$(".container").hide();
				var loginView = new app.LoginView({backTo: "menu-container"});
				$(".main-container").append(loginView.render().el);
			}, 2000);
		}		
	});
	
	$("#home-header").bind("touchmove", {}, function(e){
		e.preventDefault();
	});
	$(window).scrollTop(2);
});