<template>
	<div id="goods">
		<div class="menu-wrap" ref="menuWrap">
			<ul>
				<li v-for="(item,index) in goods" class="meun-item" :class="{'menuIndex': index == menuIndex}" :key="index" @click="selectMenu(index,$event)">
					<span class="text">
						<span v-if="item.type >= 0" class="icon" :class="classMap[item.type]"></span>{{item.name}}
					</span>
				</li>
			</ul>
		</div>
		<div class="foods-wrap" ref="foodsWrap">
			<ul>
				<li v-for="items in goods" class="foods foods-hook" >
					<h1 class="title">{{items.name}}</h1>
					<ul>
						<li v-for="food in items.foods" @click="selectFood(food,$event)" class="food-item">
							<div class="icon">
								<img width="57" height="57" :src="food.icon" alt="">
							</div>
							<div class="content">
								<h2 class="name">{{food.name}}</h2>
								<p class="desc">{{food.description}}</p>
								<div class="extra">
									<span class="count">月售{{food.sellCount}}份</span><span>好评率{{food.rating}}%</span>
								</div>
								<div class="price">
									<span class="now">￥{{food.price}}</span><span v-if="food.oldPrice" class="old">￥{{food.oldPrice}}</span>
								</div>
								<div class="cartcontrol-wrap">
									<cartcontrol @cartAdd="cartcontrolAdd" :food="food"></cartcontrol>
								</div>
							</div>
						</li>
					</ul>
				</li>
			</ul>
		</div>
		<shopCart ref="shopCart" :selectFoods="selectFoods" :deliveryPrice="seller.deliveryPrice" :minPrice="seller.minPrice"></shopCart>
		<foodView ref="foodView"  @goodAdd="cartcontrolAdd" :food="selectedFood"></foodView>
	</div>
</template>

<script>
	import BScroll from 'better-scroll';
	import shopCart from '../shopcart/shopCart.vue';
	import cartcontrol from '../cartcontrol/cartcontrol.vue';
	import foodView from '../food/food.vue';
	export default {
		props: {
			seller: {
				type: Object
			}
		},
		components: {
			'shopCart': shopCart,
			'cartcontrol': cartcontrol,
			'foodView': foodView,
		},
		data() {
			return {
				goods: [],
				classMap: [
					'decrease',
					'discount',
					'special',
					'invoice',
					'guarantee'
				],
				listHeight: [],
				foodScrollY: 0,
				selectedFood: {}
			}
		},
		watch: {
			goods(cur,prev){
				// console.log(cur,prev)
			},
			seller(cur,prev) {
				// console.log(cur,prev)
			}
		},
		computed: {
			menuIndex() {
				for (let i = 0; i < this.listHeight.length; i++) {
					let height1 = this.listHeight[i];
					let height2 = this.listHeight[i+1];
					if (!height2 ||this.foodScrollY >= height1 && this.foodScrollY < height2) {
						return i;
					}
				}
			},
			selectFoods() {
				let arr = []
				this.goods.forEach(good => {
					good.foods.forEach(food => {
						if(food.count) {
							arr.push(food)
						}
					})
				})

				return arr;
			}
		},
		created() {
			let self = this;
			this.$http.get('/api/goods').then(response => {
				if (response.data.errno == 0) {
	        this.goods = response.data.data;
	        this.$nextTick(() => {
	        	this.initScroll();
	        	this.caculateHeight();
	        })
	      }
			})
				.catch(err => {
					console.log(error)
				})
		},
		mounted() {
			
		},
		methods: {
			initScroll() {
				this.menuScroll = new BScroll(this.$refs.menuWrap, {
					click: true
				});
				this.foodsScroll = new BScroll(this.$refs.foodsWrap, {
					probeType: 3,
					click: true
				});

				this.foodsScroll.on('scroll', pos => {
					this.foodScrollY = Math.abs(Math.floor(pos.y));
				})
			},
			caculateHeight() {
				let foodList = this.$refs.foodsWrap.getElementsByClassName("foods-hook");
				let height = 0;
				this.listHeight.push(height);
				for (let i = 0; i < foodList.length; i++) {
					height += foodList[i].clientHeight;
					this.listHeight.push(height);
				}
				// console.log(this.listHeight)
			},
			selectMenu(index,event) {
				let foodList = this.$refs.foodsWrap.getElementsByClassName("foods-hook");
				let el = foodList[index];
				this.foodsScroll.scrollToElement(el,300);
			},
			cartcontrolAdd(target) {
				this.$refs.shopCart.drop(target)
			},
			selectFood(food,event) {
				this.selectedFood = food;
				this.$refs.foodView.show();
			}
		}
	}
</script>

<style lang="less" scoped>
@import '../../commom/less/mixin.less';

.background-img(@url) {
	@png2: '@2x.png';
	@png3: '@3x.png';
	background-image: url('@{url}@{png2}');

	@media (-webkit-min-device-pixel-ratio: 2),(min-device-pixel-ratio: 2) {
		background-image: url('@{url}@{png3}');
	}
}

	#goods {
		display: flex;
		position: absolute;
		top: 174px;
		bottom: 46px;
		overflow: hidden;
		width: 100%;

		.menu-wrap {
			flex: 0 0 80px;
			width: 80px;
			background: #f3f5f7;

			.meun-item {
				display: table;
				padding: 0 12px;
				height: 54px;
				width: 56px;
				line-height: 14px;
				font-weight: 200;
				font-size: 12px;

				&.menuIndex {
					position: relative;
					margin-top: -1px;
					background: #fff;
					color: rgb(240,20,20);
					
					.text{
						.border-bottom-none();	
					}
				}

				.icon {
					display: inline-block;
					vertical-align: top;
					width: 12px;
					height: 12px;
					margin-right: 2px;
					background-size: 12px 12px;
					background-repeat: no-repeat;
					&.decrease {
						.background-img('img/decrease_3');
					}
					&.discount {
						.background-img('img/discount_3');
					}
					&.guarantee {
						.background-img('img/guarantee_3');
					}
					&.invoice {
						.background-img('img/invoice_3');
					}
					&.special {
						.background-img('img/special_3');
					}
				}
				.text {
					display: table-cell;
					vertical-align: middle;
					.border-bottom-1px(rgba(7,17,27,0.1));
				}
			}
		}

		.foods-wrap {
			flex: 1;

			.title {
				padding-left: 12px;
				height: 26px;
				line-height: 26px; 
				border-left: 2px solid #d9dde1;
				font-size: 12px;
				color: rgb(147,153,195);
				background-color: #f3f5f7;
			}

			.food-item {
				display: flex;
				margin: 18px;
				padding-bottom: 18px;
				.border-bottom-1px(rgba(7,17,27,0.1));

				&:last-child {
					.border-bottom-none();
					margin-bottom: 0;
				}

				.icon {
					flex: 0 0 57px;
					width: 57px;
					font-size: 0;
					margin-right: 10px;
				}

				.content {
					flex: 1;

					.name {
						margin: 2px 0 8px;
						font-size: 14px;
						line-height: 14px;
						color: rgb(7,17,27);
					}

					.desc {
						margin-bottom: 8px;
						font-size: 10px;
						line-height: 12px;
						color: rgb(147,153,159);
					}

					.extra {
						line-height: 10px;
						font-size: 10px;

						.count {
							margin-right: 12px;
						}
					}

					.price {
						line-height: 24px;
						font-weight: 700;

						.now {
							font-size: 14px;
							color: rgb(240,20,20);
							margin-right: 8px;
						}

						.old {
							font-size: 10px;
							color: rgb(147,153,159);
							text-decoration: line-through;
						}
					}

					.cartcontrol-wrap {
						position: absolute;
						bottom: 24px;
						right: 0;
						height: 24px;

					}
				}
			}
		}
	}

</style>