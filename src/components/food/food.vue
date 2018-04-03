<template>
	<transition name="foodView">
		<div v-show="showFlag" id="food" ref="food">
			<div class="food-content">
				<div class="content-header">
					<img class="img" :src="food.image">
					<div class="back">
						<i class="icon-arrow_lift" @click.stop.prevent="hide"></i>
					</div>
				</div>
				<div class="content">
					<h1 class="title">{{food.name}}</h1>
					<div class="detail">
						<span class="sell-count">月售{{food.sellCount}}份</span><span class="rating">好评率{{food.rating}}%</span>
					</div>
					<div class="price">
						<span class="now">￥{{food.price}}</span><span v-if="food.oldPrice" class="old">￥{{food.oldPrice}}</span>
					</div>
					<div class="cartcontrol-wrap">
						<cartcontrol @cartAdd="cartcontrolAdd" :food="food"></cartcontrol>
					</div>
					<transition name="fade">
						<div class="buy" @click.stop.prevent="addFirst($event)" v-show="!food.count || food.count===0">加入购物车</div>
					</transition>
				</div>
				<split v-if="food.info"></split>
				<div class="info" v-if="food.info">
					<h1 class="title">商品信息</h1>
					<p class="text">{{food.info}}</p>
				</div>
				<split></split>
				<div class="rating">
					<h1 class="title">商品评价</h1>
					<ratingSelect :selectType="selectType" :desc="desc" :onlyContent="onlyContent" :ratings="food.ratings" @selectTypeChange="selectTypeChange" @onlyContentChange="onlyContentChange"></ratingSelect>
				</div>
				<div class="ratings-wrap">
					<ul v-show="food.ratings && food.ratings.length">
						<li class="ratings-item" v-for="(rating,index) in food.ratings" :key="index" v-show="needShow(rating.rateType,rating.text)">
							<div class="user">
								<span class="name">{{rating.username}}</span>
								<img class="avatar" :src="rating.avatar" width="12" height="12">
							</div>
							<div class="time">{{rating.rateTime | formatDate}}</div>
							<p class="text">
								<span :class="{'icon-thumb_down':rating.rateType===0,'icon-thumb_up':rating.rateType===1}"></span>{{rating.text}}
							</p>
						</li>
					</ul>
					<div class="no-ratings" v-show="!food.ratings || !food.ratings.length">暂无评价</div>
				</div>
			</div>
		</div>
	</transition>
</template>

<script>
	import BScroll from 'better-scroll';
	import { formatDate } from '../../commom/js/formatDate.js';
	import Vue from 'vue';
	import cartcontrol from '../cartcontrol/cartcontrol.vue';
	import split from '../split/split.vue';
	import ratingSelect from '../ratingselect/ratingselect.vue';

	const POSITIVE = 0;
	const NEGATIVE = 1;
	const ALL  = 2;

	export default {
		props: {
			food: {
				type: Object
			}
		},
		components: {
			'cartcontrol': cartcontrol,
			'split': split,
			'ratingSelect': ratingSelect
		},
		data() {
			return {
				showFlag: false,
				selectType: ALL,
				onlyContent: false,
				desc: {
					all: '全部',
					positive: '推荐',
					negative: '吐槽'
				}
			}
		},
		filters: {
			formatDate(time) {
				let date = new Date(time);
				return formatDate(date,'yyyy-MM-dd hh:mm');
			}
		},
		methods: {
			show() {
				this.showFlag = true
				this.selectType = ALL
				this.onlyContent = false
				this.$nextTick(() => {
					if (!this.scroll) {
						this.scroll = new BScroll(this.$refs.food, {
							click: true
						})
					} else {
						this.scroll.refresh();
					}
				})
			},
			hide() {
				this.showFlag = false
			},
			addFirst(event) {
				Vue.set(this.food,'count',1);
				this.$emit('goodAdd',event.target)
			},
			cartcontrolAdd(target) {
				this.$emit('goodAdd',target)
			},
			selectTypeChange(type) {
				this.selectType = type;
				this.$nextTick(() => {
					this.scroll.refresh();
				})
			},
			onlyContentChange() {
				this.onlyContent = !this.onlyContent;
				this.$nextTick(() => {
					this.scroll.refresh();
				})
			},
			needShow(type,text) {
				if (this.onlyContent && text==='') {
					return false;
				}
				if (this.selectType === ALL) {
					return true;
				} else {
					return this.selectType === type
				}
			}
		}
	}
</script>

<style lang="less" scoped>
@import '../../commom/less/mixin.less';

	#food {
		position: fixed;
		top: 0;
		left: 0;
		bottom: 48px;
		width: 100%;
		background: #fff;
		z-index: 40;

		&.foodView-enter-active, &.foodView-leave-active {
			transition: all 0.3s linear;
			transform: translate3d(0,0,0);
		}
		&.foodView-enter, &.foodView-leave-to {
			transform: translate3d(100%,0,0);
		}

		.content-header {
			position: relative;
			width: 100%;
			height: 0;
			font-size: 0;
			padding-top: 100%;

			.img {
				position: absolute;
				top: 0;
				left: 0;
				width: 100%;
				height: 100%;
			}

			.back {
				position: absolute;
				top: 10px;
				left: 0;

				.icon-arrow_lift {
					display: block;
					padding: 15px;
					font-size: 20px;
					color: #fff;
				}
			}
		}

		.content {
			position: relative;
			padding: 18px;

			.title {
				height: 14px;
				margin-bottom: 8px;
				line-height: 14px;
				font-weight: 700;
				color: rgb(7,17,27);
			}

			.detail {
				height: 10px;
				margin-bottom: 18px;
				line-height: 10px;
				color: rgb(147,153,159);
				font-size: 10px;

				.sell-count {
					margin-right: 12px;
				}
			}

			.price {
				height: 24px;
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
				bottom: 12px;
				right: 12px;
			}

			.buy {
				position: absolute;
				bottom: 18px;
				right: 18px;
				height: 24px;
				padding: 6px 12px;
				box-sizing: border-box;
				line-height: 12px;
				font-size: 10px;
				color: #fff;
				border-radius: 12px;
				background: rgb(0,160,220);

				&.fade-enter-active, &.fade-leave-active {
					opacity: 1;
					transition: all 0.3s;
				}
				&.fade-enter, &.fade-leave-to {
					opacity: 0;
					z-index: -1;
				}
			}
		}

		.info {
			padding: 18px;

			.title {
				line-height: 14px;
				font-size: 14px;
				margin-bottom: 6px;
				color: rgb(7,17,27);
			}

			.text {
				padding: 0 4px;
				line-height: 24px;
				font-size: 12px;
				color: rgb(78,85,93);
				font-weight: 200;
			}
		}

		.rating {
			padding-top: 18px;

			.title {
				line-height: 14px;
				margin-left: 16px;
				font-size: 14px;
				color: rgb(7,17,27);
			}
		}

		.ratings-wrap {
			padding: 0 18px;

			.ratings-item {
				position: relative;
				padding: 16px 0;
				.border-bottom-1px(rgba(7,17,27,0.1));
				&:last-child {
					.border-bottom-none();
				}

				.user {
					position: absolute;
					right: 0;
					top: 16px;
					line-height: 12px;

					.name {
						display: inline-block;
						vertical-align: top;
						font-size: 10px;
						margin-right: 8px;
					}

					.avatar {
						display: inline-block;
						font-size: 0;
						border-radius: 50%;
					}
				}

				.time {
					margin-bottom: 6px;
					line-height: 12px;
					font-size: 10px;
					color: rgb(147,153,159);
				}

				.text {
					line-height: 16px;
					font-size: 12px;
					color: rgb(7,17,27);

					.icon-thumb_down {
						color: rgb(147,153,159);
						line-height: 24px;
						font-size: 12px;
						margin-right: 4px;
					}

					.icon-thumb_up {
						color: rgb(0,160,220);
						line-height: 24px;
						font-size: 12px;
						margin-right: 4px;
					}
				}
			}

			.no-ratings {
				text-align: center;
				padding: 16px 0;
				font-size: 12px;
				color: rgb(147, 153, 159);
			}
		}
	}
</style>