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
  }

  updateItem(item) {
    if (this.legendaryItems.includes(item.name)) {
      return item
    }

    if (this.appreciatingItems.includes(item.name)) {
      if (item.quality < 50) {
        item.quality = item.quality + 1
        if (item.name == 'Backstage passes to a TAFKAL80ETC concert') {
          if (item.sellIn < 11) {
            if (item.quality < 50) {
              item.quality = item.quality + 1
            }
          }
          if (item.sellIn < 6) {
            if (item.quality < 50) {
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

    item.sellIn = item.sellIn - 1

    if (item.sellIn < 0) {
      if (item.name != 'Aged Brie') {
        if (item.name != 'Backstage passes to a TAFKAL80ETC concert') {
          if (item.quality > 0) {
            item.quality = item.quality - 1
          }
        } else {
          item.quality = item.quality - item.quality
        }
      } else {
        if (item.quality < 50) {
          item.quality = item.quality + 1
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
