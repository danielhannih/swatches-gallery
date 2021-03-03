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
const copyToClipboard = (str) => {
  const el = make("textarea")
  el.value = str
  el.setAttribute("readonly","")
  el.style.position = "absolute"
  el.style.left = "-9999px"
  put([el],body)
  el.select()
  document.execCommand("copy")
  document.body.removeChild(el)
  msg(`👌 Copied to clipboard: ${str}`)
}

const encode = (e) => btoa(e)
const decode = (e) => atob(e)


const randomNumberBetween = (min,max) => Math.floor(Math.random() * (max - min + 1) + min)
const angle = () => randomNumberBetween(0,360)


// Create HSL color
const hsl = (h,w,b) => `hsl(${h},${w}%, ${b}%)`

// Return gradient style
const gradient = (deg,v1,v2) => `linear-gradient(${deg}deg,${v1}0%,${v2} 100%)`



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
const storageStructure = (id,v1,v2) => {
  let x = {
    id: id,
    hex: [v1,v2]
  }
  return x
}

const hasFavorites = () => null != localStorage.getItem(storageID)

const favoriteGradient = (id,v1,v2) => {
  if (hasFavorites()) {
    let stored = JSON.parse(localStorage.getItem(storageID))
    // Get index of ID -> if -1 -> its not in the array
    let indexOfID = stored.map(e => e.id).indexOf(id)
    if (indexOfID == -1) {
      stored.push(storageStructure(id,v1,v2))
    } else {
      stored.splice(indexOfID,1)
      // remove heart from main gallery

    }
    saveToStorage(stored)
  } else {
    let x = []
    x.push(storageStructure(id,v1,v2))
    saveToStorage(x)
  }
  createFavoriteGallery()
}

// Get from storage -> if not there, create new item with gradient object in it
// If there, get the object -> json.parse -> see if its already in there





// Create swatch info
const createSwatchInfo = (swatches=[],id) => {
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
    favoriteGradient(id,swatches[0],swatches[1])
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
  info = make("div",["info"])
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
    id = encode(finalGradient),
    color1 = hsl_Hex(baseTint,baseSaturation,baseLightValue),
    color2 = hsl_Hex(shiftedTint,shiftedSaturation,shiftedLightValue)
    swatch.style.backgroundImage = finalGradient
    wrap.setAttribute("data-id",id)
    put([swatch,createSwatchInfo([color1,color2],id)],wrap)
  } else {
    swatch.style.backgroundImage = decode(item.id)
    put([swatch,createSwatchInfo([item.hex[0],item.hex[1]],item.id)],wrap)
  }
  return wrap
}



// Populate galleries
const createMainGallery = (n) => {
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
  gradientTypeHue = globals.gradientTypes[gradientType].hue
  gradientTypeSaturation = globals.gradientTypes[gradientType].saturation
  gradientTypeLight = globals.gradientTypes[gradientType].light
}

const repopulateMainGallery = () => {
  main.innerHTML = ""
  createMainGallery(globals.swatchCount)
  msg(`✨ Generated ${globals.gradientTypes[gradientType].name} Gallery.`)
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
  for (const [key, value] of Object.entries(globals.gradientTypes)) {
    let item = make("div",["item"])
    item.innerText = globals.gradientTypes[key].name
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

const cssToggle = () => {
  let toggle = make("div",["css-toggle"])
  toggle.innerText = "CSS Toggle"
  return toggle
}

const settings = () => {
  let settingsWrap = make("div",["settings"])

  // CSS Toggle -> to copy css of gradient
  // Show placeholder text in gradient

  settingsWrap.innerText = "Settings"
  return settingsWrap
}

const createTopLevelControls = () => {

  put([gradientSwitcher(),generateNewGalleryButton()],controls)

  // controls
}

const init = () => {
  createTopLevelControls()
  createMainGallery(globals.swatchCount)
  createFavoriteGallery()
}

let globals = {
  swatchCount: 64,
  css: false,
  gradientTypes: {
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
gradientType = "vibrant"
gradientTypeHue = globals.gradientTypes[gradientType].hue,
gradientTypeSaturation = globals.gradientTypes[gradientType].saturation,
gradientTypeLight = globals.gradientTypes[gradientType].light



// button that clears gallery and creates new ones
// favorite button -> ability to edit name?


init()
