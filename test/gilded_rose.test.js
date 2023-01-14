const {Shop, Item} = require('../src/gilded_rose')

describe('Gilded Rose', function() {
  const sellIn = 20
  const quality = 10
  const normalRate = 1
  const maxQuality = 50

  it('constructor', function() {
    const gildedRose = new Shop()
    const items = gildedRose.updateQuality()
    
    expect(items.length).toBe(0)
  })

  it('should have attributes', function() {
    const gildedRose = new Shop([new Item('foo', sellIn, quality)])
    const items = gildedRose.updateQuality()
    
    expect(items[0].name).toBe('foo')
  })

  it('degrades normally', function() {
    const gildedRose = new Shop([new Item('foo', sellIn, quality)])
    
    const items = gildedRose.updateQuality()
    
    expect(items[0].sellIn).toBe(sellIn - normalRate)
    expect(items[0].quality).toBe(quality - normalRate)
  })

  describe('interesting behaviors', () => {
    it('Once the sell by date has passed, Quality degrades twice as fast', () => {
      const [expiringSellIn, expiredSellIn, longExpiredSellIn] = [1, 0, -1]

      const gildedRose = new Shop([
        new Item('Expiring Good', expiringSellIn, quality),
        new Item('Expired Good', expiredSellIn, quality),
        new Item('Long Expired goods', longExpiredSellIn, quality),
      ])
    
      const items = gildedRose.updateQuality()

      expect(items[0].sellIn).toBe(expiringSellIn - normalRate)
      expect(items[0].quality).toBe(quality - normalRate)
      
      expect(items[1].sellIn).toBe(expiredSellIn - normalRate)
      expect(items[1].quality).toBe(quality - (normalRate * 2))

      expect(items[2].sellIn).toBe(longExpiredSellIn - normalRate)
      expect(items[2].quality).toBe(quality - (normalRate * 2))
    })

    it('The Quality of an item is never negative', () => {
      const [usableQuality, badQuality] = [1, 0]
      const longExpiredSellIn = -1
      const gildedRose = new Shop([
        new Item('Still usable', sellIn, usableQuality),
        new Item('Not usable', sellIn, badQuality),
        new Item('Expired but usable', longExpiredSellIn, usableQuality),
      ])
  
      const items = gildedRose.updateQuality()
  
      expect(items[0].sellIn).toBe(sellIn - normalRate)
      expect(items[0].quality).toBe(usableQuality - normalRate)
      
      expect(items[1].sellIn).toBe(sellIn - normalRate)
      expect(items[1].quality).toBe(badQuality)
  
      expect(items[2].sellIn).toBe(longExpiredSellIn - normalRate)
      expect(items[2].quality).toBe(badQuality)
    })

    it("'Aged Brie' actually increases in Quality the older it gets", () => {
      const [normalSellIn, expiringSellIn, expiredSellIn, longExpiredSellIn] = [20, 1, 0, -1]
      
      const gildedRose = new Shop([
        new Item('Aged Brie', normalSellIn, quality),
        new Item('Aged Brie', expiringSellIn, quality),
        new Item('Aged Brie', expiredSellIn, quality),
        new Item('Aged Brie', longExpiredSellIn, quality),
        new Item('Aged Brie', longExpiredSellIn, maxQuality),
      ])

      const items = gildedRose.updateQuality()

      expect(items[0].quality).toBe(quality + normalRate)
      expect(items[1].quality).toBe(quality + normalRate)
      expect(items[2].quality).toBe(quality + (normalRate * 2))
      expect(items[3].quality).toBe(quality + (normalRate * 2))
      expect(items[4].quality).toBe(maxQuality)
    })

    it('The Quality of an item is never more than 50', () => {
      const gildedRose = new Shop([
        new Item('Aged Brie', sellIn, maxQuality)
      ])

      const items = gildedRose.updateQuality()

      expect(items[0].sellIn).toBe(sellIn - normalRate)
      expect(items[0].quality).toBe(maxQuality)
    })

    it("'Sulfuras', being a legendary item, never has to be sold or decreases in Quality", () => {
      const gildedRose = new Shop([
        new Item('Sulfuras, Hand of Ragnaros', sellIn, 80),
        new Item('Sulfuras, Hand of Ragnaros', -1, 80)
      ])

      const items = gildedRose.updateQuality()

      expect(items[0].sellIn).toBe(sellIn)
      expect(items[0].quality).toBe(80)

      expect(items[1].sellIn).toBe(-1)
      expect(items[1].quality).toBe(80)
    })

    it("'Backstage passes' behaviors", () => {
      const [normalSellIn, hotCakeSellIn, LastMinuteSellIn, expiredSellIn, longExpiredSellIn] = [20, 10, 5, 0, -1]

      const gildedRose = new Shop([
        new Item('Backstage passes to a TAFKAL80ETC concert', normalSellIn, quality),
        new Item('Backstage passes to a TAFKAL80ETC concert', hotCakeSellIn, quality),
        new Item('Backstage passes to a TAFKAL80ETC concert', hotCakeSellIn, maxQuality),
        new Item('Backstage passes to a TAFKAL80ETC concert', LastMinuteSellIn, quality),
        new Item('Backstage passes to a TAFKAL80ETC concert', LastMinuteSellIn, maxQuality),
        new Item('Backstage passes to a TAFKAL80ETC concert', expiredSellIn, quality),
        new Item('Backstage passes to a TAFKAL80ETC concert', longExpiredSellIn, quality)
      ])

      const items = gildedRose.updateQuality()

      expect(items[0].quality).toBe(quality + normalRate)
      expect(items[1].quality).toBe(quality + (normalRate * 2))
      expect(items[2].quality).toBe(maxQuality)
      expect(items[3].quality).toBe(quality + (normalRate * 3))
      expect(items[4].quality).toBe(maxQuality)
      expect(items[5].quality).toBe(0)
      expect(items[6].quality).toBe(0)
    })

    xit("'Conjured' items degrade in Quality twice as fast as normal items", () => {
      const gildedRose = new Shop([
        new Item('Conjured', sellIn, quality)
      ])

      const items = gildedRose.updateQuality()

      expect(items[0].sellIn).toBe(sellIn - normalRate)
      expect(items[0].quality).toBe(quality - (normalRate * 2))
    })
  })
})
