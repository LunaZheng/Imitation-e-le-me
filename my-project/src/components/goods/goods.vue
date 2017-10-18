<template>
  <div class="goods">
    <div class="menu-wrapper" ref="menuWrapper">
      <ul>
        <li class="menu-item border-1px"
          v-for="(item, idx) in goods"
          :class="{'current': currentIndex === idx}"
          @click="selectMenu(idx, $event)"
        >
          <span class="text">
            <i class="icon"
              v-show="item.type > 0"
              :class="classMap[item.type]"
            ></i>{{item.name}}
          </span>
        </li>
      </ul>
    </div>
    <div class="foods-wrapper" ref="foodsWrapper">
      <ul>
        <li class="food-list food-list-hook"
          v-for="(item, idx) in goods"
        >
          <h1 class="title">{{item.name}}</h1>
          <ul>
            <li class="food-item border-1px"
              v-for="(food, idx) in item.foods"
            >
              <div class="icon">
                <img width="57" height="57" :src="food.icon" alt="" class="">
              </div>
              <div class="content">
                <h2 class="name">{{food.name}}</h2>
                <p class="desc">{{food.description}}</p>
                <div class="extra">
                  <span class="count">月售{{food.sellCount}}份</span>
                  <span>好评率{{food.rating}}%</span>
                </div>
                <div class="price">
                  <span class="now">￥{{food.price}}</span>
                  <span class="old" v-show="food.oldPrice">￥{{food.oldPrice}}</span>
                </div>
                <div class="cartcontrol-wrapper">
                  <cartcontrol :food="food"></cartcontrol>
                </div>
              </div>
            </li>
          </ul>
        </li>
      </ul>
    </div>
    <shopcart :select-foods="selectFoods" :delivery-price="seller.deliveryPrice" :min-price="seller.minPrice"></shopcart>
  </div>
</template>

<script>
import BScroll from 'better-scroll'
import shopcart from '../shopcart/shopcart'
import cartcontrol from '../cartcontrol/cartcontrol'

const ERR_OK = 0

export default {
  props: {
    seller: {
      type: Object
    }
  },
  data () {
    return {
      goods: [],
      listHeight: [],
      scrollY: 0
    }
  },
  computed: {
    currentIndex () {
      for (let i = 0, len = this.listHeight.length; i < len; i++) {
        let height1 = this.listHeight[i]
        let height2 = this.listHeight[i + 1]
        if (!height2 || (this.scrollY >= height1 && this.scrollY < height2)) {
          return i
        }
      }
      return 0
    },
    selectFoods () {
      let foods = []
      this.goods.forEach((good) => {
        good.foods.forEach((food) => {
          if (food.count) {
            foods.push(food)
          }
        })
      })
      return foods
    }
  },
  created () {
    var vm = this
    vm.$http.get('/api/goods').then((response) => {
      response = response.body
      if (response.errno === ERR_OK) {
        vm.goods = response.data
        vm.$nextTick(() => { // 当要对DOM做操时,一定要保证DOM已经被渲染了
          vm._initScroll()
          vm._calculateHeight()
        })
      }
    })
    vm.classMap = ['decrease', 'discount', 'special', 'invoice', 'guarantee']
  },
  components: {
    shopcart,
    cartcontrol
  },
  methods: {
    selectMenu (idx, event) {
      if (!event._constructed) {
        return
      }
      let foodList = this.$refs.foodsWrapper.getElementsByClassName('food-list-hook')
      let el = foodList[idx]
      this.foodsScroll.scrollToElement(el, 300)
    },
    _initScroll () {
      this.menuScroll = new BScroll(this.$refs.menuWrapper, {
        click: true // 因为better-scroll会阻止默认
      })
      this.foodsScroll = new BScroll(this.$refs.foodsWrapper, {
        click: true,
        probeType: 3 // probeType: 1 会截流,只有在滚动结束的时候派发一个 scroll 事件。2在手指 move 的时候也会实时派发 scroll 事件，不会截流。 3除了手指 move 的时候派发scroll事件，在 swipe（手指迅速滑动一小段距离）的情况下，列表会有一个长距离的滚动动画，这个滚动的动画过程中也会实时派发滚动事件
      })

      this.foodsScroll.on('scroll', (pos) => {
        this.scrollY = Math.abs(Math.round(pos.y))
      })
    },
    _calculateHeight () {
      let foodList = this.$refs.foodsWrapper.getElementsByClassName('food-list-hook')
      let height = 0
      this.listHeight.push(height)
      for (let i = 0, len = foodList.length; i < len; i++) {
        let item = foodList[i]
        height += item.clientHeight
        this.listHeight.push(height)
      }
    }
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus">
@import "../../common/stylus/mixin.styl"

.goods
  display flex
  position absolute
  top 174px
  bottom 46px
  width 100%
  overflow hidden
  .menu-wrapper
    flex 0 0 80px
    width 80px
    background #f3f5f7
    .menu-item
      display table
      height 54px
      width 56px
      line-height 14px
      text-align center
      padding 0 12px
      &.current
        position relative
        z-index 10
        margin-top -1px
        background #fff
        font-weight 700
        .text
          border-none()
      .icon
        display inline-block
        width 12px
        height 12px
        vertical-align top
        margin-right 4px
        background-size 12px 12px
        background-repeat no-repeat
        &.decrease
          bg-image('decrease_3')
        &.discount
          bg-image('discount_3')
        &.guarantee
          bg-image('guarantee_3')
        &.invoice
          bg-image('invoice_3')
        &.special
          bg-image('special_3')
      .text
        display table-cell
        width 56px
        vertical-align top
        font-size 12px
        vertical-align middle
        border-1px(rgba(7, 17, 27, .1))
  .foods-wrapper
    flex 1
    .title
      padding-left 14px
      height 26px
      line-height 26px
      border-left 2px solid #d9dde1
      font-size 12px
      color rgb(147, 153, 159)
      background #f3f5f7
    .food-item
      display flex
      margin 18px
      padding-bottom 12px
      border-1px(rgba(7, 17, 27, 0.1))
      &:last-child
        border-none()
        margin-bottom 0
      .icon
        flex 0 0 57px
        margin-right 10px
      .content
        flex 1
        .name
          font-size 14px
          height 14px
          line-height 14px
          margin 2px 0 8px 0
          color rgb(7, 17, 27)
          font-weight bold
        .desc, .extra
          line-height 10px
          font-size 10px
          color rgb(147, 153, 150)
        .desc
          margin-bottom 8px
          line-height 12px
        .extra
          .count
            margin-right 12px
        .price
          margin-top 4px
          font-weight 700
          line-height 24px
          .now
            margin-right 8px
            font-size 14px
            color rgb(240, 20, 20)
          .old
            text-decoration line-through
            font-size 10px
            color rgb(147, 153, 150)
        .cartcontrol-wrapper
          position absolute
          right 0
          bottom 6px
</style>
