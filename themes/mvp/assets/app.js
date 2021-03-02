// Elements
const body = document.body
const main = document.querySelector("main")

const put = (a, p) => a.forEach((e, i) => p.appendChild(a[i]))
const make = (e, a = []) => {
  let x = document.createElement(e)
  a.forEach((e, c) => x.classList.add(a[c]))
  return x
}

const randomNumberBetween = (min,max) => Math.floor(Math.random() * (max - min + 1) + min)
const angle = () => randomNumberBetween(0,360)

// h > 359(360), w > 0% - 100%, b > 0% - 100% --- hsl(232,95,50)
const hsl = (h,w,b) => `hsl(${h},${w}%, ${b}%)`
const gradient = (deg,v1,v2) => `linear-gradient(${deg}deg,${v1}0%,${v2} 100%)`

// stepcounter dependend on how many generated tiles -> 0, 20, 40, to ortder colors

const getBaseTint = () => randomNumberBetween(100,360)
const getTintVariation = (baseTint) => {
  let x = baseTint + randomNumberBetween(16,70)
  if (x > 360) {
    x = x - 360
  }
  return x
}

const getLightValue = () => randomNumberBetween(49,56)
const getSaturation = () => randomNumberBetween(97,100)

const createGradient = (baseTint,tintVariation) => gradient(angle(),hsl(baseTint,getSaturation(),getLightValue()),hsl(tintVariation,getSaturation(),getLightValue()))

// background-image: linear-gradient(180deg, #0056FF 0%, #22DAF2 100%);

const createTile = () => {
  let div = make("div",["tile"])
  div.innerText = "Some placeholder text."

  let baseTint = getBaseTint()
  let tintVariation = getTintVariation(baseTint)
  div.style.backgroundImage = createGradient(baseTint,tintVariation)
  return div
}

createMultipleTiles = (number,parent) => {
  let i = 0
  while (i < number) {
    put([createTile()],parent)
    i++
  }
}

const init = () => {
  createMultipleTiles(100,main)
}


init()
