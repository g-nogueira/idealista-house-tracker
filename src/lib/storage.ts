import type { HouseInfo } from './types';

export const storage = {
  async getHouses(): Promise<HouseInfo[]> {
    const result = await chrome.storage.local.get(['houses']);
    return result.houses || [];
  },

  async addHouse(house: HouseInfo): Promise<void> {
    console.log("Adding House")
    const houses = await this.getHouses();
    houses.push(house);
    await chrome.storage.local.set({ houses });
  },

  async removeHouse(id: string): Promise<void> {
    const houses = await this.getHouses();
    const filtered = houses.filter(h => h.id !== id);
    await chrome.storage.local.set({ houses: filtered });
  },

  async exportToCsv(): Promise<string> {
    const houses = await this.getHouses();
    const headers = ['Title', 'Price', 'Address', 'Year', 'Energy Certificate', 'Gross Area (m²)', 'Util Area (m²)', 'URL'];
    
    return [
      headers.join(','),
      ...houses.map(house => [
        `"${house.title.replaceAll(",", "-")}"`,
        house.price.replaceAll(",", "-"),
        `"${house.address.replaceAll(",", "-")}"`,
        house.year,
        house.energyCertificate,
        house.grossArea,
        house.utilArea,
        `"${house.url}"`
      ].join(','))
    ].join('\n');
  },

  async importFromCsv(csvContent: string): Promise<{ success: number; failed: number }> {
    const lines = csvContent.split('\n');
    const headers = lines[0].split(',');
    const houses = await this.getHouses();
    const results = { success: 0, failed: 0 };

    for (const line of lines.slice(1)) {
        if (!line.trim()) continue;
        
        try {
            const values = line.split(',');
            const house: HouseInfo = {
                id: crypto.randomUUID(),
                title: values[0].replace(/^"|"$/g, ''),
                price: values[1].replace(/^"|"$/g, ''),
                address: values[2].replace(/^"|"$/g, ''),
                year: values[3],
                energyCertificate: values[4],
                grossArea: values[5],
                utilArea: values[6],
                url: values[7].replace(/^"|"$/g, ''),
                listingUrl: values[7].replace(/^"|"$/g, ''),
                thumbnail: '', // Will be fetched when visiting the page
                addedAt: Date.now()
            };

            if (house.url && !houses.some(h => h.url === house.url)) {
                houses.push(house);
                results.success++;
            }
        } catch (error) {
            console.error('Failed to parse line:', line, error);
            results.failed++;
        }
    }

    await chrome.storage.local.set({ houses });
    return results;
}
};