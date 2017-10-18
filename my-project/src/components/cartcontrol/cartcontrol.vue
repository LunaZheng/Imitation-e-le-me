<template>
  <div class="cartcontrol">
    <transition name="fadeRotate">
      <div class="cart-decrease" 
        v-show="food.count>0"
        @click="decreaseCart"
      >
        <span class="inner icon-minus-circle"></span>
      </div>
    </transition>
    <div class="cart-count" v-show="food.count>0">{{food.count}}</div>
    <div class="cart-add icon-add_circle" @click="addCart"></div>
  </div>
</template>

<script>
import Vue from 'vue'

export default {
  props: {
    food: {
      type: Object
    }
  },
  data () {
    return {
      msg: 'cartcontrol'
    }
  },
  methods: {
    addCart (event) {
      if (!event._constructed) {
        return
      }
      if (!this.food.count) {
        Vue.set(this.food, 'count', 0)
      }
      this.food.count++
      console.log(this.$root.eventHub)
      this.$root.eventHub.$emit('cart.add', event.target)
    },
    decreaseCart (event) {
      if (!event._constructed) {
        return
      }
      if (this.food.count) {
        this.food.count--
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" rel="stylesheet/stylus">
.cartcontrol
  font-size 0
  .cart-decrease
    display inline-block
    padding 6px
    transition all 0.4s linear
    .inner
      display inline-block
      line-height 24px
      font-size 24px
      color rgb(0, 160, 220)
      transition all 0.4s linear
    &.fadeRotate-enter-active, &.fadeRotate-leave-active
      transform translate3d(0, 0, 0)
      .inner
        display inline-block
        transform rotate(0)
    &.fadeRotate-enter, &.fadeRotate-leave-active
      opacity: 0
      transform translate3d(24px, 0, 0)
      .inner
        transform rotate(180deg)
  .cart-count
    display inline-block
    font-size 10px
    vertical-align top
    width 12px
    height 24px
    line-height 24px
    text-align center
    margin-top 8px
    color rgb(147, 153, 149)
  .cart-add
    display inline-block
    padding 6px
    line-height 24px
    font-size 24px
    color rgb(0, 160, 220)
</style>
