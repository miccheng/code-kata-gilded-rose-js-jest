class Item {
  constructor(name, sellIn, quality){
    this.name = name
    this.sellIn = sellIn
    this.quality = quality
  }
}

class Shop {
  constructor(items=[]){
    this.items = items
    this.legendaryItems = ['Sulfuras, Hand of Ragnaros']
    this.appreciatingItems = ['Aged Brie', 'Backstage passes to a TAFKAL80ETC concert']
    this.maxQuality = 50
  }

  isMaxQuality(item) {
    return item.quality === this.maxQuality
  }

  isExpired(item) {
    return item.sellIn < 0
  }

  updateItem(item) {
    if (this.legendaryItems.includes(item.name)) {
      return item
    }

    item.sellIn = item.sellIn - 1

    if (this.appreciatingItems.includes(item.name)) {
      if (!this.isMaxQuality(item)) {
        item.quality = item.quality + 1
        if (item.name == 'Backstage passes to a TAFKAL80ETC concert') {
          if (item.sellIn < 10) {
            if (!this.isMaxQuality(item)) {
              item.quality = item.quality + 1
            }
          }
          if (item.sellIn < 5) {
            if (!this.isMaxQuality(item)) {
              item.quality = item.quality + 1
            }
          }
        }
      }
    } else {
      if (item.quality > 0) {
        item.quality = item.quality - 1
      }
    }    

    if (this.isExpired(item)) {
      if (item.name === 'Aged Brie') {
        if (!this.isMaxQuality(item)) {
          item.quality = item.quality + 1
        }
      } else {
        if (item.name != 'Backstage passes to a TAFKAL80ETC concert') {
          if (item.quality > 0) {
            item.quality = item.quality - 1
          }
        } else {
          item.quality = item.quality - item.quality
        }
      }
    }

    return item
  }

  updateQuality() {
    return this.items.map(item => this.updateItem(item))
  }
}

module.exports = {
  Item,
  Shop
}
