import { router } from '/@nue/app-router.js'
import { $ } from '/@nue/view-transitions.js'


router.configure({ route: '/:filter/', persistent_params: ['todos'] })


export function addTodo(e) {
  const todo = Object.fromEntries(new FormData(e.target)).todo
  console.log('addTodo:', todo)
  e.target.reset()
}

export function removeTodo(e) {
  console.log('removeTodo:', e)
}

export function todoState(e) {
  console.log('todoState:', e)
}

export function setSelected(query, attr, val = true) {
  $(`[${attr}]`)?.removeAttribute(attr)
  $(query)?.setAttribute(attr, val)
}
