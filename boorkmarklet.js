function extractInfo(doc) {
  
    const url = new URL(doc.URL);
    const listingUrl = url.href;
    
    const year = getYear(doc);
    const energyCertificate = getEnergyCertificate(doc);
    const grossArea = getGrossArea(doc);
    const utilArea = getUtilArea(doc);
    
    return {
      "URL": url.href,
      "Title": getTitle(doc),
      "Address": getAddress(doc),
      "Price": getPrice(doc),
      "Listing URL": listingUrl,
      "Year": year,
      "Energy Certificate": energyCertificate,
      "Gross Area (m²)": grossArea,
      "Util Area (m²)": utilArea
    };
  }
  
  function getPrice(doc) {
    const priceElement = doc.querySelector(".info-data-price");
    if (priceElement) {
      return priceElement.innerText.replace(/€/g, ' ').trim();
    } else {
      return 'Unknown';
    }
  }
  
  function getTitle(doc) {
    const titleElement = doc.querySelector("h1");
    if (titleElement) {
      return titleElement.innerText;
    } else {
      return 'Unknown';
    }
  }
  
  function getAddress(doc) {
    const addressElement = doc.querySelector(".main-info__title-minor");
    if (addressElement) {
      return addressElement.innerText;
    } else {
      return 'Unknown';
    }
  }
  
  function getYear(doc) {
    const year = [...doc.querySelectorAll("li")].find(el => el.innerText.includes("Construído em"))?.innerText.match(/\d{4}/g)?.[0];
  
    return year || 'Unknown';
  }
  
  function getEnergyCertificate(doc) {
    const energyCertificateElement = [...doc.querySelectorAll("li")].find(el => el.innerText.includes("Classe energética"))?.querySelector("span:nth-child(2)")?.title
  
    return energyCertificateElement || 'Unknown';
  
  }
  
  function getGrossArea(doc) {
    const gross = [...doc.querySelectorAll("li")].find(el => el.innerText.includes("área bruta"))?.innerText.match(/\d+/g)?.[0];
  
    return gross || 'Unknown';
  }
  
  function getUtilArea(doc) {
    const year = [...doc.querySelectorAll("li")].find(el => el.innerText.includes("úteis"))?.innerText?.match(/(\d+) m² úteis/)[1];
  
    return year || 'Unknown';
  }
  
  function getNotes(doc) {
    const notesElement = doc.querySelector('p:contains("está em bom estado")');
    if (notesElement) {
      return 'Needs renovation';
    } else {
      return 'Unknown';
    }
  }
  
  let info = extractInfo(document);
  console.log(info);
  navigator.clipboard.writeText(JSON.stringify(info, null, 2))