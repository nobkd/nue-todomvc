import { $ } from '/@nue/view-transitions.js'


export function addTodo({ target }) {
  console.log('addTodo:', target.value)
  target.value = ''
}

export function removeTodo(e) {
  console.log('removeTodo:', e)
}

export function toggleAll(e) {
  console.log('toggleAll:', e)
}

export function todoState(e) {
  console.log('todoState:', e)
}

export function setSelected(query, attr, val = true) {
  $(`[${attr}]`)?.removeAttribute(attr)
  $(query)?.setAttribute(attr, val)
}
