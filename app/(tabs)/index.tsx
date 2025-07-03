import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../src/store/auth-context';
import { useAppDispatch } from '../../src/hooks/useAppDispatch';
import { useAppSelector } from '../../src/hooks/useAppSelector';
import { subscribeTodos, clearTodos } from '../../src/store/todoSlice';
import TodoCard from '../../src/components/TodoCard';
import TodoFormModal from '../../src/components/TodoFormModal';
import { Todo } from '../../src/types/todo.types';

export default function TodoListScreen() {
  const { user } = useAuth();
  const dispatch = useAppDispatch();
  const { list: todos, loading, error } = useAppSelector((state) => state.todos);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (user) {
      dispatch(subscribeTodos(user.uid));
    } else {
      dispatch(clearTodos());
    }
  }, [user, dispatch]);

  const handleRefresh = async () => {
    if (user) {
      setRefreshing(true);
      await dispatch(subscribeTodos(user.uid));
      setRefreshing(false);
    }
  };

  const handleAddTodo = () => {
    setEditingTodo(null);
    setModalVisible(true);
  };

  const handleEditTodo = (todo: Todo) => {
    setEditingTodo(todo);
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    setEditingTodo(null);
  };

  const renderTodo = ({ item }: { item: Todo }) => (
    <TodoCard todo={item} onEdit={handleEditTodo} />
  );

  const renderEmptyState = () => (
    <View className="flex-1 items-center justify-center px-6">
      <Text className="text-xl text-gray-500 text-center mb-4">
        No todos yet
      </Text>
      <Text className="text-gray-400 text-center mb-6">
        Create your first todo to get started
      </Text>
      <TouchableOpacity
        className="bg-primary-600 px-6 py-3 rounded-lg"
        onPress={handleAddTodo}
      >
        <Text className="text-white font-semibold">Create Todo</Text>
      </TouchableOpacity>
    </View>
  );

  if (error) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50">
        <View className="flex-1 items-center justify-center px-6">
          <Text className="text-red-600 text-center mb-4">Error: {error}</Text>
          <TouchableOpacity
            className="bg-primary-600 px-6 py-3 rounded-lg"
            onPress={handleRefresh}
          >
            <Text className="text-white font-semibold">Retry</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <View className="bg-white px-6 pt-4 pb-4 border-b border-gray-200">
        <View className="flex-row justify-between items-center">
          <Text className="text-3xl font-bold text-primary-700">My Todos</Text>
          <TouchableOpacity
            className="bg-primary-600 px-4 py-2 rounded-lg"
            onPress={handleAddTodo}
          >
            <Text className="text-white font-semibold">+ Add</Text>
          </TouchableOpacity>
        </View>
        <Text className="text-gray-600 mt-2">
          {todos.length} {todos.length === 1 ? 'todo' : 'todos'}
        </Text>
      </View>

      <FlatList
        data={todos}
        renderItem={renderTodo}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{
          padding: 16,
          flexGrow: 1,
        }}
        ListEmptyComponent={renderEmptyState}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
        showsVerticalScrollIndicator={false}
      />

      <TodoFormModal
        visible={modalVisible}
        onClose={handleCloseModal}
        todo={editingTodo}
      />
    </SafeAreaView>
  );
}