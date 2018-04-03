<template>
	<div id="ratingselect">
		<div class="selectType">
			<span class="block all" :class="{'active': selectType===2}" @click="clickSelectType(2)">{{desc.all}}<span class="count">{{ratings.length}}</span></span>
			<span class="block positive" :class="{'active': selectType===0}" @click="clickSelectType(0)">{{desc.positive}}<span class="count">{{positives.length}}</span></span>
			<span class="block negative" :class="{'active': selectType===1}" @click="clickSelectType(1)">{{desc.negative}}<span class="count">{{negatives.length}}</span></span>
		</div>
		<div class="switch" @click.stop="toggleOnlyContent" :class="{'on': onlyContent}">
			<span class="icon icon-check_circle"></span>
			<span class="text">只看有内容的评价</span>
		</div>
	</div>
</template>

<script>
	const POSITIVE = 0;
	const NEGATIVE = 1;
	const ALL  = 2;

	export default {
		props: {
			ratings: {
				type: Array,
				default() {
					return []
				}
			},
			selectType: {
				type: Number,
				default: ALL
			},
			onlyContent: {
				type: Boolean,
				default: false
			},
			desc: {
				type: Object,
				default() {
					return {
						all: '全部',
						positive: '满意',
						negative: '不满意'
					}
				}
			}
		},
		computed: {
			positives() {
				 return this.ratings.filter((item) => {
					return item.rateType === POSITIVE
				});
			},
			negatives() {
				 return this.ratings.filter((item) => {
					return item.rateType === NEGATIVE
				});
			}
		},
		methods: {
			clickSelectType(type) {
				this.$emit('selectTypeChange',type)
			},
			toggleOnlyContent() {
				this.$emit('onlyContentChange')
			}
		}
	}
</script>

<style lang="less" scoped>
@import '../../commom/less/mixin.less';

	#ratingselect {
		.selectType {
			padding: 18px 0;
			margin: 0 18px;
			font-size: 0;
			.border-bottom-1px(rgba(7,17,27,0.1));

			.block {
				display: inline-block;
				padding: 8px 12px;
				font-size: 12px;
				line-height: 16px;
				border-radius: 2px;
				margin-right: 8px;

				&:last-child {
					margin-right: 0;
				}

				.count {
					font-size: 8px;
					margin-left: 2px;
				}

				&.all {
					color: rgb(77,85,93);
					background: rgba(0,160,220,0.2);
					&.active {
						color: #fff;
						background: rgb(0,160,220);
					}
				}

				&.positive {
					color: rgb(77,85,93);
					background: rgba(0,160,220,0.2);
					&.active {
						color: #fff;
						background: rgb(0,160,220);
					}
				}

				&.negative {
					color: rgb(77,85,93);
					background: rgba(77,85,93,0.2);
					&.active {
						color: #fff;
						background: rgb(77,85,93);
					}
				}
			}
		}

		.switch {
			padding: 12px 18px;
			line-height: 24px;
			border-bottom: 1px solid rgba(7,17,27,0.1);
			color: rgb(147, 153, 159);
			font-size: 0;

			&.on {
				.icon-check_circle {
					color: rgb(0,200,80);
				}
			}

			.icon-check_circle {
				display: inline-block;
				font-size: 24px;
				margin-right: 4px;
			}

			.text {
				display: inline-block;
				vertical-align: top;
				font-size: 12px;
			}
		}
	}
</style>