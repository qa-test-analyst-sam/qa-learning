const modal = document.querySelector('#signup-modal')
const signupForm = document.querySelector('#signup-form')
const modalClose = document.querySelector('#modal-close')
const chatPanel = document.querySelector('#chat-panel')
const chatToggle = document.querySelector('#chat-toggle')
const chatMessages = document.querySelector('#chat-messages')
const chatForm = document.querySelector('#chat-form')
const chatInput = document.querySelector('#chat-input')
const accountKey = 'testatlas-demo-account'

function accountExists() {
  try { return Boolean(localStorage.getItem(accountKey)) } catch { return false }
}
function openSignup() {
  if (accountExists()) return
  modal.hidden = false
  document.body.style.overflow = 'hidden'
  document.querySelector('#signup-name').focus()
}
function closeSignup() {
  modal.hidden = true
  document.body.style.overflow = ''
}
function unlockTutorials() {
  document.querySelectorAll('.gated-video').forEach(button => {
    const query = encodeURIComponent(button.dataset.search)
    const title = button.dataset.title
    button.classList.add('unlocked')
    button.innerHTML = `<span class="mini-thumb"><img src="${button.querySelector('img').src}" alt=""><span>▶</span></span><span><b>${title}</b><small>Open tutorial ↗</small></span><i>↗</i>`
    button.onclick = () => window.open(`https://www.youtube.com/results?search_query=${query}`, '_blank', 'noopener,noreferrer')
  })
  document.querySelectorAll('.join-trigger').forEach(button => {
    if (button.matches('button')) button.textContent = 'Tutorial access unlocked ✓'
  })
}
document.querySelectorAll('.join-trigger').forEach(button => button.addEventListener('click', openSignup))
document.querySelectorAll('.gated-video').forEach(button => button.addEventListener('click', openSignup))
modalClose.addEventListener('click', closeSignup)
modal.addEventListener('click', event => { if (event.target === modal) closeSignup() })
document.addEventListener('keydown', event => { if (event.key === 'Escape' && !modal.hidden) closeSignup() })
signupForm.addEventListener('submit', event => {
  event.preventDefault()
  const email = new FormData(signupForm).get('email')
  try { localStorage.setItem(accountKey, JSON.stringify({ email, createdAt: Date.now() })) } catch {}
  closeSignup()
  unlockTutorials()
  const trigger = document.querySelector('.join-trigger')
  trigger?.blur()
  alert('You’re in! Tutorial links are now unlocked in this browser.')
})
if (accountExists()) unlockTutorials()

document.querySelector('#menu-toggle').addEventListener('click', event => {
  const nav = document.querySelector('#main-nav')
  const expanded = event.currentTarget.getAttribute('aria-expanded') === 'true'
  event.currentTarget.setAttribute('aria-expanded', String(!expanded))
  event.currentTarget.setAttribute('aria-label', expanded ? 'Open menu' : 'Close menu')
  nav.classList.toggle('menu-open', !expanded)
})
document.querySelectorAll('#main-nav a').forEach(link => link.addEventListener('click', () => {
  document.querySelector('#main-nav').classList.remove('menu-open')
  document.querySelector('#menu-toggle').setAttribute('aria-expanded', 'false')
}))

document.querySelector('#contact-form').addEventListener('submit', event => {
  event.preventDefault()
  event.currentTarget.reset()
  document.querySelector('#contact-note').textContent = 'Thanks for reaching out! This demo does not send messages to a server.'
  document.querySelector('#contact-note').classList.add('success-note')
})

chatToggle.addEventListener('click', () => {
  const open = chatPanel.hidden
  chatPanel.hidden = !open
  chatToggle.setAttribute('aria-expanded', String(open))
  chatToggle.querySelector('span:last-child').textContent = open ? 'Close guide' : 'Ask our guide'
  if (open) chatInput.focus()
})
function addBubble(text, kind) {
  const bubble = document.createElement('div')
  bubble.className = `bubble ${kind === 'user' ? 'user-bubble' : 'bot-bubble'}`
  bubble.textContent = text
  chatMessages.append(bubble)
  chatMessages.scrollTop = chatMessages.scrollHeight
}
function answerQuestion(text) {
  const message = text.toLowerCase()
  if (/where|start|topic|learn/.test(message)) return 'Try Manual Testing for the foundations, then explore Automation, API Testing, or Performance testing. The free library has beginner guides for each.'
  if (/account|video|tutorial|watch/.test(message)) return accountExists() ? 'Your tutorial access is unlocked! Choose a lesson in the video library to open its tutorial.' : 'Tutorial videos are for free account holders. Select “Create free account” and the lesson links will unlock in this browser.'
  if (/document|download|template|free|guide/.test(message)) return 'All documents and templates in the Learning Library are free to read and download without an account.'
  if (/contact|email|help|team/.test(message)) return 'Use the Contact section at the bottom of the page to leave a message, or email hello@testatlas.example.'
  if (/blog|article/.test(message)) return 'Visit the Blog from the top navigation for practical notes on test strategy, bug reports, and exploratory testing.'
  return 'I can point you to QA topics, free documents, tutorial access, blog articles, or the contact details. What would you like to explore?'
}
function submitChat(text) {
  const cleaned = text.trim()
  if (!cleaned) return
  addBubble(cleaned, 'user')
  addBubble(answerQuestion(cleaned), 'bot')
}
chatForm.addEventListener('submit', event => {
  event.preventDefault()
  submitChat(chatInput.value)
  chatInput.value = ''
})
document.querySelectorAll('.quick-replies button').forEach(button => button.addEventListener('click', () => submitChat(button.dataset.question)))

document.querySelector('#year')?.replaceChildren(String(new Date().getFullYear()))

const heroSlider = document.querySelector('#home-slider')
if (heroSlider) {
  const slides = [...heroSlider.querySelectorAll('.hero-slide')]
  const dots = [...heroSlider.querySelectorAll('[data-go-to]')]
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  let activeSlide = 0
  let timer

  function showSlide(index) {
    activeSlide = (index + slides.length) % slides.length
    slides.forEach((slide, i) => {
      const active = i === activeSlide
      slide.classList.toggle('is-active', active)
      slide.setAttribute('aria-hidden', String(!active))
    })
    dots.forEach((dot, i) => dot.setAttribute('aria-current', String(i === activeSlide)))
  }

  function stopRotation() {
    window.clearInterval(timer)
  }

  function startRotation() {
    stopRotation()
    if (!reducedMotion && !document.hidden && !heroSlider.matches(':hover, :focus-within')) {
      timer = window.setInterval(() => showSlide(activeSlide + 1), 7000)
    }
  }

  heroSlider.querySelectorAll('[data-direction]').forEach(button => button.addEventListener('click', () => {
    showSlide(activeSlide + (button.dataset.direction === 'next' ? 1 : -1))
    startRotation()
  }))
  dots.forEach(dot => dot.addEventListener('click', () => {
    showSlide(Number(dot.dataset.goTo))
    startRotation()
  }))
  heroSlider.addEventListener('mouseenter', stopRotation)
  heroSlider.addEventListener('mouseleave', startRotation)
  heroSlider.addEventListener('focusin', stopRotation)
  heroSlider.addEventListener('focusout', event => {
    if (!heroSlider.contains(event.relatedTarget)) startRotation()
  })
  document.addEventListener('visibilitychange', startRotation)
  startRotation()
}
