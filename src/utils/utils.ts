// This file will export the basic utitlity function to use globally.
import Compressor from 'compressorjs';
import { v4 as uuid } from 'uuid';
import { windowRef } from './window';

/**
 * Determine the mobile operating system.
 * This function returns one of 'iOS', 'Android', 'Windows Phone', or 'unknown'.
 *
 * @returns {String}
 */
export function getMobileOperatingSystem() {
  var userAgent = windowRef()?.navigator?.userAgent || windowRef()?.navigator?.vendor || windowRef()?.opera;

  // Windows Phone must come first because its UA also contains "Android"
  if (/windows phone/i.test(userAgent)) {
    return "Windows Phone";
  }

  if (/android/i.test(userAgent)) {
    return "Android";
  }

  // iOS detection from: http://stackoverflow.com/a/9039885/177710
  if (/iPad|iPhone|iPod/.test(userAgent) && !windowRef().MSStream) {
    return "IOS";
  }

  return "unknown";
}

export function timeDiffCalc(dateFuture, dateNow, status) {
  let diffInMilliSeconds = Math.abs(dateFuture - dateNow) / 1000;

  // calculate days
  const days = Math.floor(diffInMilliSeconds / 86400);
  diffInMilliSeconds -= days * 86400;
  // console.log('calculated days', days);

  // calculate hours
  const hours = Math.floor(diffInMilliSeconds / 3600) % 24;
  diffInMilliSeconds -= hours * 3600;
  // console.log('calculated hours', hours);

  // calculate minutes
  const minutes = Math.floor(diffInMilliSeconds / 60) % 60;
  diffInMilliSeconds -= minutes * 60;
  // console.log('minutes', minutes);

  let difference: any = '';
  switch (status) {
    case 'Days':
      difference = days;
      break;
    case 'Hours':
      difference = hours;
      break;
    case 'Minutes':
      difference = minutes;
      break;
    case 'Fulldate':
      if (days > 0) {
        difference += (days === 1) ? `${days} day, ` : `${days} days, `;
      }

      difference += (hours === 0 || hours === 1) ? `${hours} hour, ` : `${hours} hours, `;

      difference += (minutes === 0 || hours === 1) ? `${minutes} minutes` : `${minutes} minutes`;
      break;
  }

  return difference;
}

/**
 * This utility function will truncate the long text
 * with the chars provided, for example if chars = 32 then it will
 * truancate the text till 32th character and return the new text.
 * @param {*} desc 
 * @param {*} chars 
 */
export const TruncateText = (desc, chars) => {
  if (desc && desc?.length > chars) {
    return desc.substring(0, chars) + '';
  } else {
    return desc
  }
}

export function parseJSON(response) {
  return new Promise(resolve => {
    response.text().then(body => {
      resolve({
        status: response.status,
        ok: response.ok,
        json: body !== '' ? JSON.parse(body) : '{}'
      })
    })
  })
}

function formatFilterString(type, filter) {
  const filterStringArray = Object.keys(filter)?.map(key => {
    const value = filter[key]
    let queryString: any = `${key},${value}`

    if (typeof value === 'object')
      queryString = Object.keys(value)?.map(
        attr => `${key}.${attr},${value[attr]}`
      )

    return `${type}(${queryString})`
  })

  return filterStringArray.join(':')
}

function formatQueryString(key, value) {
  if (key === 'limit' || key === 'offset') {
    return `page${value}`
  }

  if (key === 'filter') {
    const filterValues = Object.keys(value)?.map(filter =>
      formatFilterString(filter, value[filter])
    )

    return `${key}=${filterValues.join(':')}`
  }

  return `${key}=${value}`
}

function buildQueryParams({ includes, sort, limit, offset, filter }) {
  const query: any = {}

  if (includes) {
    query.include = includes
  }

  if (sort) {
    query.sort = `${sort}`
  }

  if (limit) {
    query.limit = `[limit]=${limit}`
  }

  if (offset) {
    query.offset = `[offset]=${offset}`
  }

  if (filter) {
    query.filter = filter
  }

  return Object.keys(query)
    ?.map(k => formatQueryString(k, query[k]))
    .join('&')
}

export function buildURL(endpoint, params) {
  if (
    params.includes ||
    params.sort ||
    params.limit ||
    params.offset ||
    params.filter
  ) {
    const paramsString = buildQueryParams(params)

    return `${endpoint}?${paramsString}`
  }

  return endpoint
}

export function buildRequestBody(body) {
  let parsedBody
  if (body) {
    if (body.options) {
      parsedBody = `{
        "data": ${JSON.stringify(body.data)},
        "options" : ${JSON.stringify(body.options)}
      }`
    } else {
      parsedBody = `{
        "data": ${JSON.stringify(body)}
      }`
    }
  }

  return parsedBody
}

export function buildCartItemData(
  id,
  quantity = null,
  type = 'cart_item',
  flows,
  isSku = false
) {
  const payload = {
    type,
    ...flows
  }

  if (type === 'cart_item') {
    if (isSku)
      Object.assign(payload, {
        sku: id,
        quantity: parseInt(quantity, 10)
      })
    else
      Object.assign(payload, {
        id,
        quantity: parseInt(quantity, 10)
      })
  }

  if (type === 'promotion_item') {
    Object.assign(payload, {
      code: id
    })
  }

  return payload
}

export function buildCartCheckoutData(
  customer,
  billing_address,
  shipping_address
) {
  let parsedCustomer = customer

  if (typeof customer === 'string') parsedCustomer = { id: customer }

  return {
    customer: parsedCustomer,
    billing_address,
    shipping_address
  }
}

export function resetProps(instance) {
  const inst = instance
    ;['includes', 'sort', 'limit', 'offset', 'filter'].forEach(
      e => delete inst[e]
    )
}

export function getCredentials(storage) {
  return JSON.parse(storage.get('moltinCredentials'))
}

export function tokenInvalid(config) {
  const credentials = getCredentials(config.storage)

  return (
    !credentials ||
    !credentials.access_token ||
    credentials.client_id !== config.client_id ||
    Math.floor(Date.now() / 1000) >= credentials.expires
  )
}

export function formatTimeTo12Hr(time) {
  if (time) {
    let timeNewDateString = time.split(":");
    let timeNewDate = new Date();
    timeNewDate.setHours(parseInt(timeNewDateString[0]));
    timeNewDate.setMinutes(parseInt(timeNewDateString[1]));
    const hour24 = timeNewDate.getHours();
    let minutes: any = (timeNewDate.getMinutes() === 0) ? '00' : timeNewDate.getMinutes();
    minutes = (minutes > 0 && minutes < 10) ? `0${minutes}` : minutes;
    const ampm = (hour24 >= 12) ? 'PM' : 'AM';
    let hour: any = hour24 % 12 || 12;
    //append zero is hour is single digit
    if (hour < 10) {
      hour = `0${hour}`;
    }
    return `${hour}:${minutes} ${ampm}`;
  } else return '';
};
export function hex2rgb(colour, alpha) {
  var r, g, b;
  if (colour.charAt(0) == "#") {
    colour = colour.substr(1);
  }

  r = colour.charAt(0) + '' + colour.charAt(1);
  g = colour.charAt(2) + '' + colour.charAt(3);
  b = colour.charAt(4) + '' + colour.charAt(5);

  r = parseInt(r, 16);
  g = parseInt(g, 16);
  b = parseInt(b, 16);
  return alpha ? `rgb(${r},${g},${b},${alpha}%)` : `rgb(${r},${g},${b})`;
}

export function dynamicSort(property: any, order: number) {
  var sortOrder = order;
  if (property == 'lastVisitedOn') {
    return function (a: any, b: any) {
      var result = (new Date(a[property]).getTime() < new Date(b[property]).getTime()) ? -1 : (new Date(a[property]).getTime() > new Date(b[property]).getTime()) ? 1 : 0;
      return result * sortOrder;
    }
  } else {
    return function (a: any, b: any) {
      var result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
      return result * sortOrder;
    }
  }
}

export function updateManifestFile(storeData: any) {
  const theme_color = document.getElementById("theme-color").getAttribute("content");
  const manifestConfig = storeData.configData.storeConfig.manifestConfig;
  const manifestString = JSON.stringify({
    ...{
      "name": `${storeData.tenant}, ${storeData.name}` || 'Respark',
      "short_name": `${storeData.tenant}` || 'Respark',
      "start_url": storeData.url || '/',
      "display": "standalone",
      "background_color": theme_color || "#dee1ec",
      "theme_color": theme_color || "#dee1ec",
      "orientation": "standalone",
      "description": storeData.description,
      "id": storeData.tenantId,
      "icons": [
        {
          "src": manifestConfig.icons['180'],
          "type": "image/png",
          "sizes": "180x180"
        },
        {
          "src": manifestConfig.icons['192'],
          "type": "image/png",
          "sizes": "192x192"
        },
        {
          "src": manifestConfig.icons['384'],
          "type": "image/png",
          "sizes": "384x384"
        },
        {
          "src": manifestConfig.icons['512'],
          "type": "image/png",
          "sizes": "512x512"
        },
        {
          "src": manifestConfig.icons['1024'],
          "type": "image/png",
          "sizes": "1024x1024"
        }
      ]
    },
  });
  // console.log(manifestString)
  const manifestElement = document.getElementById("manifest");
  manifestElement?.setAttribute("href", "data:application/json;charset=utf-8," + encodeURIComponent(manifestString));
}

export function getDateObj(inputDate: any = new Date()) {
  let dateObj = new Date(inputDate.getFullYear(), inputDate.getMonth(), inputDate.getDate());
  const month = (dateObj.getMonth() + 1).toString().length == 1 ? `0${dateObj.getMonth() + 1}` : dateObj.getMonth() + 1;
  const date = dateObj.getDate().toString().length == 1 ? `0${dateObj.getDate()}` : dateObj.getDate();
  return {
    displayDate: date,
    displayDay: dateObj.toLocaleString('en-us', { weekday: 'long' }).substring(0, 3),
    newDate: dateObj,
    dateObj: `${dateObj.getFullYear()}-${month}-${date}`,
    dateTimeDisplay: `${dateObj.getFullYear()}-${month}-${date} ${formatTimeTo12Hr(inputDate.toLocaleTimeString())}`
  }
}

export function initialThemeHandler() {
  let isDark = false;
  if (localStorage.getItem("theme")) {
    isDark = localStorage.getItem("theme") == 'dark' ? true : false
  } else {
    const darkTheme = window.matchMedia("(prefers-color-scheme: dark)");
    if (darkTheme) {
      localStorage.setItem("theme", 'dark');
      isDark = true;
    } else {
      localStorage.setItem("theme", 'light');
      isDark = false;
    }
  }
  return isDark
}

export function convertRGBtoOBJ(colorString) {
  const rgbKeys = ['r', 'g', 'b', 'a'];
  let rgbObj = {};
  let color = colorString.replace(/^rgba?\(|\s+|\)$/g, '').split(',');

  for (let i in rgbKeys)
    rgbObj[rgbKeys[i]] = color[i] || 1;

  return rgbObj;
}

export function calculateTextColor(backgroundColor) {
  // Extract RGB values from the hex code
  const r = parseInt(backgroundColor.slice(1, 3), 16);
  const g = parseInt(backgroundColor.slice(3, 5), 16);
  const b = parseInt(backgroundColor.slice(5, 7), 16);

  // Calculate perceived brightness using a weighted average
  const brightness = (r * 0.299 + g * 0.587 + b * 0.114) / 255;

  // Choose black or white text based on brightness threshold
  const textColor = brightness > 0.5 ? '#000000' : '#ffffff';

  return textColor;
}

export function lightenColor(color, amount) {
  // Validate hex code format (basic check)
  if (!color.match(/^#[0-9A-F]{3,6}$/i)) {
    return null;
  }

  amount = Math.max(0, amount || 0); // Ensure amount is non-negative

  // Convert hex to decimal (RGB)
  const num = parseInt(color.slice(1), 16);
  let r = (num >> 16) & 255;
  let g = (num >> 8) & 255;
  let b = num & 255;

  // Increase each component by the specified amount
  r = Math.min(255, r + amount);
  g = Math.min(255, g + amount);
  b = Math.min(255, b + amount);

  // Convert back to hex
  return "#" + (1 << 24 | r << 16 | g << 8 | b).toString(16).slice(1).padStart(6, '0');
}


export function hexToRgbA(hex, alpha = 1) {
  var c;
  if (/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)) {
    c = hex.substring(1).split('');
    if (c.length == 3) {
      c = [c[0], c[0], c[1], c[1], c[2], c[2]];
    }
    c = '0x' + c.join('');
    return 'rgba(' + [(c >> 16) & 255, (c >> 8) & 255, c & 255].join(',') + ',' + alpha + ')';
  }
  throw hex;
}

export function convertOBJtoRgb(obj) {
  return `rgba(${obj.r}, ${obj.g}, ${obj.b}, ${obj.a})`;
}

export const uid = () => String(Date.now().toString(32) + Math.random().toString(16)).replace(/\./g, '');

export const isContainerElement = (config) => Boolean(config.sectionId) ? true : false;

export const removeObjRef = (obj) => {
  // return deepClone(obj);
  // return structuredClone(obj);
  // return removeReferencesManually(obj);
  // return Object.assign({}, obj)
  return JSON.parse(JSON.stringify(obj || {}));
}

function removeReferencesManually(obj) {
  if (obj === null || typeof obj !== 'object') {
    return obj; // Primitive values, return them directly
  }

  if (Array.isArray(obj)) {
    return obj.map(item => removeReferencesManually(item)); // Clone array elements
  }

  const newObj = {};
  for (const key in obj) {
    if (typeof obj[key] === 'object') {
      obj[key] = null; // Set the reference to null
    } else {
      newObj[key] = obj[key]; // Copy primitive values
    }
  }
  return newObj;
}

function deepClone(obj) {
  if (obj === null || typeof obj !== 'object') {
    return obj; // Primitive values, return them directly
  }

  if (Array.isArray(obj)) {
    return obj.map(deepClone); // Clone array elements recursively
  }

  const newObj = {};
  for (const key in obj) {
    newObj[key] = deepClone(obj[key]); // Clone nested objects/arrays
  }
  return newObj;
}

export function updateDeepPathValue(object, path, val) {
  const keys = path.split(".");
  const lastKey = keys.pop();
  const lastObj = keys.reduce((obj: any, key: any) => obj[key] = obj[key] || {}, object);
  lastObj[lastKey] = val;
  return object;
}
// updateDeepPath(originalObject, 'data.nested.value', 'modified value');

function cloneObject(source, deep = true) {
  var o, prop, type;

  if (typeof source != 'object' || source === null) {
    // What do to with functions, throw an error?
    o = source;
    return o;
  }
  if (typeof source.constructor !== 'function') {
    source.constructor = function () { };
  }

  o = new source.constructor();

  for (prop in source) {

    if (source.hasOwnProperty(prop)) {
      type = typeof source[prop];

      if (deep && type == 'object' && source[prop] !== null) {
        o[prop] = cloneObject(source[prop]);

      } else {
        o[prop] = source[prop];
      }
    }
  }
  return o;
}

export function isSameObjects(value, other) {
  // Get the value type
  var type = Object.prototype.toString.call(value);
  // If the two objects are not the same type, return false
  if (type !== Object.prototype.toString.call(other)) return false;
  // If items are not an object or array, return false
  if (['[object Array]', '[object Object]'].indexOf(type) < 0) return false;
  // Compare the length of the length of the two items
  var valueLen = type === '[object Array]' ? value.length : Object.keys(value).length;
  var otherLen = type === '[object Array]' ? other.length : Object.keys(other).length;
  if (valueLen !== otherLen) return false;
  // Compare two items
  var compare = function (item1, item2) {
    // Get the object type
    var itemType = Object.prototype.toString.call(item1);
    // If an object or array, compare recursively
    if (['[object Array]', '[object Object]'].indexOf(itemType) >= 0) {
      if (!isSameObjects(item1, item2)) return false;
    }
    // Otherwise, do a simple comparison
    else {
      // If the two items are not the same type, return false
      if (itemType !== Object.prototype.toString.call(item2)) return false;
      // Else if it's a function, convert to a string and compare
      // Otherwise, just compare
      if (itemType === '[object Function]') {
        if (item1.toString() !== item2.toString()) return false;
      } else {
        if (item1 !== item2) return false;
      }
    }
  };

  // Compare properties
  if (type === '[object Array]') {
    for (var i = 0; i < valueLen; i++) {
      if (compare(value[i], other[i]) === false) return false;
    }
  } else {
    for (var key in value) {
      if (value.hasOwnProperty(key)) {
        if (compare(value[key], other[key]) === false) return false;
      }
    }
  }
  // If nothing failed, return true
  return true;

};

export function compareObjects(obj1, obj2) {
  const deepCompare = (value1, value2) => {
    if (typeof value1 === 'object' && typeof value2 === 'object') {
      return compareObjects(value1, value2);
    }
    return value1 === value2;
  };
  const keys1 = Object.keys(obj1);
  const keys2 = Object.keys(obj2);
  const addedKeys = keys2.filter(key => !keys1.includes(key));
  const removedKeys = keys1.filter(key => !keys2.includes(key));
  const modifiedValues = keys1.filter(key => !deepCompare(obj1[key], obj2[key])).reduce((result, key) => {
    result[key] = {
      old: obj1[key],
      new: obj2[key],
    };
    return result;
  }, {});
  const sharedKeys = keys1.filter(key => keys2.includes(key));
  const nestedDifferences = sharedKeys.reduce((result, key) => {
    const value1 = obj1[key];
    const value2 = obj2[key];
    if (typeof value1 === 'object' && typeof value2 === 'object') {
      const nestedDiff = compareObjects(value1, value2);
      if (Object.keys(nestedDiff).length > 0) {
        result[key] = nestedDiff;
      }
    } else if (Array.isArray(value1) && Array.isArray(value2)) {
      if (!isSameObjects(value1, value2)) {
        result[key] = {
          old: value1,
          new: value2,
        };
      }
    }
    return result;
  }, {});
  return {
    added: addedKeys,
    removed: removedKeys,
    modified: modifiedValues,
    nested: nestedDifferences,
  };
}

export const checkUidIsPresent = (obj, uid) => {
  // Check if the current object has a uid property and if it matches the desired uid
  if (obj.hasOwnProperty('uid') && obj.uid === uid) {
    return true;
  }

  // If the current object has children, recursively search through them
  if (obj.hasOwnProperty('children') && Array.isArray(obj.children)) {
    for (let child of obj.children) {
      // Recursive call to search in child object
      if (checkUidIsPresent(child, uid)) {
        return true;
      }
    }
  }
  // If the uid is not found in the current object or its children, return false
  return false;
}

export const isProduction = () => {
  return process.env.NODE_ENV === "production"
}

export const isDevelopment = () => {
  return process.env.NODE_ENV === "development"
}

export const clearBrowserCache = (reloadAfterClear = true) => {
  if ('caches' in window) {
    caches.keys().then((names) => {
      names.forEach(async (name) => {
        await caches.delete(name)
      })
    })

    if (reloadAfterClear)
      window.location.reload()
  }
}

export const arrayNullCheck = (arrayObj) => {
  return Boolean(arrayObj?.length);
}

export const valueNullCheck = (value) => {
  return Boolean(value);
}

export const objectNullCheck = (object, key = '') => {
  return Boolean(object) && Boolean(Object.keys(object)?.length) && (Boolean(key) ? Boolean(object?.[key]) : Boolean(object));
}

export const getUID = () => {
  return uuid();
}

export const getRandomPasteleColor = (alpha = 1) => {
  return "hsl(" + 360 * Math.random() + ',' +
    (25 + 70 * Math.random()) + '%,' +
    (85 + 10 * Math.random()) + '%,' + alpha + ")"
}

export const getBase64 = (file: any): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });

export const blobToBase64 = (blob) => {
  return new Promise((resolve, _) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result);
    reader.readAsDataURL(blob);
  });
}

export const getCompressedImage = (file, quality = 0.8) => {
  return new Promise((resolve, _) => {
    new Compressor(file, {
      quality,
      // The compression process is asynchronous,
      async success(compressedBlob: any) {//result == blob
        const base64 = await blobToBase64(compressedBlob)
        resolve(base64)
      },
      error(err) {
        resolve(null)
        console.log(err.message);
      },
    });
  });
}

export const getUniqueValueArray = (value, index, self) => {
  return self.indexOf(value) === index;
}

export const getBase64Length = (base64Url) => {
  var stringLength = base64Url.length - 'data:image/png;base64,'.length;
  var sizeInBytes = 4 * Math.ceil((stringLength / 3)) * 0.5624896334383812;
  return sizeInBytes;
}

export const addFontFaceStyle = (presetsList: any[]) => {
  let styleTag = document.getElementById("ecoms.ai-font-face");
  if (!styleTag) {
    styleTag = document.createElement('style');
    styleTag.id = "ecoms.ai-font-face"; // Set the id attribute
  }

  let fontFaces = "";
  presetsList.map((preset) => {
    if (!Boolean(styleTag.innerText.includes(preset.code))) {
      fontFaces = fontFaces + `
          @font-face {
            font-family: ${preset.code};
            src: url('${preset.fileUrl}');
          }
          `;
    }
  })

  try {
    styleTag.appendChild(document.createTextNode(fontFaces));
  } catch (error) {
    // styleTag.styleSheet.cssText = code;
  }
  const head = document.getElementsByTagName('head')[0];
  head.appendChild(styleTag);
}

export const getEncodedString = (str: string = "") => {
  if (!str) return "";
  return btoa(str);
}

export const getDecodedString = (str: string = "") => {
  if (!str) return "";
  return atob(str);
}

export const onlyUnique = (value, index, self) => {
  return self.indexOf(value) === index;
}

export const getNameInitials = (name: string) => {
  return name
    .split(' ')
    .map(part => part[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
};
