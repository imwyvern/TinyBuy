var app = app || {};

app.Delivery = Backbone.Model.extend({
	defaults: {
		way: "",
		time: "",
	},

	initialize: function() {
		console.log("A delivery model has been created!");
	}
});

app.Extra = Backbone.Model.extend({
	defaults: {
		transfee: "",
		discounts: ""
	},

	initialize: function() {
		console.log("An extra model has been created!");
	}
});

app.Item = Backbone.Model.extend({
	defaults: {
		id: "",
		cost: "",
		detail: "",
		name: "",
		picurl: "",
		image: "",
		price: 0,
		priority: "",
		sale: "",
		status: "",
		weight: "",
		count: 0,
		total: 0
	},

	initialize: function() {
		this.set('id', this.get('id'));

		this.on("invalid", function(model, error) {
			console.log(error);
		});
	},

	validate: function(attrs) {

	}
});

app.Order = Backbone.Model.extend({
	defaults: {
		id: "",
		time: "",
		price: 0,
		count: 0,
		total: 0,
		item_count: 0,
		item_total: 0,
		tuan_count: 0,
		tuan_total: 0,
		items: null,
		tuans: null,
	},

	initialize: function() {
		var that = this;
		var items = new app.ItemCollection();
		var tuans = new app.ItemCollection();
		this.set('items', items);
		this.set('tuans', tuans);

		this.on('invalid', function(model, error) {
			console.log(error);
		});

		// 为订单的菜品集合添加add事件监听
		this.get('items').on('add', function(model) {
			model.set('count', 1);
			model.set('total', parseInt(model.get('price')));
			that.set('item_count', that.get('item_count') + model.get('count'));
			that.set('item_total', that.get('item_total') + model.get('count') * parseInt(model.get('price')));
			that.set('count', parseInt(that.get('item_count')) + parseInt(that.get('tuan_count')));
			that.set('total', parseInt(that.get('item_total')) + parseInt(that.get('tuan_total')));
		});

		// 为订单的菜品集合添加remove事件监听
		this.get('items').on('remove', function(model) {
			that.set('item_count', that.get('item_count') - model.get('count'));
			that.set('item_total', that.get('item_total') - model.get('count') * parseInt(model.get('price')));
			that.set('count', that.get('item_count') + that.get('tuan_count'));
			that.set('total', that.get('item_total') + that.get('tuan_total'));
		});
		
		// 为订单的团购菜品集合添加add事件监听
		this.get('tuans').on('add', function(model) {
			model.set('count', 1);
			model.set('total', parseInt(model.get('price')));
			that.set('tuan_count', that.get('tuan_count') + model.get('count'));
			that.set('tuan_total', that.get('tuan_total') + model.get('count') * parseInt(model.get('price')));
			that.set('count', that.get('item_count') + that.get('tuan_count'));
			that.set('total', that.get('item_total') + that.get('tuan_total'));
		});

		// 为订单的团购菜品集合添加remove事件监听
		this.get('tuans').on('remove', function(model) {
			that.set('tuan_count', that.get('tuan_count') - model.get('count'));
			that.set('tuan_total', that.get('tuan_total') - model.get('count') * parseInt(model.get('price')));
			that.set('count', that.get('item_count') + that.get('tuan_count'));
			that.set('total', that.get('item_total') + that.get('tuan_total'));
		});

		this.on('change:item_count', function() {
			var item_count = 0;
			var tuan_count = 0;
			if(that.get('tuan_count'))
				tuan_count = that.get('tuan_count');
			if(that.get('item_count'))
				item_count = that.get('item_count');
			that.set('count', item_count+tuan_count);
			//that.set('item_total', that.get('item_total') + item_count * parseInt(that.get('price')));
			
			//$('.items-total-price').html(that.get('item_total'));
			//$('.items-total-amount').html(that.get('item_count'));
		});

		this.on('change:item_total', function() {
			var tuan_total = 0;
			var item_total = 0;
			if(that.get('tuan_total'))
				tuan_total = that.get('tuan_total');
			if(that.get('item_total'))
				item_total = that.get('item_total');
			that.set('total', item_total + tuan_total);
			$('.items-total-price').html(item_total);
		});
		
		this.on('change:tuan_count', function() {
			var tuan_total = 0;
			var item_total = 0;
			if(that.get('tuan_total'))
				tuan_total = that.get('tuan_total');
			if(that.get('item_total'))
				item_total = that.get('item_total');
			that.set('total', item_total + tuan_total);
		});

		this.on('change:tuan_total', function() {
			var tuan_total = 0;
			var item_total = 0;
			if(that.get('tuan_total'))
				tuan_total = that.get('tuan_total');
			if(that.get('item_total'))
				item_total = that.get('item_total');
			that.set('total', item_total + tuan_total);
			$('.tuans-total-price').html(tuan_total);
		});
		
		// 为订单的菜品数目添加change事件监听
		this.on('change:count', function(data) {
			$('.total-amount').each(function() {
				$(this).html(that.get('count'));
			});

			if (data.get('count') <= 0) {
				app.shoppingCartV.$el.hide();
			} else {
				app.shoppingCartV.$el.show();
			}
		});

		// 为订单的总价格添加change事件监听
		this.on('change:total', function() {
			$('.total-price').each(function() {
				$(this).html(that.get('total'));
			});
		});
	},

	validate: function(attrs) {
		if (typeof attrs.count !== 'number') {
			return "count must be a number";
		} else if (typeof attrs.count === 'number' && attrs.count < 0) {
			return "count can not be less than zero";
		}
	}
});

app.Payment = Backbone.Model.extend({
	defaults: {
		online: {
			name: 'online',
			label: '在线支付',
			status: false
		},

		cool: {
			name: 'cool',
			label: '货到付款',
			status: false
		}
	},

	initialize: function() {
		// console.log("A payment model has been created!");
	}
});

app.User = Backbone.Model.extend({
	defaults: {
		wechatId: "",
		name: "",
		address: "",
		phone: "",
		remark: ""
	},

	initialize: function() {
		// console.log("A user model has been created!");

		this.on("invalid", function(model, error) {
			console.log(error);
		});
	},

	validate: function(attrs) {
		
	}
});



app.ItemCollection = Backbone.Collection.extend({
	model: app.Item,
});