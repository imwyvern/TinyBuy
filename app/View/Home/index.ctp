<!DOCTYPE html>
<html>
<head>
	<base src="<?php echo $this->webroot; ?>"></base>
	<meta http-equiv="Content-type" content="text/html; charset=utf-8">
	<meta name="viewport" content="	width=100%;
									initial-scale=1;
									maximum-scale=1;
									minimum-scale=1;
									user-scalable=no;">
	<meta name="apple-mobile-web-app-capable" content="yes">
	<title>TinyBuy</title>
	<link rel="stylesheet" href="css/style.css">	
</head>
<body>
	<div class="main-container">
		<div class="loader-mask"><img src="img/ajax-loader.gif" alt="loader"></div>
	</div>
	<div class="go_top">
		<img src="img/go_top.png" alt="go_top">
	</div>
	<div id="menu-shadow" hidefocus="true"></div>
	<div id="menu-dropdown">
		<div id="menu-arrow"></div>
		<ul>
			<li id="myOrder">
				<a href="javascript:void(0);">我的订单</a>
            </li>
			<li id="addUser">
				<a href="javascript:void(0);">注册</a>
			</li>
			<li id="divider">
				<div class="divider"></div>
			</li>
			<li id="logout">
				<a href="javascript:void(0);">退出登录</a>
			</li>
		</ul>
	</div>

	<!-- 弹出窗口模版 -->
	<script type="text/template" id="popupView-template">

	</script>

	<!-- 登录页面模版 -->
	<script type="text/template" id="loginView-template">
		<div class="login-header">
			
		</div>

		<div class="login-form">
			<div class="line">
				<label for="account" >手机号：</label>
				<input type="tel" name="account" placeholder="请输入手机号码">
			</div>

			<div class="line">
				<label for="password">密码：</label>
				<input type="password" name="password" placeholder="请输入密码">
			</div>

			<a id="reg">注册</a>
			<a id="forget">忘记密码？</a>
			
			<div class="line">
				<button class="btn-success" id="login">登 录</button>
			</div>			
		</div>

		<div class="toolbar">
			<a class="back" href="javascript:void(0);">
				<img src="img/back.png">
			</a>			
		</div>
	</script>

	<!-- 注册页面模版 -->
	<script type="text/template" id="registerView-template">
		<div class="login-header">
			
		</div>

		<div class="login-form">
			<div class="line">
				<label for="account">手机号：</label>
				<input type="tel" name="account" placeholder="请输入手机号码">
			</div>

			<div class="line">
				<label for="password">密码：</label>
				<input type="password" name="password" placeholder="请输入密码">
			</div>

			<div class="line">
				<label for="password">密码确认：</label>
				<input type="password" name="repassword" placeholder="请重复密码">
			</div>

			<div class="line">
				<label for="password">邮箱：</label>
				<input type="text" name="email" placeholder="请输入邮箱,用于密码找回">
			</div>

			<button class="btn-success" id="register">注 册</button>
		</div>

		<div class="toolbar">
			<a class="back" href="javascript:void(0);">
				<img src="img/back.png">
			</a>			
		</div>
	</script>

	<!-- 忘记密码页面模版 -->
	<script type="text/template" id="forgetPasswordView-template">
		<div class="login-form">
			<div class="line">
				<label for="account">手机号：</label>
				<input type="text" name="account" placeholder="">
			</div>

			<div class="line">
				<label for="email">邮箱：</label>
				<input type="text" name="email" placeholder="">
			</div>
			<button class="btn-success" id="getPassword">确 定</button>
		</div>

		<div class="toolbar">
			<a class="back" href="javascript:void(0);">
				<img src="img/back.png">
			</a>			
		</div>
	</script>

	<!-- 菜谱视图模版 -->
	<script type="text/template" id="menuView-template">		
		<div class="header" id="home-header">
			<div class="types">
				<ul>
				<!--
					<li class="active" id="CtgOne" class="Ctg"></li>
					<li id="CtgTwo" class="Ctg"></li>
					<li id="CtgThree" class="Ctg"></li>
					<li id="CtgFour" class="Ctg"></li>
					<li id="Groupon" class="Ctg"></li>
					<li id="More-tabs" class="types-toggle">&nbsp;</li>-->
				</ul>

				<div class="tabs-dropdown" id="tabs-dropdown">
					<ul>
					<!--
						<li class="Ctg">王伟胸</li>
						<li class="Ctg">王伟雄</li>
						<li class="Ctg">妄为凶</li>
						<li class="Ctg">王维熊</li>
						<li class="Ctg">网维兄</li>-->
					</ul>
				</div>
			</div>
		</div>		

		<div class="marquee" style="height:0">
			<marquee class="none" id="marquee-content"></marquee>
		</div>		

		<div class="main">
		</div>
		
		<div id="page_tag_load"><img src='img/ajax-loader.gif' alt='loader'></div>

		<div class="toolbar" style="left:0;">
			<a class="mybtn" id="before-submit" href="javascript:void(0);" hidefocus="true">请先选单</a>			
			<a class="user" href="javascript:void(0);" hidefocus="true"><img src="img/user.png" alt="user"></a>
		</div>
	</script>

	<!-- 菜谱条目模版 -->
	<script type="text/template" id="item-template">		
		<div class="item-title fl"><%= name %></div>
		<div class="item-image">
			<img src="img/ajax-loader.gif" lazy-src="<%= picurl %>" alt="item image"></div>
		<div class="single-item-info">
			<% if(price < cost) { %>
				<div class="item-price fl">
					<span>原价￥</span><s><%= cost %></s>
				</div>			
				<div class="item-price fr">
					<span>优惠价￥</span><r><%= price %></r>
				</div>
			<% } else { %>
				<div class="item-price fl">
					<span>价格￥</span><r><%= cost %></r>
				</div>
			<% } %>

			<!--
			<div class="item-amount fr">
				<span>
					<img src="img/bow@2x.png" alt="bowl"></span>
				<span><%= sale %>人</span>
			</div>
			-->

			<div class="item-detail">
				<a href="javascript:void(0);">点击进入详情</a>
				<img src="img/greentri@2x.png" alt="detail">
			</div>
		</div>

		<div class="select-shadow">
			<div class="shadow-label">
				<img src="img/check.png" alt="selected">
				<span>已选</span>
			</div>
		</div>
	</script>

	<!-- 购物车按钮模版 -->
	<script type="text/template" id="shoppingCart-template">
		<div class="shopping-cart mybtn">
			<span style="display:block; font-size: 13px; line-height: 16px; height: 19px;">
				<span class="total-amount"><%= count %></span>
				份，共
				<span class="total-price"><%= total %></span>
				元
				<br/>
			</span>
			<span style="display:block; font-size: 16px; line-height: 16px; height: 16px;">点击下单</span>
		</div>
	</script>

	<!-- 菜品详情页面模版 -->
	<script type="text/template" id="itemDetailView-template">
		<div class="header" id="detail-header">
			<span class="single-name"><%= name%></span>
		</div>

		<div class="detail">
			<div class="detail-image">
				<img src="<%= image %>" alt="商品详情"></div>

			<div class="button-group">
				<button class="addItem btn btn-success">加入购物车</button>
			</div>

			<table class="detail-content">
				<tbody>
					<% if (price < cost) { %>
						<tr>
							<td>价格:</td>
							<td><s><%= cost %></s>元</td>
						</tr>
						<tr>
							<td>优惠价:</td>
							<td><r><%= price %></r>元</td>
						</tr>
					<% } else { %>
						<tr>
							<td>价格:</td>
							<td><%= cost %>元</td>
						</tr>
					<% } %>

					<tr>
						<td>详情:</td>
						
					</tr>
					<tr>
						<td colSpan=2><div style="word-break: break-all;"><%= detail %></div></td>
					</tr>
				</tbody>
			</table>

			<div class="done">
				<img src="img/car2@2x.png">
				<span>成功放入购物车</span>
			</div>
		</div>

		<div class="toolbar">
			<a class="back" href="javascript:void(0);">
				<img src="img/back.png">
			</a>
			
			<a class="user" href="javascript:void(0);">
				<img src="img/user.png"></a>
		</div>
	</script>

	<!-- 订单确认视图模版 -->
	<script type="text/template" id="orderView-template">
		<div class="confirmation-form">
			<div class="confirmation-header">
				<span>订单确认</span>				
			</div>

			<div class="confirmation-list" id="item-list">
				<div class="dotted-divider" style="width: 105.263157894737%; margin-left: -2.9%"></div>
				<ul>				
					<!-- 插入订单条目视图 -->					
				</ul>
				<div class="total-info">
					<span>
                    运费：<span class="items-total-amount"><%= trade_fee %></span>元，共<span class="items-total-price">
                    <%= (free_trade_fee > 0 && free_trade_fee < item_total) ? item_total : (trade_fee + item_total)  %>
                    </span>元
					</span>
				</div>
			</div>			

			<div class="confirmation-list" id="tuan-list">
				<div class="dotted-divider" style="width: 105.263157894737%; margin-left: -2.9%"></div>
				<ul>				
					<!-- 插入订单条目视图 -->					
				</ul>
				<div class="total-info">
					<span>
						运费：<span class="tuans-total-amount">0</span>元，共<span class="tuans-total-price"><%= tuan_total %></span>元
					</span>
				</div>
			</div>
		</div>

		<div class="toolbar">
			<a class="back" href="javascript:void(0);">
				<img src="img/back.png">
			</a>
			<a class="next mybtn" href="javascript:void(0);">
				<span style="display: block; height: 39px; font-size: 1.2em;">下一步</span>
			</a>
			<a class="user" href="javascript:void(0);">
				<img src="img/user.png"></a>
		</div>
	</script>


	<!-- 订单条目视图模版 -->
	<script type="text/template" id="orderItemView-template">
		<div class="confirmation-item">
			<div class="item-info">
				<span class="item-name" title="<%= name %>"><%= name %><br/></span>
				<span class="item-price-info">
					<span>
						<span class="item-total-price">￥<%= total %></span>
						(<span class="item-single-price"><%= price %></span>×<span class="item-amount"><%= count %></span>)
					</span>
				</span>
			</div>
			<div class="select-box">
				<span class="minus disabled">—</span>
				<input class="amount" type="text" name="amount" value="<%= count %>" autocomplete="off" readonly>
				<span class="add">+</span>
			</div>
			<div class="delete">
				<a class="delete-btn" href="javascript:void(0);">
					<img src="img/delete.png"></a>
			</div>
		</div>
		<div class="divider"></div>
	</script>

	<!-- 订单配送信息视图模版 -->
	<script type="text/template" id="deliveryView-template">
		<div class="confirmation-form">
			<div class="confirmation-header">
				<span>信息</span>
				<div class="dotted-divider"></div>
			</div>

			<form class="delivery-info">
				<table class="delivery-table">
					<tbody>
						<tr>
							<td><label for="username">姓名：</label></td>
							<td><input type="text" name="username" id="username" placeholder="建议使用微信名称" value="" required></td>
						</tr>
						<tr>
							<td><label for="tel">手机：</label></td>
							<td><input type="text" name="tel" id="tel" placeholder="" required value=""></td>
						</tr>
						<tr class="addr">
							<td rowSpan=2><label for="addr">地址：</label></td>
							<td><select name="company" id="company"></select></td>
						</tr>
						<tr>
							<td><input type="text" name="addr" id="addr" value="" required></td>
						</tr>
						<tr>
							<td><label for="note">备注：</label></td>
							<td><input type="text" name="note" id="note" placeholder="选填" value=""></td>
						</tr>
					</tbody>
				</table>				
			</form>
		</div>

		<div class="toolbar">
			<a class="back" href="javascript:void(0);">
				<img src="img/back.png">
			</a>
			<a class="next mybtn" href="javascript:void(0);">
				<span style="display: block; height: 39px; font-size: 1.2em;">提交订单</span>
			</a>
			<a class="user" href="javascript:void(0);">
				<img src="img/user.png"></a>
		</div>
	</script>

	<!-- 支付方式模版 -->
	<script type="text/template" id="paymentView-template">
	    <span>支付方式：</span>
	    <div>
			<span class="line" id="online-payment">
				<span class="radio selected"></span>
				<span class="label">微信支付</span>
			</span>
			<span class="line" id="cool-payment">
				<span class="radio disabled"></span>
				<span class="label">货到付款</span>
			</span>
		</div>
	</script>

	<!-- 订单提交结果视图模版 -->
	<script type="text/template" id="orderResultView-template">
		<div class="orderResult-header">
			<span>
				<img class="smile" src="img/smile.png">&nbsp&nbsp&nbsp下单成功</span>
			<div class="dotted-divider"></div>
		</div>

		<div class="orderResultList-container">
				<!-- 在此插入普通菜品和土特团的订单列表 -->
		</div>

		<div class="toolbar">
			<a class="next mybtn" href="javascript:void(0);">
				<span style="display: block; height: 39px; font-size: 1.2em;">继续选购</span>
			</a>
			<a class="user" href="javascript:void(0);">
				<img src="img/user.png"></a>
		</div>
	</script>
	
	<!-- 订单结果中普通菜品列表的视图模版 -->
	<script type="text/template" id="itemsResultView-template">
		<div class="orderResult-form">
			<div class="orderResult-list" id="items-order-result">
				<div class="order-info">
					<span>
						订单编号：
						<span id="order-no"><%= cart_id %></span>
					</span>
					<span class="date" style="float: right"></span>
				</div>
				<div class="order-list" id="item-order-list">
					<ul>
					</ul>
				</div>
				<div class="divider"></div>
				<div class="total-info">
					<span>
                    运费：<span><%= trade_fee %></span>元，共<span>
                    <%= (free_trade_fee > 0 && free_trade_fee < item_total) ? item_total : (trade_fee + item_total)  %>
                    </span>元
						
					</span>
					<span class="cancelOrder">取消订单</span>
				</div>				
			</div>
		</div>

		<div class="tips" id="items-tips">
			<div class="tips-arrow"></div>
			<!--<span>温馨提示：此订单将于<span id="items-delivery-time"><%= items.date %></span>下午4-6点配送</span>-->
            <span>温馨提示：<?php echo $tips;?></span>
		</div>
	</script>

	<!-- 订单结果中土特团列表的视图模版 -->
	<script type="text/template" id="tuansResultView-template">
		<div class="orderResult-form">	
			<div class="orderResult-list" id="tuans-order-result">
				<div class="order-info">
					<span>
						订单编号：
						<span id="order-no"><%= tuan_id %></span>
					</span>
					<span class="date" style="float: right"></span>
				</div>
				<div class="order-list" id="tuan-order-list">
					<ul>
					</ul>
				</div>
				<div class="divider"></div>
				<div class="total-info">
					<span>
						运费：<span>0</span>元，共<span><%= tuan_total %></span>元
					</span>
					<span class="cancelOrder">取消订单</span>
				</div>				
			</div>
		</div>

		<div class="tips" id="tuans-tips">
			<div class="tips-arrow"></div>
			<!--<span>温馨提示：此团购将于<span id="items-delivery-time"><%= tuans.date %></span>下午4-6点配送</span>-->
			<span>温馨提示：<?php echo $tips;?></span>
		</div>		
	</script>

	<!-- 订单中普通菜品条目视图模版 -->
	<script type="text/template" id="resultItemView-template">
		<span class="order-item-name"><%= name %></span>
		<span class="order-item-price">￥<%= total %></span>
		<span class="order-item-amount">×<%= count %></span>
	</script>

	<!-- 订单中土特团条目视图模版 -->
	<script type="text/template" id="resultTuanView-template">
		<span class="order-item-name"><%= Tutetuan.name %></span>
		<span class="order-item-price">￥<%= total %></span>
		<span class="order-item-amount">×<%= count %></span>
	</script>


	<!-- 我的订单视图模版 -->
	<script type="text/template" id="myOrdersView-template">
		<div class="my-order-header">
			<span>我的订单</span>			
		</div>
		
		<div class='myOrderList'>

		</div>

		<div class="history-loader">
			<img src="img/timer.png">
			<span class="history-loader-text">点击查看历史订单</span>
		</div>

		<div class="toolbar">
			<a class="next mybtn" href="javascript:void(0);">
				<span style="display: block; height: 39px; font-size: 1.2em;">我要选购</span>
			</a>
			<a class="user" href="javascript:void(0);">
				<img src="img/user.png"></a>
		</div>
	</script>

	<script type="text/template" id="oneDayOrderView-template">
		<div class="orderResult-form">
		</div>
	</script>

	<!-- 我的订单中普通菜品列表的视图模版 -->
	<script type="text/template" id="itemOrderView-template">
		<div class="dotted-divider"></div>	
		<div class="order-header">
			<span class="order-status">订单状态：<span class="status"><%= order_status %></span></span>
			<span class="cancelOrder">取消订单</span>
		</div>
		<div class="orderResult-list" id="items-order-result">
			<div class="order-info">
				<span>
					订单编号：
					<span id="order-no"><%= cart_id %></span>
				</span>
				<span class="date" style="float: right"></span>
			</div>
			<div class="order-list" id="item-order-list">
				<ul>
				</ul>
			</div>
			<div class="divider"></div>
			<div class="total-info">
				<span>
                运费：<span><%= trade_fee %></span>元，共<span>
                    <%= (free_trade_fee > 0 && free_trade_fee < cart_total) ? cart_total : (trade_fee + cart_total)  %>
                </span>元
				</span>
				<a class="btn dail-small">拨打电话催一催</a>
				<!--
				<img class="dail-small" src="img/dail-small.png">					
				-->
			</div>				
		</div>
	</script>

	<!-- 我的订单中土特团列表的视图模版 -->
	<script type="text/template" id="tuanOrderView-template">
		<div class="order-header">
			<span class="order-status">订单状态：<span class="status"><%= order_status %></span></span>
			<span class="cancelOrder">取消订单</span>
		</div>
		<div class="orderResult-list" id="tuans-order-result">
			<div class="order-info">
				<span>
					订单编号：
					<span id="order-no"><%= tuan_id %></span>
				</span>
				<span class="date" style="float: right"></span>
			</div>
			<div class="order-list" id="tuan-order-list">
				<ul>
				</ul>
			</div>
			<div class="divider"></div>
			<div class="total-info">
				<span>
					运费：<span>0</span>元，共<span><%= tuan_total %></span>元
				</span>
				<a class="btn dail-small">拨打电话催一催</a>
				<!--
				<img class="dail-small" src="img/dail-small.png">
				-->
			</div>		
		</div>
	</script>

	<!-- 警告弹窗视图模版 -->
	<script type="text/template" id="orderInfoPopupView-template">
		<div class="popup-header"></div>
		
		<div class="btn-group">
			<button class="btn">关闭</button>
		</div>
	</script>

	<!-- 确认弹窗视图模版 -->
	<script type="text/template" id="orderConfirmPopupView-template">
		<div class="popup-header"></div>

		<div class="popup-tips"></div>
		
		<div class="btn-group">
			<button class="btn" id="yes">确定</button>
			<button class="btn" id="no">取消</button>
		</div>
	</script>





<!--<script type="text/javascript" src="http://counter.sina.com.cn/ip/" charset="gb2312"></script>-->
<script src="js/components/jquery/jquery-1.8.3.min.js"></script>
<script src="js/components/jquery/tm.min.js"></script>
<script src="js/components/underscore/underscore.min.js"></script>
<script src="js/components/backbone/backbone.min.js"></script>	
<script src="js/components/backbone/backbone.touch.js"></script>
<!--
<script src="js/components/wechatpay/core-min.js"></script>
<script src="js/components/wechatpay/md5.js"></script>
<script src="js/components/wechatpay/sha1.js"></script>
<script src="js/components/wechatpay/wxpay.js"></script>-->
<script src="js/models/models.js"></script>
<script src="js/views/views.js"></script>
<script src="js/songcai.js"></script>	
</body>

</html>