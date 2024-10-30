// components/TodoList.js
import React, { useState } from 'react';
import { View, TextInput, Button, FlatList, Text, StyleSheet } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { addTodo, removeTodo, toggleTodo } from '../actions/todoActions';

const TodoList = () => {
  const [text, setText] = useState('');
  const todos = useSelector((state) => state.todo.todos);
  const dispatch = useDispatch();

  const handleAddTodo = () => {
    if (text) {
      dispatch(addTodo(text));
      setText('');
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
            <Text
              style={[
                styles.todoText,
                { textDecorationLine: item.completed ? 'line-through' : 'none' },
              ]}
              onPress={() => dispatch(toggleTodo(item.id))}
            >
              {item.text}
            </Text>
            <Button title="Remove" onPress={() => dispatch(removeTodo(item.id))} />
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { padding: 20 },
  input: { padding: 10, borderWidth: 1, borderRadius: 5, marginBottom: 10 },
  todoItem: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  todoText: { fontSize: 18 },
});

export default TodoList;
