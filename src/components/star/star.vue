<template>
	<div id="star">
		<div class="star" :class="starType">
			<span v-for="itemClass in itemClasses" :class="itemClass" class="star-item"></span>
		</div>
	</div>
</template>

<script>
	
	const LENGTH = 5;
	const CLS_ON = 'on';
	const CLS_HALF = 'half';
	const CLS_OFF = 'off';

	export default {
		props: ['size', 'score'],
		data() {
			return {

			}
		},
		computed: {
			starType(){
				return 'star-' + this.size;
			},
			itemClasses(){
				let result = [];
				let score = Math.floor(this.score * 2) / 2;
				let hasDecimal = score % 1 !== 0;
				let integer = Math.floor(score);

				for (let i = 0; i < integer; i++) {
					result.push(CLS_ON);
				}
				if (hasDecimal) {
					result.push(CLS_HALF);
				}
				while(result.length < LENGTH) {
					result.push(CLS_OFF)
				}

				return result;
			}
		},
		mounted() {

		}
	}
</script>

<style lang="less" scoped>

.background-img(@url) {
	@png2: '@2x.png';
	@png3: '@3x.png';
	background-image: url('@{url}@{png2}');

	@media (-webkit-min-device-pixel-ratio: 2),(min-device-pixel-ratio: 2) {
		background-image: url('@{url}@{png3}');
	}
}

	#star {
		.star {
			font-size: 0;

			.star-item {
				display: inline-block;
				background-repeat: no-repeat;	
			}

			&.star-24 {
				.star-item {
					width: 10px;
					height: 10px;
					margin-right: 3px;
					background-size: 10px 10px;

					&:last-child {
						margin-right: 0;
					}

					&.on {
						.background-img('img/star24_on');
					}
					&.off {
						.background-img('img/star24_off');
					}
					&.half {
						.background-img('img/star24_half');
					}

				}
			}

			&.star-36 {
				.star-item {
					width: 15px;
					height: 15px;
					margin-right: 6px;
					background-size: 15px 15px;

					&:last-child {
						margin-right: 0;
					}

					&.on {
						.background-img('img/star36_on');
					}
					&.off {
						.background-img('img/star36_off');
					}
					&.half {
						.background-img('img/star36_half');
					}

				}
			}
			
			&.star-48 {
				.star-item {
					width: 20px;
					height: 20px;
					margin-right: 22px;
					background-size: 20px 20px;

					&:last-child {
						margin-right: 0;
					}

					&.on {
						.background-img('img/star48_on');
					}
					&.off {
						.background-img('img/star48_off');
					}
					&.half {
						.background-img('img/star48_half');
					}

				}
			}
		}
	}
</style>