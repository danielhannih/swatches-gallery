// Elements
const body = document.body
const main = document.querySelector("main.generated")
const favs = document.querySelector("main.favorites")
const controls = document.querySelector(".control")



// Framework functions
const put = (a, p) => a.forEach((e, i) => p.appendChild(a[i]))
const make = (e, a = []) => {
  let x = document.createElement(e)
  a.forEach((e, c) => x.classList.add(a[c]))
  return x
}

const id = () => Math.random().toString(36).substr(2,4)
const createID = () => `${id()}-${id()}-${id()}`


// Notification Message
const msg = (msg) => {
  let previousMsg = document.querySelector(".notification-message")
  if (previousMsg != null) {
    previousMsg.remove()
  }
  let div = make("div",["notification-message"])
  div.innerText = msg
  setTimeout(() => div.style.animation = "unset", 350)
  setTimeout(() => div.style.opacity = 0, 3000)
  setTimeout(() => div.remove(), 3500)
  put([div],body)
}


// Copy to clipboard
const copyToClipboard = (str,custom=false) => {
  const el = make("textarea")
  el.value = str
  el.setAttribute("readonly","")
  el.style.position = "absolute"
  el.style.left = "-9999px"
  put([el],body)
  el.select()
  document.execCommand("copy")
  body.removeChild(el)
  if (custom) {
    msg(`👌 Copied to clipboard!`)
  } else {
    msg(`👌 Copied to clipboard: ${str}`)
  }
}

const encode = (e) => btoa(e)
const decode = (e) => atob(e)


const randomNumberBetween = (min,max) => Math.floor(Math.random() * (max - min + 1) + min)
const angle = () => randomNumberBetween(0,360)


// Create HSL color
const hsl = (h,w,b) => `hsl(${h},${w}%, ${b}%)`

// Return gradient style
const gradient = (deg,v1,v2) => `linear-gradient(${deg}deg,${v1}0%,${v2} 100%)`
const gradientID = (deg,v1,v2) => `${deg}${v1}${v2}`



// Convert HSL to Hex
const hsl_Hex = (h,s,l) => {
  l /= 100
  const a = s * Math.min(l, 1 - l) / 100
  const f = n => {
    const k = (n + h / 30) % 12
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1)
    return Math.round(255 * color).toString(16).padStart(2,"0")
  }
  return `#${f(0)}${f(8)}${f(4)}`
}



// stepcounter dependend on how many generated tiles -> 0, 20, 40, to ortder colors

const getBaseTint = () => randomNumberBetween(gradientTypeHue[0],gradientTypeHue[1])
const getTintVariation = (baseTint) => {
  let x = baseTint + randomNumberBetween(16,70)
  if (x > 360) {
    x = x - 360
  }
  return x
}

const getLightValue = () => randomNumberBetween(gradientTypeLight[0],gradientTypeLight[1])
const getSaturation = () => randomNumberBetween(gradientTypeSaturation[0],gradientTypeSaturation[1])





// Storage Functions

// save gradient property also to gallery so that it can check if gradient is already stored
//  id generation -> use base64?

const storageID = "swatch-gallery-favorites"
const saveToStorage = (d) => localStorage.setItem(storageID,JSON.stringify(d))
const storageStructure = (id,v1,v2,deg) => {
  let x = {
    id: id,
    hex: [v1,v2],
    deg: deg
  }
  return x
}

const hasFavorites = () => null != localStorage.getItem(storageID)

const favoriteGradient = (id,v1,v2,deg) => {
  if (hasFavorites()) {
    let stored = JSON.parse(localStorage.getItem(storageID))
    // Get index of ID -> if -1 -> its not in the array
    let indexOfID = stored.map(e => e.id).indexOf(id)
    if (indexOfID == -1) {
      stored.push(storageStructure(id,v1,v2,deg))
    } else {
      stored.splice(indexOfID,1)
      // remove heart from main gallery

    }
    saveToStorage(stored)
  } else {
    let x = []
    x.push(storageStructure(id,v1,v2,deg))
    saveToStorage(x)
  }
  createFavoriteGallery()
}

// Get from storage -> if not there, create new item with gradient object in it
// If there, get the object -> json.parse -> see if its already in there





// Create swatch info
const createSwatchInfo = (swatches=[],id,deg) => {
  let info = make("div",["info"]),
  stopsWrap = make("div",["stops-wrap"]),
  favorite = make("div",["favorite-wrap"]),
  favoriteBtn = make("div",["make-favorite"])

  if (hasFavorites()) {
    let stored = JSON.parse(localStorage.getItem(storageID))
    let indexOfID = stored.map(e => e.id).indexOf(id)
    if (indexOfID != -1) {
      favoriteBtn.classList.add("active")
    }
  }

  favoriteBtn.addEventListener("click",() => {
    favoriteBtn.classList.toggle("active")
    favoriteGradient(id,swatches[0],swatches[1],deg)
    if (!favoriteBtn.classList.contains("active")) {
      let mainGalleryItemWithSameID = document.querySelector(`[data-id="${id}"] .active`)
      if (mainGalleryItemWithSameID !== null) {
        mainGalleryItemWithSameID.classList.toggle("active")
      }
    }
  })

  put([favoriteBtn],favorite)

  swatches.forEach((item, i) => {
    let swatchInfo = make("div",["stop"]),
    swatchPreview = make("div",["preview"]),
    swatchText = make("div",["text"])
    swatchPreview.style.backgroundColor = item
    swatchText.innerText = item
    swatchInfo.addEventListener("click",() => copyToClipboard(item))
    put([swatchPreview,swatchText],swatchInfo)
    put([swatchInfo],stopsWrap)
  })
  put([stopsWrap,favorite],info)
  return info
}




// on populate -> check if there are favorites, if there are favorites -> check if it has the same ID as the generated gradient -> if yes, pass active heart to info box


// if in favorites -> show delete button
// make createTile() so that it can be used everywhere

const createTile = (item=false) => {
  let
  wrap = make("div",["wrap"]),
  swatch = make("div",["swatch"]),
  info = make("div",["info"]),
  codeValues = {}
  if (item == false) {
    let baseTint = getBaseTint(),
    baseSaturation = getSaturation(),
    baseLightValue = getLightValue(),
    shiftedTint = getTintVariation(baseTint),
    shiftedSaturation = getSaturation(),
    shiftedLightValue = getLightValue(),
    gredientAngle = angle(),
    baseHSL = hsl(baseTint,baseSaturation,baseLightValue),
    shiftedHSL = hsl(shiftedTint,shiftedSaturation,shiftedLightValue),
    finalGradient = gradient(gredientAngle,baseHSL,shiftedHSL),
    color1 = hsl_Hex(baseTint,baseSaturation,baseLightValue),
    color2 = hsl_Hex(shiftedTint,shiftedSaturation,shiftedLightValue),
    id = encode(gradientID(gredientAngle,color1,color2))

    swatch.style.backgroundImage = finalGradient
    wrap.setAttribute("data-id",id)
    put([swatch,createSwatchInfo([color1,color2],id,gredientAngle)],wrap)

    codeValues.deg = gredientAngle
    codeValues.s1 = color1
    codeValues.s2 = color2

  } else {
    swatch.style.backgroundImage = `linear-gradient(${item.deg}deg,${item.hex[0]} 0%,${item.hex[1]} 100%)`
    put([swatch,createSwatchInfo([item.hex[0],item.hex[1]],item.id,item.deg)],wrap)

    codeValues.deg = item.deg
    codeValues.s1 = item.hex[0]
    codeValues.s2 = item.hex[1]

  }

  put([codeToggle(codeValues)],swatch)
  return wrap
}

const codeToggle = (codeValues) => {
  let toggle = make("div",["css-toggle"])
  toggle.innerText = "CSS"
  toggle.addEventListener("click",() => showCodeOverlay(codeValues))
  return toggle
}

const createCSSCode = (obj,prefixer) => {
  // linear-gradient
  let x = `
  <span class="p">background:</span> <span class="b">${prefixer}</span>(<span class="o">${obj.deg}deg</span>, <span class="o">${obj.s1.slice(0,1)}</span><span class="b">${obj.s1.slice(1).toUpperCase()}</span> <span class="o">0%</span>, <span class="o">${obj.s2.slice(0,1)}</span><span class="b">${obj.s2.slice(1).toUpperCase()}</span> <span class="o">100%</span>)<span class="p">;</span>`
  return x
}


const closeMultipleElements = (array) => array.forEach((e) => closeElement(e))

const closeElement = (e) => {
  e.style.opacity = 0
  setTimeout(() => e.remove(), 350)
}

const showCodeOverlay = (obj) => {
  let overlay = make("div",["code-overlay"]),
  overlayBackdrop = make("div",["code-overlay-backdrop"]),
  headline = make("div",["headline"]),
  codeBlock = make("code"),
  copyCode = make("div",["copy-cta"]),
  closeOverlay = make("div",["close-overlay"]),
  closeOverlayIcon = make("i"),
  closeButtons = [closeOverlay,overlayBackdrop],
  closeableElements = [overlay,overlayBackdrop]

  headline.innerText = "Copy CSS code"
  copyCode.innerText = "Copy CSS"
  codeBlock.innerHTML = `
    ${createCSSCode(obj,"linear-gradient")}
    <br>
    <br>
    <i>// For older Browsers:</i><br>
    ${createCSSCode(obj,"-webkit-linear-gradient")}
    <br>
    ${createCSSCode(obj,"-moz-linear-gradient")}
    <br>
    ${createCSSCode(obj,"-o-linear-gradient")}
    `

  overlay.style.opacity = 0
  setTimeout(() => overlay.style.opacity = 1, 1)
  closeButtons.forEach((btn) => btn.addEventListener("click",() => closeMultipleElements(closeableElements)))

  copyCode.addEventListener("click",() => copyToClipboard(codeBlock.innerText,true))

  put([closeOverlayIcon],closeOverlay)
  put([closeOverlay,headline,codeBlock,copyCode],overlay)
  put([overlayBackdrop,overlay],body)
}



// Populate galleries
const createMainGallery = (n) => {
  main.innerHTML = ""
  let i = 0
  while (i < n) {
    put([createTile()],main)
    i++
  }
}

const createEmptyFavorites = (parent) => parent.innerHTML = "<div class=empty><span>Your favorited swatches will appear here.</span></div>"

const createFavoriteGallery = () => {
  favs.innerHTML = ""
  if (hasFavorites()) {
    let stored = JSON.parse(localStorage.getItem(storageID))
    if (stored.length == 0) {
      createEmptyFavorites(favs)
    } else {
      stored.forEach((item) => put([createTile(item)],favs))
    }
  } else {
    createEmptyFavorites(favs)
  }
}


const setGlobalGradientType = () => {
  gradientTypeHue = globals.T[gradientType].hue
  gradientTypeSaturation = globals.T[gradientType].saturation
  gradientTypeLight = globals.T[gradientType].light
}

const repopulateMainGallery = () => {

  createMainGallery(globals.swatchCount)
  msg(`✨ Generated ${globals.T[gradientType].name} Gallery.`)
}

const generateNewGalleryButton = () => {
  let generateNewGallery = make("div",["cta"])
  generateNewGallery.innerText = "Generate New Gallery"
  generateNewGallery.addEventListener("click",() => repopulateMainGallery())
  return generateNewGallery
}

const gradientSwitcher = () => {
  let switcher = make("div",["switcher"]),
  activeIndicator = make("div",["active-switcher",gradientType])
  put([activeIndicator],switcher)
  for (const [key, value] of Object.entries(globals.T)) {
    let item = make("div",["item"])
    item.innerText = globals.T[key].name
    if (gradientType == key) {
      item.classList.add("active-select")
    }
    item.addEventListener("click",() => {
      activeIndicator.classList.remove(gradientType)
      gradientType = key
      activeIndicator.classList.add(gradientType)
      setGlobalGradientType()
      repopulateMainGallery()
    })
    put([item],switcher)
  }
  return switcher
}

const createTopLevelControls = () => put([gradientSwitcher(),generateNewGalleryButton()],controls)



// Settings to toggle CSS and downlaod image



// const settings = () => {
//   let settingsWrap = make("div",["settings"])
//
//   // CSS Toggle -> to copy css of gradient
//   // Show placeholder text in gradient
//
//   settingsWrap.innerText = "Settings"
//   return settingsWrap
// }








const init = () => {
  createTopLevelControls()
  createMainGallery(globals.swatchCount)
  createFavoriteGallery()
}

let globals = {
  swatchCount: 64,
  css: false,
  T: {
    vibrant: {
      name: "Vibrant",
      hue: [0,360],
      saturation: [97,100],
      light: [49,56]
    },
    pastel: {
      name: "Pastel",
      hue: [0,360],
      saturation: [80,100],
      light: [62,82]
    },
    random: {
      name: "Random",
      hue: [0,360],
      saturation: [0,100],
      light: [0,100]
    }
  }
}

let
gradientType = "vibrant",
gradientTypeHue = globals.T[gradientType].hue,
gradientTypeSaturation = globals.T[gradientType].saturation,
gradientTypeLight = globals.T[gradientType].light



// button that clears gallery and creates new ones
// favorite button -> ability to edit name?


init()
