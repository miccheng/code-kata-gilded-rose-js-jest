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
    this.rateOfChange = 1
  }

  isExpired(item) {
    return item.sellIn < 0
  }

  updateItemQuality(direction, item, rate) {
    switch (direction) {
      case 'APPRECIATE':
        item.quality = item.quality + rate
        break;
      case 'DEPRECIATE':
      default:
        item.quality = item.quality - rate
        break;
    }

    if (item.quality > 50) item.quality = 50
    if (item.quality < 0) item.quality = 0

    return item
  }

  updateItem(item) {
    if (this.legendaryItems.includes(item.name)) {
      return item
    }

    item.sellIn = item.sellIn - 1
    
    let rateOfQualityChange = this.rateOfChange
    let qualityChangeType = this.appreciatingItems.includes(item.name) ? 'APPRECIATE' : 'DEPRECIATE'

    if (item.name === 'Backstage passes to a TAFKAL80ETC concert') {
      if (this.isExpired(item)) {
        item.quality = 0
        return item
      }
      
      if (item.sellIn < 5) {
        rateOfQualityChange = rateOfQualityChange * 3
      } else if (item.sellIn < 10) {
        rateOfQualityChange = rateOfQualityChange * 2
      }
    }

    if (item.name === 'Conjured' ) {
      rateOfQualityChange = rateOfQualityChange * 2
    }

    if (this.isExpired(item)) {
      rateOfQualityChange = rateOfQualityChange * 2
    } 

    item = this.updateItemQuality(qualityChangeType, item, rateOfQualityChange)

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
