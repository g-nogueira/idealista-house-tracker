import type { HouseInfo } from './types';

export function extractHouseInfo(doc: Document): HouseInfo {
    const url = new URL(doc.URL);

    return {
        id: crypto.randomUUID(),
        url: url.href,
        title: getTitle(doc),
        address: getAddress(doc),
        price: getPrice(doc),
        listingUrl: url.href,
        year: getYear(doc),
        energyCertificate: getEnergyCertificate(doc),
        grossArea: getGrossArea(doc),
        utilArea: getUtilArea(doc),
        thumbnail: getThumbnail(doc),
        addedAt: Date.now()
    };
}

function getThumbnail(doc: Document): string {
    return (doc.querySelector("img[data-orientation=horizontal]") as HTMLImageElement)?.src;
}

function getPrice(doc: Document): string {
    return (doc.querySelector(".info-data-price") as HTMLElement)?.innerText.replace(/€/g, '').trim() || 'Unknown';
}

function getTitle(doc: Document): string {
    return doc.querySelector("h1")?.innerText || 'Unknown';
}

function getAddress(doc: Document): string {
    return (doc.querySelector(".main-info__title-minor") as HTMLElement)?.innerText || 'Unknown';
}

function getYear(doc: Document): string {
    return [...doc.querySelectorAll("li")]
        .find(el => el.innerText.includes("Construído em"))
        ?.innerText.match(/\d{4}/g)?.[0] || 'Unknown';
}

function getEnergyCertificate(doc: Document): string {
    return [...doc.querySelectorAll("li")]
        .find(el => el.innerText.includes("Classe energética"))
        ?.querySelector("span:nth-child(2)")?.title || 'Unknown';
}

function getGrossArea(doc: Document): string {
    return [...doc.querySelectorAll("li")]
        .find(el => el.innerText.includes("área bruta"))
        ?.innerText.match(/\d+/g)?.[0] || 'Unknown';
}

function getUtilArea(doc: Document): string {
    return [...doc.querySelectorAll("li")]
        .find(el => el.innerText.includes("úteis"))
        ?.innerText?.match(/(\d+) m² úteis/)?.[1] || 'Unknown';
}