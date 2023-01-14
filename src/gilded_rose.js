class Item {
  constructor(name, sellIn, quality){
    this.name = name
    this.sellIn = sellIn
    this.quality = quality
  }
}

class SellInStrategy {
  apply(otherOptions) {
    return {
      rateOfSellInChange: -1
    }
  }
}

class ExpiredModifierStrategy {
  apply(otherOptions) {
    return {
      expired: (item, otherOptions) => {
        const currentQualityChangeMultiplier = otherOptions.hasOwnProperty('qualityChangeMultiplier') ? otherOptions.qualityChangeMultiplier : 1
        
        return { qualityChangeMultiplier: currentQualityChangeMultiplier * 2 }
      }
    }
  }
}

class AppreciatingStrategy {
  apply(otherOptions) {
    return {
      rateOfQualityChange: 1,
      qualityChangeMultiplier: 1
    }
  }
}

class DepreciatingStrategy {
  apply(otherOptions) {
    return {
      rateOfQualityChange: -1,
      qualityChangeMultiplier: 1
    }
  }
}

class LegendaryStrategy {
  apply(otherOptions) {
    return {
      rateOfQualityChange: 0,
      rateOfSellInChange: 0,
      qualityChangeMultiplier: 0
    }
  }
}

class ExpiredInvalidModifierStrategy{
  apply(otherOptions) {
    return {
      expired: (item, otherOptions) => {
        return { overrideQuality: 0 }
      }
    }
  }
}

class BackstagePassStrategy {
  apply(otherOptions) {
    return {
      qualityChangeMultiplier: (item, otherOptions) => {
        if (item.sellIn < 5) {
          return 3
        } else if (item.sellIn < 10) {
          return 2
        }
        return 1
      }
    }
  }
}

class DoubleDecayStrategy {
  apply(otherOptions) {
    const currentQualityChangeMultiplier = otherOptions.hasOwnProperty('qualityChangeMultiplier') ? otherOptions.qualityChangeMultiplier : 1

    return {
      qualityChangeMultiplier: currentQualityChangeMultiplier * 2
    }
  }
}


class Shop {
  constructor(items=[]){
    this.items = items
    this.legendaryItems = ['Sulfuras, Hand of Ragnaros']
    this.appreciatingItems = ['Aged Brie', 'Backstage passes to a TAFKAL80ETC concert']
    this.maxQuality = 50
    this.rateOfChange = 1
    this.itemClassifications = {
      '__default__': [new SellInStrategy(), new DepreciatingStrategy(), new ExpiredModifierStrategy()],
      'Sulfuras, Hand of Ragnaros': [new LegendaryStrategy()],
      'Aged Brie': [new SellInStrategy(), new SellInStrategy(), new AppreciatingStrategy(), new ExpiredModifierStrategy()],
      'Backstage passes to a TAFKAL80ETC concert': [new SellInStrategy(), new AppreciatingStrategy(), new BackstagePassStrategy(), new ExpiredInvalidModifierStrategy()],
      'Conjured': [new SellInStrategy(), new DepreciatingStrategy(), new DoubleDecayStrategy(), new ExpiredModifierStrategy()],
    }
  }

  isExpired(item) {
    return item.sellIn < 0
  }

  applyStrategies(item, options) {
    if (options.hasOwnProperty('overrideSellIn')) {
      item.sellIn += options.overrideSellIn
    } else if (options.hasOwnProperty('rateOfSellInChange')) {
      item.sellIn += options.rateOfSellInChange
    }

    if (this.isExpired(item) && options.hasOwnProperty('expired')) {
      options = {...options, ...options.expired(item, options)}
    }

    if (options.hasOwnProperty('overrideQuality')) {
      item.quality = options.overrideQuality
    } else {
      let qualityChangeMultiplier = options.hasOwnProperty('qualityChangeMultiplier') ? options.qualityChangeMultiplier : 1
      if (typeof qualityChangeMultiplier === 'function') {
        qualityChangeMultiplier = qualityChangeMultiplier(item, options)
      }
      let rateOfQualityChange = options.hasOwnProperty('rateOfQualityChange') ? options.rateOfQualityChange : -1
      if (typeof rateOfQualityChange === 'function') {
        rateOfQualityChange = rateOfQualityChange(item, options)
      }

      if ((rateOfQualityChange * qualityChangeMultiplier) != 0) {
        item.quality += (rateOfQualityChange * qualityChangeMultiplier)
    
        if (item.quality > 50) item.quality = 50
        if (item.quality < 0) item.quality = 0
      }
    }

    return item
  }

  updateItem(item) {
    const strategyName = this.itemClassifications.hasOwnProperty(item.name) ? item.name : '__default__'
    const itemStrategies = this.itemClassifications[strategyName].reduce((accumulator, currentStrategy) => {
      return {...accumulator, ...currentStrategy.apply(accumulator)}
    }, {})

    return this.applyStrategies(item, itemStrategies)
  }

  updateQuality() {
    return this.items.map(item => this.updateItem(item))
  }
}

module.exports = {
  Item,
  Shop
}
