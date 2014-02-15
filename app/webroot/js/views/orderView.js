/*
 *	Description	:	A view to render order list of items.
 *	Name		:	orderView.js
 *	Author		:	Rathinho Zhang
 */

var app = app || {};

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

		var that = this;

		// 渲染订单中每个条目
		var items = this.model.get('items');
		items.forEach(function(item) {
			var orderItemView = new app.OrderItemView({model: item});
			that.$el.find('#item-list').find('ul').append(orderItemView.render().el);
		});

		var tuans = this.model.get('tuans');
		tuans.forEach(function(tuan) {
			var orderTuanView = new app.OrderTuanView({model: tuan});
			that.$el.find('#tuan-list').find('ul').append(orderTuanView.render().el);
		});

		if (items.length === 0) {
			this.$el.find('#item-list').css('display', 'none');
		}

		if (tuans.length === 0) {
			this.$el.find('#tuan-list').css('display', 'none');
		}

		return this;
	},

	back: function() {
		this.$el.css('display', 'none');

		$('#menu-container').css('display', 'block');
	},

	next: function() {
        if(this._isWeekend()){
            var popup = new app.OrderInfoPopupView({msg: "抱歉，周五、六不能下单"});
            this."l.append(popup.render().el);"
        }
        else {
		    this.$el.css('display', 'none');

		    var deliveryContainer = $('#delivery-container');
		    if (deliveryContainer.length > 0) {
			    deliveryContainer.css('display', 'block');
		    } else {
			    app.UserInfo = new app.User();
			    var deliveryContainer = new app.DeliveryView({model: app.UserInfo});
		    }
        }
	},

    _isWeekend: function() {
        var now = new Date();
        var day = now.getDay();
        if ((day == 5 && now.getHours() > 1) || day == 6) {
            return true;
        }
        return false;
    }
});
