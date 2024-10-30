// components/TodoList.js
import React, { useState } from 'react';
import { View, TextInput, Button, FlatList, Text, StyleSheet } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { addTodo, removeTodo, toggleTodo } from '../actions/todoActions';

const TodoList = () => {
  const [text, setText] = useState('');
  const [editingText, setEditingText] = useState(''); // Giá trị mới để chỉnh sửa todo
  const [editingId, setEditingId] = useState(null); // ID của todo đang được chỉnh sửa
  const todos = useSelector((state) => state.todo.todos);
  const dispatch = useDispatch();

  const handleAddTodo = () => {
    if (text) {
      dispatch(addTodo(text));
      setText('');
    }
  };

  const handleEditTodo = (id) => {
    setEditingId(id);
    const todoToEdit = todos.find((todo) => todo.id === id);
    setEditingText(todoToEdit.text); // Đặt giá trị hiện tại vào `editingText`
  };

  const handleSaveEdit = (id) => {
    if (editingText) {
      dispatch({ type: 'EDIT_TODO', payload: { id, text: editingText } });
      setEditingId(null); // Đặt lại `editingId` sau khi lưu
      setEditingText(''); // Đặt lại `editingText`
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Add new todo"
        value={text}
        onChangeText={setText}
      />
      <Button title="Add Todo" onPress={handleAddTodo} />
      
      <FlatList
        data={todos}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.todoItem}>
            {editingId === item.id ? (
              <>
                <TextInput
                  style={styles.input}
                  value={editingText}
                  onChangeText={setEditingText}
                />
                <Button title="Save" onPress={() => handleSaveEdit(item.id)} />
              </>
            ) : (
              <>
                <Text
                  style={[
                    styles.todoText,
                    { textDecorationLine: item.completed ? 'line-through' : 'none' },
                  ]}
                  onPress={() => dispatch(toggleTodo(item.id))}
                >
                  {item.text}
                </Text>
                <Button title="Edit" onPress={() => handleEditTodo(item.id)} />
                <Button title="Remove" onPress={() => dispatch(removeTodo(item.id))} />
              </>
            )}
          </View>
        )}
      />
    </View>
  );
};

// Thêm `EDIT_TODO` trong reducer
// reducers/todoReducer.js
import { ADD_TODO, REMOVE_TODO, TOGGLE_TODO } from '../actions/todoActions';

const initialState = {
  todos: [],
};

export default function todoReducer(state = initialState, action) {
  switch (action.type) {
    case ADD_TODO:
      return {
        ...state,
        todos: [
          ...state.todos,
          { id: Date.now(), text: action.payload, completed: false },
        ],
      };
    case REMOVE_TODO:
      return {
        ...state,
        todos: state.todos.filter((todo) => todo.id !== action.payload),
      };
    case TOGGLE_TODO:
      return {
        ...state,
        todos: state.todos.map((todo) =>
          todo.id === action.payload
            ? { ...todo, completed: !todo.completed }
            : todo
        ),
      };
    case 'EDIT_TODO':
      return {
        ...state,
        todos: state.todos.map((todo) =>
          todo.id === action.payload.id ? { ...todo, text: action.payload.text } : todo
        ),
      };
    default:
      return state;
  }
}

const styles = StyleSheet.create({
  container: { padding: 20 },
  input: { padding: 10, borderWidth: 1, borderRadius: 5, marginBottom: 10 },
  todoItem: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  todoText: { fontSize: 18, flex: 1 },
});
