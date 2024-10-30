// components/TodoList.js
import React, { useState } from 'react';
import { View, TextInput, Button, FlatList, Text, StyleSheet } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { addTodo, removeTodo, toggleTodo, editTodo } from '../actions/todoActions';

const TodoList = () => {
  const [text, setText] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editingText, setEditingText] = useState('');
  const todos = useSelector((state) => state.todo.todos);
  const dispatch = useDispatch();

  const handleAddTodo = () => {
    if (text) {
      dispatch(addTodo(text));
      setText('');
    }
  };

  const handleEditTodo = (id, currentText) => {
    setEditingId(id);
    setEditingText(currentText);
  };

  const handleSaveEdit = (id) => {
    if (editingText) {
      dispatch(editTodo(id, editingText));
      setEditingId(null);
      setEditingText('');
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
                  style={styles.editInput}
                  value={editingText}
                  onChangeText={setEditingText}
                />
                <Button title="Save" onPress={() => handleSaveEdit(item.id)} />
                <Button title="Cancel" onPress={() => setEditingId(null)} />
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
                <Button title="Edit" onPress={() => handleEditTodo(item.id, item.text)} />
                <Button title="Remove" onPress={() => dispatch(removeTodo(item.id))} />
              </>
            )}
          </View>
        )}
      />
    </View>
  );
};

// styles
const styles = StyleSheet.create({
  container: { padding: 20 },
  input: { padding: 10, borderWidth: 1, borderRadius: 5, marginBottom: 10 },
  editInput: { padding: 10, borderWidth: 1, borderRadius: 5, flex: 1 },
  todoItem: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  todoText: { fontSize: 18, flex: 1 },
});

export default TodoList;
