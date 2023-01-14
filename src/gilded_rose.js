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

  isExpired(item) {
    return item.sellIn < 0
  }

  appreciatedQuality(item, rate=1) {
    if (item.quality != this.maxQuality) {
      item.quality = item.quality + rate
    }
    if (item.quality > 50) item.quality = 50

    return item
  }

  depreciateQuality(item, rate=1) {
    if (item.quality > 0) {
      item.quality = item.quality - rate
    }

    return item
  }

  updateItem(item) {
    if (this.legendaryItems.includes(item.name)) {
      return item
    }

    item.sellIn = item.sellIn - 1

    if (this.appreciatingItems.includes(item.name)) {
      if (item.name === 'Backstage passes to a TAFKAL80ETC concert') {
        if (item.sellIn < 5) {
          item = this.appreciatedQuality(item, 3)
        } else if (item.sellIn < 10) {
          item = this.appreciatedQuality(item, 2)
        } else {
          item = this.appreciatedQuality(item)
        }
      } else {
        item = this.appreciatedQuality(item)
      }
    } else {
      if (item.quality > 0) {
        item.quality = item.quality - 1
      }
    }    

    if (this.isExpired(item)) {
      if (item.name === 'Aged Brie') {
        item = this.appreciatedQuality(item)
      } else if(item.name === 'Backstage passes to a TAFKAL80ETC concert') {
        item.quality = 0
      } else {
        item = this.depreciateQuality(item)
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
