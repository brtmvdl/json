
// references

const $error = document.getElementById('error')
const $url = document.getElementById('url')
const $json = document.getElementById('json')
const $text = document.getElementById('text')

const DEFAULT_URL = window.location.href + 'sample.json'

// events handlers

$url.addEventListener('keydown', onUrlKeyDown)
$json.addEventListener('keyup', onJsonKeyUp)

// side effects

function setError({ message }) {
  $error.innerText = message
}

function clearError() {
  $error.innerText = ''
}

function setUrl(url) {
  $url.value = url
}

function getUrl() {
  return $url.value
}

function setJson(json) {
  $json.value = stringifyJSON(json)
}

function getJson() {
  return $json.value
}

function setText(text) {
  $text.innerText = text
  $text.style.display = (text === null || text.length === 0) ? 'none' : 'block'
}

function onJsonKeyUp() {
  renderJson($json.value)
}

// helpers

function ajax(url) {
  return new Promise((resolve, reject) => {
    const notFound = () => reject(new Error('URL not found.'))

    const xhr = new XMLHttpRequest()
    xhr.open('GET', url, false)
    xhr.onload = () => xhr.status === 200 ? resolve(xhr.responseText) : notFound()
    xhr.onerror = () => notFound()
    xhr.send()
  })
}

// functions

function onUrlKeyDown({ ctrlKey, key }) {
  if (key === 'Enter') {
    const url = getUrl()
    if (!url) setUrl(DEFAULT_URL)
    clearError()
    renderURL(getUrl())
  }
}

function renderURL(url) {
  if (url === '') return Promise.resolve(getJson())

  try {
    url = (new URL(url)).href
  } catch (e) {
    throw new Error('Invalid URL.')
  }

  ajax(url)
    .then((json) => renderJson(json))
    .catch(error => setError(error))
}

function renderJson(json) {
  setJson(json)
  renderText(json)
}

function stringifyJSON (text) {
  let json = {}

  try {
    json = JSON.parse(text)
  } catch (e) {
    json = null
  }

  return JSON.stringify(json, null, 4)
}

function renderText(text) {
  setText(stringifyJSON(text))
}
