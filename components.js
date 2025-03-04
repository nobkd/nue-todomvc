
  import { router } from '/nue-todomvc/@nue/app-router.js'
  import { $ } from '/nue-todomvc/@nue/view-transitions.js'
  
  router.configure({ route: '/nue-todomvc/:filter' })
  
  const key = 'todos'
  const todos = load()
  emit()
  addEventListener(key, save)
  // addEventListener('storage', ({key, oldValue, newValue}) => { key == 'todos ' && oldValue != newValue && emit()})

  function setSelected(query, attr, val = true) {
    $(`[${attr}]`)?.removeAttribute(attr)
    $(query)?.setAttribute(attr, val)
  }

  function load() { return JSON.parse(localStorage.getItem(key) || '[]') }
  function save() { localStorage.setItem(key, JSON.stringify(todos)) }
  function emit(name=key) { dispatchEvent(new Event(name)) }

  function add(text) { todos.push({ done: false, text }); emit() }
  function del(id) { todos.splice(id, 1); emit() }
  function delDone() { todos.splice(0, todos.length,...todos.filter(e => !e.done)); emit() }
  function toggleAll(done) { todos.forEach(e => e.done = done); emit() }
  function setState(id, done) { todos[id].done = done; emit() }
  function setText(id, text) { todos[id].text = text; emit() }
  function todoCount() { return todos.filter(e => !e.done).length }

export const lib = [
{
  name: 'app',
  tagName: 'div',
  tmpl: '<div> <add-todo></add-todo> <todos :if="0"></todos> <filters :if="1"></filters> </div>',
  Impl: class { 
    mounted() {
      router.initialize({ root: this.root })
      addEventListener(key, () => this.update({ len: todos.length }))
      this.update({ len: todos.length })
    }
   },
  fns: [
    _ => _.len,
    _ => _.len
  ]
},{
  name: 'add-todo',
  tagName: 'header',
  tmpl: '<header> <h1>todos</h1> <form @submit="0"> <input type="checkbox" $checked="1" @change="2"> <input type="text" ref="todo" placeholder="What needs to be done?" required> </form> </header>',
  Impl: class { 
    toggleAll = toggleAll
    add = add

    mounted() { 
      const setChecked = () => this.update({ checked: todos.length != 0 && todoCount() == 0 })
      addEventListener(key, setChecked)
      setChecked()
    }
   },
  fns: [
    (_,e) => { {e.preventDefault();_.add(_.$refs.todo.value); _.$refs.todo.value = ''} },
    _ => _.checked,
    (_,e) => { _.toggleAll(!_.checked) }
  ]
},{
  name: 'filters',
  tagName: 'footer',
  tmpl: '<footer> <p>:0:</p> <nav> <a href="/nue-todomvc/">All</a> <a href="/nue-todomvc/active">Active</a> <a href="/nue-todomvc/completed">Completed</a> </nav> <button :style="1" @click="2">Clear completed</button> </footer>',
  Impl: class { 
    delDone = delDone

    mounted() {
      const setCount = () => this.update({ todo_count: todoCount(), done_count: todos.length - todoCount() })

      router.on('filter', (_, { path }) => setSelected(`a[href="${path}"]`, 'aria-current', 'page'))
      addEventListener(key, setCount)

      setSelected(`a[href="${window.location.pathname}"]`, 'aria-current', 'page')
      setCount()
    }
   },
  fns: [
    _ => [_.todo_count,' items left'],
    _ => ['opacity:',_.done_count],
    (_,e) => { _.delDone.call(_, e) }
  ]
},{
  name: 'todos',
  tagName: 'main',
  tmpl: '<main :if="0"> <ul> <li :for="1" :bind="2"> <input type="checkbox" $checked="3" @change="4"> <p ref="display" @dblclick="5">:6:</p> <input type="text" :value="7" ref="edit" @keydown="8" @blur="9" :data-id="10"> <button @click="11">&#xd7;</button> </li> </ul> </main>',
  Impl: class { 
    setState = setState
    del = del

    edit() { 
      this.$refs.display.setAttribute('hidden', true)
      this.$refs.edit.select()
     }

    editEnd({ key }) {
      const { display, edit } = this.$refs
      
      if (!key || key == 'Escape' || key == 'Enter') display.removeAttribute('hidden')
      if (key == 'Enter' && display.innerText != edit.value) setText(parseInt(edit.dataset.id), edit.value)
    }

    mounted() {
      const setFiltered = (filter) => this.update({
        todos: todos.map((e,i) => {e.id = i; return e})
          .filter(e => !filter || (filter == 'completed' ? e.done : !e.done))
      })

      addEventListener(key, () => setFiltered(router.state.filter))
      router.on('filter', ({ filter }) => setFiltered(filter))
      setFiltered(router.state.filter)
    }
   },
  fns: [
    _ => _.todos.length,
    _ => [['id','done','text'], _.todos, '$index'],
    _ => _.e,
    _ => _.done,
    (_,e) => { _.setState(_.id, !_.done) },
    (_,e) => { _.edit.call(_, e) },
    _ => [_.text],
    _ => _.text,
    (_,e) => { _.editEnd.call(_, e) },
    (_,e) => { _.editEnd.call(_, e) },
    _ => [_.id],
    (_,e) => { _.del(_.id) }
  ]
}]
export default lib[0]