<template>
	<div id="shopcart">
		<div class="content" @click="toggleShowList">
			<div class="content-left">
				<div class="logo-wrap">
					<div class="logo" :class="{'highlight': totalCount>0}">
						<span class="icon-shopping_cart"></span>
					</div>
					<div class="num" v-show="totalCount>0">{{totalCount}}</div>
				</div>
				<div class="price" :class="{'highlight': totalPrice>0}">￥{{totalPrice}}</div>
				<div class="desc">另需配送费{{deliveryPrice}}元</div>
			</div>
			<div class="content-right">
				<div class="pay" @click.stop="toPay" :class="payClass">{{payDesc}}</div>
			</div>
		</div>
		<div class="ball-container">
			<transition v-for="(ball,index) in balls" @before-enter="beforeEnter" @enter="enter" @after-enter="afterEnter" name="dropball" :key="index">
				<div v-show="ball.show" class="ball">
					<div class="ball-hook"></div>
				</div>
			</transition>
		</div>
		<transition name="fold">
			<div class="shopcart-list" v-show="listShow">
				<div class="list-header">
					<h1 class="title">购物车</h1>
					<span class="empty" @click="empty">清空</span>
				</div>
				<div class="list-content" ref="listContent">
					<ul>
						<li class="food" v-for="(food,index) in selectFoods" :key="index">
							<span class="name">{{food.name}}</span>
							<div class="price">
								<span>￥{{food.price * food.count}}</span>
							</div>
							<div class="cartcontrol-wrap">
								<cartcontrol @cartAdd="cartcontrolAdd" :food="food"></cartcontrol>
							</div>
						</li>
					</ul>
				</div>
			</div>
		</transition>
		<transition name="fade">
			<div class="list-mask" @click="hideList" v-show="listShow"></div>
		</transition>
	</div>
</template>

<script>
	import BScroll from 'better-scroll';
	import cartcontrol from '../cartcontrol/cartcontrol.vue';

	export default {
		props: {
			deliveryPrice: {
				type: Number,
				default: 0
			},
			minPrice: {
				type: Number,
				default: 0
			},
			selectFoods: {
				type: Array,
				default() {
					return []
				}
			},
			// food: {
			// 	type: Object
			// }
		},
		components: {
			'cartcontrol': cartcontrol
		},
		data(){
			return {
				balls: [
					{
						show: false
					},
					{
						show: false
					},
					{
						show: false
					},
					{
						show: false
					},
					{
						show: false
					}
				],
				dropBalls: [],
				fold: true
			}
		},
		computed: {
			totalPrice() {
				let total = 0;
				this.selectFoods.forEach(food => {
					total += food.price * food.count
				})
				return total;
			},
			totalCount() {
				let count = 0;
				this.selectFoods.forEach(food => {
					count +=food.count
				})
				return count;
			},
			payDesc() {
				if (this.totalPrice === 0) {
					return `￥${this.minPrice}元起送`;
				} else if (this.totalPrice>0 && this.totalPrice<this.minPrice) {
					let diff = this.minPrice -this.totalPrice;
					return `还差￥${diff}起送`;
				} else if (this.totalPrice>=this.minPrice) {
					return `去结算`;
				}
			},
			payClass() {
				if (this.totalPrice<this.minPrice) {
					return 'no-enough'
				} else {
					return 'enough'
				}
			},
			listShow() {
				if (!this.totalCount) {
					this.fold = true;
					return false
				}

				let show = !this.fold;
				this.$nextTick(() => {
					if (show) {
						if (!this.scroll) {
							this.scroll = new BScroll(this.$refs.listContent, {
								click: true
							});
						} else {
							this.scroll.refresh()
						}
					}
				})

				return show;
			}
		},
		mounted(){

		},
		methods: {
			beforeEnter(el) {
				let count = this.balls.length;
        while (count--) {
          let ball = this.balls[count];
          if (ball.show) {
            let rect = ball.el.getBoundingClientRect();
            let x = rect.left - 32;
            let y = -(window.innerHeight - rect.top - 22);
            el.style.display = '';
            el.style.webkitTransform = `translate3d(0,${y}px,0)`;
            el.style.transform = `translate3d(0,${y}px,0)`;
            let inner = el.getElementsByClassName('ball-hook')[0];
            inner.style.webkitTransform = `translate3d(${x}px,0,0)`;
            inner.style.transform = `translate3d(${x}px,0,0)`;
          }
        }
			},
			enter(el, done) {

				let rf = el.offsetHeight;		//手动触发重绘html
        this.$nextTick(() => {		////让动画效果异步执行,提高性能
          el.style.webkitTransform = 'translate3d(0,0,0)';
          el.style.transform = 'translate3d(0,0,0)';
          let inner = el.getElementsByClassName('ball-hook')[0];
          inner.style.webkitTransform = 'translate3d(0,0,0)';
          inner.style.transform = 'translate3d(0,0,0)';
          el.addEventListener('transitionend', done);
        });
			},
			afterEnter(el) {
				let ball = this.dropBalls.shift();
        if (ball) {
          ball.show = false;
          el.style.display = 'none';
        }
			},
			drop(target) {
				for (let i = 0; i <this.balls.length; i++) {
					let ball = this.balls[i]
					if (!ball.show) {
						ball.show = true;
						ball.el = target;
						this.dropBalls.push(ball)
						return;
					}
				}
			},
			toggleShowList() {
				if (!this.totalCount) {
					return
				}
				this.fold = !this.fold;
			},
			empty() {
				this.selectFoods.forEach((food) => {
					food.count = 0;
				})
			},
			hideList() {
				this.fold = true;
			},
			toPay() {
				if (this.totalPrice < this.minPrice) {
					return;
				}
				alert(`需支付￥${this.totalCount}元!`)
			},
			cartcontrolAdd(target) {
				this.drop(target);
			}
		}
	}
</script>

<style lang="less" scoped>
	@import '../../commom/less/mixin.less';

	#shopcart {
		position: fixed;
		left: 0;
		bottom: 0;
		width: 100%;
		height: 48px;
		z-index: 50;

		.content {
			display: flex;
			height: 48px;
			background: #141d27;
			
			.content-left {
				flex: 1;
				font-size: 0;

				.logo-wrap {
					display: inline-block;
					vertical-align: top;
					position: relative;
					top: -10px;
					box-sizing: border-box;
					width: 56px;
					height: 56px;
					padding: 6px;
					margin: 0 18px;
					border-radius: 50%;
					background: #141d27;

					.logo {
						width: 100%;
						height: 100%;
						border-radius: 50%;
						text-align: center;
						background: rgba(255,255,255,0.2);
						
						&.highlight {
							background: rgb(0,160,220);

							.icon-shopping_cart {
								color: #fff;
							}
						}

						.icon-shopping_cart {
							font-size: 24px;
							line-height: 44px;
							color: rgba(255,255,255,0.4);
						}
					}

					.num {
						position: absolute;
						top: 0;
						right: 0;
						width: 24px;
						height: 16px;
						text-align: center;
						line-height: 16px;
						color: #fff;
						font-size: 9px;
						font-weight: 700;
						border-radius: 16px;
						background: rgb(240,20,20);
						box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.4);
					}
				}

				.price {
					display: inline-block;
					vertical-align: top;
					margin-top: 12px;
					padding-right: 12px;
					border-right: 1px solid rgba(255, 255, 255, 0.1);
					line-height: 24px;
					font-size: 16px;
					font-weight: 700;
					color: rgba(255,255,255,0.4);

					&.highlight {
						color: #fff;
					}
				}

				.desc {
					display: inline-block;
					vertical-align: top;
					margin: 12px;
					line-height: 24px;
					font-size: 10px;
					font-weight: 100;
					color: rgba(255,255,255,0.4);
				}
			}
			.content-right {
				flex: 0 0 105px;
				width: 105px;
				font-size: 12px;
				color: rgba(255,255,255,0.2);
				font-weight: 700;
				line-height: 24px;

				.pay {
					height: 48px;
					line-height: 48px;
					text-align: center;
					font-size: 12px;
					font-weight: 700;
					
					&.no-enough {
						color: rgba(255,255,255,0.4);
						background: rgb(43,51,59);
					}
					&.enough {
						color: #fff;
						background: #00b43c;
					}
				}
			}
		}

		.ball-container {

			.ball {
				position: fixed;
				left: 36px;
				bottom: 22px;
				z-index: 200;
				transition: all 0.3s cubic-bezier(0.49, -0.29, 0.75, 0.41);

				.ball-hook {
					width: 16px;
					height: 16px;
					background: #00a0dc;
					border-radius: 50%;
					transition: all 0.3s linear;
				}
			}
		}

		.shopcart-list {
			position: absolute;
			top: 0;
			left: 0;
			width: 100%;
			z-index: -1;
			transform: translate3d(0,-100%,0);
			
			&.fold-enter-active, &.fold-leave-active {
				transition: all 0.4s;
			}
			&.fold-enter, &.fold-leave-to {
				transform: translate3d(0,0,0);
			}

			.list-header {
				height: 40px;
				line-height: 40px;
				padding: 0 18px;
				background: #f3f5f7;
				border-bottom: 1px solid rgba(7, 17, 27, 0.1);

				.title {
					float: left;
					font-size: 14px;
					font-weight: 200;
					color: rgb(7,17,27);
				}

				.empty {
					float: right;
					font-size: 12px;
					color: rgb(0,160,220);
				}
			}

			.list-content {
				padding: 0 18px;
				max-height: 217px;
				overflow: hidden;
				background: #fff;

				.food {
					position: relative;
					padding: 12px 0;
					.border-bottom-1px(rgba(1,17,27,0.1));

					.name {
						line-height: 24px;
						font-size: 14px;
						color: rgb(7,17,27);
					}

					.price {
						position: absolute;
						right: 98px;
						bottom: 12px;
						font-size: 14px;
						line-height: 24px;
						color: rgb(240,20,20);
					}

					.cartcontrol-wrap {
						position: absolute;
						right: 0;
						bottom: 6px;
					}

					&:last-child {
						.border-bottom-none(); 
					}
				}
			}
		}

		.list-mask {
			position: fixed;
			top: 0;
			left: 0;
			width: 100%;
			height: 100%;
			z-index: -2;
			background: rgba(7,17,27,0.6);
			backdrop-filter: blur(10px);

			&.fade-enter-active, &.fade-leave-active {
				transition: all 0.4s;
				opacity: 1;
			}
			&.fade-enter, &.fade-leave-to {
				opacity: 0;
			}
		}
	}
</style>