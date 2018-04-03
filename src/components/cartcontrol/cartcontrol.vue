<template>
	<div id="cartcontrol">
		<transition name="cartdecrease">
			<div class="cart-decrease icon-remove_circle_outline" v-show="food.count > 0" @click.stop.prevent="removeCart"></div>
		</transition>
		<transition name="cartdecrease">
			<div class="cart-count" v-show="food.count > 0">{{food.count}}</div>
		</transition>
		<div class="cart-add icon-add_circle" @click.stop.prevent="addCart($event)"></div>
	</div>
</template>

<script>
import Vue from 'vue';
	export default {
		props: {
			food: {
				type: Object
			}
		},
		data() {
			return {

			}
		},
		mounted() {
			
		},
		methods: {
			addCart(event) {
				if (!this.food.count) {
					Vue.set(this.food,'count', 1)
				} else {
					this.food.count++
				}

				this.$emit('cartAdd',event.target)
			},
			removeCart() {
				if (this.food.count > 0) {
					this.food.count--
				}
			}
		}
	}
</script>

<style lang="less" scoped>
	#cartcontrol {
		font-size: 0;

		.cartdecrease-enter-active, .cartdecrease-leave-active {
			transition: all 0.2s linear;
		}
		.cartdecrease-enter, .cartdecrease-leave-to {
			transform: translate3d(24px,0,0);
			opacity: 0;
		}

		// .cartcount-enter-acitve, .cartcount-leave-active {
		// 	transition: all 0.2s linear;
		// }
		// .cartcount-enter, .cartcount-leave-to {
		// 	transform: translate3d(24px,0,0);
		// 	opacity: 0;
		// }

		.cart-decrease {
			display: inline-block;
			padding: 6px;
			line-height: 24px;
			font-size: 24px;
			color: rgb(0,160,220);
		}

		.cart-count {
			display: inline-block;
			vertical-align: top;
			padding: 6px 0;
			line-height: 24px;
			font-size: 10px;
			width: 24px;
			text-align: center;
			color: rgb(147,153,159);
		}

		.cart-add {
			display: inline-block;
			padding: 6px;
			line-height: 24px;
			font-size: 24px;
			color: rgb(0,160,220);
		}
	}
</style>