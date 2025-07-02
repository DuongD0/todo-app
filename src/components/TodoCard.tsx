import React from 'react';
import { View, Text, TouchableOpacity, Image, Alert } from 'react-native';
import { Todo } from '@/types/todo.types';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { toggleTodoComplete, removeExistingTodo } from '@/store/todoSlice';

interface TodoCardProps {
  todo: Todo;
  onEdit: (todo: Todo) => void;
}

export default function TodoCard({ todo, onEdit }: TodoCardProps) {
  const dispatch = useAppDispatch();

  const handleToggleComplete = () => {
    dispatch(toggleTodoComplete({ id: todo.id, isDone: !todo.isDone }));
  };

  const handleDelete = () => {
    Alert.alert(
      'Delete Todo',
      'Are you sure you want to delete this todo?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => dispatch(removeExistingTodo(todo.id)),
        },
      ]
    );
  };

  const getPriorityColor = (priority: number) => {
    switch (priority) {
      case 1:
        return 'bg-red-100 text-red-800';
      case 2:
        return 'bg-yellow-100 text-yellow-800';
      case 3:
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityText = (priority: number) => {
    switch (priority) {
      case 1:
        return 'High';
      case 2:
        return 'Medium';
      case 3:
        return 'Low';
      default:
        return 'Unknown';
    }
  };

  const formatDate = (timestamp: any) => {
    if (!timestamp) return '';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString();
  };

  return (
    <View className="bg-white rounded-lg p-4 mb-3 shadow-sm border border-gray-200">
      <View className="flex-row items-start justify-between mb-2">
        <View className="flex-1">
          <Text
            className={`text-lg font-semibold ${
              todo.isDone ? 'line-through text-gray-400' : 'text-gray-900'
            }`}
          >
            {todo.title}
          </Text>
          {todo.description && (
            <Text
              className={`text-sm mt-1 ${
                todo.isDone ? 'text-gray-400' : 'text-gray-600'
              }`}
            >
              {todo.description}
            </Text>
          )}
        </View>
        {todo.imageUrl && (
          <Image
            source={{ uri: todo.imageUrl }}
            className="w-12 h-12 rounded ml-3"
          />
        )}
      </View>

      <View className="flex-row items-center justify-between mb-3">
        <View className="flex-row items-center space-x-2">
          <View
            className={`px-2 py-1 rounded-full ${getPriorityColor(
              todo.priority
            )}`}
          >
            <Text className="text-xs font-medium">
              {getPriorityText(todo.priority)}
            </Text>
          </View>
          <Text className="text-xs text-gray-500">
            Due: {formatDate(todo.dueDate)}
          </Text>
        </View>
      </View>

      {todo.tags.length > 0 && (
        <View className="flex-row flex-wrap mb-3">
          {todo.tags.map((tag, index) => (
            <View
              key={index}
              className="bg-blue-100 px-2 py-1 rounded mr-2 mb-1"
            >
              <Text className="text-xs text-blue-800">{tag}</Text>
            </View>
          ))}
        </View>
      )}

      <View className="flex-row justify-between">
        <TouchableOpacity
          className={`px-4 py-2 rounded ${
            todo.isDone ? 'bg-gray-200' : 'bg-green-600'
          }`}
          onPress={handleToggleComplete}
        >
          <Text
            className={`text-sm font-medium ${
              todo.isDone ? 'text-gray-600' : 'text-white'
            }`}
          >
            {todo.isDone ? 'Undo' : 'Complete'}
          </Text>
        </TouchableOpacity>

        <View className="flex-row space-x-2">
          <TouchableOpacity
            className="px-4 py-2 bg-blue-600 rounded"
            onPress={() => onEdit(todo)}
          >
            <Text className="text-white text-sm font-medium">Edit</Text>
          </TouchableOpacity>
          <TouchableOpacity
            className="px-4 py-2 bg-red-600 rounded"
            onPress={handleDelete}
          >
            <Text className="text-white text-sm font-medium">Delete</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

