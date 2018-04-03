<template>
	<div id="header">
		<div class="content-wrap">
			<div class="avatar">
				<img width="64" height="64" :src="seller.avatar" alt="">
			</div>
			<div class="h-content">
				<div class="title">
					<span class="brand background-img"></span>
					<span class="name">{{seller.name}}</span>
				</div>
				<div class="description">{{seller.description}}/{{seller.deliveryTime}}分钟送达</div>
				<div v-if="seller.supports" class="support">
					<span class="icon" :class="classMap[seller.supports[0].type]"></span>
					<span class="text">{{seller.supports[0].description}}</span>
				</div>
			</div>
			<div v-if="seller.supports" @click="showDetail" class="supports-count">
				<span class="count">{{seller.supports.length}}个</span>
				<i class="icon-keyboard_arrow_right"></i>
			</div>
		</div>
		<div class="bulletin-wrap" @click="showDetail">
			<span class="bulletin-icon"></span><span class="bulletin-text">{{seller.bulletin}}</span>
			<i class="icon-keyboard_arrow_right bulletin-right"></i>
		</div>
		<div class="background">
			<img :src="seller.avatar" width="100%" alt="">
		</div>
		<transition name="detail-fade">
			<div v-show="detailShow" class="detail">
				<div class="detail-wrap clearfix">
					<div class="detail-main">
						<h1 class="name">{{seller.name}}</h1>
						<div class="v-star">
							<v-star :size="48" :score="seller.score"></v-star>
						</div>
						<div class="title">
							<div class="line"></div>
							<div class="text">优惠信息</div>
							<div class="line"></div>
						</div>
						<ul v-if="seller.supports" class="supports">
							<li class="support-item" v-for="item in seller.supports">
								<span class="icon" :class="classMap[item.type]"></span>
								<span class="text">{{item.description}}</span>
							</li>
						</ul>
						<div class="title">
							<div class="line"></div>
							<div class="text">商家公告</div>
							<div class="line"></div>
						</div>
						<div class="bulletin">
							<p class="content">{{seller.bulletin}}</p>
						</div>
					</div>
				</div>
				<div class="detail-close">
					<i class="icon-close" @click="hideDetail"></i>
				</div>
			</div>
		</transition>
	</div>
</template>

<script>
	import star from '../star/star.vue';

	export default {
		props: ['seller'],
		components: {
			'v-star': star
		},
		data() {
			return {
				classMap: [
					'decrease',
					'discount',
					'special',
					'invoice',
					'guarantee'
				],
				detailShow: false,
			}
		},
		mounted() {
			
		},
		methods: {
			showDetail() {
				this.detailShow = true;
			},
			hideDetail() {
				this.detailShow = false;
			}
		}
	}
</script>

<style lang="less" scoped>
	@import '../../commom/less/mixin.less';

	.detail-fade-enter-active, .detail-fade-leave-active {
		transition: all 0.3s;
	}
	.detail-fade-enter, .detail-fade-leave-to {
		opacity: 0;
	}

.background-img(@url) {
	@png2: '@2x.png';
	@png3: '@3x.png';
	background-image: url('@{url}@{png2}');

	@media (-webkit-min-device-pixel-ratio: 2),(min-device-pixel-ratio: 2) {
		background-image: url('@{url}@{png3}');
	}
}

.fontWeight(@num: 600) {
	font-weight: @num;
}

	#header {
		position: relative;
		height: 134px;
		color: rgb(255,255,255);
		background: rgba(7, 17, 27, 0.5);
		overflow: hidden;

		.content-wrap {
			padding: 24px 12px 18px 24px;
			font-size: 0;
			position: relative;

			>div {
				display: inline-block;
				vertical-align: top;
				font-size: 0;
				line-height: 0;
			}

			.avatar {
				img {
					line-height: 0;
				}
			}

			.h-content {
				margin-left: 16px;
				padding-top: 2px;

				.title {
					font-size: 0;
					line-height: 0;
					margin-bottom: 8px;

					.brand {
						display: inline-block;
						vertical-align: top;
						width: 30px;
						height: 18px;
						.background-img('img/brand');
						background-size: 30px 18px;
					}
					.name {
						display: inline-block;
						vertical-align: top;
						margin-left: 9px;
						font-size: 16px;
						line-height: 18px;
						
					}
				}

				.description {
					margin-bottom: 10px;
					font-size: 12px;
					line-height: 12px;
					.fontWeight();
				}

				.support {
					font-size: 0;
					line-height: 0;

					.icon {
						display: inline-block;
						vertical-align: top;
						width: 12px;
						height: 12px;
						background-size: 12px 12px;
						background-repeat: no-repeat;
						&.decrease {
							.background-img('img/decrease_1');
						}
						&.discount {
							.background-img('img/discount_1');
						}
						&.guarantee {
							.background-img('img/guarantee_1');
						}
						&.invoice {
							.background-img('img/invoice_1');
						}
						&.special {
							.background-img('img/special_1');
						}
					}
					.text {
						display: inline-block;
						vertical-align: top;
						padding-left: 4px;
						font-size: 10px;
						line-height: 12px;
						.fontWeight();
					}
				}
			}

			.supports-count {
				position: absolute;
				padding: 0 8px;
				height: 24px;
				right: 12px;
				bottom: 18px;
				line-height: 24px;
				border-radius: 8px;
				background-color: rgba(0, 0, 0, 0.2);

				.count {
					vertical-align: top;
					font-size: 10px;
				}
				.icon-keyboard_arrow_right {
					margin-left: 2px;
					line-height: 24px;
					font-size: 10px;
				}
			}
		}

		.bulletin-wrap {
			position: relative;
			height: 28px;
			line-height: 28px;
			padding: 0 22px 0 12px;
			white-space: nowrap;
			overflow: hidden;
			text-overflow: ellipsis;
			background: rgba(7, 17, 27, 0.5);

			.bulletin-icon {
				display: inline-block;
				vertical-align: middle;
				width: 24px;
				height: 12px;
				.background-img('img/bulletin');
				background-size: 24px 12px;
			}

			.bulletin-text {
				font-size: 10px;
				margin: 0 4px;
			}

			.bulletin-right {
				position: absolute;
				font-size: 10px;
				top: 8px;
				right: 12px;
			}
		}

		.background {
			position: absolute;
			top: 0;
			left: 0;
			width: 100%;
			height: 100%;
			z-index: -1;
			filter: blur(10px);
		}
		.detail {
			position: fixed;
			height: 100%;
			width: 100%;
			top: 0;
			left: 0;
			z-index: 100;
			overflow: auto;
			background: rgba(7, 17, 27, 0.8);
			backdrop-filter: blur(10px);

			.detail-wrap {
				display: inline-block;
				width: 100%;
				min-height: 100%;

				.detail-main {
					margin-top: 64px;
					padding-bottom: 64px;

					.name {
						font-size: 16px;
						line-height: 16px;
						font-weight: 700;
						text-align: center;
					}
					.v-star {
						margin-top: 16px;
						text-align: center;
					}
					.title {
						display: flex;
						width: 80%;
						margin: 28px auto 24px auto;
						.text {
							font-size: 14px;
							line-height: 14px;
							padding: 0 12px;
							font-weight: 700;
						}
						.line {
							flex: 1;
							position: relative;
							top: -6px;
							border-bottom: 1px solid rgba(255, 255, 255, 0.2);
						}
					}
					.supports {
						width: 80%;
						margin: 0 auto;
						.support-item {
							padding: 0 12px;
							margin-bottom: 12px;
							font-size: 0;
							&:last-child {
								margin-bottom: 0;
							}

							.icon {
								display: inline-block;
								vertical-align: top;
								width: 16px;
								height: 16px;
								margin-right: 8px;
								background-size: 16px 16px;
								background-repeat: no-repeat;
								&.decrease {
									.background-img('img/decrease_2');
								}
								&.discount {
									.background-img('img/discount_2');
								}
								&.guarantee {
									.background-img('img/guarantee_2');
								}
								&.invoice {
									.background-img('img/invoice_2');
								}
								&.special {
									.background-img('img/special_2');
								}
							}
							.text {
								display: inline-block;
								height: 16px;
								line-height: 16px;
								font-size: 12px;
							}
						}
					}
					.bulletin {
						width: 80%;
						margin: 0 auto;
						.content {
							padding: 0 12px;
							font-size: 12px;
							line-height: 24px;
							font-weight: 200;
						}
					}
				}
			}
			.detail-close {
				position: relative;
				width: 32px;
				height: 32px;
				margin: -64px auto 0 auto;
				font-size: 32px;
			}
		}
	}
</style>