<template>
	<div id="ratings" ref="ratings">
		<div class="ratings-content">
			<div class="overview">
				<div class="overview-left">
					<h1 class="score">{{seller.score}}</h1>
					<div class="title">综合评分</div>
					<div class="rankRate">高于周边商家{{seller.rankRate}}%</div>
				</div>
				<div class="overview-right">
					<div class="score-wrap">
						<span class="name">服务态度</span>
						<v-star :size="36" :score="seller.serviceScore"></v-star>
						<span class="score">{{seller.serviceScore}}</span>
					</div>
					<div class="score-wrap">
						<span class="name">商品评分</span>
						<v-star :size="36" :score="seller.foodScore"></v-star>
						<span class="score">{{seller.foodScore}}</span>
					</div>
					<div class="delivery-wrap">
						<span class="title">送达时间</span>
						<span class="delivery">{{seller.deliveryTime}}分钟</span>
					</div>
				</div>
			</div>
			<v-split></v-split>
			<v-ratingSelect :ratings="ratings" :selectType="selectType" :onlyContent="onlyContent" @selectTypeChange="selectTypeChange" @onlyContentChange="onlyContentChange"></v-ratingSelect>
			<div class="ratings-wrap">
				<ul>
					<li v-for="rating in ratings" class="ratings-item" v-show="needShow(rating.rateType,rating.text)">
						<div class="avatar">
							<img :src="rating.avatar" width="28" height="28">
						</div>
						<div class="content">
							<h1 class="name">{{rating.username}}</h1>
							<div class="star-wrap">
								<v-star :size="24" :score="rating.score"></v-star>
								<span class="delivery" v-show="rating.deliveryTime">{{rating.deliveryTime}}分钟送达</span>
							</div>
							<p class="text">{{rating.text}}</p>
							<div class="recommend" v-show="rating.recommend && rating.recommend.length">
								<span class="icon" :class="{'icon-thumb_up': true}"></span>
								<span class="item" v-for="item in rating.recommend">{{item}}</span>
							</div>
							<div class="rateTime">{{rating.rateTime | formatDate}}</div>
						</div>
					</li>
				</ul>
			</div>
		</div>
	</div>
</template>

<script>
	import BScroll from 'better-scroll';
	import { formatDate } from '../../commom/js/formatDate.js';
	import star from '../star/star.vue';
	import split from '../split/split.vue';
	import ratingSelect from '../ratingselect/ratingselect.vue';

	const POSITIVE = 0;
	const NEGATIVE = 1;
	const ALL  = 2;

	export default {
		props: {
			seller: {
				type: Object
			}
		},
		components: {
			'v-star': star,
			'v-split': split,
			'v-ratingSelect': ratingSelect
		},
		data() {
			return {
				ratings: [],
				showFlag: false,
				selectType: ALL,
				onlyContent: false,
			}
		},
		created() {
    	let self = this;
			this.$http.get('/api/ratings').then(response => {
				if (response.data.errno == 0) {
	        self.ratings = response.data.data
	        self.$nextTick(() => {
	        	self.scroll = new BScroll(self.$refs.ratings, {
	        		click: true
	        	})
	        })
	      }
			})
		},
		filters: {
			formatDate(time) {
				let date = new Date(time);
				return formatDate(date,'yyyy-MM-dd hh:mm');
			}
		},
		methods: {
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

	#ratings {
		position: absolute;
		top: 174px;
		left: 0;
		bottom: 0;
		width: 100%;
		overflow: hidden;

		.ratings-content {

			.overview {
				display: flex;
				padding: 18px 0;

				.overview-left {
					flex: 0 0 137px;
					width: 137px;
					padding: 6px 0;
					font-size: 0;
					text-align: center;
					.border-right-1px(rgba(7,17,27,0.1));
					@media only screen and (max-width: 320px) {
						flex: 0 0 120px;
						width: 120px;
					}

					.score {
						margin-bottom: 6px;
						font-size: 24px;
						color: rgb(255,153,0);
						line-height: 28px;
					}

					.title {
						margin-bottom: 8px;
						font-size: 12px;
						color: rgb(7,17,27);
						line-height: 12px;
					}

					.rankRate {
						font-size: 10px;
						color: rgb(147,153,159);
						line-height: 10px;
					}
				}

				.overview-right {
					flex: 1;
					padding: 6px 0 6px 24px;
					@media only screen and (max-width: 320px) {
						padding-left: 6px;
					}

					.score-wrap {
						margin-bottom: 8px;

						.name {
							display: inline-block;
							vertical-align: top;
							font-size: 12px;
							color: rgb(7,17,27);
							line-height: 18px;
						}
						
						#star {
							display: inline-block;
							vertical-align: top;
							margin: 0 12px;
							@media only screen and (max-width: 320px) {
								margin: 0 6px;
							}
						}

						.score {
							display: inline-block;
							vertical-align: top;
							font-size: 12px;
							color: rgb(255,153,0);
							line-height: 16px;
						}
					}

					.delivery-wrap {
						font-size: 0;

						.title {
							display: inline-block;
							vertical-align: top;
							font-size: 12px;
							color: rgb(7,17,27);
							line-height: 18px;
						}

						.delivery {
							display: inline-block;
							vertical-align: top;
							margin-left: 12px;
							font-size: 12px;
							color: rgb(147,153,159);
							line-height: 18px;
						}
					}
				}
			}

			.ratings-wrap {
				padding: 0 18px;

				.ratings-item {
					display: flex;
					padding: 18px 0;
					.border-bottom-1px(rgba(7,17,27,0.1));

					.avatar {
						flex: 0 0 28px;
						width: 28px;
						height: 28px;
						margin-right: 12px;
						border-radius: 50%;

						img {
							border-radius: 50%;
						}
					}

					.content {
						position: relative;
						flex: 1;

						.name {
							margin-bottom: 4px;
							font-size: 10px;
							color: rgb(7,17,27);
							line-height: 12px;
						}

						.star-wrap {
							margin-bottom: 6px;
							font-size: 0;

							#star {
								display: inline-block;
								vertical-align: top;
								margin-right: 6px;
							}

							.delivery {
								display: inline-block;
								vertical-align: top;
								font-size: 10px;
								font-weight: 200;
								color: rgb(147,153,159);
								line-height: 12px;
							}
						}

						.text {
							margin-bottom: 8px;
							font-size: 12px;
							color: rgb(7,17,27);
							line-height: 18px;
						}

						.recommend {
							line-height: 16px;
							font-size: 0;

							.icon, .item {
								display: inline-block;
								// vertical-align: top;
								margin: 0 8px 4px 0;
								font-size: 9px;
							}

							.icon-thumb_up {
								font-size: 12px;
								color: rgb(0,160,220);
							}

							.icon-thumb_down {
								font-size: 12px;
								color: rgb(183,187,191);
							}

							.item {
								padding: 0 6px;
								border: 1px solid rgba(7, 17, 27, 0.1);
								border-radius: 2px;
								color: rgb(147,153,159);
								background: #fff;
							}
						}

						.rateTime {
							position: absolute;
							top: 0;
							right: 0;
							font-size: 10px;
							font-weight: 200;
							color: rgb(147,153,159);
							line-height: 12px;
						}
					}
				}
			}
		}
	}
</style>