const modal = document.querySelector('#signup-modal')
const signupForm = document.querySelector('#signup-form')
const modalClose = document.querySelector('#modal-close')
const accountKey = 'testatlas-demo-account'
let pendingVideo = null

function accountExists() {
  try { return Boolean(localStorage.getItem(accountKey)) } catch { return false }
}

function openSignup() {
  if (accountExists() || !modal) return
  modal.hidden = false
  document.body.style.overflow = 'hidden'
  document.querySelector('#signup-name')?.focus()
}

function closeSignup() {
  if (!modal) return
  modal.hidden = true
  document.body.style.overflow = ''
}

function videoUrl(button) {
  return button.dataset.videoUrl || `https://www.youtube.com/results?search_query=${encodeURIComponent(button.dataset.search || button.dataset.title || 'QA testing tutorial')}`
}

function openVideo(button) {
  const videoWindow = window.open(videoUrl(button), '_blank')
  if (videoWindow) videoWindow.opener = null
  else window.location.assign(videoUrl(button))
}

function unlockTutorials() {
  document.querySelectorAll('.gated-video').forEach(button => {
    button.classList.add('unlocked')
    button.setAttribute('aria-label', `Watch ${button.dataset.title || 'course video'}`)
    const accessText = button.querySelector('.course-video-access')
    if (accessText) accessText.textContent = 'Watch lesson'
    const lock = button.querySelector('.video-lock, .video-mini-lock, i')
    if (lock) lock.textContent = '↗'
  })
  document.querySelectorAll('.join-trigger').forEach(button => {
    if (button.matches('button')) button.textContent = 'Tutorial access unlocked ✓'
  })
}

document.querySelectorAll('.join-trigger').forEach(button => button.addEventListener('click', openSignup))
document.querySelectorAll('.gated-video').forEach(button => button.addEventListener('click', () => {
  if (accountExists()) {
    openVideo(button)
    return
  }
  pendingVideo = button
  openSignup()
}))
modalClose?.addEventListener('click', closeSignup)
modal?.addEventListener('click', event => { if (event.target === modal) closeSignup() })
document.addEventListener('keydown', event => { if (event.key === 'Escape' && modal && !modal.hidden) closeSignup() })
signupForm?.addEventListener('submit', event => {
  event.preventDefault()
  const email = new FormData(signupForm).get('email')
  try { localStorage.setItem(accountKey, JSON.stringify({ email, createdAt: Date.now() })) } catch {}
  closeSignup()
  unlockTutorials()
  const video = pendingVideo
  pendingVideo = null
  if (video) openVideo(video)
})
if (accountExists()) unlockTutorials()

const menuToggle = document.querySelector('#menu-toggle')
menuToggle?.addEventListener('click', event => {
  const nav = document.querySelector('#main-nav')
  if (!nav) return
  const expanded = event.currentTarget.getAttribute('aria-expanded') === 'true'
  event.currentTarget.setAttribute('aria-expanded', String(!expanded))
  event.currentTarget.setAttribute('aria-label', expanded ? 'Open menu' : 'Close menu')
  nav.classList.toggle('menu-open', !expanded)
})
document.querySelectorAll('#main-nav a').forEach(link => link.addEventListener('click', () => {
  document.querySelector('#main-nav')?.classList.remove('menu-open')
  menuToggle?.setAttribute('aria-expanded', 'false')
}))

document.querySelector('#contact-form')?.addEventListener('submit', event => {
  event.preventDefault()
  event.currentTarget.reset()
  const note = document.querySelector('#contact-note')
  if (note) {
    note.textContent = 'Thanks for reaching out! This demo does not send messages to a server.'
    note.classList.add('success-note')
  }
})

const chatPanel = document.querySelector('#chat-panel')
const chatToggle = document.querySelector('#chat-toggle')
const chatMessages = document.querySelector('#chat-messages')
const chatForm = document.querySelector('#chat-form')
const chatInput = document.querySelector('#chat-input')
if (chatPanel && chatToggle && chatMessages && chatForm && chatInput) {
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
    if (/where|start|topic|learn/.test(message)) return 'Start with Manual Testing, then explore Automation, API Testing, or Performance testing. Each course has a focused guide.'
    if (/account|video|tutorial|watch/.test(message)) return accountExists() ? 'Your tutorial access is unlocked. Open a course and choose one of its video lessons.' : 'Course video lessons are available after creating the free demo account.'
    if (/document|download|template|free|guide/.test(message)) return 'All documents and templates in the Learning Library are free to read and download without an account.'
    if (/contact|email|help|team/.test(message)) return 'Use the Contact section at the bottom of the page or email hello@testatlas.example.'
    if (/blog|article/.test(message)) return 'Visit the Blog for practical notes on test strategy, bug reports, and exploratory testing.'
    return 'I can point you to QA courses, free documents, tutorial access, blog articles, or contact details. What would you like to explore?'
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
}

document.querySelector('#year')?.replaceChildren(String(new Date().getFullYear()))

const heroSlider = document.querySelector('#home-slider')
if (heroSlider) {
  const slides = [...heroSlider.querySelectorAll('.hero-slide')]
  const dots = [...heroSlider.querySelectorAll('[data-go-to]')]
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  let activeSlide = Math.max(0, slides.findIndex(slide => slide.classList.contains('is-active')))
  let timer

  function showSlide(index) {
    if (!slides.length) return
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
      timer = window.setInterval(() => showSlide(activeSlide + 1), 6000)
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
  showSlide(activeSlide)
  startRotation()
}
