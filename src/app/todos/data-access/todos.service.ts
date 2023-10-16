import { Injectable, signal } from '@angular/core';
import { Todo } from 'src/app/shared/utils/todos';

@Injectable({
  providedIn: 'root'
})

export class TodosService {

  public todos = signal([] as Todo[]);

  constructor() { }

  public addTodo (todo : Todo) : void {
    this.todos.update(todos => [...todos, todo]);
  }

  public removeTodo (todo : Todo) : void {
    this.todos.update(todos => todos.filter(t => t !== todo));
  }

  public toggleTodo (todo : Todo) : void {
    this.todos.update(todos => todos.map(t => t === todo ? { ...t, done: !t.completed } : t));
  }

  public clearCompleted () : void {
    this.todos.update(todos => todos.filter(t => !t.completed));
  }

  public toggleAll (completed : boolean) : void {
    this.todos.update(todos => todos.map(t => ({ ...t, completed })));
  }

  public editTodo (todo : Todo, title : string) : void {
    this.todos.update(todos => todos.map(t => t === todo ? { ...t, title } : t));
  }

}
